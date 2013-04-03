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

var utils = require('./scripts/utils'),
	jWorkflow = require('jWorkflow'),
    childProcess = require('child_process'),
    DESC_NEW_LINE = "\n\t\t\t  # ";

desc("runs clean, hint, build and test");
task('default', ['clean', 'hint', 'build', 'test'], function () {});

desc("clean");
task('clean', [], function () {
    var cmd = 'make clean',
        cleanTask = jWorkflow.order();

    cleanTask.andThen(utils.execCommandWithJWorkflow(cmd, {}, true));
    cleanTask.start(function (error) {
        if (error) {
            utils.displayOutput("Clean FAILED");
            process.exit(1);
        } else {
            utils.displayOutput("Clean SUCCESS");
        }
        complete();
    });
}, true);

desc("hint");
task('hint', [], function () {
    require('./scripts/lint')(Array.prototype.slice.call(arguments), complete);
}, true);

desc("build");
task('build', [], function () {
    var build = jWorkflow.order(function (prev, baton) {
            baton.take();
            require('./scripts/build')(function () {
                baton.pass();
            });
        }).start(function () {
            complete();
        });
}, true);

desc("run unit tests in node - jake test [pluginId]");
task('test', [], function () {
    require('./scripts/test')(null, process.argv.length >= 4 ? process.argv[3] : null);
}, true);

desc("deploy and run test app on device/simulator" + DESC_NEW_LINE +
    "Usage: jake deploy-test-app['branch','targetname','ip','targettype','password']" + DESC_NEW_LINE +
    "Example: jake deploy-test-app['nextBB10','mybb10','169.254.0.1','device','password']");
task('deploy-test-app', ['build'], require('./scripts/test-app'), true);

desc("run test suite in node - jake deploy-test-suite[branch,targetname,ip,targettype,password]");
task('deploy-test-suite', [], require('./scripts/test-suite'));

desc("deploy and run cordova-mobile-spec on device/simulator");
task('deploy-mobile-spec', [], require('./scripts/mobile-spec'));
