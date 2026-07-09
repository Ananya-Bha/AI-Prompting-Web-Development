# Lesson Context

You are writing CSS or JavaScript for a beginner student building a small web app. The HTML is already written and will not change — do not add, remove, or rename elements. Use only the constructs listed below. If something seems to need a feature that is not on this list, find a workaround using only what is listed.

## What's new in this lesson (delta from 4.6)

Three new tools are unlocked this week. Everything else from 4.6 still applies.

- **CSS:** `display` now has three valid values instead of one: `block` (default for divs and paragraphs), `inline-block` (for elements you want laid out side by side with explicit `width` / `height`, like uniform numbered tiles), and `none` (hides the element completely — leaves no gap).
- **JS:** `element.classList.add('className')` and `element.classList.remove('className')` — add or remove a CSS class on an element. The class itself is still defined in `style.css` like any other; this just toggles whether that class applies. Use these instead of writing one `.style.x = ...` line per property.
- **JS:** `element.src = "images/something.png"` — change which image file an `<img>` element shows. Same shape as `element.textContent = "..."`, just a different property.

## New convention this week: ids for JS, classes for CSS

In Lesson 6 you styled everything via `#id` rules. That worked because the page never changed state. This week's apps swap themes, hide elements, and toggle visibility — and `#id` rules get in the way: an `#title { color: white }` rule always beats a `.red-fg { color: red }` rule, even when JS adds the class. So this week:

- **Use `#id` only inside JS** — `document.querySelector('#title')`. The id is how JS finds a specific element.
- **Use `.class` for every CSS rule** — `.title { font-size: 40px; }`, `.theme { color: cream; }`, `.red-fg { color: red; }`. Layout, theme, and state all go on classes.

The pre-built HTML already gives every styled element a class for you. Define your CSS rules against those classes. When you write a state-flip class like `.red-fg`, put its rule *after* the base rule it overrides — when two classes set the same property, the one defined later in the file wins.

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
`color`, `background-color`, `font-family`, `font-size`, `font-weight`, `text-align`, `padding`, `margin`, `border`, `border-radius`, `width`, `height`, `line-height`, and `display` (only the values `block`, `inline-block`, or `none`).

**Do NOT use:**
- Element selectors (`body`, `p`, `h1`, `button`, etc.) — always use the id or class instead.
- Pseudo-classes (`:hover`, `:focus`, `:nth-child`, etc.).
- Descendant or compound selectors (`.card h3`, `p.dish`).
- `display: flex`, `display: grid`, or any flex/grid property (`gap`, `justify-content`, `align-items`, `grid-template-*`).
- `display` values other than `block`, `inline-block`, and `none`.
- Transitions, animations, transforms, media queries, CSS variables.

**Idioms:**
- Centre a block horizontally: `margin: 30px auto`.
- Put an element on its own line with spacing: `display: block` plus `margin`.
- Hide an element completely: define a `.hidden { display: none; }` class in CSS, then add or remove the class from JS.

## JavaScript

**Allowed:**
- Named function declarations: `function doThing() { ... }`
- `document.querySelector('#id')` (or `.class`)
- `.value` to read an input; `.textContent` to read or write text inside an element
- `.style.propertyName = "value"` (camelCase: `backgroundColor`, `fontSize`, `borderRadius`)
- `.classList.add('className')` and `.classList.remove('className')` — turn a CSS class on or off
- `.src = "images/file.png"` to change which image an `<img>` element shows
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
- `.classList.toggle(...)` — use the explicit `.add()` or `.remove()` pair instead, so the reader can tell which direction you're going.
- Arrays (`[1, 2, 3]`) or array methods (`.forEach`, `.map`, `.filter`, `.find`, etc.).
- Loops (`for`, `while`, `do...while`).
- String methods (`.toLowerCase`, `.toUpperCase`, `.includes`, `.length`, `.slice`, `.split`, `.trim`, etc.). Use strict `===` matching and tell the user to type exactly.
- Ternary expressions (`a ? b : c`), `switch` statements.
- `fetch`, `setTimeout`, `setInterval`, Promises, `async`/`await`.
- `try / catch`.
- Arrow functions (`() => {}`), object destructuring, spread/rest, template literals (use `+` for string concatenation).
- Function parameters or return values — every function is zero-arg, void.
- Modifying the structure of the HTML — no `innerHTML`, no `appendChild`, no `createElement`. Changing `.textContent`, `.src`, `.style.*`, or `.classList` on an existing element is fine; adding or removing elements is not.
- `DOMContentLoaded` listeners, IIFEs, or any other module wrapping.

## Multi-case rule (important)

When an app has several similar cases — 5 lamp buttons, 6 mood responses, 4 score bands, 10 balloons to pop — write each case as a separate `if / else if` branch or as a separate named function. Do **not** refactor with arrays or loops, even if it would be cleaner. The student has not yet learned arrays or loops; the repetition is intentional.

## Level 2: Hide and Seek (stretch)

If you finish all the Level 1 challenges, try the Level 2 game: **Hide and Seek**.

You pick a buddy (duck or cat). Your app hides them inside one of ten numbered boxes. You click boxes to look. Fewer clicks = better score. Your buddy and your best score are remembered between visits — close the tab, come back tomorrow, and your buddy is still hiding in a new box, but your best score is still there to beat.

No new tools to learn. The whole challenge is using what you already know — class flipping, `display: none`, `.src`, `.textContent`, and `localStorage` — in one larger app.

One trick the Level 2 game introduces: how to pick a random whole number from 1 to 10 using `Math.random()` (which only gives you a fraction between 0 and 1). The answer is a 10-branch `if / else if` ladder — see the multi-case rule above.
