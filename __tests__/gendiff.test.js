import fs from 'fs';
import genDiff from '../src';

let expected;

beforeAll(() => {
  expected = fs.readFileSync('__tests__/__fixtures__/expected', 'UTF-8').trim();
});

test('genDiff json', () => {
  expect(
    genDiff(
      '__tests__/__fixtures__/before.json',
      '__tests__/__fixtures__/after.json',
    ),
  ).toBe(expected);
});

test('genDiff yaml', () => {
  expect(
    genDiff(
      '__tests__/__fixtures__/before.yml',
      '__tests__/__fixtures__/after.yml',
    ),
  ).toBe(expected);
});
