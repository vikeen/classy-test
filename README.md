# Classy Test

[![Build Status](https://travis-ci.org/vikeen/classy-test.svg?branch=master)](https://travis-ci.org/vikeen/classy-test)

Opinionated class based testing framework.

## Install

```bash
$ npm install classy-test
```

## Usage

#### Command Line Interface

```bash
$ node node_modules/classy-test/bin/classy-test-cli.js
```

#### Exported Module

```js
const ClassyTestRunner = require("classy-test");
new ClassyTestRunner().run();
```

## API

### ClassyTestRunner([options])

#### options

##### directories 

Type: `string[]` <br/>
Default: `['test']`

Relative paths to all directories that should be searched for test case files.

##### extension

Type: `string` *(test file extension)* <br/>
Default: `'.test.js`

Set the default file extension for your test files.

## Examples

For examples check [here](examples).

## Team

[![John Rake](http://gravatar.com/avatar/98008fcabb57bf00074774d37e2d79e7?s=144)](https://github.com/vikeen)

## License

MIT &copy; [John Rake](https://github.com/vikeen)
