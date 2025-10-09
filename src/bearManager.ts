// Bear data fetching and management module with TypeScript types

interface WikipediaParams {
  action: string;
  page?: string;
  prop: string;
  section?: number;
  format: string;
  origin: string;
  titles?: string;
  iiprop?: string;
  [key: string]: string | number | undefined;
}

interface WikipediaApiResponse {
  parse?: {
    wikitext: {
      '*': string;
    };
  };
  query?: {
    pages: Record<string, WikipediaPage>;
  };
  error?: {
    info: string;
  };
}

interface WikipediaPage {
  imageinfo?: Array<{
    url: string;
  }>;
}

interface BearData {
  name: string;
  binomial: string;
  image: string;
  range: string;
}

export class BearManager {
  private readonly baseUrl: string;
  private readonly title: string;
  private readonly moreBears: HTMLElement | null;
  private readonly placeholderImage: string;

  constructor() {
    this.baseUrl = 'https://en.wikipedia.org/w/api.php';
    this.title = 'List_of_ursids';
    this.moreBears = document.querySelector('.more_bears');
    this.placeholderImage = './media/placeholder-bear.svg';
    console.log(
      'BearManager constructor - moreBears element found:',
      !!this.moreBears
    );
  }

  // Initialize the BearManager and load bear data
  async init(): Promise<void> {
    console.log('BearManager init started');

    if (!this.moreBears) {
      console.error('More bears container not found!');
      return;
    }

    try {
      this.showLoadingMessage();
      await this.loadBearData();
      console.log('BearManager init completed successfully');
    } catch (error: unknown) {
      console.error('Failed to load bear data:', error);
      this.showErrorMessage(
        'Failed to load bear information. Please refresh the page to try again.'
      );
    }
  }

  private showLoadingMessage(): void {
    if (!this.moreBears) return;

    // Sichere DOM-Manipulation ohne innerHTML
    this.moreBears.textContent = '';
    const loadingPara: HTMLParagraphElement = document.createElement('p');
    loadingPara.textContent = 'Loading bear information...';
    this.moreBears.appendChild(loadingPara);
  }

  private async loadBearData(): Promise<void> {
    const params: WikipediaParams = {
      action: 'parse',
      page: this.title,
      prop: 'wikitext',
      section: 3,
      format: 'json',
      origin: '*',
    };

    try {
      console.log('Fetching bear data from Wikipedia...');
      const response: Response = await fetch(
        this.baseUrl +
          '?' +
          new URLSearchParams(params as Record<string, string>).toString()
      );

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

      console.log('Bear data received, extracting bears...');
      await this.extractBears(data.parse.wikitext['*']);
    } catch (error: unknown) {
      console.error('Error loading bear data:', error);
      throw error;
    }
  }

  private async fetchImageUrl(fileName: string): Promise<string> {
    const imageParams: WikipediaParams = {
      action: 'query',
      titles: 'File:' + fileName,
      prop: 'imageinfo',
      iiprop: 'url',
      format: 'json',
      origin: '*',
    };

    try {
      const url: string =
        this.baseUrl +
        '?' +
        new URLSearchParams(imageParams as Record<string, string>).toString();
      const response: Response = await fetch(url);

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
    } catch (error: unknown) {
      console.warn(`Failed to fetch image for ${fileName}:`, error);
      return this.placeholderImage;
    }
  }

  private async checkImageAvailability(imageUrl: string): Promise<boolean> {
    try {
      const response: Response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error: unknown) {
      return false;
    }
  }

