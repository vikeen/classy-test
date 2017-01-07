"use strict";

const Widgets = require("./complex"),
    classyTest = require("../index.js"),
    assert = require("chai").assert;

class BaseWidgetTestCase extends classyTest.BaseTestCase {
    constructor() {
        super();
    }

    testVersion() {
        assert.equal(this.widget.version, "alpha-1");
    }
}

class RedWidgetTestCase extends BaseWidgetTestCase {
    constructor() {
        super();

        this.widget = new Widgets.RedWidget();
    }

    testColor() {
        assert.equal(this.widget.color, "red");
    }

    testParts() {
        assert.equal(this.widget.numParts, 4);
    }
}

class GreenWidgetTestCase extends BaseWidgetTestCase {
    constructor() {
        super();

        this.widget = new Widgets.GreenWidget();
    }

    testColor() {
        assert.equal(this.widget.color, "green");
    }

    testParts() {
        assert.equal(this.widget.numParts, 10);
    }
}

class BlueWidgetTestCase extends BaseWidgetTestCase {
    constructor() {
        super();

        this.widget = new Widgets.BlueWidget();
    }

    testColor() {
        assert.equal(this.widget.color, "blue");
    }

    testParts() {
        assert.equal(this.widget.numParts, 8);
    }
}

module.exports = {
    TestCases: [
        RedWidgetTestCase,
        GreenWidgetTestCase,
        BlueWidgetTestCase
    ]
};