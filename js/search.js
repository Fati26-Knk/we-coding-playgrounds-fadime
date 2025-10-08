// Search functionality module
export function initSearch({ form, input, scope }) {
  console.log('Initializing search module...');
  
  // Prüfe ob alle Elemente existieren
  if (!form || !input) {
    console.error('Search: Required elements not found', { 
      form: !!form, 
      input: !!input 
    });
    return;
  }

  try {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      try {
        console.log('Search form submitted');
        
        // Vorherige Highlights entfernen
        clearHighlights();
        
        const searchKey = input.value.trim();
        if (!searchKey) {
          console.log('Empty search query');
          return;
        }
        
        console.log('Searching for:', searchKey);
        
        // Nur in article-Elementen suchen (Anforderung)
        const articleElements = document.querySelectorAll('article');
        console.log('Found articles:', articleElements.length);
        
        // Sichere Regex-Erstellung ohne eval
        const escapedSearchKey = escapeRegExp(searchKey);
        const regex = new RegExp('(' + escapedSearchKey + ')', 'gi');
        
        articleElements.forEach(article => {
          walkAndHighlight(article, regex);
        });
        
        console.log('Search completed');
      } catch (error) {
        console.error('Search execution failed:', error);
        alert('Search functionality encountered an error. Please try again.');
      }
    });
    
    console.log('Search module initialized successfully');
  } catch (error) {
    console.error('Search initialization failed:', error);
  }
}

function clearHighlights() {
  document.querySelectorAll('.highlight').forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });
}

function walkAndHighlight(node, regex) {
  if (node.nodeType === 3) { // Text node
    const text = node.nodeValue;
    const matches = [];
    let match;
    
    // Alle Matches sammeln
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        index: match.index
      });
      // Verhindere infinite loop bei global regex
      if (!regex.global) break;
    }
    
    if (matches.length > 0) {
      // Sichere DOM-Manipulation ohne innerHTML oder eval
      const parent = node.parentNode;
      const fragment = document.createDocumentFragment();
      
      let lastIndex = 0;
      
      matches.forEach(match => {
        // Text vor dem Match
        if (match.index > lastIndex) {
          const beforeText = text.substring(lastIndex, match.index);
          fragment.appendChild(document.createTextNode(beforeText));
        }
        
        // Highlighted Match
        const mark = document.createElement('mark');
        mark.className = 'highlight';
        mark.textContent = match.text;
        fragment.appendChild(mark);
        
        lastIndex = match.index + match.text.length;
      });
      
      // Rest-Text nach dem letzten Match
      if (lastIndex < text.length) {
        const afterText = text.substring(lastIndex);
        fragment.appendChild(document.createTextNode(afterText));
      }
      
      parent.replaceChild(fragment, node);
    }
  } else if (node.nodeType === 1 && 
             node.tagName !== 'SCRIPT' && 
             node.tagName !== 'STYLE' && 
             node.tagName !== 'FORM' &&
             node.tagName !== 'MARK') {
    // Element node - weiter durchsuchen
    Array.from(node.childNodes).forEach(child => walkAndHighlight(child, regex));
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
