#!/usr/bin/env node

"use strict";

const winston = require('winston'),
    logger = require("../lib/helpers/logger"),
    debug = process.env.NODE_ENV === 'development',
    path = require("path");

const argv = require('yargs')
    .usage('$0 [files]')
    .alias('h', 'help')
    .help()
    .argv;

const files = argv._;

class ClassyTestRunner {
    constructor(files) {
        this.files = files;
        this.results = [];
    }

    run() {
        console.time("time taken");
        this.testFiles();
        this.report();
        console.timeEnd("time taken");
    }


    testFiles() {
        this.files.forEach(file => {
            const filePath = path.normalize(path.join(process.cwd(), file));
            this.testFile(filePath);
        });
    }

    testFile(filePath) {
        let TestCases = require(filePath).TestCases;

        if (!Array.isArray(TestCases)) {
            TestCases = [TestCases];
        }

        TestCases.forEach(TestCase => {
            const testCase = new TestCase();

            this.results.concat(testCase.__run());
        });
    }

    report() {
        const passedTests = this.results.filter(item => item.status === "pass"),
            failedTests = this.results.filter(item => item.status === "fail");

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
}

new ClassyTestRunner(files).run();