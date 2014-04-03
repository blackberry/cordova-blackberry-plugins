/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
var _apiDir = __dirname + "/../../../plugin/com.blackberry.screenshot/",
    _libDir = __dirname + "/../../../lib/",
    index,
    mockJnextObjId = 123,
    mockedPluginResult = {},
    success,
    fail,
    mockedExec = jasmine.createSpy("exec");

describe("screenshot index", function () {
    beforeEach(function () {
        mockedPluginResult = {
            callbackOk: jasmine.createSpy(),
            callbackError: jasmine.createSpy(),
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

    describe("execute", function () {
        it("can call JNEXT and PluginResult", function () {
            var args = {
                    callbackId: jasmine.any(Number),
                    userargs: encodeURIComponent(JSON.stringify({dest: 'data', mime: 'image/png'}))
                };

            index.execute(success, fail, args, jasmine.any(Object));

            expect(mockedPluginResult.ok).toHaveBeenCalled();
            expect(JNEXT.invoke).toHaveBeenCalled();
        });

        it("can call fail callback", function () {
            var args = {
                    callbackId: jasmine.any(Number),
                    userargs: encodeURIComponent(JSON.stringify({dest: 'data', mime: 'image/png'}))
                };

            GLOBAL.qnx = {
                webplatform: {
                    getWebViews: jasmine.createSpy("getWebViewsSpy").andCallFake(function () {
                        return [{
                            zOrder: "1"
                        }];
                    })
                }
            };

            index.execute(success, fail, args, jasmine.any(Object));

            expect(mockedPluginResult.ok).not.toHaveBeenCalled();
            expect(JNEXT.invoke).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith('error:no window handle');
        });
    });
});
