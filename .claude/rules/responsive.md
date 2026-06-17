# Responsive Design Rules

## Principle

Every CV view page must be fully and comfortably usable on mobile, tablet, and desktop.
Mobile-first approach: base styles apply to mobile, with `min-width` media queries for larger screens.

## Breakpoints

```css
/* Mobile — base (no media query) */
/* max ~600px */

/* Tablet */
@media (min-width: 601px) and (max-width: 900px) { ... }

/* Desktop */
@media (min-width: 901px) { ... }
```

## Per-View Expectations

### Every Page

- Text must be readable on mobile (min 14px)
- Buttons must be touch-friendly (min 44×44px touch target)
- Avoid horizontal scroll (except intentionally scrollable containers like Gantt)
- Modals (Hire Me, Meet) must open full-width and scrollable on mobile
- Music player panel must not obscure content on mobile

### Index Page (carousel)

- Cards stack vertically at full width on mobile, or carousel shows one card at a time
- Arrows and dots must be touch-navigable

### Plain View

- Print-optimized layout (`@media print`) — black and white regardless of theme
- Theme selector and header buttons collapse or stack on mobile

### Gantt View

- Gantt chart is in a horizontally scrollable container — intentional
- Left sidebar column (`SIDEBAR_W`) can be narrower or fixed on mobile, but must remain visible
- Header (contacts, buttons) stacks on mobile

### Scrumboard View

- Columns stack vertically on mobile (flex-direction: column)
- Cards are full-width on mobile

### Swagger View

- Endpoint blocks are collapsible — collapsed by default on mobile
- Params-table scrolls horizontally if needed

### JSON View

- Line numbers can be hidden on mobile to save space
- Fold/unfold buttons must work well with touch

### Game View

- NippleJS joystick appears automatically on mobile
- Orientation warning in landscape mode if needed

## CSS Variables and Theming

`styles/cv-index.css` contains shared CSS variables (theme, modal, toast styles).
Each view-specific CSS file builds on these — do not duplicate variable definitions.

## Accessibility

- `aria-label` attributes on all interactive elements
- `role` attributes on list, dialog, navigation elements
- Keyboard navigable (Tab, Enter, Escape for modal close)
- Contrast ratio minimum 4.5:1 for text in all themes

## What to Avoid

- Fixed `px` widths on main layout containers — use `%`, `vw`, `max-width`
- `overflow: hidden` on the entire body — can break modal scrolling on mobile
- Small touch targets (`< 44px`) on buttons
- Broken layout on orientation change
