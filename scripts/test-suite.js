/*
 *  Copyright 2012 Research In Motion Limited.
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

module.exports = function (branch, targetName, targetIP, targetType, targetPwd) {
    var jasmine = require('jasmine-node'),
        jWorkflow = require('jWorkflow'),
        path = require('path'),
        fs = require('fs'),
        projectUtils = require('./project-utils'),
        utils = require('./utils'),
        conf = require('./conf'),
        verbose = false,
        colored = false,
        baseDir = path.join(__dirname, '/../'),
        specs = path.join(baseDir, 'test', 'test-suite', 'test'),
        projectPath = conf.TEST_SUITE_APP,
        key,
        done,
        preservingProject = false,
        projectFileBackuped = path.join(projectPath, '..', 'project.json'),
        projectFile = path.join(projectPath, 'project.json');

    for (key in jasmine) {
        if (Object.prototype.hasOwnProperty.call(jasmine, key)) {
            global[key] = jasmine[key];
        }
    }

    if (!targetIP && !targetType && !targetPwd && 
        fs.existsSync(path.join(projectPath, 'project.json'))) {
        preservingProject = true;
    }

    jWorkflow.order()
        .andThen(function (prev, baton) {
            done = function () {
                baton.pass();
            };
            baton.take();
            projectUtils.setupRepo(branch, done);
        })
        .andThen(function (prev, baton) {
            baton.take();
            if (preservingProject) {
                utils.copyFile(projectFile, path.join(projectPath, '..'));
            }
            projectUtils.createProject(projectPath, 'testsuite', function () {
                if (preservingProject && fs.existsSync(projectFileBackuped)) {
                    utils.copyFile(projectFileBackuped, projectPath);
                }
                baton.pass();
            });
        })
        .andThen(function (prev, baton) {
            baton.take();
            if (!preservingProject) {
                projectUtils.configProject(projectPath, targetName, targetIP, targetType, targetPwd, done);
            } else {
                baton.pass();
            }
        })
        .andThen(function (prev, baton) {
            var plugins = [
                "com.blackberry.app",
                "com.blackberry.bbm.platform",
                "com.blackberry.connection",
                "com.blackberry.event",
                "com.blackberry.identity",
                "com.blackberry.invoke",
                "com.blackberry.invoke.card",
                "com.blackberry.invoked",
                "com.blackberry.io",
                "com.blackberry.io.filetransfer",
                "com.blackberry.jpps",
                "com.blackberry.notification",
                "com.blackberry.payment",
                "com.blackberry.pim.calendar",
                "com.blackberry.pim.contacts",
                "com.blackberry.push",
                "com.blackberry.sensors",
                "com.blackberry.system",
                "com.blackberry.ui.contextmenu",
                "com.blackberry.ui.cover",
                "com.blackberry.ui.dialog",
                "com.blackberry.ui.toast",
                "com.blackberry.utils"
            ];
            baton.take();
            projectUtils.addPlugins(projectPath, plugins, function () {
                baton.pass();
            });
        })
        .andThen(function (prev, baton) {
            baton.take();
            jasmine.executeSpecsInFolder(specs, function (runner, log) {
                var failed = runner.results().failedCount === 0 ? 0 : 1;
                setTimeout(done, 10);
            }, verbose, colored);
        })
        .start();
};
