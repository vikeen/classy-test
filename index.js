"use strict";

const TEST_NAME_KEY_WORD = "test";

class BaseTestCase {
    constructor() {
        console.log("base: constructor");
        return this;
    }

    setup() {
        console.log("base: setup");
        console.log("");
        return this;
    }

    teardown() {
        console.log("");
        console.log("");
        console.log("base: teardown");
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
        console.log("");
        console.log(failedTest.testCaseName, ":", failedTest.testName);
        console.error(failedTest.error);
    });

    console.log("");
    console.log("================================");
    console.log("pass:", passedTests.length, " -- fail:", failedTests.length);
    console.log("================================");

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

    console.log(testCaseName + ":", tests.size, "tests");

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
    process.stdout.write(progress);
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