import {
  isObject,
  isString,
  flattenDeep,
  compact,
  compose,
  join,
} from 'lodash/fp';

const renderValue = value => {
  if (isObject(value)) {
    return '[complex value]';
  }
  if (isString(value)) {
    return `'${value}'`;
  }
  return `${value}`;
};

export default ast => {
  const iter = (tree, parent = '') => {
    return tree.map(item => {
      const { key, oldValue, newValue, type, children } = item;
      const combinedKey = `${parent}${key}`;
      switch (type) {
        case 'removed':
          return `Property '${combinedKey}' was removed`;
        case 'added':
          return `Property '${combinedKey}' was added with value: ${renderValue(
            newValue,
          )}`;
        case 'changed':
          return `Property '${combinedKey}' was updated. From ${renderValue(
            oldValue,
          )} to ${renderValue(newValue)}`;
        case 'nested':
          return iter(children, `${combinedKey}.`);
        case 'equals':
          return null;
        default:
          throw new Error('Invalid tree item type');
      }
    });
  };

  return compose(
    join('\n'),
    compact,
    flattenDeep,
  )(iter(ast));
};
