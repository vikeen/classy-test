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
Default: `'.test.js'`

Set the default file extension for your test files.

## Examples

### Component

my-project/lib/component.js

```js
"use strict";

class SimpleComponent {
    constructor(numbers) {
        this.numbers = numbers;
    }

    sum() {
        return this.numbers.reduce((a, b) => a + b);
    }

    sort() {
        return this.numbers.sort();
    }
}

module.exports = SimpleComponent;
```

### Test File

my-project/test/component.test.js

```js
"use strict";

const Component = require("../lib/component"),
    classyTest = require("classy-test"),
    assert = require("chai").assert;

// extend base test case.
class ComponentTestCase extends classyTest.BaseTestCase {
    constructor() {
        super();
    }

    // prefix all test functions in your test case with 'test'
    testSum() {
        assert.equal(new Component([1, 2, 3, 4]).sum(), 10);
    }

    testSort() {
        assert.deepEqual(new Component([4, 1, 5, 2, 3]).sort(), [1, 2, 3, 4, 5]);
    }
}

// export an array of test cases you want to run
module.exports = [
    ComponentTestCase
];
```

### Output

```bash
$ node node_modules/classy-test/bin/classy-test-cli.js                                                                                                                                                1 ↵
debug: - 1 files found -
debug: /Users/johnrake/dev/classy-test-sandbox/test/component.test.js
debug: testing file - /Users/johnrake/dev/classy-test-sandbox/test/component.test.js
debug: found 1 test case(s)
debug: running test case [ComponentTestCase]
info: [ComponentTestCase] - 2 tests
	..

info: ================================
info: pass: 2 -- fail: 0
info: ================================
time taken: 35.084ms
```

For more examples check [here](examples).

## Team

[![John Rake](http://gravatar.com/avatar/98008fcabb57bf00074774d37e2d79e7?s=144)](https://github.com/vikeen)

## License

MIT &copy; [John Rake](https://github.com/vikeen)
