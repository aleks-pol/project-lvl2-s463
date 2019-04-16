import { has, difference, intersection } from 'lodash/fp';
import parse from './parsers';

const diffKeys = (before, after) => {
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);
  const removedKeys = difference(beforeKeys, afterKeys).map(key => ({
    key,
    value: before[key],
    type: 'removed',
  }));
  const addedKeys = difference(afterKeys, beforeKeys).map(key => ({
    key,
    value: after[key],
    type: 'added',
  }));
  const commonKeys = intersection(afterKeys, beforeKeys).map(key => {
    const noChangeVal = has(key, before) && before[key] === after[key];
    const beforeHasChildren = typeof before[key] === 'object';
    const afterHasChildren = typeof after[key] === 'object';
    if (noChangeVal) {
      return {
        key,
        type: 'equals',
        value: before[key],
      };
    }
    if (beforeHasChildren && afterHasChildren) {
      return {
        key,
        type: 'changedChildren',
        children: diffKeys(before[key], after[key]),
      };
    }
    return {
      key,
      type: 'changed',
      value: after[key],
      before: before[key],
    };
  });

  return [...commonKeys, ...addedKeys, ...removedKeys];
};

const render = ast => {
  const iter = tree => {
    return tree.reduce((acc, item) => {
      const { type, value, children, key, before } = item;

      switch (type) {
        case 'removed':
          return { ...acc, [`- ${key}`]: value };
        case 'added':
          return { ...acc, [`+ ${key}`]: value };
        case 'changed':
          return {
            ...acc,
            [`+ ${key}`]: value,
            [`- ${key}`]: before,
          };
        case 'changedChildren':
          return {
            ...acc,
            [key]: iter(children),
          };
        default:
          return {
            ...acc,
            [key]: value,
          };
      }
    }, {});
  };
  return JSON.stringify(iter(ast), null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/: "([^"]+)"/g, ': $1')
    .replace(/,$/gm, '');
};

const genDiff = (firstFilePath, secondFilePath) => {
  const firstFile = parse(firstFilePath);
  const secondFile = parse(secondFilePath);
  const diff = diffKeys(firstFile, secondFile);

  return render(diff);
};

export default genDiff;
