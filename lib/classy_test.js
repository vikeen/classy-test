"use strict";

const logger = require("./helpers/logger")(),
    TestResult = require("./helpers/test_result"),
    path = require("path"),
    fs = require("fs"),
    TEST_NAME_KEY_WORD = "test";

class ClassyTestRunner {
    constructor(directories = ["test"], extension = ".test.js", disableLogging = false) {
        this.TestCases = [];
        this.tests = [];
        this.results = [];
        this.currentTestIndex = 1;
        this.options = {
            directories: directories,
            extension: extension,
            disableLogging: disableLogging
        };

        if (!Array.isArray(this.options.directories)) {
            this.options.directories = [this.options.directories];
        }

        if (this.options.directories.length) {
            this.loadFromDirectories(this.options.directories);
        }
    }

    loadFromDirectories(directories) {
        let files = [];

        directories.forEach(directory => {
            directory = path.normalize(path.join(process.cwd(), directory));

            const allFiles = __walkSync(directory),
                testFiles = allFiles.filter(file => file.endsWith(this.options.extension));

            files = files.concat(testFiles);
        });

        if (!this.options.disableLogging) {
            logger.debug(`- ${files.length} files found -`);
        }

        files.forEach(this.loadFile.bind(this));
    }

    loadFile(filePath) {
        if (!this.options.disableLogging) {
            logger.debug(filePath);
        }

        const TestCases = require(filePath);

        if (Array.isArray(TestCases)) {
            TestCases.forEach(this.loadTestCase.bind(this));
        } else {
            throw new Error("invalid export format for file: " + filePath);
        }
    }

    loadTestCase(TestCase) {
        this.TestCases = this.TestCases.concat([TestCase]);
        this.tests = this.tests.concat(this.getTestsForTestCase(TestCase));
    }

    run() {
        if (!this.options.disableLogging) {
            console.time("time taken");
            this.printVersion();
            this.printTestPlan();
        }

        this.runTestCases();

        if (!this.options.disableLogging) {
            this.report();
            console.timeEnd("time taken");
        }

        if (this.hasFailedTest) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    }

    get hasFailedTest() {
        return this.failedTests.length > 0;
    }

    get failedTests() {
        return this.results.filter(item => item.isFailedStatus);
    }

    get passedTests() {
        return this.results.filter(item => item.isPassedStatus);
    }


    runTestCases() {
        this.TestCases.forEach(TestCase => {
            this.runTestCase(TestCase);
        });
    }

    runTestCase(TestCase) {
        const tests = this.getTestsForTestCase(TestCase),
            testCase = new TestCase();

        tests.forEach(test => {
            this.runTest(testCase, test);
        });
    }

    runTest(testCase, testName) {
        testCase.setup();

        let testResult = new TestResult(this.__name, testName, this.currentTestIndex);

        try {
            testCase[testName]();
            testResult.pass();
        } catch (error) {
            logger.debug(error);
            testResult.fail(error);
        }

        this.results.push(testResult);

        testCase.teardown();

        if (!this.options.disableLogging) {
            testResult.report();
        }

        this.currentTestIndex += 1;
    }

    report() {
        const numFailed = this.failedTests.length,
            numPassed = this.passedTests.length,
            numTotal = this.tests.length,
            percentagePassed = ((numPassed / numTotal) * 100).toFixed(2);

        if (this.failedTests.length) {
            console.log("");
            console.log("FAILED tests", this.failedTests.map(test => test.testIndex).join(", "));
            console.log(`Failed ${numFailed}/${numTotal}, ${percentagePassed}% okay`);
        }
    }

    getTestsForTestCase(TestCase) {
        function filterTests(name) {
            return name.startsWith(TEST_NAME_KEY_WORD);
        }

        let tests = Object.getOwnPropertyNames(TestCase.prototype).filter(filterTests);

        while (TestCase = Reflect.getPrototypeOf(TestCase)) {
            if (TestCase.prototype) {
                tests = tests.concat(Object.getOwnPropertyNames(TestCase.prototype).filter(filterTests));
            }
        }

        return tests;
    }

    printVersion() {
        console.log("TAP version 13");
    }

    printTestPlan() {
        console.log("1.." + this.tests.length);
    }
}

const __walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {

        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? __walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
};

module.exports = ClassyTestRunner;