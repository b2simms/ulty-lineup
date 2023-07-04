#!/bin/bash
set -e

npm i
npm run build
git checkout deploy

# clean up old build
rm index.html
rm -rf assets
rm sports*
rm vite*

# move dist build
mv dist/* ./

git add .
# git commit -m "Deploying..."
# git push