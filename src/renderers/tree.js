import { isObject } from 'lodash/fp';

const renderValue = (value, indent) => {
  if (isObject(value)) {
    const spaceIndent = ' '.repeat(indent);
    const childSpaceIndent = ' '.repeat(indent + 2);
    return Object.keys(value).reduce((acc, key) => {
      return `${acc}{\n${childSpaceIndent}${key}: ${
        value[key]
      }\n${spaceIndent}}`;
    }, '');
  }
  return value;
};

export default ast => {
  const START_INDENT = 2;
  const iter = (tree, indent) => {
    return tree
      .reduce((acc, item) => {
        const {
          meta: { oldValue, newValue, type },
          children,
          key,
        } = item;
        const spaceIndent = ' '.repeat(indent);
        const equalsSpaceIndent = ' '.repeat(indent + 2);
        switch (type) {
          case 'removed':
            return [
              ...acc,
              `${spaceIndent}- ${key}: ${renderValue(oldValue, indent)}`,
            ];
          case 'added':
            return [
              ...acc,
              `${spaceIndent}+ ${key}: ${renderValue(newValue, indent)}`,
            ];
          case 'changed':
            return [
              ...acc,
              `${spaceIndent}+ ${key}: ${renderValue(newValue, indent)}`,
              `${spaceIndent}- ${key}: ${renderValue(oldValue, indent)}`,
            ];
          case 'changedChildren':
            return [
              ...acc,
              `${spaceIndent}${key}: {\n${iter(
                children,
                indent + 2,
              )}\n${spaceIndent}}`,
            ];
          case 'equals':
            return [
              ...acc,
              `${equalsSpaceIndent}${key}: ${renderValue(oldValue, indent)}`,
            ];
          default:
            return acc;
        }
      }, [])
      .join('\n');
  };
  return `{\n${iter(ast, START_INDENT)}\n}`;
};
