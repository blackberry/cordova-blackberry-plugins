/*
 * Copyright 2013 Research In Motion Limited.
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
    path = require("path"),
    wrench = require("wrench"),
    fs = require("fs"),
    ncp = require("ncp").ncp,
    baseDir = path.join(__dirname, "/../"),
    utils = require(path.join(__dirname, "utils")),
    prjUtils = require(path.join(__dirname, "project-utils")),
    conf = require(path.join(__dirname, "conf")),
    projectPath = path.join(baseDir, "test", "mobile-spec/app"),
    projectName = "CordovaMobileSpec";

module.exports = function (branch, targetName, targetIP, targetType, targetPassword, mobileSpecBranch, storepass) {
    var tasks = jWorkflow.order(),
        shouldAddTarget = targetName && targetIP && targetPassword,
        projectFileBackuped = path.join(projectPath, '..', 'project.json'),
        projectFile = path.join(projectPath, 'project.json');

    if (!fs.existsSync(projectPath)) {
        wrench.mkdirSyncRecursive(projectPath, "0755");
    }

    tasks.andThen(function (prev, baton) {
            baton.take();
            prjUtils.setupRepo(branch ? branch : 'origin/master', function () {
                baton.pass();
            });
        })
    .andThen(function (prev, baton) {
        baton.take();
        prjUtils.setupMobileSpecRepo(mobileSpecBranch ? mobileSpecBranch : 'origin/master', function () {
            baton.pass();
        });
    })
    .andThen(function (prev, baton) {
        baton.take();
        prjUtils.createProject(projectPath, projectName, function () {
            baton.pass();
        });
    })
    .andThen(function (prev, baton) {
        baton.take();
        if (shouldAddTarget) {
            prjUtils.configProject(projectPath, targetName, targetIP, targetType, targetPassword, function () {
                baton.pass();
            });
        } else {
            baton.pass();
        }
    })
    .andThen(function (prev, baton) {
        baton.take();
        prjUtils.copyMobileSpec(projectPath, conf.MOBILE_SPEC_REPOS.dir, function () {
            baton.pass();
        });
    })
    .andThen(function (prev, baton) {
        baton.take();
        prjUtils.runProject(projectPath, targetName, function () {
            baton.pass();
        }, storepass);
    })
    .start(function (err) {
        if (!err) {
            console.log("Mobile Spec Deployed Successfully!!!");
        } else {
            console.log("Everything is bad and you should feel bad");
        }
    });
};
