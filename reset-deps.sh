# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall all dependencies
npm install --legacy-peer-deps
