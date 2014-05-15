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

var extDir = __dirname + "/../../../plugin",
    ID = "com.blackberry.system",
    apiDir = extDir + "/" + ID,
    sysClient = null,
    MockedChannel,
    channelRegistry = {};

describe("system client", function () {
    beforeEach(function () {

        MockedChannel = function () {
            return {
                onHasSubscribersChange: undefined,
                numHandlers: undefined
            };
        };

        GLOBAL.cordova = {
            addDocumentEventHandler: jasmine.createSpy("cordova.addDocumentEventHandler").andCallFake(function (eventName) {
                channelRegistry[eventName] = new MockedChannel();
                return channelRegistry[eventName];
            }),
            fireDocumentEvent: jasmine.createSpy("cordova.fireDocumentEvent"),
            exec: jasmine.createSpy("cordova.exec"),
            require: function () {
                return cordova.exec;
            }
        };

        sysClient = require(apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        delete require.cache[require.resolve(apiDir + "/www/client")];
        sysClient = null;
    });

    it("defines events", function () {
        var events = ["batterystatus", "batterylow", "batterycritical", "languagechanged", "regionchanged", "fontchanged", "perimeterlocked", "perimeterunlocked"];
        events.forEach(function (event) {
            var channel;

            //test channel creation
            expect(cordova.addDocumentEventHandler).toHaveBeenCalledWith(event);

            //test Subscriber add
            channel = channelRegistry[event];
            channel.numHandlers = 1;
            channel.onHasSubscribersChange();
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "startEvent", {eventName: event});

            //test Subscriber remove
            channel.numHandlers = 0;
            channel.onHasSubscribersChange();
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "stopEvent", {eventName: event});
        });
    });

    it("getFontInfo", function () {
        var result;

        cordova.exec.andCallFake(function (success, fail, service, action, args) {
            success(true);
        });

        result = sysClient.getFontInfo();

        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "getFontInfo", undefined);
        expect(result).toBeTruthy();
    });

    it("getCurrentTimezone", function () {
        var result;

        cordova.exec.andCallFake(function (success, fail, service, action, args) {
            success("America/New_York");
        });

        result = sysClient.getCurrentTimezone();

        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "getCurrentTimezone", undefined);
        expect(result).toBe("America/New_York");
    });

    it("getTimezones", function () {
        var timezones = ["America/New_York", "America/Los_Angeles"],
            result;

        cordova.exec.andCallFake(function (success, fail, service, action, args) {
            success(timezones);
        });

        result = sysClient.getTimezones();

        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "getTimezones", undefined);
        expect(result).toBe(timezones);
    });

    it("setWallpaper", function () {
        var filePath = "file:///accounts/1000/shared/camera/IMG_00000001.jpg";

        sysClient.setWallpaper(filePath);

        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "setWallpaper", {"wallpaper": filePath});
    });

    it("deviceLockedStatus", function () {
        cordova.exec.andCallFake(function (success, fail, service, action, args) {
            success("notLocked");
        });

        expect(sysClient.deviceLockedStatus).toEqual("notLocked");
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "deviceLockedStatus", undefined);
    });

    describe("device properties and ReadOnlyFields", function () {

        var mockDeviceProperties = {
            hardwareId: "123",
            softwareVersion: "456",
            name: "789"
        };

        beforeEach(function () {
            cordova.exec.andCallFake(function (success, fail, service, action, args) {
                success(mockDeviceProperties);
            });
            delete require.cache[require.resolve(apiDir + "/www/client")];
            sysClient = require(apiDir + "/www/client");
        });

        it("defines ALLOW", function () {
            expect(sysClient.ALLOW).toEqual(0);
        });

        it("defines DENY", function () {
            expect(sysClient.DENY).toEqual(1);
        });

        it("sets readonly fields", function () {
            expect(sysClient.hardwareId).toEqual("123");
            expect(sysClient.softwareVersion).toEqual("456");
            expect(sysClient.name).toEqual("789");
        });
    });

    describe("properties", function () {

        describe("region", function () {
            beforeEach(function () {
                cordova.exec.andCallFake(function (success, fail, namespace, field) {
                    if (field === "language") {
                        success("fr_CA");
                    } else if (field === "region") {
                        success("en_US");
                    }
                });
            });

            it("region", function () {
                expect(sysClient.region).toEqual("en_US");
                expect(cordova.exec.argsForCall).toContain([jasmine.any(Function), jasmine.any(Function), ID, "region", undefined]);
            });
        });

        describe("language", function () {
            var mockNavigator;

            beforeEach(function () {
                mockNavigator = {
                    language: (new Date()).toString()
                };
                GLOBAL.navigator = mockNavigator;
                sysClient = require(apiDir + "/www/client");
            });

            afterEach(function () {
                delete GLOBAL.navigator;
            });

            it("defines a getter for navigator.language", function () {
                expect(sysClient.language).toEqual(mockNavigator.language);
            });

        });
    });
});
