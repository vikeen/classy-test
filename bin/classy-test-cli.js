#!/usr/bin/env node

"use strict";

const ClassyTestRunner = require("../lib/classy_test"),
    argv = require('yargs')
        .usage('$0 -d [directory]')
        .alias('h', 'help')
        .alias('d', 'directory')
        .default('directory', 'test')
        .help()
        .argv;

const classyTestRunner = new ClassyTestRunner(argv.d);
classyTestRunner.run();