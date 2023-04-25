#!/bin/bash
printf "copy static files..."
rm -rf public/*
cp -r static-files/* public/
find blog -type d | grep static | xargs -I% mkdir -p public/%
find blog -type f | grep static | xargs -I% cp % public/%
echo " done."
