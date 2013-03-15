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
    client,
    mockedWebworks = {
        exec: jasmine.createSpy("webworks.exec")
    };

describe("invoked client", function () {
    beforeEach(function () {
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        client = null;
    });

    describe("cardResizeDone", function () {
        it("should call exec for cardResizeDone", function () {
            expect(client.cardResizeDone).toBeDefined();
            client.cardResizeDone();
            expect(window.webworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "cardResizeDone");
        });
    });

    describe("cardStartPeek", function () {
        var peekType = "root";

        it("should call exec for cardStartPeek", function () {
            expect(client.cardStartPeek).toBeDefined();
            client.cardStartPeek(peekType);
            expect(window.webworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "cardStartPeek", {'peekType': peekType});
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
            expect(window.webworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "cardRequestClosure", {'request': request});
        });
    });

    it("should register for events by calling registerEvents method", function () {
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "registerEvents", null);
    });
});

