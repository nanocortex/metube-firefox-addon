#!/bin/sh

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
VERSION=$(grep -o '"version": "[^"]*"' ./src/manifest.json | cut -d'"' -f4)
VERSION_CLEAN=$(echo $VERSION | tr -d '.')

7z a -tzip metube_v${VERSION_CLEAN}_${TIMESTAMP}.zip ./src/*
