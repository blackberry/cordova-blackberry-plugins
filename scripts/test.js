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
    jWorkflow = require('jWorkflow'),
    path = require('path'),
    _c = require('./conf'),
    testPlugin = require('./test-plugin');

module.exports = function (done, id) {
    var plugins = id ? [id] : fs.readdirSync(path.join(_c.ROOT, "plugin")),
        totalFailed = 0,
        test = function (prev, baton) {
            baton.take();
            if (/blackberry\./.test(this.plugin)) {
                testPlugin(function (failed) {
                    totalFailed += failed;
                    baton.pass();
                }, this.plugin);
            } else {
                baton.pass();
            }
        },
        testWorkflow = function () {
            var order;

            plugins.forEach(function (plugin, idx) {
                if (idx === 0) {
                    order = jWorkflow.order(test, {plugin: plugin});
                } else {
                    order = order.andThen(test, {plugin: plugin});
                }
            });

            return order;
        };


    testWorkflow().start(function () {
        setTimeout(function () {
                (typeof done !== "function" ? process.exit : done)(totalFailed);
            }, 10);
    });
};
