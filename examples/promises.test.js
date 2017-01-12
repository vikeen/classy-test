"use strict";

const classyTest = require("../index.js"),
    assert = require("chai").assert;

class Invoice {
    // simulate async database interaction
    static getById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id) {
                    resolve({
                        id: 123,
                        amount: 100,
                        currency: "USD"
                    });
                } else {
                    reject(new Error("invoice_not_found"));
                }
            }, 200);
        });
    }
}

// test case for all your project needs
class ProjectBaseTestCase extends classyTest.BaseTestCase {
    constructor() {
        super();
    }

    setup() {
        super.setup();
        return this.bootstrapDatabase();
    }

    teardown() {
        super.teardown();
        return this.teardownDatabase();
    }

    bootstrapDatabase() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500)
        });
    }

    teardownDatabase() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500)
        });
    }
}

// Simple test case extended our base project test case
class InvoiceTestCase extends ProjectBaseTestCase {
    constructor() {
        super();
    }

    testGetById() {
        return Invoice.getById(123).then(invoice => {
            assert.deepEqual(invoice, {
                id: 123,
                amount: 100,
                currency: "USD"
            });
        }).catch(console.error);
    }

    testGetByIdError() {
        return Invoice.getById(null).then(() => {
            assert.isFalse(true, "the underlying promise should have failed. This block should never be run");
        }).catch(error => {
            assert.equal(error.message, "invoice_not_found");
        });
    }
}

module.exports = [InvoiceTestCase];