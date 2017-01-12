"use strict";

const ClassyTest = require("../lib/classy_test"),
    BaseTestCase = require("../lib/base_test_case"),
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
        assert.deepEqual(this.classyTest.tests, ["testEqual", "testTrue"])
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
        assert.deepEqual(this.classyTest.tests, ["testEqual", "testTrue"])
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

module.exports = [
    LoadFileTestCase,
    LoadTestCaseTestCase
];