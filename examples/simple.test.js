"use strict";

const SimpleComponent = require("./simple"),
    classyTest = require("../index.js"),
    assert = require("chai").assert;

class SimpleComponentSumTestCase extends classyTest.BaseTestCase {
    constructor() {
        super();
    }

    testSum() {
        this.simpleComponent = new SimpleComponent([1, 2, 3, 4]);
        assert.equal(this.simpleComponent.sum(), 10);
    }

    testSort() {
        this.simpleComponent = new SimpleComponent([4, 1, 5, 2, 3]);
        assert.deepEqual(this.simpleComponent.sort(), [1, 2, 3, 4, 5]);
    }
}

classyTest.run(SimpleComponentSumTestCase);