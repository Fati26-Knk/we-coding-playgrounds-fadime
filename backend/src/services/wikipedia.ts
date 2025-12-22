import fetch from 'node-fetch';

const BASE_URL = process.env.WIKIPEDIA_API_URL || 'https://en.wikipedia.org/w/api.php';
const TITLE = 'List_of_ursids';
const PLACEHOLDER_IMAGE = '/placeholder-bear.svg';

interface BearData {
  name: string;
  binomial: string;
  image: string;
  range: string;
}

interface WikipediaApiResponse {
  parse?: {
    wikitext: {
      '*': string;
    };
  };
  query?: {
    pages: Record<
      string,
      {
        imageinfo?: Array<{
          url: string;
        }>;
      }
    >;
  };
  error?: {
    info: string;
  };
}

/**
 * Fetches bear data from Wikipedia API
 */
export async function fetchBearData(): Promise<BearData[]> {
  try {
    const params = new URLSearchParams({
      action: 'parse',
      page: TITLE,
      prop: 'wikitext',
      section: '3',
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as WikipediaApiResponse;

    if (data.error) {
      throw new Error(`Wikipedia API error: ${data.error.info}`);
    }

    if (!data.parse?.wikitext) {
      throw new Error('No wikitext data received');
    }

    console.log('Extracting bears from wikitext...');
    const bears = await extractBears(data.parse.wikitext['*']);

    return bears;
  } catch (error) {
    console.error('Failed to load bear data:', error);
    throw error;
  }
}

/**
 * Fetches image URL from Wikipedia
 */
export async function fetchImageUrl(fileName: string): Promise<string> {
  try {
    const params = new URLSearchParams({
      action: 'query',
      titles: `File:${fileName}`,
      prop: 'imageinfo',
      iiprop: 'url',
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as WikipediaApiResponse;

    if (!data.query?.pages) {
      throw new Error('No pages data received');
    }

    const pages = data.query.pages;
    const page = Object.values(pages)[0];

    if (page?.imageinfo?.[0]?.url) {
      return page.imageinfo[0].url;
    } else {
      throw new Error('Image not found');
    }
  } catch (error) {
    console.warn(`Failed to fetch image for ${fileName}:`, error);
    return PLACEHOLDER_IMAGE;
  }
}

/**
 * Extracts bear data from Wikipedia wikitext
 */
async function extractBears(wikitext: string): Promise<BearData[]> {
  const speciesTables = wikitext.split('{{Species table/end}}');
  const bearsArray: BearData[] = [];

  console.log(`Processing ${speciesTables.length} species tables...`);

  for (const table of speciesTables) {
    const rows = table.split('{{Species table/row');

    for (const row of rows) {
      const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
      const binomialMatch = row.match(/\|binomial=(.*?)\n/);
      const imageMatch = row.match(/\|image=(.*?)\n/);
      const rangeMatch = row.match(/\|range=(.*?)\n/);

      if (nameMatch?.[1] && binomialMatch?.[1]) {
        let imageUrl = PLACEHOLDER_IMAGE;

        // Try to load image if available
        if (imageMatch?.[1]) {
          const fileName = imageMatch[1].trim().replace('File:', '');
          if (fileName) {
            try {
              imageUrl = await fetchImageUrl(fileName);
            } catch (error) {
              console.warn(`Error processing image ${fileName}:`, error);
              imageUrl = PLACEHOLDER_IMAGE;
            }
          }
        }

        const bear: BearData = {
          name: nameMatch[1].trim(),
          binomial: binomialMatch[1].trim(),
          image: imageUrl,
          range: cleanRangeText(rangeMatch?.[1]?.trim() || 'Range information not available'),
        };

        bearsArray.push(bear);
      }
    }
  }

  console.log(`Found ${bearsArray.length} bears before deduplication`);

  // Remove duplicates based on name
  const uniqueBears = bearsArray.filter(
    (bear, index, self) => index === self.findIndex((b) => b.name === bear.name)
  );

  console.log(`${uniqueBears.length} unique bears after deduplication`);
  return uniqueBears;
}

/**
 * Cleans range text by removing Wiki markup
 */
function cleanRangeText(rangeText: string): string {
  if (!rangeText || rangeText === 'Range information not available') {
    return rangeText;
  }

  // Remove everything after and including |range-image=
  let cleaned = rangeText.split('|range-image=')[0];

  // Remove everything after and including |range-image-size=
  cleaned = cleaned.split('|range-image-size=')[0];

  // Remove |range= prefix if present
  cleaned = cleaned.replace(/^\|?range=/i, '');

  // Trim whitespace
  cleaned = cleaned.trim();

  // If nothing left, return default message
  if (!cleaned) {
    return 'Range information not available';
  }

  return cleaned;
}
