# @krayavikrayam/config

Shared build/lint/style presets used by apps and packages in the monorepo.

## Exports

- `@krayavikrayam/config/eslint-preset` — flat ESLint config built on
  `eslint-config-next` (core-web-vitals + typescript).
- `@krayavikrayam/config/tsconfig.base.json` — TypeScript base config to
  extend in app/package `tsconfig.json` files.
- `@krayavikrayam/config/tailwind-preset` — Tailwind preset exposing the
  shared design-token color/border/font scales (driven by CSS variables).

## Usage

ESLint (`eslint.config.mjs`):

```js
import preset from "@krayavikrayam/config/eslint-preset";
export default preset;
```

TypeScript (`tsconfig.json`):

```json
{ "extends": "@krayavikrayam/config/tsconfig.base.json" }
```

Tailwind (`tailwind.config.ts`):

```ts
import type { Config } from "tailwindcss";
import preset from "@krayavikrayam/config/tailwind-preset";

const config: Config = {
  presets: [preset as Config],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
};
export default config;
```
