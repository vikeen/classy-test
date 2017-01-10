"use strict";

module.exports = class BaseTestCase {
    constructor() {
        this.__name = this.constructor.name;
        return this;
    }

    setup() {
        return this;
    }

    teardown() {
        return this;
    }
};