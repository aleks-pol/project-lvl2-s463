import { has, difference, intersection } from 'lodash/fp';
import parse from './parsers';

const genDiff = (firstFilePath, secondFilePath) => {
  const firstFile = parse(firstFilePath);
  const secondFile = parse(secondFilePath);
  const firstKeys = Object.keys(firstFile);
  const secondKeys = Object.keys(secondFile);
  const removedKeys = difference(firstKeys, secondKeys).reduce(
    (acc, key) => ({ ...acc, [`- ${key}`]: firstFile[key] }),
    {},
  );
  const addedKeys = difference(secondKeys, firstKeys).reduce(
    (acc, key) => ({ ...acc, [`+ ${key}`]: secondFile[key] }),
    {},
  );
  const commonKeys = intersection(secondKeys, firstKeys).reduce((acc, key) => {
    const noChangeVal =
      has(key, firstFile) && firstFile[key] === secondFile[key];
    return noChangeVal
      ? {
          ...acc,
          [`  ${key}`]: firstFile[key],
        }
      : {
          ...acc,
          [`+ ${key}`]: secondFile[key],
          [`- ${key}`]: firstFile[key],
        };
  }, {});

  return JSON.stringify(
    {
      ...commonKeys,
      ...addedKeys,
      ...removedKeys,
    },
    null,
    2,
  )
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/: "([^"]+)"/g, ': $1')
    .replace(/,$/gm, '');
};
export default genDiff;
