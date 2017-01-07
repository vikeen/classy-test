"use strict";

class BaseWidget {
    constructor(numParts) {
        this.numParts = numParts;
        this.version = "alpha-1";
    }
}

class RedWidget extends BaseWidget {
    constructor() {
        super(4);
        this.color = "red";
    }
}

class GreenWidget extends BaseWidget {
    constructor() {
        super(10);
        this.color = "green";
    }
}

class BlueWidget extends BaseWidget {
    constructor() {
        super(8);
        this.color = "blue";
    }
}

module.exports = {
    RedWidget: RedWidget,
    BlueWidget: BlueWidget,
    GreenWidget: GreenWidget
};