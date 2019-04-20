export default ast => {
  const iter = tree => {
    return tree.reduce((acc, item) => {
      const {
        meta: { type },
        children,
      } = item;
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
