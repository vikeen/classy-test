"use strict";

const BaseTestCase = require("../lib/base_test_case"),
    assert = require("chai").assert;

class BaseProxyTestCase extends BaseTestCase {
    constructor() {
        super();
    }

    testName() {
        assert.equal(this.__name, 'BaseProxyTestCase');
    }
    // name
    // setup run
    // teardown run
}

module.exports = [BaseProxyTestCase];