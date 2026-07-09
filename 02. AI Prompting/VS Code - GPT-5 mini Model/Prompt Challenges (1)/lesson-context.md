# Lesson Context

You are writing CSS or JavaScript for a beginner student building a small web app. The HTML is already written and will not change — do not add, remove, or rename elements. Use only the constructs listed below. If something seems to need a feature that is not on this list, find a workaround using only what is listed.

## Conventions

- The page body has `id="page"`. To style the body, write a `#page { ... }` rule.
- Buttons in the HTML are wired with `onclick="functionName()"`. Your job in JS is to define each named function — `function functionName() { ... }`. Never use `addEventListener`.
- Every function is zero-argument and returns nothing. Functions find what they need with `document.querySelector` inside their own body.

## CSS

**Selectors (only these):**
- `#id`
- `.class`
- Grouped: `#a, #b { ... }` (same rule applied to multiple targets)

**Properties (only these):**
`color`, `background-color`, `font-family`, `font-size`, `font-weight`, `text-align`, `padding`, `margin`, `border`, `border-radius`, `width`, `height`, `line-height`, and `display: block` (the only `display` value).

**Do NOT use:**
- Element selectors (`body`, `p`, `h1`, `button`, etc.) — always use the id or class instead.
- Pseudo-classes (`:hover`, `:focus`, `:nth-child`, etc.).
- Descendant or compound selectors (`.card h3`, `p.dish`).
- `display: flex`, `display: grid`, or any flex/grid property (`gap`, `justify-content`, `align-items`, `grid-template-*`).
- Transitions, animations, transforms, media queries, CSS variables.

**Idioms:**
- Centre a block horizontally: `margin: 30px auto`.
- Put an element on its own line with spacing: `display: block` plus `margin`.

## JavaScript

**Allowed:**
- Named function declarations: `function doThing() { ... }`
- `document.querySelector('#id')` (or `.class`)
- `.value` to read an input; `.textContent` to read or write text inside an element
- `.style.propertyName = "value"` (camelCase: `backgroundColor`, `fontSize`, `borderRadius`)
- `const` and `let` declarations inside functions
- `if / else if / else`
- Equality `===`, `!==`; comparison `<`, `>`, `<=`, `>=`
- Logical operators `||` and `&&`
- Arithmetic `+`, `-`, `*`, `/` (and `+` for string concatenation)
- `Number(...)` to convert a string to a number
- `Math.random()` (returns a number between 0 and 1)
- `localStorage.getItem(key)` and `localStorage.setItem(key, value)` — values stored as strings; wrap reads in `Number(...)` when comparing to a number
- A function may call another function defined elsewhere in the same file
- A single top-level function call at the end of the file is allowed for page-load initialisation (e.g. `loadBest();` as the last line)

**Do NOT use:**
- `addEventListener` — buttons are already wired via `onclick` in the HTML; just define the named function in JS.
- Arrays (`[1, 2, 3]`) or array methods (`.forEach`, `.map`, `.filter`, `.find`, etc.).
- Loops (`for`, `while`, `do...while`).
- String methods (`.toLowerCase`, `.toUpperCase`, `.includes`, `.length`, `.slice`, `.split`, `.trim`, etc.). Use strict `===` matching and tell the user to type exactly.
- Ternary expressions (`a ? b : c`), `switch` statements.
- `fetch`, `setTimeout`, `setInterval`, Promises, `async`/`await`.
- `try / catch`.
- Arrow functions (`() => {}`), object destructuring, spread/rest, template literals (use `+` for string concatenation).
- Function parameters or return values — every function is zero-arg, void.
- Modifying the HTML in any way.
- `DOMContentLoaded` listeners, IIFEs, or any other module wrapping.

## Multi-case rule (important)

When an app has several similar cases — 5 lamp buttons, 6 mood responses, 4 score bands — write each case as a separate `if / else if` branch or as a separate named function. Do **not** refactor with arrays or loops, even if it would be cleaner. The student has not yet learned arrays or loops; the repetition is intentional.
