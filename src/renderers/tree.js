import { isObject, flattenDeep, compose, map, join } from 'lodash/fp';

const START_DEPTH = 2;
const renderValue = (value, indent) => {
  if (!isObject(value)) {
    return value;
  }
  const spaceIndent = ' '.repeat(indent);
  const childSpaceIndent = ' '.repeat(indent + 2);
  return Object.keys(value).reduce((acc, key) => {
    return `${acc}{\n${childSpaceIndent}${key}: ${value[key]}\n${spaceIndent}}`;
  }, '');
};

export default ast => {
  const iter = (tree, depth) => {
    const spaceIndent = ' '.repeat(depth);
    const equalsSpaceIndent = ' '.repeat(depth + 2);
    const buildString = item => {
      const { oldValue, newValue, type, children, key } = item;
      switch (type) {
        case 'removed':
          return `${spaceIndent}- ${key}: ${renderValue(oldValue, depth)}`;
        case 'added':
          return `${spaceIndent}+ ${key}: ${renderValue(newValue, depth)}`;
        case 'changed':
          return [
            `${spaceIndent}+ ${key}: ${renderValue(newValue, depth)}`,
            `${spaceIndent}- ${key}: ${renderValue(oldValue, depth)}`,
          ];
        case 'nested':
          return `${spaceIndent}${key}: {\n${iter(
            children,
            depth + 2,
          )}\n${spaceIndent}}`;
        case 'equals':
          return `${equalsSpaceIndent}${key}: ${renderValue(oldValue, depth)}`;
        default:
          throw new Error('Invalid tree item type');
      }
    };
    return compose(
      join('\n'),
      flattenDeep,
      map(buildString),
    )(tree);
  };
  return `{\n${iter(ast, START_DEPTH)}\n}`;
};
