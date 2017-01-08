"use strict";

const BaseTestCase = require("../lib/base_test_case"),
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

    testThatCanError() {
        assert.equal(this.salary, 10000);
    }

    giveRaise() {
        this.salary = this.salary + (this.salary * .10);
    }
}

class BaseProxyTestCase extends BaseTestCase {
    constructor() {
        super();
    }

    setup() {
        this.emplyeeTestCase = new EmployeeTestCase("Brenda Yukon", "C2FO");
        this.personTestCase = new PersonTestCase("Bob Yukon");

        sinon.spy(this.emplyeeTestCase, "setup");
        sinon.spy(this.emplyeeTestCase, "teardown");
        sinon.spy(this.personTestCase, "setup");
        sinon.spy(this.personTestCase, "teardown");
    }

    teardown() {
        this.emplyeeTestCase.setup.restore();
        this.emplyeeTestCase.teardown.restore();
        this.personTestCase.setup.restore();
        this.personTestCase.teardown.restore();
    }

    testName() {
        assert.equal(this.personTestCase.__name, 'PersonTestCase');
        assert.equal(this.emplyeeTestCase.__name, 'EmployeeTestCase');
    }

    testFindingAllTests() {
        const employeeTests = [...this.emplyeeTestCase.__tests],
            personTests = [...this.personTestCase.__tests];

        assert.deepEqual(employeeTests, ['testCompany', 'testThatCanError', 'testName']);
        assert.deepEqual(personTests, ['testName']);
    }

    testRun() {
        this.emplyeeTestCase.__run();
        this.personTestCase.__run();

        assert.isTrue(this.emplyeeTestCase.__results[0].isPassedStatus);
        assert.isTrue(this.emplyeeTestCase.__results[1].isPassedStatus);
        assert.isTrue(this.personTestCase.__results[0].isPassedStatus);
    }

    testRunWithError() {
        // giving the employee a raise is somehow an error. Tough world
        this.emplyeeTestCase.giveRaise();

        this.emplyeeTestCase.__run();
        this.personTestCase.__run();

        assert.isTrue(this.emplyeeTestCase.__results[0].isPassedStatus);
        assert.isTrue(this.emplyeeTestCase.__results[1].isFailedStatus);
        assert.isTrue(this.emplyeeTestCase.__results[2].isPassedStatus);
        assert.isTrue(this.personTestCase.__results[0].isPassedStatus);
    }

    testSetup() {
        this.emplyeeTestCase.__run();
        this.personTestCase.__run();

        assert.equal(this.emplyeeTestCase.setup.callCount, 3);
        assert.equal(this.personTestCase.setup.callCount, 1);
    }

    testTeardown() {
        this.emplyeeTestCase.__run();
        this.personTestCase.__run();

        assert.equal(this.emplyeeTestCase.teardown.callCount, 3);
        assert.equal(this.personTestCase.teardown.callCount, 1);
    }
}

module.exports = [BaseProxyTestCase];