const treeRender = ast => {
  const iter = tree => {
    return tree.getChildren().reduce((acc, item) => {
      const {
        meta: { type, value, before },
        key,
      } = item;

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
            [key]: iter(item),
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

const isComplexValue = value => typeof value === 'object';

const isString = value => typeof value === 'string';

const renderValue = value => {
  if (isComplexValue(value)) {
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
    return iter(el.parent, [el.key, ...acc]);
  };
  return iter(item, []).join('.');
};

const plainRender = ast => {
  const iter = tree => {
    return tree.getChildren().reduce((acc, item) => {
      const {
        meta: { type, value, before },
      } = item;
      switch (type) {
        case 'removed':
          return [...acc, `Property '${renderKey(item)}' was removed`];
        case 'added':
          return [
            ...acc,
            `Property '${renderKey(item)}' was added with value: ${renderValue(
              value,
            )}`,
          ];
        case 'changed':
          return [
            ...acc,
            `Property '${renderKey(item)}' was updated. From ${renderValue(
              before,
            )} to ${renderValue(value)}`,
          ];
        case 'changedChildren':
          return [...acc, ...iter(item)];
        default:
          return acc;
      }
    }, []);
  };
  return iter(ast).join('\n');
};

export default (format = 'tree') => {
  switch (format) {
    case 'plain':
      return plainRender;
    case 'tree':
      return treeRender;
    default:
      return treeRender;
  }
};
