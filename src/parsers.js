import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export default filePath => {
  const ext = path.extname(filePath);
  let parse;
  switch (ext) {
    case '.yml':
      parse = yaml.safeLoad;
      break;
    case '.json':
      ({ parse } = JSON);
      break;
    default:
      ({ parse } = JSON);
  }
  return parse(fs.readFileSync(path.resolve(filePath), 'UTF-8'));
};
