# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Type-check (tsc -b) then production build
npm run typecheck  # Type-check only
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

No test suite is configured.

## Architecture

This is a React + TypeScript PWA that displays real-time weather data from an Automated Meteorological Station (AMS) in Veliko Tarnovo, Bulgaria. It fetches HTML from `vt-weather.dobchev.com` via a server-side PHP proxy (`public/proxy.php`) to bypass CORS.

**Data flow:**
```
API → ArrayBuffer (Windows-1251) → data/website-parse.ts → WeatherData → App state → UI
```

### Key files

- **`types.ts`** — `WeatherData` and `DailyExtreme` TypeScript interfaces; read this to understand the data shape. Most parsed fields are `number | undefined` since parsing can silently fail.
- **`constants.ts`** — Unit metadata and app configuration (measurement labels, display text, units)
- **`data/website-parse.ts`** — Parses raw HTML response: decodes Windows-1251 encoding, extracts measurements via `indexOf`/`substring`, tracks daily min/max with timestamps. Uses `safeInvoke` to swallow parse errors.
- **`utils/function-utils.ts`** — `safeInvoke<T>` wraps callbacks in try-catch, returning `T | undefined` on failure
- **`src/App.tsx`** — All state lives here (`loading`, `theme`, `weather: WeatherData | null`); fetches every 5 minutes and on tab focus via `visibilitychange`
- **`src/components/CurrentMinMaxContainer.tsx`** — Presentational: renders current value + daily min/max with timestamps; accepts `small` prop for compact display
- **`src/components/InstallPWA.tsx`** — Listens for `beforeinstallprompt`, shows install CTA, persists dismissal in localStorage

### State management

No Redux or Context — all state is at `App` level via `useState`/`useEffect`/`useCallback`. localStorage is used for theme preference and PWA CTA dismissal.

### Theming

Theme toggling switches a class on `.app-container` between `.dark-theme` and `.white-theme`. CSS variables/overrides are scoped to those classes in `App.css`.

### PWA

Configured via `vite-plugin-pwa` with Workbox. PWA is disabled in dev mode. Use `npm run build && npm run preview` to test PWA behavior. Asset generation is configured in `pwa-assets.config.js`. Virtual module types for `virtual:pwa-register` are referenced via `src/vite-env.d.ts`.
