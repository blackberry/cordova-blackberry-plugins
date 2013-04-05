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
var path = require("path");

module.exports = {
    CORDOVA_BB10_REPOS: {
        "dir": path.normalize(__dirname + "/../test/cordova-blackberry"),
        "url": "https://github.com/blackberry/cordova-blackberry.git"
    },
    MOBILE_SPEC_REPOS: {
        "dir": path.normalize(__dirname + "/../test/cordova-mobile-spec"),
        "url": "https://github.com/apache/cordova-mobile-spec.git"
    },
    ROOT: path.normalize(__dirname + "/../"),
    TEMP: path.normalize(__dirname + "/../temp/"),
    TEST_APP_APP: path.normalize(__dirname + "/../test/test-app/app"),
    TEST_SUITE_APP: path.normalize(__dirname + "/../test/test-suite/app"),
    MOBILE_SPEC_APP: path.normalize(__dirname + "/../test/mobile-spec/app")
};
