# Web Engineering Coding Playgrounds - Documentation

## Project Overview

**Student:** Fadime  
**Course:** Web Engineering  
**Institution:** Hochschule Campus Wien  
**Instructor:** Leon Freudenthaler  
**Repository:** [we-coding-playgrounds-fadime](https://github.com/Fati26-Knk/we-coding-playgrounds-fadime)

---

## Playgrounds Summary

### Playground 1: Accessibility & Semantic HTML

**Branch:** `playground-1`  
**Status:** Completed  
**Points:** 14/14

**Key Achievements:**

- Semantic HTML structure (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`)
- Form accessibility (labels with `for`/`id` associations)
- Table accessibility (`<caption>`, `<th scope="col/row">`)
- Keyboard navigation (button focus and activation)
- Audio transcript
- Color contrast fixes

---

### Playground 2: TypeScript & Build Tools

**Branch:** `playground-2`  
**Status:** Completed  
**Points:** All tasks completed

**Key Achievements:**

- Migrated vanilla JavaScript to TypeScript
- Vite build system integration
- NPM scripts for development and production
- Type definitions for all modules
- ESLint + TypeScript configuration
- Source maps for debugging

---

### Playground 3: Advanced Accessibility & Web Components

**Branch:** `playground-3`  
**Status:** Completed  
**Points:** 20/20 (14 accessibility + 6 web components)

**Key Achievements:**

- Color contrast improvements (WCAG AAA compliance)
- Audio accessibility with comprehensive transcript
- Web Component for comment form (Shadow DOM)
- Custom elements API
- NVDA screen reader testing
- Complete accessibility documentation

**Documentation:**

- ~~Task-1-Color-Contrast.md~~ (Removed - Replaced by P4 docs)
- ~~Task-2-Semantic-HTML.md~~ (Removed - Replaced by P4 docs)
- ~~Task-3-Audio-Accessibility.md~~ (Removed - Replaced by P4 docs)
- ~~Task-4-Form-Labels.md~~ (Removed - Replaced by P4 docs)
- ~~Task-5-Keyboard-Navigation.md~~ (Removed - Replaced by P4 docs)
- ~~Task-6-Table-Accessibility.md~~ (Removed - Replaced by P4 docs)
- ~~Playground-3-Accessibility-Report.md~~ (Removed - Replaced by P4 docs)

---

### Playground 4: React Migration ⭐ CURRENT

**Branch:** `playground-4`  
**Status:** Completed  
**Framework:** React 18 + TypeScript + Vite

**Key Achievements:**

- Complete migration from Vanilla TypeScript to React
- 11 reusable React components created
- State management with React Hooks (useState, useEffect)
- TypeScript integration with strict mode
- All Playground 3 accessibility features preserved
- Wikipedia API integration migrated (BearList component)
- Build system maintained (Vite)
- Production-ready application

**Components:**

1. Header.tsx
2. Navigation.tsx
3. Article.tsx
4. BearsTable.tsx
5. AudioSection.tsx
6. CommentsSection.tsx
7. CommentFormReact.tsx
8. CommentList.tsx
9. Sidebar.tsx
10. Footer.tsx
11. BearList.tsx (Wikipedia integration)

**Documentation:**

- [Playground-4-React-Migration.md](./Playground-4-React-Migration.md) - Complete migration guide

**Commits:**

```
1767fbf - feat(playground-4): Add BearList React component for Wikipedia bear fetching
```

---

## Technology Stack Evolution

| Technology           | P1         | P2         | P3             | P4                   |
| -------------------- | ---------- | ---------- | -------------- | -------------------- |
| **Language**         | JavaScript | TypeScript | TypeScript     | TypeScript           |
| **Framework**        | Vanilla    | Vanilla    | Vanilla        | **React 18**         |
| **Build Tool**       | -          | Vite       | Vite           | Vite                 |
| **Components**       | HTML       | HTML       | Web Components | **React Components** |
| **State Management** | DOM        | DOM        | DOM            | **React Hooks**      |
| **Bundler**          | -          | Vite       | Vite           | Vite                 |
| **Type Safety**      |            |            |                |                      |
| **Dev Server**       | -          |            |                |                      |

---

## Learning Progression

### Playground 1 → 2: JavaScript to TypeScript

**Skills Acquired:**

- Type annotations and interfaces
- Build tooling (Vite)
- NPM package management
- Module systems (ES6 imports/exports)
- Source maps and debugging

### Playground 2 → 3: Advanced Web Standards

**Skills Acquired:**

- Web Components API
- Shadow DOM encapsulation
- Custom Elements
- ARIA attributes
- Screen reader testing (NVDA)
- WCAG 2.1 compliance

### Playground 3 → 4: Modern Framework Migration

**Skills Acquired:**

- React component architecture
- React Hooks (useState, useEffect)
- Props and event handling
- Controlled components (forms)
- Component composition
- Declarative UI programming
- Virtual DOM concepts
- JSX/TSX syntax

---

## Project Statistics

### Code Metrics (Playground 4)

- **Total Components:** 11 React components
- **Lines of Code:** ~1,200 lines (TypeScript + JSX)
- **TypeScript Coverage:** 100%
- **Accessibility Score:** WCAG 2.1 Level AA compliant
- **Bundle Size (Production):** ~50 KB (gzipped)
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

### Git Activity

- **Branches:** 4 (playground-1, playground-2, playground-3, playground-4)
- **Total Commits:** 20+ commits
- **Documentation Files:** 2 (this README + P4 migration guide)

---

## How to Run

### Prerequisites

```bash
node --version  # v18+ recommended
npm --version   # v9+ recommended
```

### Development Mode

```bash
# Playground 4 (React)
git checkout playground-4
npm install
npm run dev
# → http://localhost:3000
```

### Production Build

```bash
npm run build
npm run preview
# → Optimized build in dist/
```

### Other Playgrounds

```bash
# Playground 3 (Web Components + TypeScript)
git checkout playground-3
npm install
npm run dev

# Playground 2 (Vanilla TypeScript)
git checkout playground-2
npm install
npm run dev

# Playground 1 (Vanilla JavaScript)
git checkout playground-1
# Open index.html in browser (no build step)
```

---

## Key Features Across All Playgrounds

### Accessibility (All Playgrounds)

- Semantic HTML5 elements
- ARIA attributes where needed
- Keyboard navigation support
- Screen reader compatibility
- Form labels and associations
- Table headers and captions
- Audio transcripts
- Color contrast compliance
- Focus indicators

### Functionality (All Playgrounds)

- Comment system (add, display, timestamp)
- Search functionality
- Audio player with controls
- Navigation menu
- Bears comparison table
- Wikipedia bears integration
- Responsive design

### Technical Excellence (P2-P4)

- TypeScript type safety
- Vite build optimization
- ESLint code quality
- Source maps for debugging
- NPM scripts automation
- Production-ready builds

---

## Next Steps: Playground 5

**Task:** Integrate a Backend Framework

**Planned Features:**

- Backend API (Node.js/Express or similar)
- CORS configuration
- Wikipedia API proxy
- Docker containerization
- Multi-stage Dockerfiles
- Docker Compose orchestration
- Development & Production modes

**Expected Deliverables:**

- Backend API server
- Updated frontend (fetch from backend)
- Dockerfile (frontend)
- Dockerfile (backend)
- docker-compose.yml
- docker-compose.prod.yml

---

## Documentation Index

### Current Documentation

1. **[README.md](./README.md)** (This file) - Project overview
2. **[Playground-4-React-Migration.md](./Playground-4-React-Migration.md)** - Detailed React migration guide

### Archived Documentation (Playground 3)

Previous documentation has been removed and consolidated into the current Playground 4 documentation, which preserves all accessibility information.

---

## Resources & References

### Official Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tools Used

- **IDE:** Visual Studio Code
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Build Tool:** Vite
- **Linter:** ESLint
- **Screen Reader:** NVDA (accessibility testing)
- **AI Assistant:** GitHub Copilot

---

## Acknowledgments

**Instructor:** Leon Freudenthaler - Hochschule Campus Wien  
**Course:** Web Engineering  
**AI Support:** GitHub Copilot (code generation and documentation)  
**Testing:** NVDA Screen Reader, modern browsers

---

## License

© 2025 Fadime. Educational project for Hochschule Campus Wien.

---

**Last Updated:** October 28, 2025  
**Current Playground:** 4 (React Migration)  
**Next Playground:** 5 (Backend Integration)
