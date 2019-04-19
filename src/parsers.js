import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

export default filePath => {
  const ext = path.extname(filePath);
  const data = fs.readFileSync(path.resolve(filePath), 'UTF-8');
  switch (ext) {
    case '.yml':
      return yaml.safeLoad(data);
    case '.json':
      return JSON.parse(data);
    case '.ini':
      return ini.parse(data);
    default:
      return JSON.parse(data);
  }
};
