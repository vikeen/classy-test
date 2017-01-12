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

### Simple

#### Component

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

#### Test File

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

### Promise Support

```js
"use strict";

const classyTest = require("../index.js"),
    assert = require("chai").assert;

class Invoice {
    // simulate async database interaction
    static getById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id) {
                    resolve({
                        id: 123,
                        amount: 100,
                        currency: "USD"
                    });
                } else {
                    reject(new Error("invoice_not_found"));
                }
            }, 200);
        });
    }
}

// test case for all your project needs
class ProjectBaseTestCase extends classyTest.BaseTestCase {
    constructor() {
        super();
    }

    setup() {
        super.setup();
        return this.bootstrapDatabase();
    }

    teardown() {
        super.teardown();
        return this.teardownDatabase();
    }

    bootstrapDatabase() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500)
        });
    }

    teardownDatabase() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500)
        });
    }
}

// Simple test case extended our base project test case
class InvoiceTestCase extends ProjectBaseTestCase {
    constructor() {
        super();
    }

    testGetById() {
        return Invoice.getById(123).then(invoice => {
            assert.deepEqual(invoice, {
                id: 123,
                amount: 100,
                currency: "USD"
            });
        }).catch(console.error);
    }

    testGetByIdError() {
        return Invoice.getById(null).then(() => {
            assert.isFalse(true, "the underlying promise should have failed. This block should never be run");
        }).catch(error => {
            assert.equal(error.message, "invoice_not_found");
        });
    }
}

module.exports = [InvoiceTestCase];
``````

For more examples check [here](examples).

## Team

[![John Rake](http://gravatar.com/avatar/98008fcabb57bf00074774d37e2d79e7?s=144)](https://github.com/vikeen)

## License

MIT &copy; [John Rake](https://github.com/vikeen)
