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
    anyFunc = jasmine.any(Function),
    client;

describe("identity client", function () {

    describe("when user has specified correct permission", function () {

        beforeEach(function () {
            GLOBAL.cordova = {
                exec: jasmine.createSpy().andCallFake(function (success, fail, service, action) {
                    var result = "Unsupported action";
                    if (action === "getFields") {
                        result = {
                            uuid: "0x12345678",
                            IMSI: "310150123456789",
                            IMEI: "AA-BBBBBB-CCCCCC-D"
                        };
                    }
                    success(result);
                }),
                require: function () {
                    return cordova.exec;
                }
            };
            client = require(_apiDir + "/www/client");
        });

        afterEach(function () {
            delete require.cache[require.resolve(_apiDir + "/www/client")];
            client = null;
            delete GLOBAL.cordova;
        });

        it("exec should have been called once for all fields", function () {
            expect(cordova.exec.callCount).toEqual(1);
        });

        it("uuid should call exec and value should be defined", function () {
            expect(cordova.exec).toHaveBeenCalledWith(anyFunc, anyFunc, _ID, "getFields", null);
            expect(cordova.exec).not.toHaveBeenCalledWith(anyFunc, anyFunc, _ID, "uuid", null);
            expect(client.uuid).toEqual("0x12345678");
        });

        it("IMSI value should be defined", function () {
            expect(cordova.exec).not.toHaveBeenCalledWith(anyFunc, anyFunc, _ID, "IMSI", null);
            expect(client.IMSI).toEqual("310150123456789");
        });

        it("IMSI value should be defined", function () {
            expect(cordova.exec).not.toHaveBeenCalledWith(anyFunc, anyFunc, _ID, "IMEI", null);
            expect(client.IMEI).toEqual("AA-BBBBBB-CCCCCC-D");
        });
    });

    describe("when user hasn't specified correct permission", function () {
        beforeEach(function () {
            GLOBAL.cordova = {
                exec: jasmine.createSpy().andThrow("Cannot read PPS object"),
                require: function () {
                    return cordova.exec;
                }
            };
            client = require(_apiDir + "/www/client");
        });

        afterEach(function () {
            delete require.cache[require.resolve(_apiDir + "/www/client")];
            delete GLOBAL.cordova;
        });

        it("uuid should call exec and catch error and return null", function () {
            var uuid = client.uuid;
            expect(uuid).toEqual(null);
            expect(cordova.exec).toHaveBeenCalledWith(anyFunc, anyFunc, _ID, "getFields", null);
        });
    });
});
