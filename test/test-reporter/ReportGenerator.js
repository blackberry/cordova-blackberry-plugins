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

var ReportGenerator = {},
    fs = require('fs'),
    jsdom = require('jsdom'),
    path = require('path'),
    page_template = fs.readFileSync(path.join(__dirname, 'template/test-report_templ.html'), 'utf-8'),
    brief_template = fs.readFileSync(path.join(__dirname, 'template/brief-report_templ.html'), 'utf-8'),
    reportDocument = jsdom.jsdom(page_template),
    briefDocument = jsdom.jsdom(brief_template),
    featureList = [],
    fullReport = path.join(__dirname, 'report/testReport.html'),
    briefReport = path.join(__dirname, 'report/testBrief.html');

function createNewRowForSuite(suite) {
    var reportTable = reportDocument.getElementById('TestReport'),
        suiteRow = reportDocument.createElement('tr'),
        suiteDesc = reportDocument.createElement('th'),
        passedAssertionsInSuite = reportDocument.createElement('td'),
        failedAssertionsInSuite = reportDocument.createElement('td'),
        totalAssertionsInSuite = reportDocument.createElement('td'),
        resultOfSuite = reportDocument.createElement('td'),
        specRow,
        specHeader,
        specDesc,
        passedInSpec,
        failedInSpec,
        totalInSpec,
        resultOfSpec,
        i;

    suiteRow.className = "suite collapsed";
    suiteDesc.setAttribute("colspan", "2");
    suiteDesc.setAttribute("onclick", "expandSpecs(this)");
    suiteDesc.setAttribute('value', suite.description);

    if (suite.specs.length === 0) {
        suiteDesc.innerHTML = "[" + suite.description + "]";    
    } else {
        suiteDesc.innerHTML = suite.description + " +"; 
    }
    
    if (suite.passed) {
        resultOfSuite.innerHTML = "OK";
        suiteRow.className = "suite collapsed";
    } else {
        resultOfSuite.innerHTML = "NG";
        suiteRow.className = "suite collapsed suite-fail";
    }
    passedAssertionsInSuite.innerHTML = suite.assertionCount.passed;
    failedAssertionsInSuite.innerHTML = suite.assertionCount.failed;
    totalAssertionsInSuite.innerHTML = suite.assertionCount.total;
    suiteRow.appendChild(suiteDesc);
    suiteRow.appendChild(passedAssertionsInSuite);
    suiteRow.appendChild(failedAssertionsInSuite);
    suiteRow.appendChild(totalAssertionsInSuite);
    suiteRow.appendChild(resultOfSuite);
    reportTable.appendChild(suiteRow);

    for (i = 0; i < suite.specs.length; ++i) {
        passedInSpec = reportDocument.createElement('td');
        failedInSpec = reportDocument.createElement('td');
        totalInSpec = reportDocument.createElement('td');
        resultOfSpec = reportDocument.createElement('td');

        passedInSpec.className = "spec-assertion-count";
        failedInSpec.className = "spec-assertion-count";
        totalInSpec.className = "spec-assertion-count";
        resultOfSpec.className = "spec-assertion-count";
        specRow = reportDocument.createElement('tr');
        specRow.className = "specs specs-app specs-hide";
        specRow.setAttribute("name", suite.description + ".specs");
        if (i === 0) {
            specHeader = reportDocument.createElement('th');
            specHeader.className = "SpecsHeader";
            specHeader.setAttribute("rowspan", suite.specs.length);
            specHeader.innerHTML = "Specs";
            specRow.appendChild(specHeader);
        }
        specDesc = reportDocument.createElement('th');
        specDesc.innerHTML = suite.specs[i].description;
        passedInSpec.innerHTML = suite.specs[i].assertions.passed;
        failedInSpec.innerHTML = suite.specs[i].assertions.failed;
        totalInSpec.innerHTML = suite.specs[i].assertions.total;
        if (suite.specs[i].passed) {
            resultOfSpec.innerHTML = "OK";
            specRow.className = "specs specs-app specs-hide";
        } else {
            specRow.className = "specs specs-app specs-hide specs-fail";
            resultOfSpec.innerHTML = "NG";
        }
        specRow.appendChild(specDesc);
        specRow.appendChild(passedInSpec);
        specRow.appendChild(failedInSpec);
        specRow.appendChild(totalInSpec);
        specRow.appendChild(resultOfSpec);
        suiteRow.appendChild(specRow);
    }
    reportTable.appendChild(suiteRow);
}

function createNewRowForBrief(suite) {
    var suites = featureList,
        briefReport = briefDocument.getElementById('BriefReport'),
        resultRow,
        suiteCol,
        resultCol,
        i;

    for (i = 0; i < suites.length; ++i) {
        if (suite.description === suites[i]) {
            resultRow = briefDocument.createElement('tr');
            suiteCol = briefDocument.createElement('td');
            resultCol = briefDocument.createElement('td');
            suiteCol.innerHTML = suites[i];
            if (suite.assertionCount.total === 0) {
                resultCol.innerHTML = 'N/A';
            } else {
                if (suite.passed) {
                    resultCol.innerHTML = 'Passed';
                } else {
                    resultCol.innerHTML = 'Failed';
                }
                resultRow.appendChild(suiteCol);
                resultRow.appendChild(resultCol);
                briefReport.appendChild(resultRow);
            }
            if (suite.passed) {
                resultCol.innerHTML = 'Passed';
            } else {
                resultCol.innerHTML = 'Failed';
            }
            resultRow.appendChild(suiteCol);
            resultRow.appendChild(resultCol);
            briefReport.appendChild(resultRow);
        }
    }

}

function generateBriefReport(testResult) {
    var i;
    featureList = testResult.featureList;
    for (i = 0; i < testResult.suites.length; ++i) {
        createNewRowForBrief(testResult.suites[i]);
    }

    fs.writeFileSync(briefReport, briefDocument.documentElement.innerHTML, "utf8");

}

function generateReport(testResult) {
    var i,
        summary,
        testSummary = reportDocument.getElementById('TestSummary'),
        hardwareID = testResult.HardwareID,
        module = hardwareID;

    summary = "<pre>" +
              "Date        : " + testResult.date + "<br>" +
              "OS          : " + testResult.OS + "<br>" + 
              "Hardware ID : " + testResult.HardwareID + '/[' + module + "]<br>" +
              "Suites      : " + "passed[" + testResult.suiteCount.passed + "], failed[" + testResult.suiteCount.failed + "], total[" + testResult.suiteCount.total + "]<br>" +
              "Specs       : " + "passed[" + testResult.specCount.passed + "], failed[" + testResult.specCount.failed + "], total[" + testResult.specCount.total + "]<br>" +
              "Assertions  : " + "passed[" + testResult.assertionCount.passed + "], failed[" + testResult.assertionCount.failed + "], total[" + testResult.assertionCount.total + "]<br>" +
              "<//pre>";
    testSummary.innerHTML = summary;
    
    for (i = 0; i < testResult.suites.length; ++i) {
        createNewRowForSuite(testResult.suites[i]);
    }

    fs.writeFileSync(fullReport, reportDocument.documentElement.innerHTML, "utf8");

}

ReportGenerator.generateReport = generateReport;
ReportGenerator.generateBriefReport = generateBriefReport;

module.exports = ReportGenerator;
