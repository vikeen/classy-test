"use strict";

const decamelize = require('decamelize'),
    STATUSES = {
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
        let testLine = `${this.status} ${this.testIndex} ${decamelize(this.testName, " ")}`;
        console.log(testLine);
    }
}

module.exports = TestResult;