# TL8

TL8 is a desktop application that lets its users edit text translations and see the result live.

It uses Electron to provide a minimalist browser that lets users navigate to the web page they want to translate.

**Important**: it works in conjunction with the TL8 libraries available for Angular and React. Check [https://github.com/kevinmerckx/tl8] for more details.

## Develop

### Requirements

- Node 16

### Publish Library

- bump version number in libs/tl8/package.json
- npx nx build tl8 --prod
- cd dist/libs/tl8
- npm publish

### Create Apps

- bump version number in package.json
- ./package.sh
