const treeRender = ast => {
  const iter = tree => {
    return tree.reduce((acc, item) => {
      const { type, value, before, children, key } = item;
      switch (type) {
        case 'removed':
        case 'added':
          return {
            ...acc,
            [`${type === 'removed' ? '-' : '+'} ${key}`]: value,
          };
        case 'changed':
          return {
            ...acc,
            [`+ ${key}`]: value,
            [`- ${key}`]: before,
          };
        case 'changedChildren':
          return {
            ...acc,
            [key]: iter(children),
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

const jsonRender = ast => {
  const iter = tree => {
    return tree.reduce((acc, item) => {
      const { type, children } = item;
      if (type === 'changedChildren') {
        return [
          ...acc,
          {
            ...item,
            children: iter(children),
          },
        ];
      }
      return [
        ...acc,
        {
          ...item,
        },
      ];
    }, []);
  };
  return JSON.stringify(iter(ast));
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
    return iter(el.parent, [el.parent.key, ...acc]);
  };
  return iter(item, [item.key]).join('.');
};

const plainRender = ast => {
  const iter = tree => {
    return tree.reduce((acc, item) => {
      const { type, value, before, children } = item;
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
          return [...acc, ...iter(children)];
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
    case 'json':
      return jsonRender;
    default:
      return treeRender;
  }
};
