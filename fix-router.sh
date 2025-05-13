#!/bin/bash

echo "=== Fixing React Router DOM installation ==="

# Uninstall current react-router-dom
echo "Removing current react-router-dom..."
npm uninstall react-router-dom

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Install a specific version of react-router-dom (v6) that's more stable
echo "Installing react-router-dom v6.10.0..."
npm install react-router-dom@6.10.0 --save

# Install history package explicitly (a dependency of react-router-dom)
echo "Installing history package..."
npm install history@5.3.0 --save

# Reinstall dependencies to ensure everything is consistent
echo "Reinstalling all dependencies..."
npm install --legacy-peer-deps

echo "=== Installation completed ==="
echo "Please run 'npm start' to verify the fix worked"
