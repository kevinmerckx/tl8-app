#!/bin/bash

set -e
set -x

rm -rf dist/apps

npx nx build electron-shell \
  --configuration=production \
  --skipNxCache

npx nx run-many --target=build \
  --projects=extra-ui,main-frame \
  --configuration=production \
  --baseHref=./ \
  --skipNxCache

mv dist/apps/extra-ui dist/apps/electron-shell/
mv dist/apps/main-frame dist/apps/electron-shell/
