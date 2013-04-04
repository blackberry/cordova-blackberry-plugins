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
    _ID = "com.blackberry.invoke",
    _apiDir = _extDir + "/" + _ID,
    client,
    mockedWebworks,
    mockedChannel,
    MockedChannel;

describe("invoke client", function () {
    beforeEach(function () {
        mockedWebworks = {
            exec: jasmine.createSpy("webworks.exec").andCallFake(function (success, error, service, action, args) {
                if (action === "invoke") {
                    if (success) {
                        success();
                    } else {
                        error();
                    }
                }
            }),
            defineReadOnlyField: jasmine.createSpy()
        };

        GLOBAL.window = {
            btoa: jasmine.createSpy("window.btoa").andReturn("base64 string"),
            webworks: mockedWebworks
        };

        mockedChannel = {
            onHasSubscribersChange: undefined,
            numHandlers: 0,
            subscribe: jasmine.createSpy().andCallFake(function () {
                this.numHandlers++;
                this.onHasSubscribersChange();
            }),
            unsubscribe: jasmine.createSpy().andCallFake(function () {
                this.numHandlers--;
                this.onHasSubscribersChange();
            }),
            fire: jasmine.createSpy()
        };

        MockedChannel = function () {
            return mockedChannel;
        };

        GLOBAL.cordova = {
            addWindowEventHandler: jasmine.createSpy().andReturn({
                onHasSubscribersChange: jasmine.createSpy()
            }),
            fireWindowEvent: jasmine.createSpy(),
            require: jasmine.createSpy().andCallFake(function () {
                return {
                    create: jasmine.createSpy().andReturn(new MockedChannel())
                };
            })
        };

        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.window.webworks;
        delete GLOBAL.window;
        delete GLOBAL.cordova;
        client = null;
    });

    describe("invoke", function () {

        it("blackberry.invoke constants should be properly defined", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILE_TRANSFER_PRESERVE", "PRESERVE");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILE_TRANSFER_COPY_RO", "COPY_RO");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILE_TRANSFER_COPY_RW", "COPY_RW");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILE_TRANSFER_LINK", "LINK");
        });

        it("should call error callback if request is not valid", function () {
            var onError = jasmine.createSpy("client onError");

            client.invoke(null, null, onError);
            expect(onError).toHaveBeenCalled();
        });

        it("should call exec", function () {
            var request = {
                    target: "abc.xyz"
                },
                callback = jasmine.createSpy("client callback");

            client.invoke(request, callback);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), undefined, _ID, "invoke", {"request": request});
        });

        it("should encode data to base64 string", function () {
            var request = {
                    target: "abc.xyz",
                    data: "my string"
                },
                callback = jasmine.createSpy("client callback");

            client.invoke(request, callback);

            expect(window.btoa).toHaveBeenCalledWith("my string");
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), undefined, _ID, "invoke", {
                "request": {
                    target: request.target,
                    data: "base64 string"
                }
            });
        });

        it("should call onError if failed to encode data to base64", function () {
            var request = {
                    target: "abc.xyz",
                    data: "my string"
                },
                onError = jasmine.createSpy("client onError");

            window.btoa.andThrow("bad string");
            client.invoke(request, null, onError);
            expect(onError).toHaveBeenCalledWith("bad string");
        });

        it("should call onSuccess if invocation is successful", function () {
            var request = {
                    target: "abc.xyz"
                },
                onSuccess = jasmine.createSpy("client onSuccess"),
                onError = jasmine.createSpy("client onError");

            client.invoke(request, onSuccess);

            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });

        it("should call onError if invocation failed", function () {
            var request = {
                    target: "abc.xyz"
                },
                onSuccess = jasmine.createSpy("client onSuccess"),
                onError = jasmine.createSpy("client onError");

            client.invoke(request, null, onError);

            expect(onSuccess).not.toHaveBeenCalled();
            expect(onError).toHaveBeenCalled();
        });
    });

    describe("query", function () {

        beforeEach(function () {
            mockedWebworks.exec.andCallFake(function (success, error, id, action, args) {
                //Validate the args
                if (args && args.request && (args.request["type"] || args.request["uri"]) &&
                        args.request["target_type"]) {
                    success({"error": "", "response": {}});
                } else {
                    error("invalid_argument");
                }
            });
        });

        it("should register an event callback to be triggered by the server side", function () {
            var request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION"]
                },
                onSuccess = jasmine.createSpy("client onSuccess"),
                onError = jasmine.createSpy("client onError");

            client.query(request, onSuccess, onError);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "query", {"request": request });
        });

        it("should call success callback if the invocation is successful", function () {
            var request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": "ALL"
                },
                onSuccess = jasmine.createSpy("client onSuccess"),
                onError = jasmine.createSpy("client onError");

            client.query(request, onSuccess, onError);
            expect(window.webworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "query", {"request": request});
            expect(onSuccess).toHaveBeenCalledWith(jasmine.any(Object));
            expect(onError).not.toHaveBeenCalled();
        });

        it("should trigger error callback if the invocation is unsuccessful", function () {
            var request = {
                    "action": "bb.action.OPEN",
                    "target_type": "ALL"
                },
                onSuccess = jasmine.createSpy("client onSuccess"),
                onError = jasmine.createSpy("client onError");

            client.query(request, onSuccess, onError);
            expect(onSuccess).not.toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(jasmine.any(String));
        });


    });

    describe("invoke interruption", function () {

        it("can successfully register as an interrupter", function () {
            var handler = function () {};
            client.interrupter = handler;
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'startEvent', {eventName: 'invocation.interrupted'});
        });

        it("can successfully clear an interrupter", function () {
            mockedChannel.numHandlers = 1;
            client.interrupter = null;
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'stopEvent', {eventName: 'invocation.interrupted'});
        });

        it("can successfully register an interrupter multiple times and only the last one is registered", function () {
            var handler = function () {};
            client.interrupter = handler;
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'startEvent', {eventName: 'invocation.interrupted'});

            client.interrupter = handler;
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'stopEvent', {eventName: 'invocation.interrupted'});
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'startEvent', {eventName: 'invocation.interrupted'});
        });


        it("can successfully register an interrupter and retreive its value", function () {
            var handler = function () {};
            client.interrupter = handler;
            expect(client.interrupter).toEqual(handler);
        });

    });

    describe("closeChildCard", function () {
        it("should call exec for closeChildCard", function () {
            expect(client.closeChildCard).toBeDefined();
            client.closeChildCard();
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "closeChildCard");
        });
    });
});
