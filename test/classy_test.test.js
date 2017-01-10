"use strict";

const ClassyTest = require("../lib/classy_test"),
    BaseTestCase = require("../lib/base_test_case"),
    sinon = require("sinon"),
    assert = require("chai").assert,
    path = require("path");

class LoadFileTestCase extends BaseTestCase {
    constructor() {
        super();
    }

    testThrowErrorIfTestsCasesAreNotExported() {
        this.classyTest = new ClassyTest([], null, true);

        let filePath = path.resolve("test/assets/no_exported_test_cases.js");

        try {
            this.classyTest.loadFile(filePath);
            assert.isTrue(false, "an error should be thrown from the file load");
        } catch (error) {
            assert.include(error.message, "invalid export format");
        }
    }
}

module.exports = [LoadFileTestCase];