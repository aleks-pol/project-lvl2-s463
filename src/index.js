import { has, union, isObject, map, compose, sortBy } from 'lodash/fp';
import path from 'path';
import fs from 'fs';
import getParser from './parsers';
import getRender from './renderers';

const buildTree = (before, after, parent) => {
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);
  const mapKeys = key => {
    const beforeHasKey = has(key, before);
    const afterHasKey = has(key, after);
    if (before[key] === after[key]) {
      return {
        key,
        parent,
        type: 'equals',
        oldValue: before[key],
      };
    }
    if (beforeHasKey && !afterHasKey) {
      return {
        key,
        parent,
        type: 'removed',
        oldValue: before[key],
      };
    }
    if (!beforeHasKey && afterHasKey) {
      return {
        key,
        parent,
        type: 'added',
        newValue: after[key],
      };
    }
    if (isObject(before[key]) && isObject(after[key])) {
      const child = { key, type: 'nested', parent };
      return {
        key,
        parent,
        type: 'nested',
        children: buildTree(before[key], after[key], child),
      };
    }
    return {
      key,
      parent,
      type: 'changed',
      oldValue: before[key],
      newValue: after[key],
    };
  };
  return compose(
    sortBy('key'),
    map(mapKeys),
    union(beforeKeys),
  )(afterKeys);
};

const genDiff = (beforePath, afterPath, format = 'tree') => {
  const parse = getParser(path.extname(beforePath));
  const render = getRender(format);
  const beforeData = parse(fs.readFileSync(beforePath, 'UTF-8'));
  const afterData = parse(fs.readFileSync(afterPath, 'UTF-8'));
  const ast = buildTree(beforeData, afterData);
  return render(ast);
};

export default genDiff;
