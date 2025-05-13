const fs = require('fs');
const path = require('path');

// Path to the problematic file
const filePath = path.resolve('./node_modules/source-map/lib/source-map-consumer.js');

try {
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if the problematic import exists
  if (content.includes("require('../lib/read-wasm')")) {
    // Replace the problematic import
    content = content.replace(
      "require('../lib/read-wasm')",
      "{ readWasm: function() { return Promise.resolve({ buffer: Buffer.from([]) }); } }"
    );

    // Write the modified file back
    fs.writeFileSync(filePath, content);
    console.log('Successfully patched source-map package');
  } else {
    console.log('No need to patch, the import was not found');
  }
} catch (error) {
  console.error('Error patching source-map package:', error);
}
