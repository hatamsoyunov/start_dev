# start_dev

#### Front-end developing start template

Author: [hattam](https://hattam.ru)

![alt](https://raw.githubusercontent.com/hattamsoyunov/start_dev/master/src/assets/images/start_dev_preview.jpg)

## How to use

1. Install Node Modules - `yarn install` or `npm i`
2. `yarn start` - to run in dev mode
2. `yarn build` - build static files for release

**Concat libraries** Install the libraries and specify all library paths in the "jsLibs" and "cssLibs"
tasks (gulpfile.js);

## Main Gulpfile.js options:

`cssLibsPaths` and `jsLibsPaths`: List of library paths 

`watchFileTypes`: List of files extensions for watching & hard reload

## Links

- **[include html parts](https://www.npmjs.com/package/ssi#supported-instructions)**
- **[BEM](https://en.bem.info/methodology/quick-start/)**
