"use strict";

const STATUSES = {
    PASS: "pass",
    FAIL: "fail"
};

class TestCaseResult {
    constructor(testCaseName, testName) {
        this.testCaseName = testCaseName;
        this.testName = testName;
    }

    get isPassedStatus() {
        return this.status === STATUSES.PASS;
    }

    get isFailedStatus() {
        return this.status === STATUSES.FAIL;
    }

    pass() {
        this.status = STATUSES.PASS;
    }

    fail(error) {
        this.status = STATUSES.FAIL;
        this.error = error;
    }
}

module.exports = TestCaseResult;