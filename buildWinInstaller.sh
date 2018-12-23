#!/bin/bash

# Customize for specific game
dirName=blackout
pkgName=BlackOut

# Move to dir and rename it
cd "./packaged/${dirName}/"
mv win64 "${pkgName}"

# Create archive
zip -r "../${pkgName}-win64.zip" "./${pkgName}"

# Name back and move back
mv "${pkgName}" win64
cd ../..
