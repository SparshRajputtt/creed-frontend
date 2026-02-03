#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// File extensions to process
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Directories to exclude
const excludeDirs = [
  'node_modules',
  '.git',
  'build',
  'dist',
  '.next',
  'coverage',
];

// The comment to add
const tsNoCheckComment = '//@ts-nocheck\n';

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return extensions.includes(ext);
}

function shouldSkipDirectory(dirName) {
  return excludeDirs.includes(dirName);
}

function hasNoCheckComment(content) {
  // Check if the file already has @ts-nocheck comment
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].trim().includes('@ts-nocheck')) {
      return true;
    }
  }
  return false;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    if (hasNoCheckComment(content)) {
      console.log(`⏭️  Skipped: ${filePath} (already has @ts-nocheck)`);
      return false;
    }

    const newContent = tsNoCheckComment + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  let processedCount = 0;

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        if (!shouldSkipDirectory(item)) {
          processedCount += processDirectory(itemPath);
        }
      } else if (stats.isFile() && shouldProcessFile(itemPath)) {
        if (processFile(itemPath)) {
          processedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dirPath}:`, error.message);
  }

  return processedCount;
}

function main() {
  const targetDir = process.argv[2] || './src';

  console.log('🚀 Starting @ts-nocheck addition process...');
  console.log(`📁 Target directory: ${path.resolve(targetDir)}`);
  console.log(`📄 File extensions: ${extensions.join(', ')}`);
  console.log(`🚫 Excluded directories: ${excludeDirs.join(', ')}`);
  console.log('');

  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Directory "${targetDir}" does not exist`);
    process.exit(1);
  }

  const startTime = Date.now();
  const processedCount = processDirectory(targetDir);
  const endTime = Date.now();

  console.log('');
  console.log('📊 Summary:');
  console.log(`✅ Files processed: ${processedCount}`);
  console.log(`⏱️  Time taken: ${endTime - startTime}ms`);
  console.log('🎉 Done!');
}

// Run the script if called directly
main();

export { processDirectory, processFile };
