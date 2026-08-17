# Design System – Premium UI for Multi‑Vendor Marketplace

## Visual Language
- **Primary palette** – vibrant, harmonious HSL tones:
  - `--color-primary`: hsl(210, 85%, 45%)   // deep blue‑teal
  - `--color-primary‑dark`: hsl(210, 85%, 35%)
  - `--color-primary‑light`: hsl(210, 85%, 55%)
- **Secondary palette** – accent colors for calls‑to‑action and highlights:
  - `--color-accent`: hsl(30, 95%, 50%)   // warm orange‑gold
  - `--color-success`: hsl(150, 70%, 40%)  // fresh green
  - `--color-warning`: hsl(45, 90%, 45%)   // golden‑yellow
- **Neutral palette** – for backgrounds, borders, text:
  - `--color-bg`: hsl(0, 0%, 99%)          // near‑white (light mode)
  - `--color-bg‑dark`: hsl(0, 0%, 12%)   // deep charcoal (dark mode)
  - `--color-surface`: hsla(0, 0%, 100%, 0.9)
  - `--color-text`: hsl(0, 0%, 10%)
  - `--color-text‑muted`: hsl(0, 0%, 45%)
- **Glassmorphism layer** – `background: rgba(255,255,255,0.25); backdrop-filter: blur(12px);` for cards, modals, navbars.

## Typography
- **Google Font – "Inter"** (weights 400, 600, 700).
- CSS variables:
  ```css
  --font-family: "Inter", system-ui, sans-serif;
  --font-base: 1rem;               /* 16px */
  --font-scale: 1.125;             /* major third */
  ```
- Heading scale (using `clamp` for fluid sizing):
  - `h1`: `clamp(2rem, 5vw, 3rem)`
  - `h2`: `clamp(1.75rem, 4vw, 2.5rem)`
  - `h3`: `clamp(1.5rem, 3vw, 2rem)`
- Body text: `1rem` line‑height `1.5`.

## Layout & Grid
- **Responsive breakpoints**:
  - `--breakpoint-sm`: `640px`
  - `--breakpoint-md`: `768px`
  - `--breakpoint-lg`: `1024px`
  - `--breakpoint-xl`: `1280px`
- **12‑column CSS grid** with `gap: 1.5rem` on larger screens; fallback to flex column on mobile.
- **Container** – max‑width `1200px`, centered, `padding: 0 1rem`.

## Component Library (React / Next.js)
| Component | Description | Accessibility notes |
|-----------|-------------|--------------------|
| **Button** | Primary, secondary, ghost variants; uses `--color-primary` and `--color-accent`. | `aria-disabled` when disabled, focus ring `2px solid var(--color-primary)`. |
| **Card** | Glass‑morphic surface, elevation via `box-shadow: 0 4px 12px rgba(0,0,0,0.08)`. | Keyboard‑navigable; role="region" with `aria-label` when used for product previews. |
| **Modal** | Centered, backdrop glass, close button with `Esc` support. | Focus trap, `aria-modal="true"`, labelled by heading. |
| **NavBar** | Sticky, dark‑mode aware, collapses to hamburger on <`--breakpoint-sm`. | Hamburger button with `aria-controls` and `aria-expanded`. |
| **ProductTile** | Image, title, price, quick‑add button, badge for discounts. | Image `alt` derived from product name, button `aria-label="Add {product} to cart"`. |
| **Pagination** | Accessible page list with `aria-current` and `role="navigation"`. | |
| **Toast / Snackbar** | Auto‑dismiss after 4 s, variant colors (success, error, info). | `role="alert"` for error to be announced. |

## Theming & Dark Mode
- CSS custom properties prefixed with `--color-` switch based on `[data-theme="dark"]` attribute on `<html>`.
- Dark mode palette (see Visual Language section) overrides light values.
- System‑prefers‑color‑scheme media query toggles the attribute automatically.

## Interaction & Micro‑animations
- **Hover** – subtle elevation: `transform: translateY(-2px); transition: transform 0.2s ease;`
- **Button press** – scale to `0.97` with `transition`.
- **Page transition** – Next.js `framer‑motion` fade‑in/out (`opacity` from 0 to 1 over 0.3 s).
- **Loading skeletons** – animated gradient `background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite;`

## Accessibility (WCAG AA) Checklist
- Contrast ratios ≥ 4.5:1 for normal text, ≥ 3:1 for large text.
- Keyboard navigation order logical, visible focus indicator (`2px solid var(--color-primary)`).
- ARIA roles/labels used on custom components (modals, tabs, accordions).
- Skip‑to‑content link top of page.
- Form validation messages announced via `role="alert"`.

