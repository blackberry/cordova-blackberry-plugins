/*
 * Copyright 2011-2012 Research In Motion Limited.
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

var _apiDir = __dirname + "/../../../plugin/com.blackberry.invoked/",
    _libDir = __dirname + "/../../../lib/",
    mockedInvocation,
    mockedPluginResult,
    index,
    successCB,
    failCB,
    errorCode = -1;

describe("invoked index", function () {

    beforeEach(function () {
        mockedInvocation = {
            getRequest: jasmine.createSpy("invocation.getRequest"),
            getStartupMode: jasmine.createSpy("invocation.getStartupMode").andCallFake(function () {
                return 0;
            }),
            LAUNCH: 0
        };
        GLOBAL.window = {};
        GLOBAL.window.qnx = {
            callExtensionMethod : function () {}
        };
        GLOBAL.window.wp = {
            core: {
                invocation: mockedInvocation
            }
        };

        mockedPluginResult = {
            callbackOk: jasmine.createSpy(),
            callbackError: jasmine.createSpy(),
            noResult: jasmine.createSpy(),
            ok: jasmine.createSpy(),
            error: jasmine.createSpy()
        };
        GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);

        //since multiple tests are requiring invocation events we must unrequire
        var name = require.resolve(_apiDir + "invocationEvents");
        delete require.cache[name];
        index = require(_apiDir + "index");
        successCB = jasmine.createSpy("success callback");
        failCB = jasmine.createSpy("fail callback");
    });

    afterEach(function () {
        mockedInvocation = null;
        GLOBAL.window.qnx = null;
        GLOBAL.window.wp = null;
        index = null;
        successCB = null;
        failCB = null;
    });

    describe("methods", function () {
        beforeEach(function () {
            mockedInvocation.cardResized = jasmine.createSpy("invocation.cardResized");
            mockedInvocation.cardPeek = jasmine.createSpy("invocation.cardPeek");
            mockedInvocation.sendCardDone = jasmine.createSpy("invocation.sendCardDone");
        });

        afterEach(function () {
            delete mockedInvocation.cardResizeDone;
            delete mockedInvocation.cardStartPeek;
            delete mockedInvocation.cardRequestClosure;
        });

        // Positive
        it("can call cardResizeDone with success callback at the end", function () {
            index.cardResizeDone(successCB, failCB);
            expect(mockedInvocation.cardResized).toHaveBeenCalled();
            expect(mockedPluginResult.noResult).toHaveBeenCalled();
        });

        it("can call cardStartPeek with success callback at the end", function () {
            var cartType = "root",
                args = {
                    'peekType': encodeURIComponent(cartType)
                };

            index.cardStartPeek(successCB, failCB, args);
            expect(mockedInvocation.cardPeek).toHaveBeenCalledWith(cartType);
            expect(mockedPluginResult.noResult).toHaveBeenCalled();
        });

        it("can call cardRequestClosure with success callback at the end", function () {
            var request = {
                    reason: "Close Reason",
                    type: "mime/type",
                    data: "Close Data"
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.cardRequestClosure(successCB, failCB, args);
            expect(mockedInvocation.sendCardDone).toHaveBeenCalledWith(request);
            expect(mockedPluginResult.noResult).toHaveBeenCalled();
        });

        // Negative
        it("can call cardStartPeek with fail callback when missing required parameter", function () {
            index.cardStartPeek(successCB, failCB);
            expect(mockedInvocation.cardResized).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalled();
        });

        it("can call cardRequestClosure with fail callback when missing required parameter", function () {
            index.cardRequestClosure(successCB, failCB);
            expect(mockedInvocation.sendCardDone).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalled();
        });
    });
});

