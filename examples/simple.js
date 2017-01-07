"use strict";

class SimpleComponent {
    constructor(numbers) {
        this.numbers = numbers;
    }

    sum() {
        return this.numbers.reduce((a, b) => a + b);
    }

    sort() {
        return this.numbers.sort();
    }
}

module.exports = SimpleComponent;