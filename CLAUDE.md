# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (add `-- --open` to open a browser).
- `npm run build` — production build (Vercel edge adapter).
- `npm run preview` — preview the production build locally.
- `npm run check` — type-check with `svelte-check` (runs `svelte-kit sync` first). Use `npm run check:watch` while developing. There is no test runner or linter configured.

## Required environment variables

The app does not run without these (Vite `VITE_*` vars, e.g. in `.env`):

- `VITE_API_URL` — base URL of the headless WordPress REST API (all content is fetched from here).
- `VITE_THEME` — active theme/brand key (`parramattaNorth` or `rgb`); see white-labelling below.
- `VITE_GOOGLE_MAPS_API_KEY` — Google Maps JS API (maps and place markers).
- `VITE_GOOGLE_ANALYTICS_ID` — GA tag, injected client-side in `+layout.svelte`.

Note `VITE_THEME` is read two ways: as a server-only var via `$env/static/private` in `+layout.server.ts` (returned as `data.theme`), and directly via `import.meta.env.VITE_THEME` in many components.

## Architecture

SvelteKit 1 (Svelte 4) app deployed to **Vercel edge runtime**. It is the front-end for a headless **WordPress** CMS — there is no local database or backend; every route's `+page.ts` `load` fetches JSON from `VITE_API_URL` (WordPress REST API with ACF fields).

### Content flow (WordPress → app)

- WordPress custom post types map to routes: `/tour`, `/event` (→ `whats-on`), `/news` (→ `latest-news`), `/pages`, `/places`.
- Raw WP responses are shaped inside each `load` function into the interfaces in [src/lib/types.ts](src/lib/types.ts). The pattern is consistent: `title.rendered`, `content.rendered`, and custom fields under `acf.*`; the untransformed response is usually kept as `raw`.
- Media is fetched separately by ID from the WP `/media/{id}` endpoint via [src/lib/utilities/fetchMedia.ts](src/lib/utilities/fetchMedia.ts) (`fetchImage`/`fetchVideo`/`fetchAudio`).
- WP HTML (`content.rendered`) is rendered with `{@html}` and post-processed by [src/lib/utilities/htmlParser.ts](src/lib/utilities/htmlParser.ts) to normalize WP video markup and decode entities. These helpers are **client-only** — they no-op / return `""` when `window` is undefined, so guard SSR usage.

### Home page component dispatch

[src/routes/+page.svelte](src/routes/+page.svelte) is data-driven: the `load` returns a `pageData` array of `{ componentType, props, raw }` (see [ComponentItem](src/lib/types.ts)). The page dynamically `import()`s `$lib/{componentType}.svelte` at runtime and renders each with `<svelte:component>`, skipping any entry whose `raw` is empty. To add a home section, emit a new entry from `+page.ts` and create the matching `$lib/*.svelte` component.

### White-labelling / theming

The codebase serves multiple branded deployments from one source, selected by `VITE_THEME`. Two themes exist today (`parramattaNorth`, `rgb`) defined as **daisyUI** themes and Tailwind `typography` variants in [tailwind.config.js](tailwind.config.js). The theme is applied via `data-theme` on `<html>` in [src/routes/+layout.svelte](src/routes/+layout.svelte). Components frequently branch on `VITE_THEME` for brand-specific copy/assets/colors — when adding a themed value, extend both theme branches.

### Maps and AR (the core feature)

This is a location-based AR/wayfinding app.

- **Google Maps** is loaded on demand with [src/lib/utilities/loadScript.ts](src/lib/utilities/loadScript.ts) (dedupes script tags), then used in `Map.svelte`, `PlaceMap.svelte`, `WhatsOnMap.svelte`, and `Tour.svelte`. Custom map pins are `google.maps.OverlayView` subclasses in [src/lib/classes/](src/lib/classes/) (`PlaceMarker`, `UserMarker`).
- **Geolocation**: components use `navigator.geolocation.watchPosition` and proximity logic in [src/lib/utilities/calculations.ts](src/lib/utilities/calculations.ts) (`calculateDistance`, ~50m target radius) to unlock/trigger tour steps.
- **AR** is delivered as an external experience embedded in an `<iframe>` via [src/lib/ARFrame.svelte](src/lib/ARFrame.svelte), granting `camera`/`gyroscope`/`xr-spatial-tracking` permissions. The AR URL and active state live in the global store.

### Global state

[src/lib/store.ts](src/lib/store.ts) holds cross-component UI/session state as Svelte `writable`s (e.g. `targetLocation`, `isARActive`/`activeARURL`, `isNavActive`, tour/acknowledgement flags). Prefer these stores for state shared between the map, tour, nav, and AR flows rather than prop-drilling.

## Conventions

- All shared components live flat in `src/lib/*.svelte`; import via the `$lib` alias. Domain models go in [src/lib/types.ts](src/lib/types.ts) (interfaces are `I`-prefixed, e.g. `ITour`).
- Data transformation belongs in the route `load` (`+page.ts`), keeping components presentational.
- Anything touching `document`/`window`/Google Maps must be guarded for SSR (run inside `onMount` or check `typeof window`), since routes are server-rendered on the edge.
