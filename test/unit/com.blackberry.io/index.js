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
var _apiDir = __dirname + "/../../../plugin/com.blackberry.io/",
    _libDir = __dirname + "/../../../lib/",
    index,
    utils = require(_libDir + "/utils"),
    mockedWebview = {
        setSandbox: jasmine.createSpy("setSandbox"),
        getSandbox: jasmine.createSpy("getSandbox").andReturn("0")
    },
    mockedApplication = {
        getEnv: jasmine.createSpy("getEnv").andReturn("/home")
    },
    mockedPluginResult = {
        ok: jasmine.createSpy("PluginResult.ok"),
        error: jasmine.createSpy("PluginResult.error"),
        noResult: jasmine.createSpy("PluginResult.noResult"),
        callbackOk: jasmine.createSpy("PluginResult.callbackOk")
    },
    mockedQnx;

describe("blackberry.io index", function () {
    beforeEach(function () {
        mockedQnx = {
            webplatform: {
                getApplication: function () {
                    return mockedApplication;
                }
            }
        };
        GLOBAL.window = {
            qnx: mockedQnx
        };
        GLOBAL.qnx = mockedQnx;
        index = require(_apiDir + "/index");
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.qnx;
        delete require.cache[require.resolve(_apiDir + "/index")];
    });

    describe("sandbox", function () {
        beforeEach(function () {
            spyOn(utils, "requireWebview").andReturn(mockedWebview);
        });

        it("sandbox called with args will set webview sandbox", function () {
            index.sandbox(mockedPluginResult, {
                "sandbox": encodeURIComponent(JSON.stringify(false))
            });
            expect(mockedWebview.setSandbox).toHaveBeenCalledWith(false);
            expect(mockedPluginResult.ok).toHaveBeenCalled();
        });

        it("sandbox called without args will get webview sandbox", function () {
            var success = jasmine.createSpy("success");
            index.sandbox(mockedPluginResult);
            expect(mockedWebview.getSandbox).toHaveBeenCalled();
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(false, false);
        });
    });

    it("home calls getEnv('HOME')", function () {
        index.home(mockedPluginResult);
        expect(mockedApplication.getEnv).toHaveBeenCalledWith("HOME");
        expect(mockedPluginResult.ok).toHaveBeenCalledWith("/home", false);
    });

    it("sharedFolder calls getEnv('HOME')", function () {
        index.sharedFolder(mockedPluginResult);
        expect(mockedApplication.getEnv).toHaveBeenCalledWith("HOME");
        expect(mockedPluginResult.ok).toHaveBeenCalledWith("/home/../shared", false);
    });

    it("SDCard calls getEnv('HOME')", function () {
        index.SDCard(mockedPluginResult);
        expect(mockedPluginResult.ok).toHaveBeenCalledWith("/accounts/1000/removable/sdcard", false);
    });
});
