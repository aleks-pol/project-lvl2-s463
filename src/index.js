import { has, difference, intersection } from 'lodash/fp';
import parse from './parsers';
import render from './renderers';

const diffKeys = (before, after, parent) => {
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);
  const removedKeys = difference(beforeKeys, afterKeys).map(key => ({
    key,
    value: before[key],
    type: 'removed',
    parent,
  }));
  const addedKeys = difference(afterKeys, beforeKeys).map(key => ({
    key,
    value: after[key],
    type: 'added',
    parent,
  }));
  const commonKeys = intersection(afterKeys, beforeKeys).map(key => {
    const noChangeVal = has(key, before) && before[key] === after[key];
    const beforeHasChildren = typeof before[key] === 'object';
    const afterHasChildren = typeof after[key] === 'object';
    if (noChangeVal) {
      return { key, value: before[key], type: 'equals', parent };
    }
    if (beforeHasChildren && afterHasChildren) {
      const child = { key, type: 'changedChildren', parent };
      return {
        key,
        type: 'changedChildren',
        parent,
        children: diffKeys(before[key], after[key], child),
      };
    }
    return {
      key,
      type: 'changed',
      value: after[key],
      before: before[key],
      parent,
    };
  });

  return [...removedKeys, ...addedKeys, ...commonKeys];
};

const genDiff = (firstFilePath, secondFilePath, format = 'tree') => {
  const firstFile = parse(firstFilePath);
  const secondFile = parse(secondFilePath);
  const diff = diffKeys(firstFile, secondFile);
  return render(format)(diff);
};

export default genDiff;
