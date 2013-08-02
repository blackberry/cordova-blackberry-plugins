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
var _apiDir = __dirname + "/../../../plugin/com.blackberry.identity/",
    mockedPluginResult,
    index;

describe("identity index", function () {
    beforeEach(function () {
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        index = null;
    });

    describe("getFields", function () {
        beforeEach(function () {
            GLOBAL.window = {
                wp: {
                    device: {
                    }
                }
            };
            mockedPluginResult = {
                ok: jasmine.createSpy("PluginResult.ok"),
                error: jasmine.createSpy("PluginResult.error"),
                noResult: jasmine.createSpy("PluginResult.noResult"),
                callbackOk: jasmine.createSpy("PluginResult.callbackOk")
            };
            GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);
        });

        afterEach(function () {
            delete GLOBAL.window;
            delete GLOBAL.PluginResult;
        });

        it("can call ok", function () {
            var mockedDevice = {
                devicePin: (new Date()).getTime(),
                IMSI: "310150123456789",
                IMEI: "AA-BBBBBB-CCCCCC-D"
            };

            window.wp.device = mockedDevice;

            index.getFields();

            expect(mockedPluginResult.ok).toHaveBeenCalledWith({
                uuid: mockedDevice.devicePin,
                IMSI: mockedDevice.IMSI,
                IMEI: mockedDevice.IMEI
            }, false);
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });

        it("will call fail when the fields are missing", function () {

            index.getFields();

            expect(mockedPluginResult.ok).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalledWith("Cannot retrieve data from system");
        });


        it("will call fail when an error occurs", function () {
            var errMsg = "Something bad happened";

            Object.defineProperty(window.wp.device, "devicePin", {
                get: function () {
                    throw new Error(errMsg);
                }
            });

            index.getFields();

            expect(mockedPluginResult.ok).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalledWith(errMsg);
        });
    });
});
