#!/bin/bash

# Remove node_modules and package-lock.json to start fresh
rm -rf node_modules
rm -f package-lock.json

# Clean npm cache
npm cache clean --force

# Install dependencies with the correct React Router DOM version
# Using --legacy-peer-deps to avoid peer dependency issues
npm install --legacy-peer-deps
npm install react-router-dom@6.10.0 --legacy-peer-deps

# Check installed version
npm list react-router-dom
