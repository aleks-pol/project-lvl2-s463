import { isObject, flattenDeep, compose, map, join } from 'lodash/fp';

const START_INDENT = 2;
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
  const iter = (tree, indent) => {
    const spaceIndent = ' '.repeat(indent);
    const equalsSpaceIndent = ' '.repeat(indent + 2);
    const buildString = item => {
      const { oldValue, newValue, type, children, key } = item;
      switch (type) {
        case 'removed':
          return `${spaceIndent}- ${key}: ${renderValue(oldValue, indent)}`;
        case 'added':
          return `${spaceIndent}+ ${key}: ${renderValue(newValue, indent)}`;
        case 'changed':
          return `${spaceIndent}+ ${key}: ${renderValue(
            newValue,
            indent,
          )}\n${spaceIndent}- ${key}: ${renderValue(oldValue, indent)}`;
        case 'nested':
          return `${spaceIndent}${key}: {\n${iter(
            children,
            indent + 2,
          )}\n${spaceIndent}}`;
        case 'equals':
          return `${equalsSpaceIndent}${key}: ${renderValue(oldValue, indent)}`;
        default:
          throw new Error('Invalid type');
      }
    };
    return compose(
      join('\n'),
      flattenDeep,
      map(buildString),
    )(tree);
  };
  return `{\n${iter(ast, START_INDENT)}\n}`;
};
