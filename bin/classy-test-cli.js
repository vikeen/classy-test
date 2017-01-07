#!/usr/bin/env node

"use strict";

const ClassyTestRunner = require("./classy-test"),
    argv = require('yargs')
        .usage('$0 [files]')
        .alias('h', 'help')
        .help()
        .argv,
    files = argv._;

new ClassyTestRunner(files).run();