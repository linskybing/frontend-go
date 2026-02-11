#!/usr/bin/env node

/**
 * Script to check and report all files exceeding 200 lines
 * This helps enforce code standards for maintainability
 * Usage: node scripts/check-line-count.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const MAX_LINES = 200;
let violations = [];

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['.git', 'node_modules', 'dist', 'build'].includes(file)) {
        walkDir(filePath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      // Don't count blank lines
      const lines = content.split('\n').filter((line) => line.trim() !== '').length;

      if (lines > MAX_LINES) {
        violations.push({
          file: filePath.replace(SRC_DIR, 'src'),
          lines: lines,
          excess: lines - MAX_LINES,
        });
      }
    }
  });
}

console.log(`\nFrontend Code Standards Check\n`);
console.log(`Maximum allowed lines per file: ${MAX_LINES}\n`);

walkDir(SRC_DIR);

if (violations.length === 0) {
  console.log('All files comply with the 200-line limit.\n');
  process.exit(0);
} else {
  violations.sort((a, b) => b.lines - a.lines);

  console.log(`Found ${violations.length} files exceeding the limit:\n`);

  violations.forEach((violation, index) => {
    console.log(`${index + 1}. ${violation.file}`);
    console.log(`   Lines: ${violation.lines} (${violation.excess} over limit)\n`);
  });

  console.log('\nRefactoring suggestions:');
  console.log('1. Extract custom hooks for logic');
  console.log('2. Split into sub-components');
  console.log('3. Move business logic to services');
  console.log('4. Create separate utility files\n');

  // Summary statistics
  const totalExcess = violations.reduce((sum, v) => sum + v.excess, 0);
  const avgLines = Math.round(violations.reduce((sum, v) => sum + v.lines, 0) / violations.length);

  console.log('Summary Statistics:');
  console.log(`   Total violations: ${violations.length}`);
  console.log(`   Average file size: ${avgLines} lines`);
  console.log(`   Total excess lines: ${totalExcess}`);
  console.log(`   Largest file: ${violations[0].lines} lines\n`);

  process.exit(1);
}
