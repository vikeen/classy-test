"use strict";

const logger = require("./helpers/logger")(),
    TestCaseResult = require("./helpers/test_case_result"),
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

            let testCaseResult = new TestCaseResult(this.__name, testName);

            try {
                this[testName]();
                testCaseResult.pass();
            } catch (error) {
                testCaseResult.fail(error);
            }

            this.__results.push(testCaseResult);

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