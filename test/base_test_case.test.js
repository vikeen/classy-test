"use strict";

const BaseTestCase = require("../lib/base_test_case"),
    assert = require("chai").assert;

class Person {
    constructor(name) {
        this.name = name;
    }
}

class Employee extends Person {
    constructor(name, company) {
        super(name);
        this.company = company;
        this.salary = 10000;
    }
}

class PersonTestCase extends BaseTestCase {
    constructor() {
        super();
    }

    setup() {
        super.setup();
        this.person = new Person("Bob Yukon");
    }

    testPerson() {
        assert.equal("Bob Yukon", this.person.name);
    }
}

class EmployeeTestCase extends BaseTestCase {
    constructor() {
        super();
    }

    setup() {
        super.setup();
        this.employee = new Employee("Brenda Yukon", "C2FO");
    }

    testEmployee() {
        assert.equal(this.employee.company, "C2FO");
        assert.equal(this.employee.salary, 10000);
        assert.equal(this.employee.name, "Brenda Yukon");
    }
}

module.exports = [
    PersonTestCase,
    EmployeeTestCase
];