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
    et = require('elementtree'),
    shell = require("shelljs"),
    baseDir = path.join(__dirname, "/../"),
    utils = require(path.join(__dirname, "utils")),
    prjUtils = require(path.join(__dirname, "project-utils")),
    conf = require(path.join(__dirname, "conf")),
    projectPath = path.join(baseDir, "test", "autorun-mobile-spec/app"),
    projectName = "MobileSpecAutoTest";

function updateMobileSpecProject(couchdbIP) {
    var content = fs.readFileSync(path.join(projectPath, 'www', 'cordova.js'), 'utf-8'),
        version = fs.readFileSync(path.join(projectPath, 'www', 'VERSION'), 'utf-8').replace('\n', ''),
        regex = /VERSION='(.*)'.*$/gm,
        newContent = content.replace(regex.exec(content)[1],  version),
        config_path = path.join(projectPath, 'www', 'config.xml'),
        doc,
        root,
        entry_point = 'autotest/pages/all.html',
        access,
        couchdb = couchdbIP ? couchdbIP : '169.254.0.2',
        whiteList = [
            'http://' + couchdb,
            'http://audio.ibeat.org',
            'http://cordova-filetransfer.jitsu.com',
            'http://whatheaders.com',
            'http://apache.org',
            'https://apache.org',
            'http://www.google.com',
            'httpssss://example.com'
        ],
        tempJasmine,
        tempAll = path.join(projectPath, 'www', 'autotest', 'pages', 'all.html'),
        sha,
        permissions,
        permit;

    // Update version of cordova.js
    console.log("[autorun-mobile-spec]", "Update version of cordova to " + version);
    fs.writeFileSync(path.join(projectPath, 'www', 'cordova.js'), newContent, 'utf-8');

    // update jasmine-htmlreporter
    shell.cp(path.join(projectPath, '..', 'src', 'updater', 'jasmine-jsreporter.js'), path.join(projectPath, 'www'));
    tempJasmine = path.join(projectPath, 'www', 'jasmine-jsreporter.js');
    sha = shell.exec("cd " + path.join(baseDir, "test", "cordova-blackberry") + " && git rev-parse --verify HEAD", {silent: true}).output.split('\n').slice(0, -1);
    if (fs.existsSync(tempJasmine)) {
        fs.writeFileSync(tempJasmine, "var library_sha = '" + sha + "';\n" + fs.readFileSync(tempJasmine, 'utf-8'), 'utf-8');
    }

    // modify start page, access
    doc = new et.ElementTree(et.XML(fs.readFileSync(config_path, 'utf-8')));
    root = doc.getroot();
    root.find('content').attrib.src = entry_point;
    whiteList.forEach(function (server) {
        access = et.SubElement(root, 'access');
        access.set('subdomains', 'true');
        access.set('uri', server);
    });
    permissions = root.find('rim:permissions');
    permit = et.SubElement(permissions, 'rim:permit');
    permit.text = 'run_when_backgrounded';
    fs.writeFileSync(config_path, doc.write({indent: 4}), 'utf-8');

    // replace a few lines under the "all" tests autopage
    fs.writeFileSync(tempAll, fs.readFileSync(tempAll, 'utf-8').replace(/<script type=.text.javascript. src=.\.\..html.TrivialReporter\.js.><.script>/, '<script type="text/javascript" src="../html/TrivialReporter.js"></script><script type="text/javascript" src="../../jasmine-jsreporter.js"></script>'), 'utf-8');
    fs.writeFileSync(tempAll, fs.readFileSync(tempAll, 'utf-8').replace(/jasmine.HtmlReporter.../, 'jasmine.HtmlReporter(); var jr = new jasmine.JSReporter("' + 'http://' + couchdb + ':5984/' + '");'), 'utf-8');
    fs.writeFileSync(tempAll, fs.readFileSync(tempAll, 'utf-8').replace(/addReporter.htmlReporter../, 'addReporter(htmlReporter);jasmineEnv.addReporter(jr);'), 'utf-8');
}

module.exports = function (branch, targetName, targetIP, targetType, targetPassword, mobileSpecBranch, couchdbIP) {
    var tasks = jWorkflow.order(),
        preservingProject = false,
        projectFileBackuped = path.join(projectPath, '..', 'project.json'),
        projectFile = path.join(projectPath, 'project.json');

    if (fs.existsSync(projectPath)) {
        wrench.mkdirSyncRecursive(projectPath, "0755");
    }

    if (!targetIP && !targetType && !targetPassword && 
        fs.existsSync(projectFile)) {
        preservingProject = true;
    }

    tasks.andThen(function (prev, baton) {
            baton.take();
            prjUtils.setupRepo(branch ? branch : 'master', function () {
                baton.pass();
            });
        })
    .andThen(function (prev, baton) {
        baton.take();
        prjUtils.setupMobileSpecRepo(mobileSpecBranch ? mobileSpecBranch : 'master', function () {
            baton.pass();
        });
    })
    .andThen(function (prev, baton) {
        baton.take();
        if (preservingProject) {
            utils.copyFile(projectFile, path.join(projectPath, '..'));
        }
        prjUtils.createProject(projectPath, projectName, function () {
            if (preservingProject && fs.existsSync(projectFileBackuped)) {
                utils.copyFile(projectFileBackuped, projectPath);
            }
            baton.pass();
        });
    })
    .andThen(function (prev, baton) {
        baton.take();
        if (!preservingProject) {
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
        updateMobileSpecProject(couchdbIP);
        console.log("Updated cordova version");
    })
    .andThen(function (prev, baton) {
        baton.take();
        prjUtils.buildProject(projectPath, function () {
            baton.pass();
        });
    })
    .start(function () {
        console.log("DONE");
    });
};
