/*
 * Copyright 2014 BlackBerry Limited
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

var _apiDir = __dirname + "/../../../plugin/com.blackberry.barcodescanner/",
    _libDir = __dirname + "/../../../lib/",
    index,
    mockJnextObjId = 123,
    mockedPluginResult = {},
    success,
    fail,
    mockedExec = jasmine.createSpy("exec");

describe("barcodescanner index", function () {
    beforeEach(function () {
        mockedPluginResult = {
            callbackOk: jasmine.createSpy(),
            callbackError: jasmine.createSpy(),
            callbackId: jasmine.createSpy('callbackIdSpy').andCallFake(function () {
                return "1337";
            }),
            noResult: jasmine.createSpy(),
            ok: jasmine.createSpy(),
            error: jasmine.createSpy()
        };
        GLOBAL.cordova = {
            require: jasmine.createSpy().andReturn(mockedExec)
        };
        GLOBAL.JNEXT = {
            require: jasmine.createSpy("JNEXT.require").andCallFake(function () {
                return true;
            }),
            createObject: jasmine.createSpy("JNEXT.createObject").andCallFake(function () {
                return mockJnextObjId;
            }),
            invoke: jasmine.createSpy("JNEXT.invoke"),
            registerEvents: jasmine.createSpy("JNEXT.registerEvent")
        };
        GLOBAL.qnx = {
            webplatform: {
                getWebViews: jasmine.createSpy("getWebViewsSpy").andCallFake(function () {
                    return [{
                        zOrder: "0"
                    }];
                })
            }
        };
        GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);
        success = jasmine.createSpy('successCallbackSpy');
        fail = jasmine.createSpy('failCallbackSpy');
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        GLOBAL.cordova = null;
        index = null;
        GLOBAL.qnx = null;
        mockedPluginResult = {};
        success = null;
        fail = null;
    });

    it("JNEXT require/createObject/registerEvents are not called upon requiring index", function () {
        expect(JNEXT.require).not.toHaveBeenCalled();
        expect(JNEXT.createObject).not.toHaveBeenCalled();
        expect(JNEXT.registerEvents).not.toHaveBeenCalled();
    });

    describe("startRead", function () {
        it("can call JNEXT and PluginResult", function () {
            index.startRead(success, fail, jasmine.any(Object), jasmine.any(Object));

            expect(mockedPluginResult.ok).toHaveBeenCalled();
            expect(JNEXT.invoke).toHaveBeenCalledWith(123, "startRead " + mockedPluginResult.callbackId);
        });
    });

    describe("stopRead", function () {
        it("can call JNEXT and PluginResult", function () {
            index.stopRead(success, fail, jasmine.any(Object), jasmine.any(Object));

            expect(mockedPluginResult.ok).toHaveBeenCalled();
            expect(JNEXT.invoke).toHaveBeenCalledWith(123, "stopRead " + mockedPluginResult.callbackId);
        });
    });
});
