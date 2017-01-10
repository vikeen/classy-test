"use strict";

const logger = require("./helpers/logger")(),
    decamelize = require('decamelize'),
    path = require("path"),
    fs = require("fs"),
    tap = require('tap'),
    TEST_NAME_KEY_WORD = "test";

class ClassyTestRunner {
    constructor(directories = ["test"], extension = ".test.js", disableLogging = false) {
        this.TestCases = [];
        this.tests = [];
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
        tap.plan(this.tests.length);
        this.runTestCases();
        tap.end();
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

        let message = decamelize(testName, " ");

        try {
            testCase[testName]();
            tap.pass(message);
        } catch (error) {
            tap.fail(message);
        }

        testCase.teardown();
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