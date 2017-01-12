"use strict";

const BaseTestCase = require("../../index").BaseTestCase,
    assert = require("chai").assert;

class ExportedTestCase extends BaseTestCase {
    constructor() {
        super();
    }

    testEqual() {
        assert.equal(1, 1);
    }

    testTrue() {
        assert.isTrue(true);
    }
}

module.exports = [
    ExportedTestCase
];