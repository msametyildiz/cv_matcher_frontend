#!/bin/bash

echo "Cleaning up node_modules..."
rm -rf node_modules
rm -rf package-lock.json

echo "Installing dependencies with correct versions..."
npm install

echo "Installing specific ajv version..."
npm install ajv@8.12.0

echo "Done! Try running 'npm start' now."
