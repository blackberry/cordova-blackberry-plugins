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
    _apiDir = _extDir + "/com.blackberry.identity",
    _ID = "com.blackberry.identity",
    client,
    mockedWebworks = {};

function unloadClient() {
    // explicitly unload client for it to be loaded again
    delete require.cache[require.resolve(_apiDir + "/www/client")];
    client = null;
}

describe("identity client", function () {
    describe("when user has specified correct permission", function () {
        beforeEach(function () {
            mockedWebworks.exec = jasmine.createSpy().andCallFake(function (success, fail, service, action, args) {
                var result = "Unsupported action";

                if (action === "getFields") {
                    result = {
                        uuid: "0x12345678",
                        IMSI: "310150123456789",
                        IMEI: "AA-BBBBBB-CCCCCC-D"
                    };
                }

                success(result);
            });
            mockedWebworks.defineReadOnlyField = jasmine.createSpy();
            GLOBAL.window = {
                webworks: mockedWebworks
            };
            // client needs to be required for each test
            client = require(_apiDir + "/www/client");
        });

        afterEach(function () {
            unloadClient();
            delete GLOBAL.window;
        });

        it("exec should have been called once for all fields", function () {
            expect(mockedWebworks.exec.callCount).toEqual(1);
        });

        it("uuid should call exec and value should be defined", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "uuid", "0x12345678");
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getFields", null);
            expect(mockedWebworks.exec).not.toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "uuid", null);
        });

        it("IMSI value should be defined", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "IMSI", "310150123456789");
            expect(mockedWebworks.exec).not.toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "IMSI", null);
        });

        it("IMSI value should be defined", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "IMEI", "AA-BBBBBB-CCCCCC-D");
            expect(mockedWebworks.exec).not.toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "IMEI", null);
        });
    });

    describe("when user hasn't specified correct permission", function () {
        beforeEach(function () {
            spyOn(console, "error");
            mockedWebworks.exec = jasmine.createSpy().andThrow("Cannot read PPS object");
            GLOBAL.window = {
                webworks: mockedWebworks
            };
            // client needs to be required for each test
            client = require(_apiDir + "/www/client");
        });

        afterEach(function () {
            unloadClient();
            delete GLOBAL.window;
        });

        afterEach(unloadClient);

        it("uuid should call exec and catch error and return null", function () {
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getFields", null);
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "uuid", null);
        });
    });
});
