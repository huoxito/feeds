#!/bin/sh
set -e

git checkout -b production

cd client

yarn build
git add -f build/
git commit -am 'Static assets'
git push -f heroku production:master

git checkout -
git branch -D production
