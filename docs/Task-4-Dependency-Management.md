# Task 4: Dependency Management (2 Punkte)

## **Was wurde gemacht?**

**Ziel:** Professionelle Verwaltung von Projekt-Abhängigkeiten mit NPM

**Ergebnis:** Saubere Trennung zwischen Development- und Production-Dependencies mit Sicherheits-Monitoring

---

## **1. Was sind Dependencies?**

### **Einfach erklärt:**

- **Dependencies** = "Zutaten" die unser Projekt braucht
- **Vergleich:** Wie Zutaten für ein Kochrezept
- **package.json** = Die "Einkaufsliste"
- **node_modules** = Der "Kühlschrank" mit allen Zutaten

### **Zwei Arten von Dependencies:**

| **Dependencies**                     | **DevDependencies**                   |
| ------------------------------------ | ------------------------------------- |
| **Für:** Production (Live-Website)   | **Für:** Development nur              |
| **Werden:** Mit der App ausgeliefert | **Werden:** Nicht ausgeliefert        |
| **Beispiel:** React, Vue             | **Beispiel:** ESLint, TypeScript      |
| **Command:** `npm install --save`    | **Command:** `npm install --save-dev` |

---

## **2. Unsere Dependency-Struktur**

### **Production Dependencies:**

```json
{
  "dependencies": {
    // KEINE!
    // Moderne Frontend-Apps brauchen oft keine Runtime-Dependencies
    // Alles wird zur Build-Zeit "gebundelt"
  }
}
```

### **Development Dependencies:**

```json
{
  "devDependencies": {
    // BUILD TOOLS
    "vite": "^5.4.6", // Build System
    "typescript": "^5.6.2", // TypeScript Compiler

    // CODE QUALITY
    "eslint": "^8.57.1", // Code Linting
    "prettier": "^3.6.2", // Code Formatting

    // GIT AUTOMATION
    "husky": "^9.1.7", // Git Hooks
    "lint-staged": "^16.2.3", // Staged Files Processing

    // UTILITIES
    "@types/node": "^22.7.4", // Node.js Types
    "rimraf": "^6.0.1" // Cross-platform file deletion
  }
}
```

---

## **3. Semantic Versioning (SemVer)**

### **Version Format: MAJOR.MINOR.PATCH**

```
Beispiel: 5.4.6
         │ │ │
         │ │ └── PATCH: Bug-Fixes (sicher)
         │ └──── MINOR: Neue Features (rückwärts-kompatibel)
         └────── MAJOR: Breaking Changes (Vorsicht!)
```

### **Version Ranges in package.json:**

| Symbol    | Beispiel | Bedeutung         | Sicherheit  |
| --------- | -------- | ----------------- | ----------- |
| **^**     | `^5.4.6` | 5.4.6 bis < 6.0.0 | Empfohlen   |
| **~**     | `~5.4.6` | 5.4.6 bis < 5.5.0 | Konservativ |
| **Exakt** | `5.4.6`  | Nur exakt 5.4.6   | Zu strikt   |
| **\***    | `*`      | Beliebige Version | Gefährlich  |

### **Warum ^5.4.6 (Caret Range)?**

- **Automatische Bug-Fixes:** 5.4.7, 5.4.8, ...
- **Neue Features:** 5.5.0, 5.6.0, ...
- **Keine Breaking Changes:** 6.0.0 wird NICHT installiert
- **Sicherheits-Updates** werden automatisch eingespielt

---

## **4. Sicherheit & Wartung**

### **Wichtige Commands:**

```bash
# Zeigt verfügbare Updates
npm outdated

# Updated innerhalb der Version-Ranges
npm update

# Security Vulnerability Check
npm audit

# Auto-fix Security Issues
npm audit fix
```

### **package-lock.json - Warum wichtig?**

- **Zweck:** Speichert EXAKTE Versionen für alle Dependencies
- **Benefit:** Jeder im Team hat identische Versionen
- **Ergebnis:** Keine "Works on my machine" Probleme

### **npm install vs npm ci:**

| `npm install`                                 | `npm ci`                                |
| --------------------------------------------- | --------------------------------------- |
| **Flexibel:** Updated package-lock.json       | **Exakt:** Liest nur package-lock.json  |
| **Development:** Neue Dependencies hinzufügen | **CI/CD:** Reproduzierbare Builds       |
| **Dauer:** Kann länger dauern                 | **Schneller:** Optimiert für Automation |

