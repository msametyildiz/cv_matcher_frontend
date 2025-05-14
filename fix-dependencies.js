const fs = require('fs');
const path = require('path');

// Fix package.json dependencies
const packageJsonPath = path.resolve('./package.json');
try {
  const packageJson = require(packageJsonPath);
  
  // Add resolutions to enforce specific package versions
  packageJson.resolutions = {
    ...packageJson.resolutions,
    "ajv": "8.11.0",
    "ajv-keywords": "5.1.0",
    "source-map": "0.7.3"
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with resolutions');
} catch (error) {
  console.error('Error updating package.json:', error);
}
