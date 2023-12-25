# HisQuery

## Installation

### From Source

#### Requirements

Chrome 114.0.5735.133 or higher (untested on earlier versions)

#### Instructions

1. Download the extension zip from the latest [release](https://github.com/hardik-vala/HisQuery/releases).
2. Unzip the downloaded folder.
3. Open Chrome and navigate to `chrome://extensions/`.
4. In the top right corner of the page, enable "Developer mode" by clicking the toggle switch.
5. Click on the "Load unpacked" button that appears in the top left corner of the page.
6. Navigate to the downloaded folder. This should be the root directory of the extension where the `manifest.json` file is located.
7. Click "Select" or "Open". The extension should now be loaded into Chrome and it should be listed on the `chrome://extensions/` page.
8. You can test the extension in the browser by clicking on the extension icon to the right of the address bar (or hitting `Command + E` on Mac, or `Crtl + E` otherwise).

## Development

### Prerequisites

- [node + npm](https://nodejs.org/) (Current Version)

### Environment variables

Copy `.env.sample` -> `.env.development` and fill in values.

#### Retrieving variables:

- `POSTHOG_KEY`: log in and navigate to project settings in
  [Posthog](https://app.posthog.com/project/settings), for each environment, to
  find the environment-specific API key.

### Includes the following

- TypeScript
- Webpack
- React
- Jest
- Example Code
  - Chrome Storage
  - Options Version 2
  - content script
  - count up badge number
  - background

### Project Structure

- src/typescript: TypeScript source files
- src/assets: static files
- dist: Chrome Extension directory
- dist/js: Generated JavaScript files

### Setup

```
npm install
```

### Build

```
npm run build
```

### Build in watch mode

#### Terminal

```
npm run watch
```

#### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

### Load extension to Chrome

Load `dist` directory

### Test

`npx jest` or `npm run test`

## Reporting Bugs

You can submit a bug [here]() <- TODO.