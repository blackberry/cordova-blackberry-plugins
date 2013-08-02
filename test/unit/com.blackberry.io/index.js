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
    index = require(_apiDir + "/index"),
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
    };

describe("blackberry.io index", function () {
    beforeEach(function () {
        GLOBAL.wp = {
            getApplication: function () {
                return mockedApplication;
            }
        };
        GLOBAL.window = {
            wp: wp
        };
        GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.PluginResult;
    });

    describe("sandbox", function () {
        beforeEach(function () {
            spyOn(utils, "requireWebview").andReturn(mockedWebview);
        });

        it("sandbox called with args will set webview sandbox", function () {
            index.sandbox(null, null, {
                "sandbox": encodeURIComponent(JSON.stringify(false))
            }, null);
            expect(mockedWebview.setSandbox).toHaveBeenCalledWith(false);
            expect(mockedPluginResult.ok).toHaveBeenCalled();
        });

        it("sandbox called without args will get webview sandbox", function () {
            var success = jasmine.createSpy("success");
            index.sandbox(success, null, null, null);
            expect(mockedWebview.getSandbox).toHaveBeenCalled();
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(false, false);
        });
    });

    it("home calls getEnv('HOME')", function () {
        index.home();
        expect(mockedApplication.getEnv).toHaveBeenCalledWith("HOME");
        expect(mockedPluginResult.ok).toHaveBeenCalledWith("/home", false);
    });

    it("sharedFolder calls getEnv('HOME')", function () {
        index.sharedFolder();
        expect(mockedApplication.getEnv).toHaveBeenCalledWith("HOME");
        expect(mockedPluginResult.ok).toHaveBeenCalledWith("/home/../shared", false);
    });

    it("SDCard calls getEnv('HOME')", function () {
        index.SDCard();
        expect(mockedPluginResult.ok).toHaveBeenCalledWith("/accounts/1000/removable/sdcard", false);
    });
});
