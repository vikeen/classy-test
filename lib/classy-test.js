"use strict";

const logger = require("./helpers/logger")(),
    path = require("path"),
    fs = require("fs");

class ClassyTestRunner {
    constructor(directories = ["test"], extension = ".test.js") {
        this.files = [];
        this.results = [];

        if (!Array.isArray(directories)) {
            directories = [directories];
        }

        directories.forEach(directory => {
            directory = path.normalize(path.join(process.cwd(), directory));

            const allFiles = walkSync(directory),
                testFiles = allFiles.filter(file => file.endsWith(extension));

            this.files = this.files.concat(testFiles);
        });

        logger.debug(`- ${this.files.length} files found -`);

        this.files.forEach(file => {
            logger.debug(file);
        });
    }

    run() {
        console.time("time taken");
        this.testFiles();
        this.report();
        console.timeEnd("time taken");

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


    testFiles() {
        this.files.forEach(file => {
            this.testFile(file);
        });
    }

    testFile(filePath) {
        logger.debug(`testing file - ${filePath}`);
        let TestCases = require(filePath);

        logger.debug(`found ${TestCases.length} test case(s)`);

        TestCases.forEach(TestCase => {
            const testCase = new TestCase();
            logger.debug(`running test case [${testCase.__name}]`);
            testCase.__run();
            this.results = this.results.concat(testCase.__results);
        });
    }

    report() {
        this.failedTests.forEach(failedTest => {
            logger.error(`Test Case Failed (${failedTest.testCaseName}:${failedTest.testName})`);
            logger.error(failedTest.error);
        });

        logger.info("================================");
        logger.info(`pass: ${this.passedTests.length} -- fail: ${this.failedTests.length}`);
        logger.info("================================");
    }
}

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {

        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
};

module.exports = ClassyTestRunner;