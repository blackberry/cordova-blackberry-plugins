/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

var wrench = require('wrench'),
    jWorkflow = require('jWorkflow'),
    path = require('path'),
    utils = require('./utils'),
    _c = require('./conf');

module.exports = function (done, id) {
    var jasmine = require('jasmine-node'),
        verbose = false,
        colored = false,
        specs = path.join(_c.TEMP, "test/unit/" + id),
        key,
        test;

    for (key in jasmine) {
        if (Object.prototype.hasOwnProperty.call(jasmine, key)) {
            global[key] = jasmine[key];
        }
    }

    /*
        Folder structure in temp:

        temp/
            lib/
            plugin/
                blackberry.app/
                    index.js
                    www
                        client.js
                blackberry.event/
                    index.js
                    www
                        client.js
    */

    console.log("Test for: " + id);
    // index.js
    utils.copyFolder(path.join(_c.ROOT, "plugin", id, "src/blackberry10"), path.join(_c.TEMP, "plugin", id));

    // lib
    utils.copyFolder(path.join(_c.ROOT, "test/lib"), path.join(_c.TEMP, "lib"));

    // client.js
    utils.copyFolder(path.join(_c.ROOT, "plugin", id, "www"), path.join(_c.TEMP, "plugin", id, "www"));

    // copy .js files in src/blackberry10, since they are required by .js files in www
    if (id.indexOf("pim") !== -1) {
        utils.copyFolder(path.join(_c.ROOT, "plugin", id, "src/blackberry10"), path.join(_c.TEMP, "plugin", id, "www"), {preserve: true, preserveFiles: true});
    }

    // test files
    utils.copyFolder(path.join(_c.ROOT, "test/unit"), path.join(_c.TEMP, "test/unit"));

    test = jWorkflow.order();
    test.start(function (code) {
        console.log("-------------------");
        console.log("Unit Tests: ");
        jasmine.executeSpecsInFolder(specs, function (runner, log) {
            wrench.rmdirSyncRecursive(_c.TEMP, true);
            var failed = runner.results().failedCount === 0 ? 0 : 1;
            setTimeout(function () {
                (typeof done !== "function" ? process.exit : done)(failed);
            }, 10);

        }, verbose, colored);
    });
};
