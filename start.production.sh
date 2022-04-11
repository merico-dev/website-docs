#!/bin/bash
. /root/.nvm/nvm.sh
nvm use v14.15.0
yarn build
yarn serve