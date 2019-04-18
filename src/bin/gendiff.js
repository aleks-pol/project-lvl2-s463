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
  });

program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ gendiff ./example/before.json ./example/after.json');
  console.log(
    '  {\n' +
      '    host: hexlet.io\n' +
      '  + timeout: 20\n' +
      '  - timeout: 50\n' +
      '  + verbose: true\n' +
      '  - proxy: 123.234.53.22\n' +
      '  - follow: false\n' +
      '  }',
  );
  console.log('');
  console.log(
    '  $ gendiff --format plain ./example/before.json ./example/after.json',
  );
  console.log(
    "  Property 'group2' was removed\n" +
      "  Property 'group3' was added with value: [complex value]\n" +
      "  Property 'common.setting2' was removed\n" +
      "  Property 'common.follow' was added with value: false\n" +
      "  Property 'common.setting4' was added with value: 'blah blah'\n" +
      "  Property 'common.setting5' was added with value: [complex value]\n" +
      "  Property 'common.setting3' was updated. From true to [complex value]\n" +
      "  Property 'common.setting6.ops' was added with value: 'vops'\n" +
      "  Property 'group1.baz' was updated. From 'bas' to 'bars'\n" +
      "  Property 'group1.nest' was updated. From [complex value] to 'str'",
  );
});

program.parse(process.argv);
