"use strict";

const TestCaseResult = require("../../lib/helpers/test_case_result"),
    classyTest = require("../../index.js"),
    assert = require("chai").assert;

class TestCaseResultTestCase extends classyTest.BaseTestCase {
    constructor() {
        super();
        this.testCaseResult = new TestCaseResult("testCase", "test");
    }

    testPass() {
        this.testCaseResult.pass();

        assert.equal(this.testCaseResult.testCaseName, "testCase");
        assert.equal(this.testCaseResult.testName, "test");
        assert.equal(this.testCaseResult.isPassedStatus, true);
        assert.equal(this.testCaseResult.isFailedStatus, false);
        assert.equal(this.testCaseResult.error, undefined);
    }

    testFail() {
        this.testCaseResult.fail(new Error('test error'));

        assert.equal(this.testCaseResult.testCaseName, "testCase");
        assert.equal(this.testCaseResult.testName, "test");
        assert.equal(this.testCaseResult.isPassedStatus, false);
        assert.equal(this.testCaseResult.isFailedStatus, true);
        assert.isDefined(this.testCaseResult.error);
    }
}

module.exports = [TestCaseResultTestCase];