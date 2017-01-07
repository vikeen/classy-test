"use strict";

const SimpleComponent = require("./simple"),
    classyTest = require("../index.js"),
    assert = require("chai").assert;

class SimpleComponentSumTestCase extends classyTest.BaseTestCase {
    constructor() {
        super();
    }

    testSum() {
        assert.equal(new SimpleComponent([1, 2, 3, 4]).sum(), 10);
    }

    testSort() {
        assert.deepEqual(new SimpleComponent([4, 1, 5, 2, 3]).sort(), [1, 2, 3, 4, 5]);
    }
}

module.exports = {
    TestCases: [
        SimpleComponentSumTestCase
    ]
};