import plain from './plain';
import tree from './tree';
import json from './json';

const render = {
  plain,
  tree,
  json,
};

export default (format = 'tree') => render[format];
