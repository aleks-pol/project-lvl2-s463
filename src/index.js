import { has, difference, intersection } from 'lodash/fp';

import parse from './parsers';
import render from './renderers';

function createNode(key, meta = {}, parent) {
  const children = [];
  return {
    key,
    meta,
    children,
    parent,
    addChild(childKey, childMeta) {
      const childNode = createNode(childKey, childMeta, this);
      children.push(childNode);
      return childNode;
    },
  };
}

function createTree(rootKey) {
  return createNode(rootKey);
}

const diffKeys = (before, after, parent) => {
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);
  const tree = parent || createTree('', {});
  difference(beforeKeys, afterKeys).forEach(key => {
    tree.addChild(key, { value: before[key], type: 'removed' });
  });
  difference(afterKeys, beforeKeys).forEach(key => {
    tree.addChild(key, { value: after[key], type: 'added' });
  });
  intersection(afterKeys, beforeKeys).forEach(key => {
    const noChangeVal = has(key, before) && before[key] === after[key];
    const beforeHasChildren = typeof before[key] === 'object';
    const afterHasChildren = typeof after[key] === 'object';
    if (noChangeVal) {
      tree.addChild(key, { value: before[key], type: 'equals' });
    } else if (beforeHasChildren && afterHasChildren) {
      const child = tree.addChild(key, { type: 'changedChildren' });
      diffKeys(before[key], after[key], child);
    } else {
      tree.addChild(key, {
        type: 'changed',
        value: after[key],
        before: before[key],
      });
    }
  });

  return tree;
};

const genDiff = (firstFilePath, secondFilePath, format = 'tree') => {
  const firstFile = parse(firstFilePath);
  const secondFile = parse(secondFilePath);
  const diff = diffKeys(firstFile, secondFile);
  return render(format)(diff);
};

export default genDiff;
