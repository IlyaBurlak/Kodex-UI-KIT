# Kodex UI Kit — Webpack migration

This project was migrated from Vite to Webpack. Included quick commands below.

Run development server:

npm run dev

Build production bundle and types:

npm run build

Notes:

- `webpack.config.js` contains entries for the demo app (`src/main.tsx`) and the library entry (`src/index.ts`).
- SCSS, images and TypeScript are handled via loaders.
