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

var _extDir = __dirname + "/../../../plugin",
    _ID = "com.blackberry.push",
    _apiDir = _extDir + "/" + _ID,
    client,
    constants = {
        "SUCCESS" : 0,
        "INTERNAL_ERROR" : 500,
        "INVALID_DEVICE_PIN" : 10001,
        "INVALID_PROVIDER_APPLICATION_ID" : 10002,
        "CHANNEL_ALREADY_DESTROYED" : 10004,
        "CHANNEL_ALREADY_DESTROYED_BY_PROVIDER" : 10005,
        "INVALID_PPG_SUBSCRIBER_STATE" : 10006,
        "PPG_SUBSCRIBER_NOT_FOUND" : 10007,
        "EXPIRED_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG" : 10008,
        "INVALID_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG" : 10009,
        "PPG_SUBSCRIBER_LIMIT_REACHED" : 10010,
        "INVALID_OS_VERSION_OR_DEVICE_MODEL_NUMBER" : 10011,
        "CHANNEL_SUSPENDED_BY_PROVIDER" : 10012,
        "CREATE_SESSION_NOT_DONE" : 10100,
        "MISSING_PPG_URL" : 10102,
        "PUSH_TRANSPORT_UNAVAILABLE" : 10103,
        "OPERATION_NOT_SUPPORTED" : 10105,
        "CREATE_CHANNEL_NOT_DONE" : 10106,
        "MISSING_PORT_FROM_PPG" : 10107,
        "MISSING_SUBSCRIPTION_RETURN_CODE_FROM_PPG" : 10108,
        "PPG_SERVER_ERROR" : 10110,
        "MISSING_INVOKE_TARGET_ID" : 10111,
        "SESSION_ALREADY_EXISTS" : 10112,
        "INVALID_PPG_URL" : 10114,
        "CREATE_CHANNEL_OPERATION" : 1,
        "DESTROY_CHANNEL_OPERATION" : 2
    };

function unloadClient() {
    // explicitly unload client for it to be loaded again
    delete require.cache[require.resolve(_apiDir + "/www/client")];
}

