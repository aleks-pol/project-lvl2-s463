#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import { version } from '../../package.json';
import genDiff from '..';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig>')
  .arguments('<secondConfig>')
  .action((beforePath, afterPath, { format }) => {
    console.log(genDiff(beforePath, afterPath, format));
  });

program.on('--help', () => {
  const content = fs.readFileSync('help', 'UTF-8');
  console.log(content);
});

program.parse(process.argv);
