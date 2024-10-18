#!/bin/bash
. /root/.nvm/nvm.sh
nvm use v14.15.0
mv public/sitemap/sitemap-0.xml public/sitemap.xml
yarn serve
