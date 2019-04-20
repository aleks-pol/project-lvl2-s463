import yaml from 'js-yaml';
import ini from 'ini';

const PARSER = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

export default ext => PARSER[ext];
