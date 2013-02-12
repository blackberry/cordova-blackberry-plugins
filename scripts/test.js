/*
 *  Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var wrench = require('wrench'),
    jWorkflow = require('jWorkflow'),
    path = require('path'),
    utils = require('./utils'),
    _c = require('./conf');

module.exports = function (done, custom) {
    var jasmine = require('jasmine-node'),
        verbose = false,
        colored = false,
        specs = path.join(_c.TEMP, (custom ? custom : "test/unit")),
        key,
        test;

    for (key in jasmine) {
        if (Object.prototype.hasOwnProperty.call(jasmine, key)) {
            global[key] = jasmine[key];
        }
    }

    utils.copyFolder(path.join(_c.ROOT, "plugin"), path.join(_c.TEMP, "plugin"));
    utils.copyFolder(path.join(_c.ROOT, "test/lib"), path.join(_c.TEMP, "lib"));
    utils.copyFolder(path.join(_c.ROOT, "test/unit"), path.join(_c.TEMP, "test/unit"));

    test = jWorkflow.order();
    test.start(function (code) {
        jasmine.executeSpecsInFolder(specs, function (runner, log) {
            wrench.rmdirSyncRecursive(_c.TEMP, true);
            var failed = runner.results().failedCount === 0 ? 0 : 1;
            setTimeout(function () {
                (typeof done !== "function" ? process.exit : done)(failed);
            }, 10);

        }, verbose, colored);
    });
};
