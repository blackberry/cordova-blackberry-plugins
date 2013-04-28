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
    _ID = "com.blackberry.invoked",
    _apiDir = _extDir + "/" + _ID,
    client;

describe("invoked client", function () {
    beforeEach(function () {
        GLOBAL.cordova = {
            addDocumentEventHandler: jasmine.createSpy().andReturn({
                onHasSubscribersChange: jasmine.createSpy(),
                fire: jasmine.createSpy()
            }),
            require: jasmine.createSpy().andCallFake(function () {
                return cordova.exec;
            }),
            exec: jasmine.createSpy("cordova.exec")
        };
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.cordova;
        client = null;
    });

    describe("cardResizeDone", function () {
        it("should call exec for cardResizeDone", function () {
            expect(client.cardResizeDone).toBeDefined();
            client.cardResizeDone();
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "cardResizeDone");
        });
    });

    describe("cardStartPeek", function () {
        var peekType = "root";

        it("should call exec for cardStartPeek", function () {
            expect(client.cardStartPeek).toBeDefined();
            client.cardStartPeek(peekType);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "cardStartPeek", {'peekType': peekType});
        });
    });

    describe("cardRequestClosure", function () {
        var request = {
            reason: "Request Reason",
            type: "mime/type",
            data: "Request data"
        };

        it("should call exec for cardRequestClosure", function () {
            expect(client.cardRequestClosure).toBeDefined();
            client.cardRequestClosure(request);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "cardRequestClosure", {'request': request});
        });
    });
});

