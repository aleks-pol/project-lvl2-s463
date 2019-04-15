import fs from 'fs';
import genDiff from '../src';

test('genDiff', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expected', 'UTF-8').trim();
  expect(genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(expected);
});
