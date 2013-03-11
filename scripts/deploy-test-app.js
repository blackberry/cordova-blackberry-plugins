/*
 * Copyright 2012 Research In Motion Limited.
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

var jWorkflow = require("jWorkflow"),
    childProcess = require("child_process"),
    path = require("path"),
    wrench = require("wrench"),
    fs = require("fs"),
    baseDir = path.join(__dirname, "/../"),
    utils = require(path.join(__dirname, "utils")),
    prjUtils = require(path.join(__dirname, "project-utils")),
    conf = require(path.join(__dirname, "conf")),
    cordovaBB10Dir = path.join(baseDir, "test", conf.CORDOVA_BB10_REPOS.name),
    testAppSrc = path.join(baseDir, "test/test-app/src"),
    testAppPrj = conf.TEST_APP_APP,
    testAppPrjName = "wwTestApp";

module.exports = function (branch, targetName, targetIP, targetType, targetPassword) {
    var deployTest = jWorkflow.order(),
        preservingProject = false,
        projectFileBackuped = path.join(testAppPrj, '..', 'project.json'),
        projectFile = path.join(testAppPrj, 'project.json');

    if (!targetIP && !targetType && !targetPassword && 
        fs.existsSync(path.join(testAppPrj, 'project.json'))) {
        preservingProject = true;
    }

    deployTest = jWorkflow.order();
    deployTest.andThen(function (prev, baton) {
        baton.take();
        prjUtils.setupRepo(branch ? branch : 'master', function () {
            baton.pass();
        });
    })
    .andThen(function (prev, baton) {
        baton.take();
        if (preservingProject) {
            utils.copyFile(projectFile, path.join(testAppPrj, '..'));
        }
        prjUtils.createProject(testAppPrj, testAppPrjName, function () {
            if (preservingProject && fs.existsSync(projectFileBackuped)) {
                utils.copyFile(projectFileBackuped, testAppPrj);
            }
            baton.pass();
        });
    })
    .andThen(function (prev, baton) {
        baton.take();
        if (!preservingProject) {
            prjUtils.configProject(testAppPrj, targetName, targetIP, targetType, targetPassword, function () {
                baton.pass();
            });    
        } else {
            baton.pass();
        }  
    })
    .andThen(function (prev, baton) {
        baton.take();
        prjUtils.replaceWWW(testAppPrj, testAppSrc, function () {
            baton.pass();
        });
    })
    .andThen(function (prev, baton) {
        //Automatic functional tests
        wrench.copyDirSyncRecursive(path.join(baseDir, "test/integration/automatic"), path.join(testAppPrj, "www", "automatic", "spec"));
        //Manual functional tests
        wrench.copyDirSyncRecursive(path.join(baseDir, "test/integration/manual"), path.join(testAppPrj, "www", "manual", "framework", "spec"));
    })
    .andThen(function (prev, baton) {
        baton.take();
        prjUtils.copyExtensions(testAppPrj, function () {
            baton.pass();
        });
    })
    .andThen(function (prev, baton) {
        baton.take();
        prjUtils.buildProject(testAppPrj, function () {
            baton.pass();
        });
    })
    .start(function () {
        console.log("DONE");
    });
    
};
