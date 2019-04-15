#!/usr/bin/env node

const program = require('commander');
const { version } = require('../../package.json');

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig>')
  .arguments('<secondConfig>')
  .parse(process.argv);
