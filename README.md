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

##### disableLogging

Type: `boolean` *(disable interal classy test logging)* <br/>
Default: `false`

This is used for our internal testing to make the logs cleaner. It is exposed has a "quality-of-life" feature.

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
$ npm test

> classy-test@1.0.3 test /Users/johnrake/dev/classy-test
> node bin/classy-test-cli.js -d test -d examples

debug: - 3 files found -
debug: /Users/johnrake/dev/classy-test/test/base_test_case.test.js
debug: /Users/johnrake/dev/classy-test/test/classy_test.test.js
debug: /Users/johnrake/dev/classy-test/test/helpers/logger.test.js
TAP version 13
1..8
ok 1 - test name
ok 2 - test find all employee tests
ok 3 - test find all person tests
ok 4 - test valid file format
ok 5 - test throw error if tests cases are not exported
ok 6 - test valid test case
ok 7 - test normal mode
ok 8 - test debug mode
# time=170.037ms
```

For more examples check [here](examples).

## Team

[![John Rake](http://gravatar.com/avatar/98008fcabb57bf00074774d37e2d79e7?s=144)](https://github.com/vikeen)

## License

MIT &copy; [John Rake](https://github.com/vikeen)
