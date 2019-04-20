import { has, union, isObject, map, compose, sortBy } from 'lodash/fp';
import path from 'path';
import fs from 'fs';
import parse from './parsers';
import render from './renderers';

const buildAstTree = (before, after, parent) => {
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);
  const mapKeys = key => {
    const beforeHasKey = has(key, before);
    const afterHasKey = has(key, after);
    const beforeHasChildren = isObject(before[key]);
    const afterHasChildren = isObject(after[key]);
    if (before[key] === after[key]) {
      return {
        key,
        parent,
        meta: {
          type: 'equals',
          oldValue: before[key],
        },
      };
    }
    if (beforeHasKey && !afterHasKey) {
      return {
        key,
        parent,
        meta: {
          type: 'removed',
          oldValue: before[key],
        },
      };
    }
    if (!beforeHasKey && afterHasKey) {
      return {
        key,
        parent,
        meta: {
          type: 'added',
          newValue: after[key],
        },
      };
    }
    if (beforeHasChildren && afterHasChildren) {
      const child = { key, meta: { type: 'changedChildren' }, parent };
      return {
        key,
        parent,
        meta: {
          type: 'changedChildren',
        },
        children: buildAstTree(before[key], after[key], child),
      };
    }
    return {
      key,
      parent,
      meta: {
        type: 'changed',
        oldValue: before[key],
        newValue: after[key],
      },
    };
  };
  return compose(
    sortBy('key'),
    map(mapKeys),
    union(beforeKeys),
  )(afterKeys);
};

const genDiff = (beforePath, afterPath, format = 'tree') => {
  const beforeData = parse(path.extname(beforePath))(
    fs.readFileSync(beforePath, 'UTF-8'),
  );
  const afterData = parse(path.extname(afterPath))(
    fs.readFileSync(afterPath, 'UTF-8'),
  );
  const ast = buildAstTree(beforeData, afterData);
  return render(format)(ast);
};

export default genDiff;
