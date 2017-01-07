"use strict";

const winston = require('winston'),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                level: (process.env.NODE_ENV === "development") ? "debug" : "info"
            })
        ]
    }),
    TEST_NAME_KEY_WORD = "test",
    TEST_CASE_RESULT_STATUSES = {
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
        return this.status === TEST_CASE_RESULT_STATUSES.PASS;
    }

    get isFailedStatus() {
        return this.status === TEST_CASE_RESULT_STATUSES.FAIL;
    }
}

class BaseTestCase {
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
}

function run(TestCases) {
    console.time("time taken");
    let results = [];

    if (!Array.isArray(TestCases)) {
        TestCases = [TestCases];
    }

    TestCases.forEach(TestCase => {
        const testCase = new TestCase();

        results = results.concat(testCase.__run());
    });

    console.timeEnd("time taken");

    __runReport(results);
}

module.exports = {
    BaseTestCase: BaseTestCase,
    run: run
};

/*
 * PRIVATE API
 */

function __runReport(results) {
    const passedTests = results.filter(item => item.status === "pass"),
        failedTests = results.filter(item => item.status === "fail");

    failedTests.forEach(failedTest => {
        logger.error(`Test Case Failed (${failedTest.testCaseName}:${failedTest.testName})`);
        logger.error(failedTest.error);
    });

    logger.info("================================");
    logger.info(`pass: ${passedTests.length} -- fail: ${failedTests.length}`);
    logger.info("================================");

    if (failedTests.length > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}