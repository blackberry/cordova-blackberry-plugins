/*
* Copyright 2011 Research In Motion Limited.
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
var wrench = require("wrench"),
    jWorkflow = require('jWorkflow'),
    utils = require("./utils"),
    _c = require("./conf"),
    fs = require("fs"),
    path = require("path");

function copyExtensions(extPath) {
    if (fs.existsSync(extPath)) {
        //Iterate over extensions directory
        fs.readdirSync(extPath).forEach(function (extension) {
            var apiDir = path.normalize(path.resolve(extPath, extension)),
                apiDirDeviceSO = path.normalize(path.join(apiDir, 'src', 'blackberry10', 'native', 'arm', 'so.le-v7')),
                apiDirSimulatorSO = path.normalize(path.join(apiDir, 'src', 'blackberry10', 'native', 'x86', 'so')),
                apiDest = path.join(extPath, extension, 'src', 'blackberry10', 'native'),
                extensionStats = fs.lstatSync(apiDir),
                soDest,
                soFiles;

            //In case there is a file in the ext directory
            //check that we are dealing with a real extenion first
            if (extensionStats.isDirectory()) {
                if (fs.existsSync(apiDest)) {
                    // Copy the .so file for this extension
                    [{ src: apiDirDeviceSO, dst: "device" }, { src: apiDirSimulatorSO, dst: "simulator"}].forEach(function (target) {
                        if (fs.existsSync(target.src)) {
                            soDest = path.join(apiDest, target.dst);
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
            }
        });
    }
}

module.exports = function (done) {
    var cmd = 'make JLEVEL=4',
        buildTask = jWorkflow.order();

    buildTask.andThen(utils.execCommandWithJWorkflow(cmd, {}, true))
        .start(function (error) {
            copyExtensions(path.join(_c.ROOT, "plugin"));
            if (error) {
                utils.displayOutput("build FAILED");
                process.exit(1);
            } else {
                utils.displayOutput("build SUCCESS");
                if (done) {
                    done();
                }
            }
        });
};


