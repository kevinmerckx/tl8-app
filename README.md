# TL8

TL8 is a desktop application that lets its users edit text translations and see the result live.

It uses Electron to provide a minimalist browser that lets users navigate to the web page they want to translate.

Notes:

1. It works in conjunction with the TL8 libraries available for Angular and React. Check [https://github.com/kevinmerckx/tl8] for more details.
2. This project is not under active maintenance. I have been maintaining it as long as I needed it for other projects. More stars on Github are likely to make me reconsider. Any pull request/fork is welcome.

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
