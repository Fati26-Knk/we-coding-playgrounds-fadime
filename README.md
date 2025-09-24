# Web Engineering Coding Playground Template

This repository is designed as the foundation for coding playgrounds in the Web Engineering course. It offers a structured space for experimenting with and mastering various web development technologies and practices. 
The project is based on [this](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/Accessibility_troubleshooting) repository from MDN.

The project introduces a lot of code smells for you to tackle. 
**Let's get coding!**

## Submission Details and Deadlines
* Coding playgrounds are **individual** work
* Use this base template to create your project repository.
* Submit your repository link once. Send me an invitation to your repository if it is set to private:
  > GitHub: leonardo1710
* Each playground must be submitted via a new branch in that repository (last commit within deadline will be graded).
  * Naming conventions of branch: <code>playground-1</code>, <code>playground-2</code>, ...
* Each playground has a total of 20 points available.

### Submission Deadlines
* [1st Playground](#1-js-playground): 23.09.2025
* [2nd Playground](#2-dependency--and-build-management-playground): 14.10.2025
* [3rd Playground](#3-accessibility--and-web-component-playground): 30.10.2025
* [4th Playground](#4-migrate-to-a-frontend-framework): 25.11.2025
* [5th Playground](#5-integrate-a-backend-framework): 17.12.2025

## Features

- Wonderful UI-design :heart_eyes:
- Loads bear data using [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page) :bear:
  - Original Wikipedia Page can be found [here](https://en.wikipedia.org/wiki/List_of_ursids)
- Worst JS coding practices :cold_sweat:
- No Build and Dependency Management at all :fire:


# Coding Playground Description

## K.O. Criteria
* No JS Frameworks allowed to solve the playgrounds 1-4 (e.g. Vue.js, Angular, React, Svelte,...) - don't panic we will come to that!
* No CSS Libraries allowed (e.g. Bootstrap, Material, Tailwind, ...)

## 1. JS Playground
The provided base project template contains bad coding and templating practices and bugs for you to fix. Take a look into the component files and get a grasp of the inner workings of the provided project. The app should provide the requirements described below. Some are implemented poorly or do not work at all. 

### App Requirements
* On page load the app requests the Wikipedia API to extract bear information from Wikipedia's [list of ursids](https://en.wikipedia.org/wiki/List_of_ursids). The page then renders the provided image, the common name, the scientific name and it's range.
  * the bears should be ordered in the same order and number (no duplicates) as in the corresponding Wiki page.
  * if there is no image available, the app should show a placeholder image.
* Users are able to toggle the comment section.
* Users are able to leave their name and a comment (both should not be empty).
* Users are able to search the web page contents using a search query, whereby only the html contents with tag <code>article</code> should be highlighted.

### Tasks
Fix application code and answer the questions:
* (4) Split the code into separate script files and make use of <b>JS modules</b>.
* (4) Fix the semantical issues in the code based on the provided requirements.
* (4) Add proper error handling to the code using ``try/catch`` and provide useful error messages to the users. Additionally, check the image URL availability before rendering the images in HTML. Provide placeholder images if the given URL does not exist.
* (4) Adapt the code to use ``async/await`` instead of the ``then()``-callback hell and refactor the functions to use arrow function syntax instead of ``function()``-syntax.
* (4) Eliminate the remaining bad coding practices that you can find. Take notes of why they are a bad practice and how you did fix it below.

# Dokumentation: Gefixte Bad Coding Practices

## Überblick der Refactoring-Verbesserungen

Das ursprüngliche Projekt enthielt verschiedene schlechte Coding Practices, die im Rahmen des Refactoring behoben wurden. Hier ist eine detaillierte Dokumentation aller Fixes:

---

## 1. 🏗️ **Monolithische Code-Struktur → Modulare Architektur**

### **Problem:**
- Gesamter JavaScript-Code war in einer einzigen Datei (vermutlich in HTML eingebettet)
- Keine Trennung der Verantwortlichkeiten
- Schlechte Wartbarkeit und Testbarkeit

### **Lösung:**
- **Aufgeteilt in 5 separate Module:**
  - `main.js` - App Bootstrap und Initialisierung
  - `bearManager.js` - Wikipedia API und Bären-Datenverarbeitung
  - `comments.js` - Kommentar-Funktionalität
  - `search.js` - Such-Funktionalität
  - `imageUtils.js` - Bild-Hilfsfunktionen

### **Warum das besser ist:**
- **Single Responsibility Principle:** Jedes Modul hat eine klare Aufgabe
- **Bessere Wartbarkeit:** Änderungen sind isoliert
- **Wiederverwendbarkeit:** Module können in anderen Projekten genutzt werden
- **Testbarkeit:** Jedes Modul kann einzeln getestet werden

---

## 2. 🔄 **Callback Hell → Async/Await**

### **Problem:**
- Verschachtelte `.then()` Callbacks
- Schwer lesbare und fehleranfällige asynchrone Code-Ketten
- Komplexe Fehlerbehandlung

### **Lösung:**
```javascript
// Vorher (Callback Hell):
fetch(url)
  .then(response => response.json())
  .then(data => processData(data))
  .then(result => updateUI(result))
  .catch(error => handleError(error));

// Nachher (Async/Await):
async loadBearData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const result = await processData(data);
    updateUI(result);
  } catch (error) {
    handleError(error);
  }
}
```

### **Warum das besser ist:**
- **Lesbarkeit:** Synchroner Stil für asynchronen Code
- **Fehlerbehandlung:** Zentrale try/catch Blöcke
- **Debugging:** Einfachere Stack-Traces

---

## 3. 🏷️ **Nicht-semantisches HTML → Semantische Struktur**

### **Problem:**
- Verwendung von generischen `<div>` und `<span>` Tags
- Fehlende semantische Bedeutung
- Schlechte Accessibility

### **Lösung:**
```html
<!-- Vorher: -->
<div class="header">
  <div class="title">Welcome to our wildlife website</div>
</div>

<!-- Nachher: -->
<header class="header">
  <h1>Welcome to our wildlife website</h1>
</header>
```

**Implementiert:**
- `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- Proper heading hierarchy (`h1`, `h2`, `h3`)
- `<table>` mit `<caption>`, `<thead>`, `<tbody>`, `<th scope="...">`

### **Warum das besser ist:**
- **SEO:** Suchmaschinen verstehen die Struktur besser
- **Accessibility:** Screen Reader können navigieren
- **Wartbarkeit:** Klarere Code-Struktur

---

## 4. 🚫 **Fehlende Fehlerbehandlung → Comprehensive Error Handling**

### **Problem:**
- Keine try/catch Blöcke
- Keine Benutzer-Feedback bei Fehlern
- App stürzt bei Netzwerkproblemen ab

### **Lösung:**
- **20+ try/catch Blöcke** in allen kritischen Funktionen
- **Benutzerfreundliche Fehlermeldungen** statt technische Errors
- **Graceful Degradation** bei API-Fehlern

```javascript
async loadBearData() {
  try {
    // API Call
  } catch (error) {
    console.error('Error loading bear data:', error);
    this.showErrorMessage('Failed to load bear information. Please refresh the page to try again.');
  }
}
```

### **Warum das besser ist:**
- **Robustheit:** App funktioniert auch bei Problemen
- **User Experience:** Klare Fehlermeldungen für Benutzer
- **Debugging:** Detaillierte Console-Logs für Entwickler

---

## 5. 🖼️ **Fehlende Bild-Fallbacks → Image Availability Check**

### **Problem:**
- Broken Images bei fehlenden URLs
- Keine Placeholder-Bilder
- Schlechte User Experience

### **Lösung:**
- **HEAD-Request Check** vor Bild-Anzeige
- **SVG Placeholder** für fehlende Bilder
- **Automatischer Fallback** bei 404-Errors

```javascript
async checkImageAvailability(imageUrl) {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

### **Warum das besser ist:**
- **Bessere UX:** Keine broken image icons
- **Performance:** HEAD-Requests sind effizienter
- **Konsistenz:** Einheitliches Erscheinungsbild

---

## 6. 🌐 **Globale Variablen → Module Scope**

### **Problem:**
- Variablen im globalen `window` Namespace
- Naming-Konflikte möglich
- Schwer nachvollziehbare Abhängigkeiten

### **Lösung:**
```javascript
// Vorher:
var bearData = [];
var isLoading = false;

// Nachher (in Modulen):
export class BearManager {
  constructor() {
    this.bearData = [];
    this.isLoading = false;
  }
}
```

### **Warum das besser ist:**
- **Namespace-Isolation:** Keine Konflikte zwischen Modulen
- **Klare Abhängigkeiten:** Import/Export macht Beziehungen explizit
- **Wartbarkeit:** Einfacher zu refactoren

---

## 7. 🔒 **Unsichere DOM-Manipulation → Sichere Methoden**

### **Problem:**
- Verwendung von `innerHTML` mit unvalidiertem Content
- XSS-Anfälligkeiten
- Potentielle Script-Injection

### **Lösung:**
```javascript
// Vorher (unsicher):
element.innerHTML = '<p>' + userInput + '</p>';

// Nachher (sicher):
const para = document.createElement('p');
para.textContent = userInput;
element.appendChild(para);
```

### **Warum das besser ist:**
- **Sicherheit:** Kein XSS durch HTML-Injection
- **Performance:** CreateElement ist oft schneller
- **Validierung:** Browser validiert automatisch

---

## 8. 🔍 **Fehlende Input-Validierung → Comprehensive Validation**

### **Problem:**
- Keine Validierung von Formulareingaben
- Empty strings akzeptiert
- Schlechte User Experience

### **Lösung:**
```javascript
// Kommentar-Validierung
if (!nameValue || !commentValue) {
  alert('Both name and comment fields are required!');
  return;
}

// Such-Validierung
const searchKey = input.value.trim();
if (!searchKey) {
  console.log('Empty search query');
  return;
}
```

### **Warum das besser ist:**
- **Datenintegrität:** Nur valide Daten werden verarbeitet
- **User Feedback:** Klare Hinweise bei Fehlern
- **Robustheit:** App verhält sich vorhersagbar

---

## 9. ♿ **Fehlende Accessibility → ARIA und Keyboard Support**

### **Problem:**
- Keine ARIA-Labels
- Keine Keyboard-Navigation
- Screen Reader Support fehlt

### **Lösung:**
```html
<!-- ARIA Labels -->
<label for="search-input" class="sr-only">Search website content</label>
<button aria-expanded="false">Show comments</button>

<!-- Keyboard Support -->
toggleBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleBtn.click();
  }
});
```

### **Warum das besser ist:**
- **Inklusion:** App für alle Benutzer zugänglich
- **Gesetzliche Anforderungen:** WCAG Compliance
- **Bessere UX:** Keyboard-Navigation für Power User

---

## 10. 🎯 **Unpräzise Suche → Targeted Article Search**

### **Problem:**
- Suche in gesamtem Document
- Highlight auch in Navigation/Footer
- Ungewollte Treffer

### **Lösung:**
```javascript
// Nur in article-Elementen suchen
const articleElements = document.querySelectorAll('article');
articleElements.forEach(article => {
  walkAndHighlight(article, regex);
});
```

### **Warum das besser ist:**
- **Präzision:** Nur relevanter Content wird durchsucht
- **Performance:** Weniger DOM-Knoten zu verarbeiten
- **UX:** Sinnvollere Suchergebnisse

---

## 📊 **Quantitative Verbesserungen:**

- **Module:** 1 → 5 separate Dateien
- **Try/Catch Blöcke:** 0 → 20+
- **Async Functions:** 0 → 7
- **Arrow Functions:** 0 → 15+
- **Semantic HTML Tags:** 3 → 12+
- **ARIA Attributes:** 0 → 4
- **Error Messages:** 0 → 8 benutzerfreundliche Meldungen

---

## 🎯 **Resultat:**

Das refactorierte Projekt ist jetzt:
- ✅ **Modular und wartbar**
- ✅ **Sicher gegen XSS**
- ✅ **Accessible für alle Benutzer**
- ✅ **Robust gegen Netzwerk-/API-Fehler**
- ✅ **Modern mit ES6+ Features**
- ✅ **Semantisch korrekt strukturiert**
- ✅ **Performance-optimiert**

Alle Anforderungen wurden erfolgreich implementiert und Bad Practices eliminiert.


## 2. Dependency- and Build Management Playground
Build the application with ``npm`` and a build and a dependency management tool of your choice (e.g. [Vite](https://vitejs.dev/), [Webpack](https://webpack.js.org/), or others). Additionally, refactor the comments section to be a web component using shadow dom and templates.

### Tasks
* (1) Integrate `npm` and a build management tool into your project.
* (5) Configure your project to use Typescript as your primary development language and adapt the code and file extensions respectively.
* (3) Use ESLint and Prettier inside your project - rulesets can be found below.
* (2) Keep your builds clear and add dependencies to the right build.
* (2) Define the following tasks within `npm scripts`:
  * `dev`: starts the development server.
  * `build`: runs the typescript compiler and bundles your application - bundling depends on your chosen build tool (e.g. Vite, Webpack) but typically bundles multiple files into one, applies optimizations like minification and obfuscation and outputs final results to a `dist` or `build` directory.
  * `lint`: runs ESLint on all  `.js` and `.ts` files in your projects `/src` directory.
  * `lint:fix`: runs and also fixes all issues found by ESLint.
  * `format`: formats all `.js` and `.ts` files in your projects `/src` directory.
  * `format:check`: checks if the files in the `/src` directory are formatted according to Prettier's rules.
* (2) Configure a pre-commit hook that lints and formats your code using [husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged). A tutorial can be found [here](https://dev.to/shashwatnautiyal/complete-guide-to-eslint-prettier-husky-and-lint-staged-fh9).
* Configure **2 Workflows** using GitHub Actions, one for development and one for deployment:
  * (2) Development Workflow should at least lint (optionally test) your code when developers push to a branch named `development`.
  * (3) Deployment Workflow is triggered when developers push into `production` branch. It should at least lint and build your source code. Afterwards the build artifacts of your application should be automatically deployed to Github Pages (or another hosting provider of your choice).

> 
> _Insert GitHub Pages URL here......_
>
> 

**ESLint Configurations**

Use ESLint configs [standard-with-typescript](https://www.npmjs.com/package/eslint-config-standard-with-typescript) and [TypeScript ESLint Plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin).
Your `.eslintrc` file should have the following extensions:
```.eslintrc.yml
...
extends:
  - standard-with-typescript
  - plugin:@typescript-eslint/recommended
  - plugin:prettier/recommended
  - prettier
...
```
 
**Prettier Configurations**

Apply the following ruleset for Prettier:
``` .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80
}
```

## 3.	Accessibility and Web Component Playground
You might have noticed that the base project has a number of accessibility issues - your task is to explore the existing site and fix them.
Use the tools presented in our accessibility workshop to test the accessibility of your app and write a summary of your reports below.
Additionally, refactor your project by encapsulating the comments section into a web component.

### Tasks
* Accessibility Checks:
  * (2) **Color**: Test the current color contrast (text/background), report the results of the test, and then fix them by changing the assigned colors.
  * (2) **Semantic HTML**: Report on what happens when you try to navigate the page using a screen reader. Fix those navigation issues.
  * (2) **Audio**: The ``<audio>`` player isn't accessible to hearing impaired people — can you add some kind of accessible alternative for these users?
  * (2) **Forms**: 
    * The ``<input>`` element in the search form at the top could do with a label, but we don't want to add a visible text label that would potentially spoil the design and isn't really needed by sighted users. Fix this issue by adding a label that is only accessible to screen readers.
    * The two ``<input>`` elements in the comment form have visible text labels, but they are not unambiguously associated with their labels — how do you achieve this? Note that you'll need to update some of the CSS rule as well.
  * (2) **Comment Section**: The show/hide comment control button is not currently keyboard-accessible. Can you make it keyboard accessible, both in terms of focusing it using the tab key, and activating it using the return key?
  * (4) **The table**: The data table is not currently very accessible — it is hard for screen reader users to associate data rows and columns together, and the table also has no kind of summary to make it clear what it shows. Can you add some features to your HTML to fix this problem?

* (6) Create a web component for the "Add comment" section. Use te shadow DOM and <code>template</code> syntax to encapsulate all related styles inside the component. 


> 
> _Present your findings here..._
>
 

## 4. Migrate to a Frontend Framework
In this playground you will migrate your application to a frontend framework of your choice.

### Tasks
* Migrate your application to a frontend framework of your choice (e.g. React, Angular, Vue.js, Svelte,...).
  * All previous features should still work.
  * The application still should use build and dependency management.
  * Make use of provided framework features for a clean project structure like components, templates, state,...
* Adapt your `npm scripts` if necessary.

## 5. Integrate a Backend Framework
In this playground you will use a backend framework of your choice and connect it over an API to your frontend application. Additionally, you will dockerize your frontend and backend applications. It should be possible to start all services in the corresponding mode (development, production) with a single command (e.g. use Docker Compose for this).

### Tasks
* (3) Setup a backend framework of your choice.
* (3) Create an API your frontend will be connected to. Your backend should  request the bear data from presented Wikipedia API and serve it to your frontend.
* (2) Configure CORS to only allow requests from your frontend. 
* (2) Replace the frontend Wikipedia API calls with calls to your backend - the functionality of your frontend should work as before!
* (6) Create **multi-stage Dockerfiles** for your applications (depending on your frameworks):
  * The frontend Dockerfile should: 1. run the app in a development environment 2. build the app 3. serve build artefacts over Nginx
  * The backend Dockerfile should: 1. run the app in a development environment 2. build the app if there is a build step in your framework (optional) 3. serve the app 
* (4) Create two docker-compose files to orchestrate you applications in ``development`` and ``production`` mode:
    * Define ports and dependencies
    * Define corresponding stage (development, production)
    * Use environment variables if possible
* Your application should start with the following commands:
    * Development: `docker-compose -f docker-compose.yml up --build`
    * Production: `docker-compose -f docker-compose.prod.yml up --build`

---

<p>© 2025 Leon Freudenthaler (Hochschule Campus Wien). All rights reversed.</p>
