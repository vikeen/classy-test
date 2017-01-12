"use strict";

const ClassyTest = require("../lib/classy_test"),
    BaseTestCase = require("../lib/base_test_case"),
    Promise = require("bluebird"),
    assert = require("chai").assert,
    path = require("path");


class BaseClassyTestTestCase extends BaseTestCase {
    constructor() {
        super();
    }

    setup() {
        this.classyTest = new ClassyTest([], null, true);
    }
}

class LoadTestCaseTestCase extends BaseClassyTestTestCase {
    constructor() {
        super();
    }

    testValidTestCase() {
        let filePath = path.resolve("test/assets/exported_test_case.js");
        this.classyTest.loadFile(filePath);

        assert.lengthOf(this.classyTest.TestCases, 1);
    }
}

class LoadFileTestCase extends BaseClassyTestTestCase {
    constructor() {
        super();
    }

    testValidFileFormat() {
        let filePath = path.resolve("test/assets/exported_test_case.js");
        this.classyTest.loadFile(filePath);

        assert.lengthOf(this.classyTest.TestCases, 1);
    }

    testThrowErrorIfTestsCasesAreNotExported() {
        let filePath = path.resolve("test/assets/no_exported_test_case.js");

        try {
            this.classyTest.loadFile(filePath);
            assert.isTrue(false, "an error should be thrown from the file load");
        } catch (error) {
            assert.include(error.message, "invalid export format");
        }
    }
}

class PromiseTestCase extends BaseClassyTestTestCase {
    constructor() {
        super();
    }

    setup() {
        super.setup();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500)
        });
    }

    teardown() {
        super.teardown();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500)
        });
    }

    testHandlePromiseResolve() {
        const promiseThatResolves = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 200)
        });
        return promiseThatResolves.then(response => {
            assert.isTrue(response);
        }).catch(error => {
            assert.isFalse(true, "the underlying promise should have succeeded. This block should never be run");
        });
    }

    testHandlePromiseReject() {
        const promiseThatRejects = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("handle_promise_error_message"));
            }, 200);
        });

        return promiseThatRejects.then(() => {
            assert.isFalse(true, "the underlying promise should have failed. This block should never be run");
        }).catch(error => {
            assert.equal(error.message, "handle_promise_error_message");
        });
    }
}

module.exports = [
    LoadFileTestCase,
    LoadTestCaseTestCase,
    PromiseTestCase
];