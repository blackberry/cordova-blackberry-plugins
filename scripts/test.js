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

var fs = require('fs'),
    path = require('path'),
    utils = require('./utils'),
    projectUtils = require('./project-utils'),
    _c = require('./conf');

module.exports = function (done, custom) {
    var jasmine = require('jasmine-node'),
        plugins = (custom !==  null && fs.existsSync(custom)) ? [custom] : fs.readdirSync(path.join(_c.ROOT, "plugin")),
        specs = [],
        onComplete = function (runner) {
            // remove temp folder after test finished
            var wrench = require('wrench'),
                totalFailed = 0;
            wrench.rmdirSyncRecursive(path.resolve(_c.TEMP), true);
            totalFailed = runner.results().failedCount;
            (typeof done === "function" ? done : process.exit)(totalFailed);
        };

    //setup cordova-blackberry repos
    projectUtils.setupRepo('master', function () {
        // copy lib to temp folder
        utils.copyFolder(path.join(_c.CORDOVA_BB10_REPOS.dir, "blackberry10/framework/lib"), path.join(_c.TEMP, "lib"));
        // test files
        utils.copyFolder(path.join(_c.ROOT, "test/unit"), path.join(_c.TEMP, "test/unit"));
        // filter out non-plugin files/dirs
        plugins.forEach(function (plugin, index) {
            if (/blackberry\./.test(plugin) && fs.existsSync(path.join(_c.ROOT, "plugin", plugin, "www"))) {
                specs.push(path.join(_c.TEMP, "test/unit/" + plugin));
                // plugin index.js
                utils.copyFolder(path.join(_c.ROOT, "plugin", plugin, "src/blackberry10"), path.join(_c.TEMP, "plugin", plugin));
                // plugin client.js
                utils.copyFolder(path.join(_c.ROOT, "plugin", plugin, "www"), path.join(_c.TEMP, "plugin", plugin, "www"));
                // copy .js files in src/blackberry10, since they are required by .js files in www
                if (plugin.indexOf("pim") !== -1) {
                    utils.copyFolder(path.join(_c.ROOT, "plugin", plugin, "src/blackberry10"), path.join(_c.TEMP, "plugin", plugin, "www"), {preserve: true, preserveFiles: true});
                }
            }
        });

        jasmine.executeSpecsInFolder({
            'specFolders': specs,
            'onComplete': onComplete,
            'isVerbose': false,
            'showColors': true
        });
    });
};
