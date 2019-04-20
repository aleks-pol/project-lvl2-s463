import { isObject, isString } from 'lodash/fp';

const renderValue = value => {
  if (isObject(value)) {
    return '[complex value]';
  }
  if (isString(value)) {
    return `'${value}'`;
  }
  return `${value}`;
};

const renderKey = item => {
  const iter = (el, acc) => {
    if (!el.parent) {
      return acc;
    }
    return iter(el.parent, [el.parent.key, ...acc]);
  };
  return iter(item, [item.key]).join('.');
};

export default ast => {
  const iter = tree => {
    return tree.reduce((acc, item) => {
      const {
        meta: { oldValue, newValue, type },
        children,
      } = item;
      switch (type) {
        case 'removed':
          return [...acc, `Property '${renderKey(item)}' was removed`];
        case 'added':
          return [
            ...acc,
            `Property '${renderKey(item)}' was added with value: ${renderValue(
              newValue,
            )}`,
          ];
        case 'changed':
          return [
            ...acc,
            `Property '${renderKey(item)}' was updated. From ${renderValue(
              oldValue,
            )} to ${renderValue(newValue)}`,
          ];
        case 'changedChildren':
          return [...acc, ...iter(children)];
        case 'equals':
          return acc;
        default:
          return acc;
      }
    }, []);
  };
  return iter(ast).join('\n');
};
