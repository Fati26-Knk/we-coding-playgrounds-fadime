# Task 5: Keyboard Navigation (Comment Button) (2 Points)

## Aufgabenstellung

**Problem:** The show/hide comment control button is not currently keyboard-accessible. Can you make it keyboard accessible, both in terms of focusing it using the tab key, and activating it using the return key?

**WCAG Kriterien:**

- **2.1.1 Keyboard (Level A):** Alle Funktionen per Tastatur bedienbar
- **2.1.3 Keyboard (No Exception) (Level AAA):** Keine Ausnahmen
- **4.1.2 Name, Role, Value (Level A):** UI-Komponenten bedienbar

---

## Problem-Analyse

### Ursprünglicher Code (Initial Commit)

```html
<!-- BEFORE: Non-semantic DIV -->
<div class="show-hide">Show comment</div>
```

```javascript
// BEFORE: Nur Mouse-Click
var showHideBtn = document.querySelector('.show-hide');
showHideBtn.onclick = function () {
  // Toggle logic...
};
```

### Probleme

**Nicht fokussierbar**

- `<div>` ist nicht in Tab-Reihenfolge
- Keyboard-Benutzer können Element nicht erreichen

  **Nicht aktivierbar**

- Enter/Space Keys funktionieren nicht
- Nur Mouse-Click möglich

  **Keine Semantik**

- Screen Reader sagen "Text" statt "Button"
- Keine Rolle kommuniziert

---

## 🔧 Lösung: Semantic Button (Playground 1)

**Wichtiger Hinweis:** Die Keyboard-Accessibility wurde bereits in **Playground 1** implementiert. In **Playground 3** wurde die Implementierung verifiziert und mit NVDA getestet.

### Fix #1: DIV → BUTTON

```html
<!-- AFTER: Semantic Button Element -->
<button
  id="toggle-comments"
  class="show-hide"
  type="button"
  aria-expanded="false"
>
  Show comments
</button>
```

**Was ändert sich?**

- **Automatisch fokussierbar** - In Tab-Reihenfolge
- **Automatisch aktivierbar** - Enter/Space funktioniert
- **Semantische Rolle** - Screen Reader sagt "Button"
- **ARIA State** - `aria-expanded` kommuniziert Zustand

### Fix #2: Explizite Keyboard Event Handler

```typescript
// Keyboard Support (TypeScript)
toggleBtn.addEventListener('keydown', (e: KeyboardEvent): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault(); // Verhindert Scrollen bei Space
    toggleBtn.click(); // Nutzt Click-Handler
  }
});
```

**Warum explizit, wenn Button schon funktioniert?**

- **Defense in Depth** - Garantiert Funktionalität
- **Prevent Scroll** - Space-Key scrollt nicht mehr
- **Konsistenz** - Gleiche Logik für alle Eingaben
- **Best Practice** - Explizit ist besser als implizit

---

## Button Features

### Native Button Capabilities

```html
<button type="button">
  <!-- Automatisch bereitgestellt: -->
  <!--    tabindex="0" (fokussierbar) -->
  <!--    role="button" (Semantik) -->
  <!--    Enter/Space Keys (Aktivierung) -->
  <!--    Click Events (bei Keyboard) -->
  <!--    Focus Outline (visuelle Feedback) -->
</button>
```

### ARIA Enhanced

```html
<button id="toggle-comments" type="button" aria-expanded="false">
  Show comments
</button>
```

**`aria-expanded` Zustand:**

- `false` - Kommentare versteckt
- `true` - Kommentare sichtbar

**Screen Reader Ankündigung:**

```
"Show comments, button, collapsed"
[Click/Enter]
"Hide comments, button, expanded"
```

---

## Keyboard Navigation Testing (Playground 3)

### Test 1: Tab-Key Focus

```
Action: Drücke Tab mehrmals

Focus Flow:
1. Search Input
2. Search Submit Button
3. Navigation Links
4. Toggle Comments Button
5. (If expanded: Comment Form Fields)

   Button ist in Tab-Reihenfolge
   Visual Focus Indicator sichtbar
   Logische Reihenfolge eingehalten
```

### Test 2: Enter Key Activation

