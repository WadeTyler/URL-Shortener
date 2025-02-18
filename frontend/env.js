const fs = require('fs');

// Read the production environmetn file
const targetPath = './src/environments/environment.ts';
const envFile = fs.readFileSync(targetPath, 'utf-8');

// Replace the environment variables with actual values
const envFileContent = envFile
.replace('${API_URL}', process.env.API_URL || 'http://localhost:8080')
.replace('${CODE_PREFIX}', process.env.CODE_PREFIX || 'http://localhost:4200');

// Write the modified content back to the file
fs.writeFileSync(targetPath, envFileContent);
console.log(`Wrote variables to ${targetPath}`);
