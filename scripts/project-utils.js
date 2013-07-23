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

var path = require('path'),
    jWorkflow = require('jWorkflow'),
    childProcess = require('child_process'),
    fs = require('fs'),
    wrench = require('wrench'),
    util = require('util'),
    ncp = require('ncp').ncp,
    shell = require("shelljs"),
    utils = require('./utils'),
    conf = require(path.join(__dirname, "conf")),
    baseDir = path.join(__dirname, '/../'),
    cordovaDir = conf.CORDOVA_BB10_REPOS.dir,
    mobileSpecDir = conf.MOBILE_SPEC_REPOS.dir,
    mobileSpecURL = conf.MOBILE_SPEC_REPOS.url;

module.exports = {
    setupRepo: function (branch, done) {
        var workflow = jWorkflow.order(),
            clone = util.format("git clone %s %s", conf.CORDOVA_BB10_REPOS.url, cordovaDir),
            checkout = util.format("git checkout %s", branch ? branch : 'origin/master'),
            fetchAll = "git fetch --all --prune",
            npmInstall = "npm install";
        // fetch all if cordova repos folder exists
        if (fs.existsSync(cordovaDir)) {
            workflow.andThen(utils.execCommandWithJWorkflow(fetchAll, {cwd: cordovaDir}));
        } else {
            workflow.andThen(utils.execCommandWithJWorkflow(clone, {cwd: baseDir}));
        }
        workflow.andThen(utils.execCommandWithJWorkflow(checkout, {cwd: cordovaDir}))
        .andThen(utils.execCommandWithJWorkflow(npmInstall, {cwd: path.join(cordovaDir, "blackberry10")}))
        .start(function () {
            done();
        });
    },

    setupMobileSpecRepo: function (branch, done) {
        var workflow = jWorkflow.order(),
            clone = util.format("git clone %s %s", mobileSpecURL, mobileSpecDir),
            checkout = util.format("git checkout %s", branch ? branch : 'origin/master'),
            fetchAll = "git fetch --all --prune";

        // fetch all if the repos exists 
        if (fs.existsSync(mobileSpecDir)) {
            workflow.andThen(utils.execCommandWithJWorkflow(fetchAll, {cwd: cordovaDir}));
        } else {
            workflow.andThen(utils.execCommandWithJWorkflow(clone, {cwd: baseDir}));
        }
        workflow.andThen(utils.execCommandWithJWorkflow(checkout, {cwd: mobileSpecDir}))
        .start(function () {
            done();
        });
    },

    createProject: function (projectPath, name, done) {
        var create = util.format(path.join("bin", "create") + " %s %s %s", projectPath, name, name);

        // Delete existing project folder
        if (fs.existsSync(projectPath)) {
            wrench.rmdirSyncRecursive(projectPath);
        }

        jWorkflow.order(utils.execCommandWithJWorkflow(create, {cwd: path.join(cordovaDir, "blackberry10")}))
        .start(function () {
            if (done) {
                done();
            }
        });
    },

    configProject: function (projectPath, targetName, targetIP, targetType, targetPassword, done) {
        var cmd = path.join('cordova', 'target') + " add %s %s %s";
        // No validation for targetName, type, ip, password here, target command will
        // take care the validation
        if (targetName && targetType && targetIP) {
            cmd = util.format(cmd, targetName, targetIP, targetType);
            if (targetPassword) {
                cmd = cmd.concat(" --password ").concat(targetPassword);
            }
            jWorkflow.order(utils.execCommandWithJWorkflow(cmd, {cwd: projectPath}))
                .start(function () {
                    if (done) {
                        done();
                    }
                });
        } else {
            console.log("Invalid parameters, run jake -T to get the usage");
            process.exit(-1);
        }
    },

    replaceWWW: function (projectPath, src, done) {
        jWorkflow.order(function () {
            wrench.rmdirSyncRecursive(path.join(projectPath, "www"), true);
        })
        .andThen(function () {
            wrench.copyDirSyncRecursive(src, path.join(projectPath, "www/"));
        })
        .start(function () {
            if (done) {
                done();
            }
        });
    },

    copyMobileSpec: function (projectPath, src, done) {
        jWorkflow.order()
        .andThen(function (prev, baton) {
            baton.take();
            shell.mkdir('-p', path.join(projectPath, 'www'));
            shell.exec("cd " + src + "&& git archive HEAD | tar -x -C " + path.join(projectPath, "www"));
            shell.cp("-rf", path.join(projectPath, "..", "src", "plugin.xml"), path.join(projectPath, "www", "dependencies-plugin"));
            shell.cp("-rf", path.join(projectPath, "..", "src", "config.xml"), path.join(projectPath, "www"));
            shell.exec("cd " + projectPath + " && " + "cordova/plugin add " + path.join("www", "dependencies-plugin"));
            console.log("Copy Mobile Spec Finished");
            baton.pass();
        })
        .start(function () {
            if (done) {
                done();
            }
        });
    },

    buildProject: function (projectPath, done) {
        var cmd = path.join('cordova', 'run');

        jWorkflow.order(utils.execCommandWithJWorkflow(cmd, {cwd: projectPath}))
        .start(function () {
            if (done) {
                done();
            }
        });
    },

    addPlugins: function (projectPath, plugins, done) {
        var pluginsPath = path.join(baseDir, 'plugin'),
            addPlugin = path.join("cordova", "plugin") + " add %s",
            task = jWorkflow.order();

        plugins.forEach(function (plugin) {
            var cmd = util.format(addPlugin, path.join(pluginsPath, plugin));
            task.andThen(utils.execCommandWithJWorkflow(cmd, {cwd: projectPath}));
        });
        task.start(function () {
            if (done) {
                done();
            }
        });
    },

    removeProject: function (projectPath, done) {
        wrench.rmdirSyncRecursive(projectPath, true);

        if (done) {
            done();
        }
    }
};
