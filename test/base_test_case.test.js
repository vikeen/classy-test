"use strict";

const ClassyTest = require("../lib/classy_test"),
    BaseTestCase = require("../lib/base_test_case"),
    sinon = require("sinon"),
    assert = require("chai").assert;

class PersonTestCase extends BaseTestCase {
    constructor(name) {
        super();
        this.name = name;
    }

    testName() {
        assert.isDefined(this.name);
    }
}

class EmployeeTestCase extends PersonTestCase {
    constructor(name, company) {
        super(name);
        this.company = company;
        this.salary = 10000;
    }

    testCompany() {
        assert.isDefined(this.company);
    }
}

class BaseProxyTestCase extends BaseTestCase {
    constructor() {
        super();
    }

    setup() {
        this.classyTest = new ClassyTest([], null, true);
        this.emplyeeTestCase = new EmployeeTestCase("Brenda Yukon", "C2FO");
        this.personTestCase = new PersonTestCase("Bob Yukon");
    }

    teardown() {
        this.emplyeeTestCase = undefined;
        this.personTestCase = undefined;
    }

    testName() {
        assert.equal(this.personTestCase.__name, 'PersonTestCase');
        assert.equal(this.emplyeeTestCase.__name, 'EmployeeTestCase');
    }

    testFindAllEmployeeTests() {
        this.classyTest.loadTestCase(EmployeeTestCase);
        assert.deepEqual(this.classyTest.tests, ['testCompany', 'testName']);
    }

    testFindAllPersonTests() {
        this.classyTest.loadTestCase(PersonTestCase);
        assert.deepEqual(this.classyTest.tests, ['testName']);
    }
}

module.exports = [BaseProxyTestCase];