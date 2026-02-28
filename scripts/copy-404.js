const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexFile = path.join(distDir, 'index.html');
const destFile = path.join(distDir, '404.html');

fs.copyFile(indexFile, destFile, (err) => {
  if (err) {
    console.error('Failed to copy index.html to 404.html:', err);
    process.exit(1);
  }
  console.log('Copied index.html to 404.html');
});