describe("push", function () {
    beforeEach(function () {
        GLOBAL.cordova = {
            require: function () {
                return cordova.exec;
            },
            exec: jasmine.createSpy("exec")
        };
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        unloadClient();
        delete GLOBAL.cordova;
    });

    describe("push constants", function () {
        it("call defineReadOnlyField with right params", function () {
            Object.getOwnPropertyNames(constants).forEach(function (c) {
                var propertyDescriptor = Object.getOwnPropertyDescriptor(client.PushService, c);
                if (!propertyDescriptor) console.log("No property descriptor found for ", c, client.PushService, client.PushService[c]);
                expect(propertyDescriptor.value).toEqual(constants[c]);
                expect(propertyDescriptor.writable).toEqual(false);

            });
        });
    });


    describe("PushService", function () {
        it("has only one static method: create", function () {
            expect(client.PushService.create).toBeDefined();
            expect(client.PushService.createChannel).toBeUndefined();
            expect(client.PushService.destroyChannel).toBeUndefined();
            expect(client.PushService.extractPushPayload).toBeUndefined();
            expect(client.PushService.launchApplicationOnPush).toBeUndefined();
        });

        it("has several instance methods", function () {
            var pushService = new client.PushService();
            expect(pushService.createChannel).toBeDefined();
            expect(pushService.destroyChannel).toBeDefined();
            expect(pushService.extractPushPayload).toBeDefined();
            expect(pushService.launchApplicationOnPush).toBeDefined();
        });

        describe("create", function () {
            var invokeTargetIdError = "push.PushService.create: cannot call create() multiple times with different invokeTargetId's",
                appIdError = "push.PushService.create: cannot call create() multiple times with different appId's";

            it("sets up the create callback", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "appId" : "appId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "startService", options);
            });

            it("allows multiple calls with the same parameters", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                });

                runs(function () {
                    options.appId = "";
                    client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                    expect(cordova.exec.callCount).toEqual(2);
                });
            });

            it("throws an error when it is called again with a different invokeTargetId", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "appId" : "appId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                });

                runs(function () {
                    options.invokeTargetId = "differentInvokeTargetId";

                    function createPushService() {
                        client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                    }

                    expect(createPushService).toThrow(invokeTargetIdError);
                    expect(cordova.exec.callCount).toEqual(1);
                });
            });

            it("throws an error when it is called again with a different appId", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "appId" : "appId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                });

                runs(function () {
                    options.appId = "differentAppId";

                    function createPushService() {
                        client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                    }

                    expect(createPushService).toThrow(appIdError);
                    expect(cordova.exec.callCount).toEqual(1);
                });
            });

            it("throws an error when it is called twice, with an empty then non-empty appId", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                });

                runs(function () {
                    options.appId = "hello";

                    function createPushService() {
                        client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                    }

                    expect(createPushService).toThrow(appIdError);
                    expect(cordova.exec.callCount).toEqual(1);
                });
            });

            it("throws an error when it is called twice, with a non-empty then empty appId", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "appId" : "appId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                });

                runs(function () {
                    options = { "invokeTargetId" : "invokeTargetId",
                                "ppgUrl" : "ppgUrl" };

                    function createPushService() {
                        client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                    }

                    expect(createPushService).toThrow(appIdError);
                    expect(cordova.exec.callCount).toEqual(1);
                });
            });
        });

        describe("createChannel", function () {
            it("sets up the createChannel callback", function () {
                var createChannelCallback = function () {},
                    pushService = new client.PushService();

                pushService.createChannel(createChannelCallback);
                expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "createChannel", null);
            });
        });

        describe("destroyChannel", function () {
            it("sets up the destroyChannel callback", function () {
                var destroyChannelCallback = function () {},
                    pushService = new client.PushService();

                pushService.destroyChannel(destroyChannelCallback);
                expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "destroyChannel", null);
            });
        });

        describe("extractPushPayload", function () {
            var extractPayloadError = "push.PushService.extractPushPayload: the invoke object was invalid and no PushPayload could be extracted from it";

            it("returns a PushPayload object", function () {
                var invokeObject = { "data" : "ABC", "action" : "bb.action.PUSH" },
                    calledObject = { "data" : "ABC" },
                    returnPayload = { "valid" : true },
                    pushService = new client.PushService(),
                    pushPayload;

                cordova.exec.andCallFake(function (success, fail, service, action, args) {
                    success(returnPayload);
                });
                pushPayload = pushService.extractPushPayload(invokeObject);

                expect(pushPayload).toBeDefined();
                expect(pushPayload).toEqual(jasmine.any(client.PushPayload));
                expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "extractPushPayload", calledObject);
            });

            it("checks that there is a data field in the invoke object", function () {
                var invokeObject = { "action" : "bb.action.PUSH" },
                    pushService = new client.PushService();

                function extractPayload() {
                    pushService.extractPushPayload(invokeObject);
                }

                expect(extractPayload).toThrow(extractPayloadError);
                expect(cordova.exec).not.toHaveBeenCalled();
            });

            it("checks that the invoke action is bb.action.PUSH", function () {
                var invokeObject = { "data" : "ABC" },
                    pushService = new client.PushService();

                function extractPayload() {
                    pushService.extractPushPayload(invokeObject);
                }

                expect(extractPayload).toThrow(extractPayloadError);
                expect(cordova.exec).not.toHaveBeenCalled();
            });

            it("checks that the returned payload is valid", function () {
                var invokeObject = { "data" : "ABC", "action" : "bb.action.PUSH" },
                    calledObject = { "data" : "ABC" },
                    returnPayload = { "valid" : false },
                    pushService = new client.PushService();

                cordova.exec.andCallFake(function (success, fail, service, action, args) {
                    success(returnPayload);
                });

                function extractPayload() {
                    pushService.extractPushPayload(invokeObject);
                }

                expect(extractPayload).toThrow(extractPayloadError);
                expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "extractPushPayload", calledObject);
            });
        });

        describe("launchApplicationOnPush", function () {
            it("sets up the launchApplicationOnPush callback", function () {
                var shouldLaunch = true,
                    shouldLaunchObj = {"shouldLaunch" : shouldLaunch},
                    launchApplicationCallback = function () {},
                    pushService = new client.PushService();

                pushService.launchApplicationOnPush(shouldLaunch, launchApplicationCallback);
                expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "launchApplicationOnPush", shouldLaunchObj);
            });
        });
    });

    describe("PushPayload", function () {
        it("contains only instance members and methods", function () {
            expect(client.PushPayload.data).toBeUndefined();
            expect(client.PushPayload.headers).toBeUndefined();
            expect(client.PushPayload.id).toBeUndefined();
            expect(client.PushPayload.isAcknowledgeRequired).toBeUndefined();
            expect(client.PushPayload.acknowledge).toBeUndefined();
        });

        it("calls defineReadOnlyField on the instance members", function () {
            var payloadObject = {},
                pushPayload,
                dataPropertyDescriptor;

            payloadObject.data = "world";
            payloadObject.headers = { webworks : "blackberry" };
            payloadObject.id = "hello";
            payloadObject.isAcknowledgeRequired = false;

            pushPayload = new client.PushPayload(payloadObject);

            expect(pushPayload).toBeDefined();
            expect(pushPayload).toEqual(jasmine.any(client.PushPayload));

            ["data", "headers", "id", "isAcknowledgeRequired"].forEach(function (attribute) {
                dataPropertyDescriptor = Object.getOwnPropertyDescriptor(pushPayload, attribute);
                expect(dataPropertyDescriptor.value).toEqual(payloadObject[attribute]);
                expect(dataPropertyDescriptor.writable).toEqual(false);
            });
        });

        it("can acknowledge the push notification", function () {
            var shouldAcceptPush = true,
                pushPayload = new client.PushPayload({id: "id"}),
                args = { "id": "id", "shouldAcceptPush": shouldAcceptPush };

            pushPayload.acknowledge(shouldAcceptPush);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "acknowledge", args);
        });
    });
});

