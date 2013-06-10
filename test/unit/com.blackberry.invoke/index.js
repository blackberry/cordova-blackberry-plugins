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

var _apiDir = __dirname + "/../../../plugin/com.blackberry.invoke/",
    _libDir = __dirname + "/../../../lib/",
    _extDir = __dirname + "/../../../plugin/",
    mockedInvocation,
    mockedApplication,
    mockedController,
    mockedPluginResult,
    mockedQnx,
    index,
    successCB,
    failCB,
    errorCode = -1;

describe("invoke index", function () {

    beforeEach(function () {
        mockedInvocation = {
            invoke: jasmine.createSpy("invocation.invoke").andCallFake(function (request, callback) {
                callback();
            }),
            queryTargets: jasmine.createSpy("invocation.queryTargets").andCallFake(function (request, callback) {
                callback();
            }),
            TARGET_TYPE_MASK_APPLICATION: 1,
            TARGET_TYPE_MASK_CARD: 2,
            TARGET_TYPE_MASK_VIEWER: 4,
            interrupter : false
        };
        mockedController = {
            dispatchEvent : jasmine.createSpy(),
            addEventListener : jasmine.createSpy(),
            removeEventListener : jasmine.createSpy()
        };
        mockedApplication = {
            invocation: mockedInvocation,
            addEventListener : jasmine.createSpy().andCallFake(function (eventName, callback) {
                    callback();
                }),
            removeEventListener : jasmine.createSpy()
        };

        mockedQnx = {
            callExtensionMethod : function () {},
            webplatform: {
                getApplication: function () {
                    return mockedApplication;
                },
                getController : function () {
                    return mockedController;
                }
            }
        };

        GLOBAL.window = {
            qnx: mockedQnx
        };

        mockedPluginResult = {
            callbackOk: jasmine.createSpy(),
            callbackError: jasmine.createSpy(),
            noResult: jasmine.createSpy(),
            ok: jasmine.createSpy(),
            error: jasmine.createSpy()
        };

        GLOBAL.qnx = mockedQnx;
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.qnx;
    });

    describe("invoke", function () {

        it("can invoke with target", function () {
            var mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({target: "abc.xyz"}))
                };

            index.invoke(mockedPluginResult, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                target: "abc.xyz"
            }, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalledWith(undefined, false);
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

        it("can invoke with uri", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({uri: "http://www.rim.com"}))
                };

            index.invoke(mockedPluginResult, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                uri: "http://www.rim.com"
            }, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalledWith(undefined, false);
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

        it("can invoke with uri using the file_transfer_mode property", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({uri: "http://www.rim.com", file_transfer_mode: "PRESERVE"}))
                };

            index.invoke(mockedPluginResult, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                uri: "http://www.rim.com",
                file_transfer_mode : "PRESERVE"
            }, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalledWith(undefined, false);
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

    });

    describe("query", function () {
        var APPLICATION = 1,
            CARD = 2,
            VIEWER = 4;

        it("can query the invocation framework", function () {
            var request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER", "CARD"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(mockedPluginResult, args);
            delete request["target_type"];
            request["target_type_mask"] = APPLICATION | VIEWER | CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalled();
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

        it("can perform a query for application targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(mockedPluginResult, args);
            delete request["target_type"];
            request["target_type_mask"] = APPLICATION;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalled();
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

        it("can perform a query for viewer targets", function  () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["VIEWER"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(mockedPluginResult, args);
            delete request["target_type"];
            request["target_type_mask"] = VIEWER;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalled();
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

        it("can perform a query for card targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["CARD"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(mockedPluginResult, args);
            delete request["target_type"];
            request["target_type_mask"] = CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalled();
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

        it("can perform a query for all targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER", "CARD"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(mockedPluginResult, args);
            delete request["target_type"];
            request["target_type_mask"] = APPLICATION | VIEWER | CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalled();
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

        it("will not generate a target_type property in the request if it is not an array", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": "APPLICATION"
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(mockedPluginResult, args);
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalled();
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

        it("will only use valid entries in the target type array to generate the target type mask", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER", "CARD", "INVALID_ENTRY"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(mockedPluginResult, args);
            request["target_type"] = ["INVALID_ENTRY"];
            request["target_type_mask"] = APPLICATION | VIEWER | CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(mockedPluginResult.callbackOk).toHaveBeenCalled();
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });
    });

    describe("card", function () {
        beforeEach(function () {
            mockedInvocation.closeChildCard = jasmine.createSpy("invocation.closeChildCard");
        });

        afterEach(function () {
            delete mockedInvocation.closeChildCard;
        });

        describe("methods", function () {
            it("can call closeChildCard with success callback at the end", function () {
                index.closeChildCard(mockedPluginResult);
                expect(mockedInvocation.closeChildCard).toHaveBeenCalled();
                expect(mockedPluginResult.ok).toHaveBeenCalled();
                expect(mockedPluginResult.error).not.toHaveBeenCalled();
            });
        });

        describe("events", function () {
            var invocationEvents;

            beforeEach(function () {
                invocationEvents = require(_apiDir + "invocationEvents");
            });

            afterEach(function () {
                invocationEvents = null;
            });

            it("can call startEvent", function () {
                var env = {
                        webview: {
                            id: 42
                        }
                    };

                spyOn(invocationEvents, "addEventListener");

                index.startEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify("onchildcardclosed"))}, env);

                expect(invocationEvents.addEventListener).toHaveBeenCalledWith("onchildcardclosed", jasmine.any(Function));
                expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
            });

            it("can call stopEvent", function () {
                var env = {
                        webview: {
                            id: 42
                        }
                    };

                spyOn(invocationEvents, "removeEventListener");

                index.stopEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify("onchildcardclosed"))}, env);

                expect(invocationEvents.removeEventListener).toHaveBeenCalledWith("onchildcardclosed", jasmine.any(Function));
                expect(mockedPluginResult.noResult).toHaveBeenCalledWith(false);
            });
        });

        describe("interrupt invocation", function () {
            var invocationEvents;

            beforeEach(function () {
                invocationEvents = require(_apiDir + "invocationEvents");
            });

            afterEach(function () {
                invocationEvents = null;
            });

            it("expect returnInterruption to be defined", function () {
                expect(index.returnInterruption).toBeDefined();
            });

            it("can properly register for invocation interruption", function () {
                var env = {
                        webview: {
                            id: 42
                        }
                    };

                spyOn(invocationEvents, "addEventListener");

                index.startEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify("invocation.interrupted"))}, env);
                expect(invocationEvents.addEventListener).toHaveBeenCalledWith("invocation.interrupted", jasmine.any(Function));
                expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
            });

            it("can properly unregister for invocation interruption", function () {
                var env = {
                        webview: {
                            id: 42
                        }
                    };

                spyOn(invocationEvents, "removeEventListener");

                index.stopEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify("invocation.interrupted"))}, env);
                expect(invocationEvents.removeEventListener).toHaveBeenCalledWith("invocation.interrupted", jasmine.any(Function));
                expect(mockedPluginResult.noResult).toHaveBeenCalledWith(false);
            });

        });
    });
});
