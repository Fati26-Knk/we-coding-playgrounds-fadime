// Search functionality module with TypeScript types

interface SearchElements {
  form: HTMLFormElement;
  input: HTMLInputElement;
  scope?: Document;
}

interface SearchMatch {
  text: string;
  index: number;
}

export function initSearch({
  form,
  input,
}: Omit<SearchElements, 'scope'>): void {
  console.log('Initializing search module...');

  // Prüfe ob alle Elemente existieren
  if (!form || !input) {
    console.error('Search: Required elements not found', {
      form: !!form,
      input: !!input,
    });
    return;
  }

  try {
    form.addEventListener('submit', (e: Event): void => {
      e.preventDefault();

      try {
        console.log('Search form submitted');

        // Vorherige Highlights entfernen
        clearHighlights();

        const searchKey: string = input.value.trim();
        if (!searchKey) {
          console.log('Empty search query');
          return;
        }

        console.log('Searching for:', searchKey);

        // Nur in article-Elementen suchen (Anforderung)
        const articleElements: NodeListOf<HTMLElement> =
          document.querySelectorAll('article');
        console.log('Found articles:', articleElements.length);

        // Sichere Regex-Erstellung ohne eval
        const escapedSearchKey: string = escapeRegExp(searchKey);
        const regex: RegExp = new RegExp('(' + escapedSearchKey + ')', 'gi');

        articleElements.forEach((article: HTMLElement): void => {
          walkAndHighlight(article, regex);
        });

        console.log('Search completed');
      } catch (error: unknown) {
        console.error('Search execution failed:', error);
        alert('Search functionality encountered an error. Please try again.');
      }
    });

    console.log('Search module initialized successfully');
  } catch (error: unknown) {
    console.error('Search initialization failed:', error);
  }
}

function clearHighlights(): void {
  const highlights: NodeListOf<HTMLElement> =
    document.querySelectorAll('.highlight');
  highlights.forEach((el: HTMLElement): void => {
    const parent: Node | null = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ''), el);
      parent.normalize();
    }
  });
}

function walkAndHighlight(node: Node, regex: RegExp): void {
  if (node.nodeType === 3) {
    // Text node
    const text: string = node.nodeValue || '';
    const matches: SearchMatch[] = [];
    let match: RegExpExecArray | null;

    // Alle Matches sammeln
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        index: match.index,
      });
      // Verhindere infinite loop bei global regex
      if (!regex.global) break;
    }

    if (matches.length > 0) {
      // Sichere DOM-Manipulation ohne innerHTML oder eval
      const parent: Node | null = node.parentNode;
      if (!parent) return;

      const fragment: DocumentFragment = document.createDocumentFragment();

      let lastIndex = 0;

      matches.forEach((match: SearchMatch): void => {
        // Text vor dem Match
        if (match.index > lastIndex) {
          const beforeText: string = text.substring(lastIndex, match.index);
          fragment.appendChild(document.createTextNode(beforeText));
        }

        // Highlighted Match
        const mark: HTMLElement = document.createElement('mark');
        mark.className = 'highlight';
        mark.textContent = match.text;
        fragment.appendChild(mark);

        lastIndex = match.index + match.text.length;
      });

      // Rest-Text nach dem letzten Match
      if (lastIndex < text.length) {
        const afterText: string = text.substring(lastIndex);
        fragment.appendChild(document.createTextNode(afterText));
      }

      parent.replaceChild(fragment, node);
    }
  } else if (
    node.nodeType === 1 &&
    node instanceof Element &&
    node.tagName !== 'SCRIPT' &&
    node.tagName !== 'STYLE' &&
    node.tagName !== 'FORM' &&
    node.tagName !== 'MARK'
  ) {
    // Element node - weiter durchsuchen
    Array.from(node.childNodes).forEach((child: Node): void => {
      walkAndHighlight(child, regex);
    });
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