  private async extractBears(wikitext: string): Promise<void> {
    const speciesTables: string[] = wikitext.split('{{Species table/end}}');
    const bears: BearData[] = [];

    console.log(`Processing ${speciesTables.length} species tables...`);

    for (const table of speciesTables) {
      const rows: string[] = table.split('{{Species table/row');

      for (const row of rows) {
        const nameMatch: RegExpMatchArray | null =
          row.match(/\|name=\[\[(.*?)\]\]/);
        const binomialMatch: RegExpMatchArray | null =
          row.match(/\|binomial=(.*?)\n/);
        const imageMatch: RegExpMatchArray | null =
          row.match(/\|image=(.*?)\n/);
        const rangeMatch: RegExpMatchArray | null =
          row.match(/\|range=(.*?)\n/);

        if (nameMatch?.[1] && binomialMatch?.[1]) {
          let imageUrl: string = this.placeholderImage;

          // Versuche Bild zu laden, falls vorhanden
          if (imageMatch?.[1]) {
            const fileName: string = imageMatch[1].trim().replace('File:', '');
            if (fileName) {
              try {
                imageUrl = await this.fetchImageUrl(fileName);

                // Prüfe ob Bild verfügbar ist
                const isImageAvailable: boolean =
                  await this.checkImageAvailability(imageUrl);
                if (!isImageAvailable) {
                  imageUrl = this.placeholderImage;
                }
              } catch (error: unknown) {
                console.warn(`Error processing image ${fileName}:`, error);
                imageUrl = this.placeholderImage;
              }
            }
          }

          const bear: BearData = {
            name: nameMatch[1].trim(),
            binomial: binomialMatch[1].trim(),
            image: imageUrl,
            range: rangeMatch?.[1]?.trim() || 'Range information not available',
          };

          bears.push(bear);
        }
      }
    }

    console.log(`Found ${bears.length} bears before deduplication`);

    // Duplikate entfernen basierend auf Namen, Reihenfolge beibehalten
    const uniqueBears: BearData[] = bears.filter(
      (bear: BearData, index: number, self: BearData[]): boolean =>
        index === self.findIndex((b: BearData): boolean => b.name === bear.name)
    );

    console.log(`${uniqueBears.length} unique bears after deduplication`);
    this.renderBears(uniqueBears);
  }

  private renderBears(bears: BearData[]): void {
    if (!this.moreBears) return;

    // Sichere DOM-Manipulation ohne innerHTML
    this.moreBears.textContent = ''; // Alle Inhalte löschen

    if (bears.length === 0) {
      const noBearsPara: HTMLParagraphElement = document.createElement('p');
      noBearsPara.textContent = 'No bear information could be loaded.';
      this.moreBears.appendChild(noBearsPara);
      return;
    }

    bears.forEach((bear: BearData): void => {
      // Container für jeden Bären erstellen
      const bearDiv: HTMLDivElement = document.createElement('div');
      bearDiv.className = 'bear';
      bearDiv.style.cssText =
        'margin-bottom: 20px; padding: 10px; border: 1px solid #ddd;';

      // Bild erstellen
      const img: HTMLImageElement = document.createElement('img');
      img.src = bear.image;
      img.alt = `Image of ${bear.name}`;
      img.style.cssText =
        'width:200px; height:auto; display: block; margin-bottom: 10px;';
      img.onerror = (): void => {
        img.src = this.placeholderImage;
        img.title = 'Image not available';
      };

      // Name (Überschrift)
      const nameHeading: HTMLHeadingElement = document.createElement('h4');
      nameHeading.textContent = bear.name;

      // Wissenschaftlicher Name
      const scientificPara: HTMLParagraphElement = document.createElement('p');
      const scientificEm: HTMLElement = document.createElement('em');
      scientificEm.textContent = 'Scientific name: ';
      scientificPara.appendChild(scientificEm);
      scientificPara.appendChild(document.createTextNode(bear.binomial));

      // Range
      const rangePara: HTMLParagraphElement = document.createElement('p');
      const rangeEm: HTMLElement = document.createElement('em');
      rangeEm.textContent = 'Range: ';
      rangePara.appendChild(rangeEm);
      rangePara.appendChild(document.createTextNode(bear.range));

      // Alle Elemente zum Container hinzufügen
      bearDiv.appendChild(img);
      bearDiv.appendChild(nameHeading);
      bearDiv.appendChild(scientificPara);
      bearDiv.appendChild(rangePara);

      // Container zur Hauptseite hinzufügen
      this.moreBears?.appendChild(bearDiv);
    });

    console.log(`Rendered ${bears.length} bears successfully`);
  }

  private showErrorMessage(message: string): void {
    if (!this.moreBears) return;

    // Sichere DOM-Manipulation ohne innerHTML
    this.moreBears.textContent = '';
    const errorPara: HTMLParagraphElement = document.createElement('p');
    errorPara.textContent = message;
    errorPara.style.cssText = 'color: red; font-weight: bold;';
    this.moreBears.appendChild(errorPara);
  }
}
