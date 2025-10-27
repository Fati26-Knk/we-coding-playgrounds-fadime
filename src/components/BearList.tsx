import { useState, useEffect } from 'react';

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

function BearList() {
  const [bears, setBears] = useState<BearData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const PLACEHOLDER_IMAGE = '/placeholder-bear.svg';
  const BASE_URL = 'https://en.wikipedia.org/w/api.php';
  const TITLE = 'List_of_ursids';

  useEffect(() => {
    const loadBearData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch bear data from Wikipedia
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

        const data: WikipediaApiResponse = await response.json();

        if (data.error) {
          throw new Error(`Wikipedia API error: ${data.error.info}`);
        }

        if (!data.parse?.wikitext) {
          throw new Error('No wikitext data received');
        }

        // Extract bears from wikitext
        const extractedBears = await extractBears(data.parse.wikitext['*']);
        setBears(extractedBears);
      } catch (err) {
        console.error('Failed to load bear data:', err);
        setError('Failed to load bear information. Please refresh the page to try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBearData();
  }, []);

  const fetchImageUrl = async (fileName: string): Promise<string> => {
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

      const data: WikipediaApiResponse = await response.json();

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
    } catch (err) {
      console.warn(`Failed to fetch image for ${fileName}:`, err);
      return PLACEHOLDER_IMAGE;
    }
  };

  const extractBears = async (wikitext: string): Promise<BearData[]> => {
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
                // Let the browser's img.onerror handle CSP/loading issues
              } catch (err) {
                console.warn(`Error processing image ${fileName}:`, err);
                imageUrl = PLACEHOLDER_IMAGE;
              }
            }
          }

          const bear: BearData = {
            name: nameMatch[1].trim(),
            binomial: binomialMatch[1].trim(),
            image: imageUrl,
            range: rangeMatch?.[1]?.trim() || 'Range information not available',
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
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.src = PLACEHOLDER_IMAGE;
    img.title = 'Image not available';
  };

  if (loading) {
    return <p>Loading bear information...</p>;
  }

  if (error) {
    return <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>;
  }

  if (bears.length === 0) {
    return <p>No bear information could be loaded.</p>;
  }

  return (
    <div>
      {bears.map((bear) => (
        <div
          key={bear.name}
          className="bear"
          style={{
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ddd',
          }}
        >
          <img
            src={bear.image}
            alt={`Image of ${bear.name}`}
            onError={handleImageError}
            style={{
              width: '200px',
              height: 'auto',
              display: 'block',
              marginBottom: '10px',
            }}
          />
          <h4>{bear.name}</h4>
          <p>
            <em>Scientific name: </em>
            {bear.binomial}
          </p>
          <p>
            <em>Range: </em>
            {bear.range}
          </p>
        </div>
      ))}
      <p style={{ fontStyle: 'italic', marginTop: '20px' }}>
        Rendered {bears.length} bears successfully
      </p>
    </div>
  );
}

export default BearList;