## Internationalisation & Localisation
- **i18n library** – `react-i18next` for frontend, `nestjs-i18n` for backend.
- **Translation files** (`locales/en.json`, `locales/hi_IN.json`).
- **RTL Support** – CSS logical properties, `dir="rtl"` attribute toggles.
- **Currency/Tax** – Service `tax-service` reads region‑specific rates from a JSON config (`config/tax/{country}.json`).

## Assets & Media Strategy (Performance & Agility)
- **Responsive Images** – Use Next.js `next‑image` with automatic WebP/AVIF generation, `srcSet`, and lazy‑load.
- **Critical CSS** – Extract above‑the‑fold styles into a separate file served inline in the `<head>` for the initial render.
- **Font Loading** – `font-display: swap` for Inter, preload via `<link rel="preload" href="/fonts/Inter.woff2" as="font" crossorigin>`.
- **Resource Hinting** – `preconnect` to CDN origins (images, fonts, API gateway) to reduce DNS latency.
- **CDN + Edge Caching** – All static assets and Next.js generated HTML are served via CloudFront (or chosen CDN) with a 1‑month cache‑max‑age for immutable assets.
- **Lazy‑load non‑essential components** – Use React `Suspense` and dynamic imports for modals, heavy charts, and admin‑only sections.
- **Skeleton UI** – Show shimmer placeholders while data loads, improving perceived performance.
- **Prefetching** – Next.js `Link` with `prefetch` for high‑traffic pages (home, category, product detail).
- **Asset Compression** – Gzip/Brotli enabled on the server; large JSON payloads are compressed.

## Scalability & Robustness Guidelines
- **Component Isolation** – Each UI component is self‑contained with its own CSS module, avoiding global side‑effects; enables micro‑frontend style code‑splitting.
- **Design Tokens as JSON** – Export CSS variables to JSON for consumption by native mobile (React‑Native) and server‑side rendering, ensuring visual parity across platforms.
- **Stateless UI** – UI components rely on props and context only; no local storage of business state, keeping the front‑end horizontally scalable.
- **Server‑Side Rendering (SSR)** – All pages are rendered on the server (Next.js) for SEO, first‑contentful‑paint, and reduced client JS bundle size.
- **Incremental Static Regeneration (ISR)** – Product listing pages use ISR to regenerate at most every 60 s, balancing freshness with CDN caching.
- **Graceful Degradation** – If JavaScript fails, critical content (product list, checkout) remains accessible via server‑rendered fallback.
- **Feature‑Flag‑driven UI** – New UI experiments are wrapped in a flag check, allowing safe rollout without code branches.
- **Testing Matrix** – Visual regression tests (Chromatic) for every component; performance regression tracked via Lighthouse CI.

## Documentation & Usage
- All design tokens live in `src/styles/theme.css` and are imported at the root of the React app.
- Component library source under `frontend/src/components/`. Each component includes a story in **Storybook** with dark‑mode preview.
- UI‑test suite (Cypress) validates colour contrast (cypress‑axe) and focus‑order.

---

### Next actions
1. **Add the design system folder** (`design/`) to the repo scaffold (will be generated in Phase 1).
2. **Create a high‑fidelity mock‑up** of the homepage to visualise the design language.
3. **Review the mock‑up** with you; iterate on colour palette or component layout if needed.
4. **Integrate the performance hints** (critical CSS, preconnect, font‑swap) into the Next.js `_document.js` and `_app.js` templates.

Feel free to suggest any tweaks (palette adjustments, extra components, different animation easing, etc.). Once you confirm the core tech decisions, we’ll scaffold the repo and embed this design system from day one.


## Visual Language
- **Primary palette** – vibrant, harmonious HSL tones:
  - `--color-primary`: hsl(210, 85%, 45%)   // deep blue‑teal
  - `--color-primary‑dark`: hsl(210, 85%, 35%)
  - `--color-primary‑light`: hsl(210, 85%, 55%)
- **Secondary palette** – accent colors for calls‑to‑action and highlights:
  - `--color-accent`: hsl(30, 95%, 50%)   // warm orange‑gold
  - `--color-success`: hsl(150, 70%, 40%)  // fresh green
  - `--color-warning`: hsl(45, 90%, 45%)   // golden‑yellow
- **Neutral palette** – for backgrounds, borders, text:
  - `--color-bg`: hsl(0, 0%, 99%)          // near‑white (light mode)
  - `--color-bg‑dark`: hsl(0, 0%, 12%)   // deep charcoal (dark mode)
  - `--color-surface`: hsla(0, 0%, 100%, 0.9)
  - `--color-text`: hsl(0, 0%, 10%)
  - `--color-text‑muted`: hsl(0, 0%, 45%)
