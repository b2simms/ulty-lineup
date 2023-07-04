#!/bin/bash
set -e

npm i
npm run build
git checkout deploy

git add .
git commit -m "Deploying..."
git push