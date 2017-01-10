"use strict";

const STATUSES = {
    PASS: "ok",
    FAIL: "not ok"
};

class TestResult {
    constructor(testCaseName, testName, testIndex) {
        this.testCaseName = testCaseName;
        this.testName = testName;
        this.testIndex = testIndex;
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

    report() {
        console.log(this.status, this.testIndex, this.testName);
    }
}

module.exports = TestResult;