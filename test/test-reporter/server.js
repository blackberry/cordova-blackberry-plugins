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

var port = process.argv[2] || 3000,
    timeout = process.argv[3] || 5 * 60 * 60 * 1000, // set timeout to 5Hrs
    util = require("util"),
    http = require('http'), 
    url = require('url'),
    path = require("path"),
    qs = require('querystring'),
    fs = require('fs'),
    wrench = require('wrench'),
    baseDir = path.join(__dirname, "../.."),
    utils = require(path.join(baseDir, 'scripts/utils')),
    reportGenerator = require(path.join(__dirname, 'ReportGenerator')),
    testReportDir = process.argv[4] || path.join(__dirname, 'report'),
    tmplReportDir = path.join(__dirname, 'template'),
    testDetails = path.join(testReportDir, 'details', 'TestDetails.html'),
    testAppDir = path.join(baseDir, 'test/test-app'),
    reportInJSONPath = path.join(testReportDir, 'Report.json'),
    reportInXMLPath = path.join(testReportDir, 'Report.xml'),
    reportInHTMLPath = path.join(testReportDir, 'Report.html');

http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri),
        data = "",
        report = {};

    console.log('filename: ', filename);
    if (uri === '/runAutoTest') {
        console.log("start auto test");
        response.end('Successful', 'utf-8');
    }

    if (request.method === 'POST' && uri === '/report') {
        request.on("data", function (chunk) {
            data += chunk;
        }); 

        request.on("end", function () {
            // Create report folder
            if (!fs.existsSync(path.join(testReportDir,  'details'))) {
                wrench.mkdirSyncRecursive(path.join(testReportDir,  'details'), "0755");
            }
            // Copy jasmin js and css to testReport folder
            wrench.copyDirSyncRecursive(path.join(testAppDir, 'js'), path.join(testReportDir, 'js'));
            wrench.copyDirSyncRecursive(path.join(testAppDir, 'css'), path.join(testReportDir, 'css'));
            utils.copyFile(path.join(__dirname, 'template', 'js/report.js'), path.join(testReportDir, 'js'));
            utils.copyFile(path.join(__dirname, 'template', 'css/styles.css'), path.join(testReportDir, 'css'));

            report = JSON.parse(data);
            fs.writeFileSync(testDetails, report.details, "utf8");
            delete report.details;
            console.log("Testing Result: \n", JSON.stringify(report));
            reportGenerator.generateReport(report);
            reportGenerator.generateBriefReport(report);
            fs.writeFileSync(reportInJSONPath, JSON.stringify(report), "utf8");
            response.end();
            if (report.suiteCount.failed !== 0) {
                console.log('There are some test failed');
                process.exit(1);
            } else {
                console.log('Shutting down report server');
                process.exit(0);
            }
        });
    }
}).listen(port);
 
console.log('Testing report server running at http://127.0.0.1:' + port + '/');
console.log('Waiting for testing result...');

// wait 60*60 seconds
setTimeout(function () {
    console.log('Time Out: No any testing report returned, stop waiting...');
    process.exit(1);
}, timeout);
