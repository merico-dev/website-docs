#!/bin/bash
. /root/.nvm/nvm.sh
nvm use v14.15.0
GATSBY_CPU_COUNT=1 yarn build --verbose
mv public/sitemap/sitemap-0.xml public/sitemap.xml
yarn serve
