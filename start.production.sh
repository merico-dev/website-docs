#!/bin/bash
. /root/.nvm/nvm.sh
nvm use v14.15.0
yarn build
mv public/sitemap/sitemap-0.xml public/sitemap.xml
yarn serve