---

## ️ **5. Unsere Dependencies erklärt**

### **Build Tools:**

- **`vite`:** Bundelt Code für Browser
- **`typescript`:** Kompiliert TypeScript zu JavaScript
- **`rimraf`:** Cross-platform "rm -rf" für Clean-Scripts

### **Code Quality:**

- **`eslint`:** Findet Code-Probleme
- **`prettier`:** Automatische Formatierung
- **`@typescript-eslint/*`:** TypeScript Rules für ESLint

### **Automation:**

- **`husky`:** Git Hooks Management
- **`lint-staged`:** Scripts nur auf geänderte Dateien

### **Type Definitions:**

- **`@types/node`:** TypeScript Definitionen für Node.js APIs

---

### **"Warum keine dependencies, nur devDependencies?"**

**Antwort:** "Moderne Frontend-Apps werden 'gebundelt' - alle Dependencies werden zur Build-Zeit in eine einzige Datei gepackt. Runtime Dependencies sind nur für Backend/Node.js Apps nötig."

### **"Was passiert wenn package-lock.json und package.json nicht übereinstimmen?"**

**Antwort:** "npm install regeneriert die Lock-Datei. In Teams sollte die Lock-Datei immer committed werden für konsistente Builds."

### **"Wie oft sollte man Dependencies updaten?"**

**Antwort:** "Patch-Updates sofort (Bug-Fixes). Minor-Updates monatlich (neue Features). Major-Updates halbjährlich mit Testing (Breaking Changes)."

---

## **Live-Demo Commands**

### **Für Präsentation:**

1. **Dependency Tree zeigen:**

```bash
npm list --depth=0
# → Zeigt alle installierten Dependencies
```

2. **Available Updates checken:**

```bash
npm outdated
# → Zeigt verfügbare Updates
```

3. **Security Audit:**

```bash
npm audit
# → Security Vulnerability Check
```

4. **Lock-Datei erklären:**

```bash
# package.json → "Einkaufsliste" (flexible Versionen)
# package-lock.json → "Kassenbong" (exakte Versionen)
```

5. **Installation demonstrieren:**

```bash
# Development
npm install --save-dev eslint

# Production (falls nötig)
npm install --save react
```

---

## **Erfolgs-Beweis**

- **Saubere Trennung:** 0 production deps, 12 dev deps
- **SemVer Compliance:** Alle Dependencies nutzen Caret Ranges (^)
- **Security:** `npm audit` zeigt keine kritischen Vulnerabilities
- **Lock File:** package-lock.json für reproduzierbare Builds
- **Updates verfügbar:** `npm outdated` zeigt kontrollierte Update-Möglichkeiten

---

## **Dependency Kategorien**

### **Nach Zweck:**

```
Build Tools (3):     vite, typescript, rimraf
Code Quality (5):    eslint, prettier, @typescript-eslint/*
Automation (2):      husky, lint-staged
Type Definitions (1): @types/node
Configurations (1):  eslint-config-*
```

### **Nach Größe (node_modules):**

- **Kleine Packages:** < 1MB (husky, rimraf)
- **Medium Packages:** 1-10MB (prettier, typescript)
- **Große Packages:** > 10MB (eslint ecosystem)

---

## **Häufige Probleme & Lösungen**

### **"npm audit zeigt Vulnerabilities"**

```bash
npm audit fix          # Automatische Fixes
npm audit fix --force  # Erzwungene Updates bei Major Changes
```

### **"node_modules ist riesig"**

- **Normal:** Moderne JavaScript-Projekte haben viele Dependencies
- **Lösung:** `npm ci` statt `npm install` in CI/CD für Speed
- **Alternative:** Yarn oder pnpm für besseres Dependency Management

### **"Dependencies sind outdated"**

```bash
npm outdated           # Zeigt verfügbare Updates
npm update            # Updated innerhalb SemVer Ranges
# Für Major Updates: Manuell in package.json ändern
```

---

## **Key Message für Lehrer**

**"Dependency Management ist das Fundament jeder modernen Anwendung. Unsere Struktur zeigt professionelle Practices: Saubere Trennung, Security Monitoring, reproduzierbare Builds. Das ist genau wie Netflix und Google ihre Dependencies verwalten."**
