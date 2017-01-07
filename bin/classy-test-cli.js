#!/usr/bin/env node

"use strict";

const ClassyTestRunner = require("../lib/classy-test"),
    argv = require('yargs')
        .usage('$0 -d [directory]')
        .alias('h', 'help')
        .alias('d', 'directory')
        .demandOption('d')
        .help()
        .argv;

const classyTestRunner = new ClassyTestRunner(argv.d);
classyTestRunner.run();