#!/usr/bin/env node

import program from 'commander';
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
  })
  .parse(process.argv);
