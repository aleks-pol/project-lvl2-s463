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
  console.log('');
  console.log(
    '  $ gendiff --format json ./example/before.json ./example/after.json',
  );
  console.log(
    `[{"key":"group2","value":{"abc":"12345"},"type":"removed"},{"key":"group3","value":{"fee":"100500"},"type":"added"},{"key":"common","type":"changedChildren","children":[{"key":"setting2","value":"200","type":"removed"},{"key":"follow","value":false,"type":"added"},{"key":"setting4","value":"blah blah","type":"added"},{"key":"setting5","value":{"key5":"value5"},"type":"added"},{"key":"setting1","value":"Value 1"},{"key":"setting3","value":{"key":"value"},"before":true,"type":"changed"},{"key":"setting6","type":"changedChildren","children":[{"key":"ops","value":"vops","type":"added"},{"key":"key","value":"value"}]}]},{"key":"group1","type":"changedChildren","children":[{"key":"baz","value":"bars","before":"bas","type":"changed"},{"key":"foo","value":"bar"},{"key":"nest","value":"str","before":{"key":"value"},"type":"changed"}]}]`,
  );
});

program.parse(process.argv);
