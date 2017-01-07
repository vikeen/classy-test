"use strict";

const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: (process.env.NODE_ENV === "development") ? "debug" : "info"
        })
    ]
});

const TEST_NAME_KEY_WORD = "test";

class BaseTestCase {
    constructor() {
        logger.debug("[BaseTestCase] - constructor");
        return this;
    }

    setup() {
        logger.debug("[BaseTestCase] - setup");
        return this;
    }

    teardown() {
        logger.debug("[BaseTestCase] - teardown");
        return this;
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

        testCase.setup();

        results = results.concat(__runTests(testCase));

        testCase.teardown();
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
        logger.info(failedTest.testCaseName, ":", failedTest.testName);
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

function __runTests(testCase) {
    let testCaseName = testCase.constructor.name,
        tests = __getAllTests(testCase),
        results = [];

    logger.info(testCaseName + ":", tests.size, "tests");

    tests.forEach(test => {
        try {
            testCase[test]();
            results.push({
                testCaseName: testCaseName,
                testName: test,
                status: "pass"
            });
        } catch (error) {
            results.push({
                testCaseName: testCaseName,
                testName: test,
                error: error,
                status: "fail"
            });
        }

        __updateTestResultProgress(results);
    });

    // provide a little reading room after a test case report is rendered
    console.log("\n");

    return results;
}

function __updateTestResultProgress(results) {
    let progress = results.reduce((a, newResult) => {

        if (newResult.status === "pass") {
            return a + "."
        }
        if (newResult.status === "fail") {
            return a + "E"
        }
    }, "");

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("\t" + progress);
}

function __getAllTests(testCase) {
    let methods = new Set();

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