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
  .action((firstFile, secondFile, { format }) => {
    console.log(genDiff(firstFile, secondFile, format));
  });

program.on('--help', () => {
  const helpFile = fs.readFileSync('help', 'UTF-8');
  console.log(helpFile);
});

program.parse(process.argv);