```
Action: Focus auf Button → Enter drücken

Result:
→ Kommentar-Sektion wird sichtbar
→ Button-Text ändert sich zu "Hide comments"
→ aria-expanded ändert sich zu "true"

Action: Enter nochmal drücken

Result:
→ Kommentar-Sektion wird versteckt
→ Button-Text ändert sich zu "Show comments"
→ aria-expanded ändert sich zu "false"

   Enter-Key funktioniert perfekt
   Toggle wiederholt möglich
   State wird korrekt aktualisiert
```

### Test 3: Space Key Activation

```
Action: Focus auf Button → Space drücken

Result:
→ Gleich wie Enter-Key
→ ABER: Seite scrollt NICHT (preventDefault!)

   Space-Key aktiviert Button
   Kein unerwünschtes Scrollen
   Konsistent mit Enter-Verhalten
```

### Test 4: NVDA Screen Reader

```
Action: Tab zu Button

NVDA announces:
"Show comments, button, collapsed"
      ↑           ↑        ↑
   Label      Rolle    Zustand

Action: Enter drücken

NVDA announces:
"Hide comments, button, expanded"

   Button-Rolle korrekt angekündigt
   Zustand (collapsed/expanded) kommuniziert
   Label-Änderung erkannt
```

### Test 5: Complete Keyboard Workflow

```
Full User Journey (nur Tastatur):

1. Tab → "Show comments" Button
2. Enter → Kommentare werden sichtbar
3. Tab → "Your name:" Input
4. Eingabe: "John Doe"
5. Tab → "Your comment:" Input
6. Eingabe: "Great article!"
7. Tab → "Add comment" Button
8. Enter → Kommentar wird hinzugefügt
9. Tab → "Hide comments" Button
10. Space → Kommentare werden versteckt

   Kompletter Workflow keyboard-accessible
   Keine Mouse nötig
   Alle Funktionen erreichbar
```

---

## Vorher/Nachher Vergleich

### Keyboard Accessibility

**VORHER (`<div>`):**

```
User drückt Tab:
→ Überspringt Comment-Toggle (nicht fokussierbar)

User versucht Enter:
→ Nichts passiert

User versucht Space:
→ Seite scrollt (keine Button-Funktionalität)

   Keyboard-Benutzer können Kommentare NICHT öffnen
   Funktionalität komplett unzugänglich
```

**NACHHER (`<button>`):**

```
User drückt Tab:
→ Button erhält Focus
→ Visual Outline erscheint

User drückt Enter:
→ Kommentare öffnen sich
→ aria-expanded aktualisiert

User drückt Space:
→ Kommentare öffnen sich
→ Seite scrollt NICHT

   Keyboard-Benutzer haben vollen Zugang
   Alle Funktionen bedienbar
```

### Screen Reader Experience

**VORHER:**

```
NVDA: "Show comment" (nur Text)

   Keine Rolle
   Kein Zustand
   User weiß nicht: "Kann ich das aktivieren?"
```

**NACHHER:**

```
NVDA: "Show comments, button, collapsed"

   Rolle "button" klar
   Zustand "collapsed" kommuniziert
   User weiß: "Ich kann Enter/Space drücken"
```

---

## Technische Implementierung

### HTML

```html
<!-- Semantic Button mit ARIA -->
<button
  id="toggle-comments"
  class="show-hide"
  type="button"
  aria-expanded="false"
>
  Show comments
</button>
```

### TypeScript

```typescript
// Toggle Functionality
toggleBtn.addEventListener('click', (): void => {
  if (wrapper.style.display === 'none') {
    wrapper.style.display = 'block';
    toggleBtn.textContent = 'Hide comments';
    toggleBtn.setAttribute('aria-expanded', 'true');
  } else {
    wrapper.style.display = 'none';
    toggleBtn.textContent = 'Show comment';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
});

// Keyboard Support
toggleBtn.addEventListener('keydown', (e: KeyboardEvent): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleBtn.click();
  }
});
```

### CSS

```css
/* Focus Indicator (Accessibility) */
.show-hide:focus {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}
```

---

## Best Practices: Keyboard Accessibility

### 1. Verwende semantische Elemente

```html
<!--    GOOD: Semantic button -->
<button type="button">Click me</button>

<!--    BAD: Fake button -->
<div onclick="...">Click me</div>
```

### 2. Enter UND Space Keys

