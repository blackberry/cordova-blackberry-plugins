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
    mockedWebworks,
    mockedCordova,
    MockedChannel,
    channelRegistry = {};

describe("system client", function () {
    beforeEach(function () {

        mockedWebworks = {
            exec : jasmine.createSpy("webworks.exec"),
            defineReadOnlyField: jasmine.createSpy("webworks.defineReadOnlyField")
        };

        MockedChannel = function () {
            return {
                onHasSubscribersChange: undefined,
                numHandlers: undefined
            };
        };

        mockedCordova = {
            addWindowEventHandler: jasmine.createSpy("cordova.addWindowEventHandler").andCallFake(function (eventName) {
                channelRegistry[eventName] = new MockedChannel();
                return channelRegistry[eventName];
            }),
            fireWindowEvent: jasmine.createSpy("cordova.fireWindowEvent")
        };

        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window = {
            webworks: mockedWebworks,
            cordova: mockedCordova
        };
        GLOBAL.cordova = mockedCordova;

        delete require.cache[require.resolve(apiDir + "/www/client")];
        sysClient = require(apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.cordova;

        delete require.cache[require.resolve(apiDir + "/www/client")];
        sysClient = null;
    });

    it("defines events", function () {
        var events = ["batterystatus", "batterylow", "battercritical", "languagechanged", "regionchanged", "fontchanged", "perimeterlocked", "perimeterunlocked"];
        events.forEach(function (event) {
            var channel;

            //test channel creation
            expect(mockedCordova.addWindowEventHandler).toHaveBeenCalledWith(event);

            //test Subscriber add
            channel = channelRegistry[event];
            channel.numHandlers = 1;
            channel.onHasSubscribersChange();
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "startEvent", {eventName: event});

            //test Subscriber remove
            channel.numHandlers = 0;
            channel.onHasSubscribersChange();
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "stopEvent", {eventName: event});
        });
    });

    it("hasCapability", function () {
        var result;

        mockedWebworks.exec.andCallFake(function (success, fail, service, action, args) {
            success(true);
        });

        result = sysClient.hasCapability("abc.def");

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "hasCapability", {"capability": "abc.def"});
        expect(result).toBeTruthy();
    });

    it("getFontInfo", function () {
        var result;

        mockedWebworks.exec.andCallFake(function (success, fail, service, action, args) {
            success(true);
        });

        result = sysClient.getFontInfo();

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "getFontInfo", undefined);
        expect(result).toBeTruthy();
    });

    it("getCurrentTimezone", function () {
        mockedWebworks.exec.andCallFake(function (success, fail, service, action, args) {
            success("America/New_York");
        });

        var result = sysClient.getCurrentTimezone();

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "getCurrentTimezone", undefined);
        expect(result).toBe("America/New_York");
    });

    it("getTimezones", function () {
        var timezones = ["America/New_York", "America/Los_Angeles"],
            result;

        mockedWebworks.exec.andCallFake(function (success, fail, service, action, args) {
            success(timezones);
        });

        result = sysClient.getTimezones();

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "getTimezones", undefined);
        expect(result).toBe(timezones);
    });

    it("setWallpaper", function () {
        var filePath = "file:///accounts/1000/shared/camera/IMG_00000001.jpg";

        sysClient.setWallpaper(filePath);

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "setWallpaper", {"wallpaper": filePath});
    });

    it("deviceLockedStatus", function () {
        mockedWebworks.exec.andCallFake(function (success, fail, service, action, args) {
            success("notLocked");
        });

        expect(sysClient.deviceLockedStatus).toEqual("notLocked");
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "deviceLockedStatus", undefined);
    });

    describe("device properties and ReadOnlyFields", function () {

        var mockDeviceProperties = {
            hardwareId: "123",
            softwareVersion: "456",
            name: "789"
        };

        beforeEach(function () {
            mockedWebworks.exec.andCallFake(function (success, fail, service, action, args) {
                success(mockDeviceProperties);
            });
            // client needs to be required for each test
            delete require.cache[require.resolve(apiDir + "/www/client")];
            sysClient = require(apiDir + "/www/client");
        });

        afterEach(function () {
            delete require.cache[require.resolve(apiDir + "/www/client")];
            sysClient = null;
        });

        it("defines ALLOW", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "ALLOW", 0);
        });

        it("defines DENY", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "DENY", 1);
        });

        it("sets readonly fields", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "hardwareId", "123");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "softwareVersion", "456");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "name", "789");
        });
    });

    describe("properties", function () {

        describe("region", function () {
            beforeEach(function () {
                mockedWebworks.exec.andCallFake(function (success, fail, namespace, field) {
                    if (field === "language") {
                        success("fr_CA");
                    } else if (field === "region") {
                        success("en_US");
                    }
                });
            });

            it("region", function () {
                expect(sysClient.region).toEqual("en_US");
                expect(mockedWebworks.exec.argsForCall).toContain([jasmine.any(Function), jasmine.any(Function), ID, "region", undefined]);
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
