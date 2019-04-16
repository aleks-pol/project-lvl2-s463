import fs from 'fs';
import genDiff from '../src';

let expected;

const formats = ['json', 'yml', 'ini'];

beforeAll(() => {
  expected = fs.readFileSync('__tests__/__fixtures__/expected', 'UTF-8').trim();
});

test.each(formats)('gendiff %s', format => {
  expect(
    genDiff(
      `__tests__/__fixtures__/before.${format}`,
      `__tests__/__fixtures__/after.${format}`,
    ),
  ).toBe(expected);
});
