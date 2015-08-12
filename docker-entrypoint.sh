#!/usr/bin/env bash
set -e

cp config/config.example.js config/config.js
sed -i 's/mongodb\:\/\/localhost\:27017/mongodb\:\/\/mongo\:27017/g' config/config.js

npm install
nodemon ./app.js
