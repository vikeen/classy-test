"use strict";

const winston = require('winston');

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: (process.env.NODE_ENV === "development") ? "debug" : "info"
        })
    ]
});