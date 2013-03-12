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
/*jshint -W079 */
var _extDir = __dirname + "/../../../plugin",
    _ID = "blackberry.sensors",
    _apiDir = _extDir + "/" + _ID,
    client,
    module = {
        exports: null
    },
    cordova = {
        define: function (id, val) {
            val(null, null, module);
            client = module.exports;
        },
        require: jasmine.createSpy()
    },
    mockedWebworks = {
        execSync: jasmine.createSpy(),
    };

describe("sensors", function () {
    beforeEach(function () {
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        GLOBAL.cordova = cordova;
        require(_apiDir + "/www/client");
        mockedWebworks.execSync.reset();
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.cordova;
    });

    describe("setOptions", function () {
        it("calls execSync", function () {
            client.setOptions("devicecompass", { delay : 1000 });
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "setOptions", { options : { delay : 1000, sensor : "devicecompass" } });
        });
    });

    describe("supportedSensors", function () {
        it("calls execSync", function () {
            var supportedSensors;
            
            supportedSensors = client.supportedSensors;
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "supportedSensors");
            // make sure it only gets called once
            supportedSensors = client.supportedSensors;
            expect(mockedWebworks.execSync.callCount).toEqual(1);
        });
    });
});
