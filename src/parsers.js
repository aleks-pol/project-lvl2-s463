import yaml from 'js-yaml';
import ini from 'ini';

const parser = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

export default ext => parser[ext];
