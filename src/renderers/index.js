import plain from './plain';
import tree from './tree';
import json from './json';

const RENDER = {
  plain,
  tree,
  json,
};

export default (format = 'tree') => RENDER[format];
