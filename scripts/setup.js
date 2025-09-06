#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏠 Real Estate Ecommerce - Setup Script');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update BLOB_READ_WRITE_TOKEN with your actual Vercel Blob token\n');
} else {
  console.log('✅ .env.local file already exists\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('Run: npm install\n');
} else {
  console.log('✅ Dependencies are installed\n');
}

console.log('🚀 Setup complete! Next steps:');
console.log('1. Update .env.local with your Vercel Blob token');
console.log('2. Run: npm install (if not already done)');
console.log('3. Run: npm run dev');
console.log('4. Open: http://localhost:5173\n');

console.log('📚 For deployment instructions, see DEPLOYMENT.md');
console.log('📖 For more information, see README.md');
