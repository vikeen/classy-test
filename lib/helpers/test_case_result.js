"use strict";

const STATUSES = {
    PASS: "pass",
    FAIL: "fail"
};

class TestCaseResult {
    constructor(testCaseName, testName, status, error) {
        this.testCaseName = testCaseName;
        this.testName = testName;
        this.status = status;
        this.error = error;
    }

    get isPassedStatus() {
        return this.status === STATUSES.PASS;
    }

    get isFailedStatus() {
        return this.status === STATUSES.FAIL;
    }
}

module.exports = {
    TestCaseResult: TestCaseResult,
    STATUSES: STATUSES
};