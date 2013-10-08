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
        branch = branch || "origin/master";

        var workflow = jWorkflow.order(),
            clone = util.format("git clone %s %s", conf.CORDOVA_BB10_REPOS.url, cordovaDir),
            checkout = util.format("git checkout %s", branch),
            fetchAll = "git fetch --all --prune",
            npmInstall = "npm install";
        // fetch all if cordova repos folder exists
        if (fs.existsSync(cordovaDir)) {
            workflow.andThen(utils.execCommandWithJWorkflow(fetchAll, {cwd: cordovaDir}, {silent: true}));
        } else {
            workflow.andThen(utils.execCommandWithJWorkflow(clone, {cwd: baseDir}, {silent: true}));
        }
        workflow.andThen(utils.execCommandWithJWorkflow(checkout, {cwd: cordovaDir}))
        .andThen(utils.execCommandWithJWorkflow(npmInstall, {cwd: path.join(cordovaDir, "blackberry10")}, {silent: true, logSilent: true}))
        .start(function () {
            console.log("[STATUS] cordova-blackberry repo setup complete");
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
            workflow.andThen(utils.execCommandWithJWorkflow(fetchAll, {cwd: cordovaDir}, {silent: true}));
        } else {
            workflow.andThen(utils.execCommandWithJWorkflow(clone, {cwd: baseDir}, {silent: true}));
        }
        workflow.andThen(utils.execCommandWithJWorkflow(checkout, {cwd: mobileSpecDir}))
        .start(function () {
            console.log("[STATUS] cordova-mobile-spec repo setup complete");
            done();
        });
    },

    createProject: function (projectPath, name, done) {
        var platformDir = path.join(projectPath, "platforms", "blackberry10"),
            cordovaCreateCmd = util.format(path.join("bin", "create") + " %s %s %s", platformDir, name, name),
            cliCreateCmd = util.format("cordova create %s %s %s", projectPath, name, name),
            platformAddCmd = "cordova platform add blackberry10";

        // Delete existing project folder
        if (fs.existsSync(projectPath)) {
            wrench.rmdirSyncRecursive(projectPath);
        }

        jWorkflow
            .order(utils.execCommandWithJWorkflow(cliCreateCmd))
            .andThen(utils.execCommandWithJWorkflow(platformAddCmd, {cwd: projectPath}))
            .andThen(function (prev, baton) {
                wrench.rmdirSyncRecursive(platformDir);
                baton.pass();
            })
            .andThen(utils.execCommandWithJWorkflow(cordovaCreateCmd, {cwd: path.join(cordovaDir, "blackberry10")}, {silent: true}))
            .start(function () {
                if (done) {
                    done();
                }
            });
    },

    configProject: function (projectPath, targetName, targetIP, targetType, targetPassword, done) {
        var cmd = path.join('platforms', 'blackberry10', 'cordova', 'target') + " add %s %s %s";

        this.getDeviceInfo(targetIP, targetPassword, function (err, deviceInfo) {
            if (!err) {
                if (targetName && targetType && targetIP) {
                    cmd = util.format(cmd, targetName, targetIP, targetType);
                    if (targetPassword) {
                        cmd = cmd.concat(" --password ").concat(targetPassword).concat(" --pin " + deviceInfo.pin);
                    }
                    jWorkflow.order(utils.execCommandWithJWorkflow(cmd, {cwd: projectPath}))
                        .start(function () {
                            if (done) {
                                done();
                            }
                        });
                } else {
                    console.log("Invalid parameters for adding a target so it will be skipped. Please run jake -T to get the usage.");
                    process.exit(-1);
                }
            }

        });
    },

    replaceWWW: function (projectPath, src, done) {
        jWorkflow.order(function () {
            wrench.rmdirSyncRecursive(path.join(projectPath, "www"), true);
        })
        .andThen(function () {
            wrench.copyDirSyncRecursive(src, path.join(projectPath, "www/"));
            shell.cp("-f", path.join(src, "config.xml"), path.join(projectPath, "platforms", "blackberry10", "www", "config.xml"));
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
            console.log("[STATUS] Mobile Spec Assets Copied Successfully");
            shell.exec("cd " + projectPath + " && " + "cordova plugin add " + path.join("www", "dependencies-plugin"));
            console.log("[STATUS] Mobile Spec depenencies added");
            baton.pass();
        })
        .start(function () {
            if (done) {
                done();
            }
        });
    },

    runProject: function (projectPath, target, done, storepass) {
        var cmd = "cordova run",
            args = [];

        args.push(storepass ? "-k " + storepass : "");
        args.push(target ? target : "--device");
        console.log(args[0], args[1]);
        args.forEach(function (arg) {
            cmd = cmd.concat(" ").concat(arg);
        });

        jWorkflow.order(utils.execCommandWithJWorkflow(cmd, {cwd: projectPath}))
        .start(function () {
            if (done) {
                done();
            }
        });
    },

    addPlugins: function (projectPath, plugins, done) {
        var addPlugin = "cordova plugin add %s",
            task = jWorkflow.order();

        plugins.forEach(function (plugin) {
            var cmd = util.format(addPlugin, plugin);
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
    },

    getDeviceInfo: function (ip, password, callback) {
        var cmd = "blackberry-deploy -listDeviceInfo %s -password %s";

        cmd = util.format(cmd, ip, password);
        shell.exec(cmd, {silent: true}, function (code, out) {
            var err,
                result = {},
                name,
                pin;

            if (code != 0) {
                err = "Error: failed to get device information";
            } else {
                name = /modelname::(.*?)(\r?)\n/.exec(out);
                pin = /devicepin::0x(.*?)(\r?)\n/.exec(out);
                if (name && name.length > 0) {
                    result.name = name[1];
                }
                if (pin && pin.length > 0) {
                    result.pin = pin[1];
                }
            }
            callback(err, result);
        });
    }
};
