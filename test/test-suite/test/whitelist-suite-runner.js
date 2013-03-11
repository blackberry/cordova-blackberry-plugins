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
var path = require("path"),
    input = path.join(__dirname, "..", "Apps"),
    DeployTest = require('./DeployTest'),
    projectUtils = require('../../../scripts/project-utils'),
    conf = require('../../../scripts/conf'),
    projectPath = conf.TEST_SUITE_APP;

describe("whitelist", function () {
    it("runs the disable websecurity tests", function () {
        runs(function () {
            var reqData = [],
                flag = false,
                dt;
            runs(function () {
                console.log("Project Path: " + projectPath);
                projectUtils.replaceWWW(projectPath, input + '/DisableWebSecurity', function () {
                    dt = new DeployTest(projectPath);
                    dt.listen(function (request) {
                        if (request.status === 'finished') {
                            flag = true;
                        } else {
                            reqData.push(request.data);
                        }
                    });
                    dt.startServer();
                    projectUtils.buildProject(projectPath);
                });
            });
            waitsFor(function () {
                return flag;
            }, "Something", 100000);

            runs(function () {
                flag = false;
                dt.terminate(function () {
                    flag = true;
                });
                waitsFor(function () {
                    return flag;
                });
                runs(function () {
                    reqData.forEach(function (spec) {
                        if (spec.failedCount === 0) {
                            console.log("Success - " + spec.description);
                        } else {
                            console.log("Failed - " + spec.description);
                            spec.items.forEach(function (item) {
                                if (!item.passed_) {
                                    console.log(item.message);
                                    if (item.trace && item.trace.stack) {
                                        console.log(item.trace.stack);
                                    }
                                }
                            });
                        }
                        console.log("");
                    });
                });
            });
        });

    });

    it("runs the disable websecurity tests", function () {
        runs(function () {
            var reqData = [],
                flag = false,
                dt;
            runs(function () {
                projectUtils.replaceWWW(projectPath, input + '/SubfolderStartupPage', function () {
                    dt = new DeployTest(projectPath);
                    dt.listen(function (request) {
                        if (request.status === 'finished') {
                            flag = true;
                        } else {
                            reqData.push(request.data);
                        }
                    });
                    dt.startServer();
                    projectUtils.buildProject(projectPath);
                });
            });
            waitsFor(function () {
                return flag;
            }, "Something", 100000);

            runs(function () {
                flag = false;
                dt.terminate(function () {
                    flag = true;
                });
                waitsFor(function () {
                    return flag;
                });
                runs(function () {
                    reqData.forEach(function (spec) {
                        if (spec.failedCount === 0) {
                            console.log("Success - " + spec.description);
                        } else {
                            console.log("Failed - " + spec.description);
                            spec.items.forEach(function (item) {
                                if (!item.passed_) {
                                    console.log(item.message);
                                    if (item.trace && item.trace.stack) {
                                        console.log(item.trace.stack);
                                    }
                                }
                            });
                        }
                        console.log("");
                    });
                });
            });
        });
    });
});
