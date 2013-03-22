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
    utils = require('./utils'),
    conf = require(path.join(__dirname, "conf")),
    baseDir = path.join(__dirname, '/../'),
    cordovaDir = conf.CORDOVA_BB10_REPOS.dir;

module.exports = {
    setupRepo: function (branch, done) {
        var clone = util.format("git clone %s %s", conf.CORDOVA_BB10_REPOS.url, cordovaDir),
            checkout = util.format("git checkout %s", branch ? branch : 'master'),
            npmInstall = "npm install";
        // Delete existing cordova repos folder
        if (fs.existsSync(cordovaDir)) {
            wrench.rmdirSyncRecursive(cordovaDir);
        }
        jWorkflow.order(utils.execCommandWithJWorkflow(clone, {cwd: baseDir}))
            .andThen(utils.execCommandWithJWorkflow(checkout, {cwd: cordovaDir}))
            .andThen(utils.execCommandWithJWorkflow(npmInstall, {cwd: path.join(cordovaDir, "blackberry10")}))
            .start(function () {
                done();
            });
    },

    createProject: function (projectPath, name, done) {
        var create = util.format("./bin/create %s %s", projectPath, name);

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
        var cmd = "./cordova/target add %s %s %s";
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
            console.log("Invalide parameters, run jake -T to get the usage");
            process.exit(-1);
        }
    },

    replaceWWW: function (projectPath, src, done) {
        jWorkflow.order(function () {
                wrench.rmdirSyncRecursive(path.join(projectPath, "www"), true);
            })
            .andThen(function () {
                wrench.copyDirSyncRecursive(src, path.join(projectPath, "www"));
            })
            .start(function () {
                if (done) {
                    done();
                }
            });
    },

    buildProject: function (projectPath, done) {
        var cmd = "./cordova/build";

        jWorkflow.order(utils.execCommandWithJWorkflow(cmd, {cwd: projectPath}))
            .start(function () {
                if (done) {
                    done();
                }
            });
    },

    addPlugins: function (projectPath, plugins, done) {
        var pluginsPath = path.join(baseDir, 'plugin'),
            plug,
            addPlugin = "cordova/plugin add %s",
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

    // TODO: To be removed later
    copyExtensions: function (projectPath, done) {
        var extPath = path.join(baseDir, 'plugin'),
            extDest = path.join(projectPath, 'plugin');

        if (fs.existsSync(extPath)) {
            //Iterate over extensions directory
            fs.readdirSync(extPath).forEach(function (extension) {
                var apiDir = path.normalize(path.resolve(extPath, extension)),
                    apiDirDeviceSO = path.normalize(path.join(apiDir, 'src', 'blackberry10', 'native', 'arm', 'so.le-v7')),
                    apiDirSimulatorSO = path.normalize(path.join(apiDir, 'src', 'blackberry10', 'native', 'x86', 'so')),
                    apiDest = path.join(extDest, extension),
                    extensionStats = fs.lstatSync(apiDir),
                    soDest,
                    soFiles;

                //In case there is a file in the ext directory
                //check that we are dealing with a real extenion first
                if (extensionStats.isDirectory()) {
                    //find all .js files or .json files
                    [{ base: apiDir, sub: "src/blackberry10" }, { base: apiDir, sub: "www"}].forEach(function (target) {
                        if (!fs.existsSync(path.join(target.base, target.sub))) {
                            return;
                        }
                        jsFiles = utils.listFiles(path.join(target.base, target.sub), function (file) {
                            var extName = path.extname(file);
                            return extName === ".js" || extName === ".json";
                        });

                        //Copy each .js file to its extensions folder
                        jsFiles.forEach(function (jsFile) {
                            utils.copyFile(jsFile, path.join(apiDest, target.sub), path.join(target.base, target.sub));
                        });

                        if (fs.existsSync(apiDest)) {
                            // Copy the .so file for this extension
                            [{ src: apiDirDeviceSO, dst: "device" }, { src: apiDirSimulatorSO, dst: "simulator"}].forEach(function (target) {
                                var nativeDir = path.join(apiDest, 'src', 'blackberry10', 'native');
                                if (!fs.existsSync(nativeDir)) {
                                    fs.mkdirSync(nativeDir);
                                }
                                if (fs.existsSync(target.src)) {
                                    soDest = path.join(nativeDir, target.dst);
                                    if (!fs.existsSync(soDest)) {
                                        fs.mkdirSync(soDest);
                                    }

                                    soFiles = utils.listFiles(target.src, function (file) {
                                        return path.extname(file) === ".so";
                                    });

                                    soFiles.forEach(function (soFile) {
                                        utils.copyFile(soFile, soDest);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        if (done) {
            done();
        }
    },

    removeProject: function (projectPath, done) {
        wrench.rmdirSyncRecursive(projectPath, true);

        if (done) {
            done();
        }
    }
};
