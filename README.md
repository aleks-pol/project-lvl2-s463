# Вычислитель отличий
[![Maintainability](https://api.codeclimate.com/v1/badges/705a043a1ba1ca0ad4a8/maintainability)](https://codeclimate.com/github/aleks-pol/project-lvl2-s463/maintainability)
[![Build Status](https://travis-ci.org/aleks-pol/project-lvl2-s463.svg?branch=master)](https://travis-ci.org/aleks-pol/project-lvl2-s463)
[![Test Coverage](https://api.codeclimate.com/v1/badges/705a043a1ba1ca0ad4a8/test_coverage)](https://codeclimate.com/github/aleks-pol/project-lvl2-s463/test_coverage)
## Installation

```bash
$ npm install -g alexpol-gendiff
```

## Usage
##### JSON
```bash
$ gendiff ./example/before.json ./example/after.json
{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  + verbose: true
  - proxy: 123.234.53.22
  - follow: false
}
```
[![asciicast](https://asciinema.org/a/pMdEPYK0CtLFPfJvh4WEu8TL8.svg)](https://asciinema.org/a/pMdEPYK0CtLFPfJvh4WEu8TL8)

##### YAML
```bash
$ gendiff ./example/before.yml ./example/after.yml
{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  + verbose: true
  - proxy: 123.234.53.22
  - follow: false
}
```
[![asciicast](https://asciinema.org/a/KXf709hYYgUyWJYYNWSezos3x.svg)](https://asciinema.org/a/KXf709hYYgUyWJYYNWSezos3x)
