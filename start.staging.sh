#!/bin/bash
. /root/.nvm/nvm.sh
nvm use v14.15.0
# yarn install
rm -rf .cache
yarn start:0.0.0.0