#!/bin/bash
. /root/.nvm/nvm.sh
nvm use v14.15.0
# https://github.com/gatsbyjs/gatsby/discussions/32389
# https://github.com/gatsbyjs/gatsby/discussions/34473
# https://github.com/pingcap/community-website?tab=readme-ov-file#deploy
GATSBY_CPU_COUNT=1 yarn build
mv public/sitemap/sitemap-0.xml public/sitemap.xml
yarn serve
