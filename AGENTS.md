# Cheese Site — The Cheese Couriers

React 19 + TypeScript + Vite storefront for The Cheese Couriers (subscription
cheese boxes). Single-page app in `src/App.tsx` with styles in `src/App.css`
and design tokens in `src/index.css`.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build
- `npm run lint` — oxlint (must report 0 warnings / 0 errors)

## Brand

Red & cream identity (rebrand from the former green/gold theme).

- `--red` `#ad0000`, `--red-dark` `#8c0000`, `--wine` `#5e0b0e`
- `--cream` `#fffcf7`, `--paper` `#ffffff`, `--ink` `#2b1715`
- Fonts: Playfair Display (serif headings), Pinyon Script ("Cheese"
  script), DM Sans (body). Imported in `src/index.css`.
- Logo assets in `public/brand/` are transparent rebuilds of the supplied
  artwork (`logo-cream.png` for dark backgrounds, `logo-red.png` and
  `wordmark-*.png` for light, `mountain.svg` for the peak motif).
  `public/favicon.svg` is the mountain mark.
- Do not reintroduce gold/yellow accents or green blocks; supporting dark
  colour is deep wine (`--wine`).

## Notes

- Cart state lives in `CartProvider` (React context); checkout and order
  tracking are simulated — no real payments.
- Routes: `/`, `/shop`, `/product/:id`, `/about`, `/track`, `/checkout`,
  `/order-confirmation`, catch-all 404.
- When returning a cleanup from `useEffect`, return a function explicitly —
  an implicit return of a non-function value breaks React strict mode.