- **Glassmorphism layer** – `background: rgba(255,255,255,0.25); backdrop-filter: blur(12px);` for cards, modals, navbars.

## Typography
- **Google Font – "Inter"** (weights 400, 600, 700).
- CSS variables:
  ```css
  --font-family: "Inter", system-ui, sans-serif;
  --font-base: 1rem;               /* 16px */
  --font-scale: 1.125;             /* major third */
  ```
- Heading scale (using `clamp` for fluid sizing):
  - `h1`: `clamp(2rem, 5vw, 3rem)`
  - `h2`: `clamp(1.75rem, 4vw, 2.5rem)`
  - `h3`: `clamp(1.5rem, 3vw, 2rem)`
- Body text: `1rem` line‑height `1.5`.

## Layout & Grid
- **Responsive breakpoints**:
  - `--breakpoint-sm`: `640px`
  - `--breakpoint-md`: `768px`
  - `--breakpoint-lg`: `1024px`
  - `--breakpoint-xl`: `1280px`
- **12‑column CSS grid** with `gap: 1.5rem` on larger screens; fallback to flex column on mobile.
- **Container** – max‑width `1200px`, centered, `padding: 0 1rem`.

## Component Library (React / Next.js)
| Component | Description | Accessibility notes |
|-----------|-------------|--------------------|
| **Button** | Primary, secondary, ghost variants; uses `--color-primary` and `--color-accent`. | `aria-disabled` when disabled, focus ring `2px solid var(--color-primary)`.
| **Card** | Glass‑morphic surface, elevation via `box-shadow: 0 4px 12px rgba(0,0,0,0.08)`. | Keyboard‑navigable; role="region" with `aria-label` when used for product previews.
| **Modal** | Centered, backdrop glass, close button with `Esc` support. | Focus trap, `aria-modal="true"`, labelled by heading.
| **NavBar** | Sticky, dark‑mode aware, collapses to hamburger on <`--breakpoint-sm`. | Hamburger button with `aria-controls` and `aria-expanded`.
| **ProductTile** | Image, title, price, quick‑add button, badge for discounts. | Image `alt` derived from product name, button `aria-label="Add {product} to cart"`.
| **Pagination** | Accessible page list with `aria-current` and `role="navigation"`. |
| **Toast / Snackbar** | Auto‑dismiss after 4 s, variant colors (success, error, info). | `role="alert"` for error to be announced.

## Theming & Dark Mode
- CSS custom properties prefixed with `--color-` switch based on `[data-theme="dark"]` attribute on `<html>`.
- Dark mode palette (see Visual Language section) overrides light values.
- System‑prefers‑color‑scheme media query toggles the attribute automatically.

## Interaction & Micro‑animations
- **Hover** – subtle elevation: `transform: translateY(-2px); transition: transform 0.2s ease;`
- **Button press** – scale to `0.97` with `transition`.
- **Page transition** – Next.js `framer‑motion` fade‑in/out (`opacity` from 0 to 1 over 0.3 s).
- **Loading skeletons** – animated gradient `background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite;`

## Accessibility (WCAG AA) Checklist
- Contrast ratios ≥ 4.5:1 for normal text, ≥ 3:1 for large text.
- Keyboard navigation order logical, visible focus indicator (`2px solid var(--color-primary)`).
- ARIA roles/labels used on custom components (modals, tabs, accordions).
- Skip‑to‑content link top of page.
- Form validation messages announced via `role="alert"`.

## Assets & Media
- **Icon set** – open‑source Feather icons, customised stroke width 2 px, colour set to `var(--color-text)`.
- **Illustrations** – subtle abstract background shapes in SVG, using primary/secondary colors with opacity 0.1.
- **Images** – serve WebP/AVIF via Next.js `next‑image` with automatic optimisation.

## Documentation & Usage
- All design tokens live in `src/styles/theme.css` and are imported at the root of the React app.
- Component library source under `frontend/src/components/`. Each component includes a story in **Storybook** with dark‑mode preview.
- UI‑test suite (Cypress) validates colour contrast (cypress‑axe) and focus‑order.

---

**Next actions**
1. Add `theme.css` and component folder to the repo scaffold (will be generated in Phase 1).
2. Generate a high‑fidelity mock‑up of the homepage to visualise the design language.
3. Review the mock‑up with you; iterate on colour palette or component layout if needed.
