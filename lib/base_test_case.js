"use strict";

const logger = require("./helpers/logger"),
    testCaseResult = require("./helpers/test_case_result"),
    TestCaseResult = testCaseResult.TestCaseResult,
    TEST_CASE_RESULT_STATUSES = testCaseResult.STATUSES,
    TEST_NAME_KEY_WORD = "test";

module.exports = class BaseTestCase {
    constructor() {
        this.__name = this.constructor.name;
        this.__results = [];
        logger.silly("[BaseTestCase] - constructor");
        return this;
    }

    setup() {
        logger.silly("[BaseTestCase] - setup");
        return this;
    }

    teardown() {
        logger.silly("[BaseTestCase] - teardown");
        return this;
    }

    // PRIVATE API

    get __tests() {
        let methods = new Set(),
            testCase = this;

        while (testCase = Reflect.getPrototypeOf(testCase)) {
            let keys = Reflect.ownKeys(testCase);
            keys.forEach(k => {
                if (k.startsWith(TEST_NAME_KEY_WORD)) {
                    methods.add(k);
                }
            });
        }
        return methods;
    }

    __run() {
        logger.info(`[${this.__name}] - ${this.__tests.size} tests`);

        this.__tests.forEach(testName => {
            this.setup();

            try {
                this[testName]();
                this.__results.push(new TestCaseResult(this.__name, testName, TEST_CASE_RESULT_STATUSES.PASS));
            } catch (error) {
                this.__results.push(new TestCaseResult(this.__name, testName, TEST_CASE_RESULT_STATUSES.FAIL, error));
            }

            this.teardown();

            this.__updateProgress();
        });

        // provide a little reading room after a test case report is rendered
        console.log("\n");

        return this.__results;
    }

    __updateProgress() {
        let progress = this.__results.reduce((a, newResult) => {

            if (newResult.isPassedStatus) {
                return a + "."
            }
            if (newResult.isFailedStatus) {
                return a + "E"
            }
        }, "");

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write("\t" + progress);
    }
};