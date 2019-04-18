# Вычислитель отличий
[![Maintainability](https://api.codeclimate.com/v1/badges/705a043a1ba1ca0ad4a8/maintainability)](https://codeclimate.com/github/aleks-pol/project-lvl2-s463/maintainability)
[![Build Status](https://travis-ci.org/aleks-pol/project-lvl2-s463.svg?branch=master)](https://travis-ci.org/aleks-pol/project-lvl2-s463)
[![Test Coverage](https://api.codeclimate.com/v1/badges/705a043a1ba1ca0ad4a8/test_coverage)](https://codeclimate.com/github/aleks-pol/project-lvl2-s463/test_coverage)
## Installation

```bash
$ npm install -g alexpol-gendiff
```

## Usage
```bash
Usage: gendiff [options] <firstConfig> <secondConfig>

Compares two configuration files and shows a difference.

Options:
  -V, --version        output the version number
  -f, --format [type]  Output format
  -h, --help           output usage information

Examples:
  $ gendiff ./example/before.json ./example/after.json
  {
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  + verbose: true
  - proxy: 123.234.53.22
  - follow: false
  }

  $ gendiff --format plain ./example/before.json ./example/after.json
  Property 'group2' was removed
  Property 'group3' was added with value: [complex value]
  Property 'common.setting2' was removed
  Property 'common.follow' was added with value: false
  Property 'common.setting4' was added with value: 'blah blah'
  Property 'common.setting5' was added with value: [complex value]
  Property 'common.setting3' was updated. From true to [complex value]
  Property 'common.setting6.ops' was added with value: 'vops'
  Property 'group1.baz' was updated. From 'bas' to 'bars'
  Property 'group1.nest' was updated. From [complex value] to 'str'
  
  $ gendiff --format json ./example/before.json ./example/after.json
  [{"key":"group2","value":{"abc":"12345"},"type":"removed"},{"key":"group3","value":{"fee":"100500"},"type":"added"},
  {"key":"common","type":"changedChildren","children":[{"key":"setting2","value":"200","type":"removed"},{"key":"follow",
  "value":false,"type":"added"},{"key":"setting4","value":"blah blah","type":"added"},{"key":"setting5","value":{"key5":"value5"},
  "type":"added"},{"key":"setting1","value":"Value 1"},{"key":"setting3","value":{"key":"value"},"before":true,"type":"changed"},
  {"key":"setting6","type":"changedChildren","children":[{"key":"ops","value":"vops","type":"added"},{"key":"key","value":"value"}]}]},
  {"key":"group1","type":"changedChildren","children":[{"key":"baz","value":"bars","before":"bas","type":"changed"},{"key":"foo","value":"bar"},
  {"key":"nest","value":"str","before":{"key":"value"},"type":"changed"}]}]
```
[![asciicast](https://asciinema.org/a/aAV9vxt1kVRXJ8d8pUQkZIAc5.svg)](https://asciinema.org/a/aAV9vxt1kVRXJ8d8pUQkZIAc5)
