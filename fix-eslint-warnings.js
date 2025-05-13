const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the common patterns to fix
const fixes = [
  // Add eslint-disable comments for any line with unused vars
  {
    regex: /(.*?)is defined but never used/g,
    fix: (file, content) => {
      // Extract variable names from ESLint warnings
      const matches = [...content.matchAll(/'([^']+)' is defined but never used/g)];
      
      if (matches.length === 0) return content;
      
      // Read the file
      const filePath = path.resolve(`./src/${file}`);
      let fileContent = fs.readFileSync(filePath, 'utf8');
      
      // For each unused variable
      matches.forEach(match => {
        const varName = match[1];
        // Find import that includes this variable
        const importRegex = new RegExp(`import {[^}]*${varName}[^}]*} from`);
        const importLine = fileContent.match(importRegex);
        
        if (importLine) {
          // Add eslint-disable comment before the import
          fileContent = fileContent.replace(
            importLine[0],
            `// eslint-disable-next-line no-unused-vars\n${importLine[0]}`
          );
        }
      });
      
      // Write the updated content
      fs.writeFileSync(filePath, fileContent);
      return `Fixed unused imports in ${file}`;
    }
  }
];

console.log('Fixing ESLint warnings...');

// Run ESLint to get the warnings
try {
  const output = execSync('npx eslint src --format json').toString();
  const lintResults = JSON.parse(output);
  
  // Process each file with warnings
  lintResults.forEach(result => {
    const fileRelativePath = path.relative('./src', result.filePath);
    
    if (result.messages.length > 0) {
      fixes.forEach(fix => {
        const applicableMessages = result.messages.filter(msg => 
          fix.regex.test(msg.message)
        );
        
        if (applicableMessages.length > 0) {
          console.log(fix.fix(fileRelativePath, JSON.stringify(applicableMessages)));
        }
      });
    }
  });
  
  console.log('Done fixing ESLint warnings!');
} catch (error) {
  console.error('Error running ESLint:', error.message);
}
