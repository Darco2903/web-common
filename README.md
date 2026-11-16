# web-common

## Description

This package contains common functionality for web applications such as pretty printing, date formatting, cookie handling, animation utilities, and more.

> Note: This package utilizes the [**@darco2903/secondthought**](https://www.npmjs.com/package/@darco2903/secondthought) package for certain functions that involve time values, providing enhanced capabilities for handling and manipulating time-related data. While its use is not mandatory, it is recommended for optimal safety and reliability when working with time values.

## Installation

```bash
npm install @darco2903/web-common
```

## Shared settings

Settings shared by every app of the domain (`*.darco2903.fr`), stored in cookies of the parent domain so a choice made in one app applies to all of them.

```ts
import { THEMES, type Theme, loadSetting, saveSetting } from "@darco2903/web-common";

const theme: Theme = loadSetting("theme", THEMES) ?? "system";
saveSetting("theme", "dark");

const LOCALES = ["en", "fr"] as const; // the languages the app has texts for
const lang = loadSetting("lang", LOCALES) ?? "en";
saveSetting("lang", "fr");
```

- `saveSetting(name, value)` writes the cookie.
- `loadSetting(name, values)` returns the saved value when it is one of `values`, else `undefined` (the app picks its default).
  - A cookie with a value outside `values` is deleted.
  - When there is no valid cookie, a valid value in `localStorage` under the same key (saved by older app versions) is moved once to the cookie and removed from `localStorage`. When the cookie is valid, a leftover `localStorage` key is removed.
- Outside a browser both functions do nothing.

### Cookie contract

Apps that cannot use this package (or read the cookie before it loads, e.g. an inline script against theme flashes) must follow the same contract:

| Cookie  | Values                                                 |
| ------- | ------------------------------------------------------ |
| `theme` | `system`, `light`, `dark` (`THEMES`)                   |
| `lang`  | a language code, e.g. `en`, `fr` (each app validates it against its own list) |

- Plain string values, not encoded.
- `domain`: the parent domain (`DOMAIN`: `darco2903.fr` on `www.darco2903.fr`, the host itself on `localhost`/`127.0.0.1`), `path=/`.
- `max-age`: 1 year (31536000 seconds), `samesite=Lax`, `secure` on https.
- Read the cookie by its exact name (`getCookie` does): `lang` must not match a `language` cookie.
