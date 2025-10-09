// Main application entry point with TypeScript types

import { BearManager } from './bearManager.js';
import { initComments } from './comments.js';
import { initSearch } from './search.js';

interface CommentElements {
  toggleBtn: HTMLButtonElement | null;
  wrapper: HTMLElement | null;
  form: HTMLFormElement | null;
  list: HTMLElement | null;
}

interface SearchElements {
  form: HTMLFormElement | null;
  input: HTMLInputElement | null;
}

class WildlifeApp {
  private bearManager: BearManager | null = null;

  constructor() {
    console.log('WildlifeApp constructor called');
  }

  private async initializeModules(): Promise<void> {
    console.log('Starting module initialization...');

    try {
      // Kommentare initialisieren
      const commentElements: CommentElements = {
        toggleBtn: document.getElementById(
          'toggle-comments'
        ) as HTMLButtonElement | null,
        wrapper: document.getElementById('comment-wrapper'),
        form: document.getElementById('comment-form') as HTMLFormElement | null,
        list: document.getElementById('comment-list'),
      };

      console.log('Comment elements found:', {
        toggleBtn: !!commentElements.toggleBtn,
        wrapper: !!commentElements.wrapper,
        form: !!commentElements.form,
        list: !!commentElements.list,
      });

      if (
        commentElements.toggleBtn &&
        commentElements.wrapper &&
        commentElements.form &&
        commentElements.list
      ) {
        initComments({
          toggleBtn: commentElements.toggleBtn,
          wrapper: commentElements.wrapper,
          form: commentElements.form,
          list: commentElements.list,
        });
        console.log('Comments initialized successfully');
      } else {
        console.error('Comment elements missing');
      }

      // Suche initialisieren
      const searchElements: SearchElements = {
        form: document.getElementById('search-form') as HTMLFormElement | null,
        input: document.getElementById(
          'search-input'
        ) as HTMLInputElement | null,
      };

      console.log('Search elements found:', {
        form: !!searchElements.form,
        input: !!searchElements.input,
      });

      if (searchElements.form && searchElements.input) {
        initSearch({
          form: searchElements.form,
          input: searchElements.input,
        });
        console.log('Search initialized successfully');
      } else {
        console.error('Search elements missing');
      }

      // Bären-Manager initialisieren
      console.log('Initializing bear manager...');
      this.bearManager = new BearManager();
      await this.bearManager.init();
      console.log('Bear manager initialized successfully');
    } catch (error: unknown) {
      console.error('Module initialization error:', error);
      throw error;
    }
  }

  async init(): Promise<void> {
    try {
      console.log(
        'App initialization started, readyState:',
        document.readyState
      );

      // Warten bis DOM ready ist
      if (document.readyState === 'loading') {
        console.log('Waiting for DOM content loaded...');
        await new Promise<void>((resolve: () => void): void => {
          document.addEventListener('DOMContentLoaded', resolve, {
            once: true,
          });
        });
      }

      console.log('DOM ready, initializing modules...');
      await this.initializeModules();
      console.log('Wildlife app initialized successfully');
    } catch (error: unknown) {
      console.error('Application initialization failed:', error);
      alert('App failed to start. Please reload the page.');
    }
  }
}

// App starten
console.log('Creating WildlifeApp instance...');
const app: WildlifeApp = new WildlifeApp();
app.init().catch((error: unknown): void => {
  console.error('Failed to initialize app:', error);
});
