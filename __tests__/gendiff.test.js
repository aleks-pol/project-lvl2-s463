import fs from 'fs';
import genDiff from '../src';

let expected;
let expectedPlain;

const formats = ['json', 'yml', 'ini'];

beforeAll(() => {
  expected = fs.readFileSync('__tests__/__fixtures__/expected', 'UTF-8').trim();
  expectedPlain = fs
    .readFileSync('__tests__/__fixtures__/expectedPlain', 'UTF-8')
    .trim();
});

test.each(formats)('gendiff %s', fileExt => {
  expect(
    genDiff(
      `__tests__/__fixtures__/before.${fileExt}`,
      `__tests__/__fixtures__/after.${fileExt}`,
      'tree',
    ),
  ).toBe(expected);
});
test.each(formats)('gendiff plain %s', fileExt => {
  expect(
    genDiff(
      `__tests__/__fixtures__/before.${fileExt}`,
      `__tests__/__fixtures__/after.${fileExt}`,
      'plain',
    ),
  ).toBe(expectedPlain);
});
