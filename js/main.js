import { BearManager } from './bearManager.js';
import { initComments } from './comments.js';
import { initSearch } from './search.js';

class WildlifeApp {
  constructor() {
    console.log('WildlifeApp constructor called');
    this.bearManager = null;
  }

  async initializeModules() {
    console.log('Starting module initialization...');
    
    try {
      // Kommentare initialisieren
      const toggleBtn = document.getElementById('toggle-comments');
      const wrapper = document.getElementById('comment-wrapper');
      const form = document.getElementById('comment-form');
      const list = document.getElementById('comment-list');
      
      console.log('Comment elements found:', { 
        toggleBtn: !!toggleBtn, 
        wrapper: !!wrapper, 
        form: !!form, 
        list: !!list 
      });
      
      if (toggleBtn && wrapper && form && list) {
        initComments({ toggleBtn, wrapper, form, list });
        console.log('Comments initialized successfully');
      } else {
        console.error('Comment elements missing');
      }

      // Suche initialisieren
      const searchForm = document.getElementById('search-form');
      const searchInput = document.getElementById('search-input');
      
      console.log('Search elements found:', { 
        searchForm: !!searchForm, 
        searchInput: !!searchInput 
      });
      
      if (searchForm && searchInput) {
        initSearch({ form: searchForm, input: searchInput, scope: document });
        console.log('Search initialized successfully');
      } else {
        console.error('Search elements missing');
      }

      // Bären-Manager initialisieren
      console.log('Initializing bear manager...');
      this.bearManager = new BearManager();
      await this.bearManager.init();
      console.log('Bear manager initialized successfully');
      
    } catch (error) {
      console.error('Module initialization error:', error);
      throw error;
    }
  }

  async init() {
    try {
      console.log('App initialization started, readyState:', document.readyState);
      
      // Warten bis DOM ready ist
      if (document.readyState === 'loading') {
        console.log('Waiting for DOM content loaded...');
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
      }
      
      console.log('DOM ready, initializing modules...');
      await this.initializeModules();
      console.log('Wildlife app initialized successfully');
    } catch (error) {
      console.error('Application initialization failed:', error);
      alert('App failed to start. Please reload the page.');
    }
  }
}

// App starten
console.log('Creating WildlifeApp instance...');
const app = new WildlifeApp();
app.init();
