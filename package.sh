#!/bin/bash

set -e
set -x

npm install --legacy-peer-deps

rm -rf dist

npx nx run-many --target=build \
  --projects=electron-shell \
  --configuration=production \
  --skipNxCache

npx nx run-many --target=build \
  --projects=extra-ui,main-frame \
  --configuration=production \
  --baseHref=./ \
  --skipNxCache

mv dist/apps/extra-ui dist/apps/electron-shell/
mv dist/apps/main-frame dist/apps/electron-shell/

rm -r \
  node_modules/@angular \
  node_modules/@cds \
  node_modules/@ngrx \
  node_modules/@ngx-translate \
  node_modules/zone.js

npx electron-builder -m --arm64
npx electron-builder -m --x64
npx electron-builder -w --x64
npx electron-builder -l --x64

npm install --legacy-peer-deps
