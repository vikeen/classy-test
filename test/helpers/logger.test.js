"use strict";

const classyTest = require("../../index.js"),
    assert = require("chai").assert;

class LoggerTestCase extends classyTest.BaseTestCase {
    constructor() {
        super();
        this.env = process.env.NODE_ENV;
    }

    teardown() {
        process.env.NODE_ENV = this.env;
    }

    testNormalMode() {
        process.env.NODE_ENV = 'production';
        const logger = require("../../lib/helpers/logger")();
        assert.equal(logger.transports.console.level, 'info');
    }

    testDebugMode() {
        process.env.NODE_ENV = 'development';
        const logger = require("../../lib/helpers/logger")();
        assert.equal(logger.transports.console.level, 'debug');
    }
}

module.exports = [LoggerTestCase];