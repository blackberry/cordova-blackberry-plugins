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
    _ID = "com.blackberry.display",
    _apiDir = _extDir + "/" + _ID,
    _isSleepPrevented = false,
    client;

describe("display client", function () {
    beforeEach(function () {
        var apis = ["isSleepPrevented", "setPreventSleep"];
        GLOBAL.cordova = {
            exec: jasmine.createSpy().andCallFake(function (success, fail, ID, func, args) {
                if (apis.indexOf(func) !== -1) {
                    if(func === "isSleepPrevented") {
                        success(_isSleepPrevented);
                    } else {
                        _isSleepPrevented = args.input;
                        success();
                    }
                }
            }),
            require: function () {
                return cordova.exec;
            }
        };
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        client = null;
    });

    describe("isSleepPrevented", function () {
        it("should be populated", function () {
            expect(client.isSleepPrevented).toEqual(_isSleepPrevented);
        });
    });

    describe("setPreventSleep", function () {
        it("should be defined", function () {
            expect(client.setPreventSleep).toBeDefined();
        });

        it("should set isSleepPrevented to true", function () {
            client.setPreventSleep(true);
            expect(client.isSleepPrevented).toBeTruthy();
        });

        it("should set isSleepPrevented to false", function () {
            client.setPreventSleep(false);
            expect(client.isSleepPrevented).toBeFalsy();
        });
    });
});