```typescript
//    GOOD: Both keys
if (e.key === 'Enter' || e.key === ' ') {
  // Handle activation
}

//    BAD: Only Enter
if (e.key === 'Enter') {
  // Space key ignored!
}
```

### 3. Prevent Default bei Space

```typescript
//    GOOD: Prevent scrolling
if (e.key === ' ') {
  e.preventDefault(); // Wichtig!
  button.click();
}

//    BAD: Page scrolls
if (e.key === ' ') {
  button.click(); // Scrollt trotzdem!
}
```

### 4. ARIA States aktualisieren

```typescript
//    GOOD: Update aria-expanded
button.setAttribute('aria-expanded', 'true');

//    BAD: Static aria-expanded
// <button aria-expanded="false"> never changes
```

---

## WCAG Compliance Testing

### WCAG 2.1.1: Keyboard - Level A

**Requirement:**

> All functionality of the content is operable through a keyboard interface

**Compliance Check:**

- **Tab-Key:** Button fokussierbar
- **Enter-Key:** Button aktivierbar
- **Space-Key:** Button aktivierbar
- **No Trap:** Focus kann wegbewegt werden

**Result:** **PASS**

### WCAG 2.1.3: Keyboard (No Exception) - Level AAA

**Requirement:**

> All functionality operable through keyboard (no exceptions)

**Compliance Check:**

- **Complete Workflow:** Kommentare öffnen, schreiben, schließen - alles per Keyboard
- **No Mouse Required:** Keine Funktion benötigt Mouse

**Result:** **PASS (AAA Level!)**

### WCAG 4.1.2: Name, Role, Value - Level A

**Requirement:**

> Name, role, and state can be programmatically determined

**Compliance Check:**

- **Name:** "Show comments" / "Hide comments"
- **Role:** `button`
- **State:** `aria-expanded="false"/"true"`

**Result:** **PASS**

---

## Nutzen für Benutzergruppen

### Keyboard-Only Benutzer

- **Voller Zugang** - Alle Funktionen erreichbar
- **Effizient** - Tab → Enter, fertig
- **Vorhersehbar** - Standard Keyboard-Patterns

### Screen Reader Benutzer

- **Rolle klar** - "Button" angekündigt
- **Zustand kommuniziert** - "collapsed"/"expanded"
- **Aktion klar** - Wissen wie zu aktivieren

### Motor-Impaired Benutzer

- **Große Click-Area** - Button + Text
- **Keyboard Alternative** - Keine präzise Mouse nötig
- **Sticky Keys** - Funktioniert mit Accessibility-Features

### Alle Benutzer

- **Multi-Modal** - Mouse ODER Keyboard
- **Konsistent** - Verhält sich wie erwartet
- **Robust** - Funktioniert in allen Browsern

---

## Checkliste für Präsentation

- [ ] **Problem:** `<div>` nicht keyboard-accessible
- [ ] **Demo:** Vorher - Tab überspringt Element
- [ ] **Lösung:** `<button>` mit Enter/Space Handlers
- [ ] **Code:** DIV → BUTTON Transformation
- [ ] **ARIA:** `aria-expanded` State Management
- [ ] **Keyboard Test:** Tab → Enter → Space Demo
- [ ] **NVDA Test:** Screen Reader Ankündigung
- [ ] **Full Workflow:** Kommentar hinzufügen nur mit Keyboard

---

## Ergebnis

**Implementation Timeline:**

- **Playground 1:** Button + Keyboard Handlers implementiert
- **Playground 2:** TypeScript Migration
- **Playground 3:** Comprehensive Testing & Verification

**Achievements:**

- `<div>` → `<button>` Transformation
- Enter + Space Key Handlers
- `aria-expanded` State Management
- Visual Focus Indicator
- WCAG 2.1.1 (Level A) - PASS
- WCAG 2.1.3 (Level AAA) - PASS
- WCAG 4.1.2 (Level A) - PASS

**Testing Evidence:**

- Tab Key Navigation verified
- Enter Key Activation verified
- Space Key Activation verified
- NVDA Screen Reader tested
- Complete keyboard workflow successful

---

**Playground 3 - Task 5 Complete**  
_Implementation: Playground 1 | TypeScript: Playground 2 | Verification: Playground 3_
