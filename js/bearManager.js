import { resolveImage } from './imageUtils.js';

const WIKI_API =
    'https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=List_of_ursids&format=json&origin=*';

export class BearManager {
    constructor() {
        this.root = document.querySelector('.more_bears');
    }

    renderError(msg) {
        this.root.textContent = '';
        const p = document.createElement('p');
        p.textContent = msg;
        this.root.appendChild(p);
    }

    async init() {
        try {
            const bears = await this.loadBears();

            if (!Array.isArray(bears)) {
                console.error('loadBears() returned non-array:', bears);
                this.renderError('Bear list could not be loaded.');
                return;
            }

            this.root.textContent = '';
            for (const b of bears) {
                await this.renderBear(b);
            }
        } catch (err) {
            console.error('BearManager.init failed:', err);
            this.renderError('Loading bears failed. Please try again later.');
        }
    }

    async renderBear(b) {
        const article = document.createElement('article');

        const img = document.createElement('img');
        img.alt = b?.commonName || 'Bear';
        img.src = await resolveImage(b?.imageUrl);

        const h2 = document.createElement('h2');
        h2.textContent = b?.commonName ?? 'Unknown bear';

        const em = document.createElement('em');
        em.textContent = b?.scientificName ?? '';

        const p = document.createElement('p');
        p.textContent = b?.range ?? '';

        article.append(img, h2, em, p);
        this.root.appendChild(article);
    }

    async loadBears() {
        try {
            const res = await fetch(WIKI_API);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            const html = data?.parse?.text?.['*'];
            if (typeof html !== 'string' || !html.length) {
                throw new Error('Unexpected Wikipedia response');
            }

            // Wikipedia-HTML in DOM parsen
            const doc = new DOMParser().parseFromString(html, 'text/html');

            // Heuristik: Liste der Ursiden steht in <ul><li> unter .mw-parser-output
            const items = Array.from(doc.querySelectorAll('.mw-parser-output ul li'));

            const bears = [];
            for (const li of items) {
                const rawText = li.textContent.trim().replace(/\s+/g, ' ');
                if (!rawText) continue;

                // wissenschaftlicher Name (heuristisch aus Klammern)
                const sciMatch = rawText.match(/\(([^)]+)\)/);
                const scientificName = sciMatch ? sciMatch[1] : '';

                // Common name = Text ohne Klammern, erster Teil vor Komma
                const commonName = rawText.replace(/\([^)]*\)/g, '').split(',')[0].trim();
                if (!commonName) continue;

                const range = ''; // Range ist in der Liste nicht trivial — leer lassen

                // Bild (sofern vorhanden)
                const img = li.querySelector('img');
                const imageUrl = img
                    ? (img.getAttribute('src') || '').startsWith('//')
                        ? 'https:' + img.getAttribute('src')
                        : img.getAttribute('src')
                    : '';

                bears.push({ commonName, scientificName, range, imageUrl });

                // Sicherheits-Bremse: wir brauchen nicht hunderte
                if (bears.length >= 20) break;
            }

            // Duplikate entfernen, Reihenfolge behalten
            const seen = new Set();
            const unique = bears.filter(b => {
                const key = `${b.commonName}|${b.scientificName}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            if (!unique.length) throw new Error('Parsed zero bears from Wikipedia');
            return unique;
        } catch (err) {
            console.warn('Wikipedia load failed, using local fallback:', err);
            // Lokaler Fallback verhindert Crash & erlaubt Weiterarbeit
            return [
                {
                    commonName: 'Brown bear',
                    scientificName: 'Ursus arctos',
                    range: 'Eurasia, North America',
                    imageUrl: 'media/wild-bear.jpg',
                },
                {
                    commonName: 'Urban bear',
                    scientificName: 'Ursus urbanus',
                    range: 'Cities',
                    imageUrl: 'media/urban-bear.jpg',
                },
            ];
        }
    }
}
