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
    mockedWebworks = {
        exec : function () {},
        defineReadOnlyField: jasmine.createSpy()
    };

describe("system client", function () {
    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        sysClient = require(apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    it("hasPermission", function () {
        var result;

        spyOn(mockedWebworks, "exec").andCallFake(function (success, fail, service, action, args) {
            success(0);
        });

        result = sysClient.hasPermission("com.blackberry.app");

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "hasPermission", {"module": "com.blackberry.app"});
        expect(result).toEqual(0);
    });

    it("hasCapability", function () {
        var result;

        spyOn(mockedWebworks, "exec").andCallFake(function (success, fail, service, action, args) {
            success(true);
        });

        result = sysClient.hasCapability("abc.def");

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "hasCapability", {"capability": "abc.def"});
        expect(result).toBeTruthy();
    });

    it("getFontInfo", function () {
        var result;

        spyOn(mockedWebworks, "exec").andCallFake(function (success, fail, service, action, args) {
            success(true);
        });

        result = sysClient.getFontInfo();

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "getFontInfo", undefined);
        expect(result).toBeTruthy();
    });

    it("getCurrentTimezone", function () {
        spyOn(mockedWebworks, "exec").andCallFake(function (success, fail, service, action, args) {
            success("America/New_York");
        });

        var result = sysClient.getCurrentTimezone();

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "getCurrentTimezone", undefined);
        expect(result).toBe("America/New_York");
    });

    it("getTimezones", function () {
        var timezones = ["America/New_York", "America/Los_Angeles"],
            result;

        spyOn(mockedWebworks, "exec").andCallFake(function (success, fail, service, action, args) {
            success(timezones);
        });

        result = sysClient.getTimezones();

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "getTimezones", undefined);
        expect(result).toBe(timezones);
    });

    it("setWallpaper", function () {
        var filePath = "file:///accounts/1000/shared/camera/IMG_00000001.jpg";

        spyOn(mockedWebworks, "exec");
        sysClient.setWallpaper(filePath);

        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "setWallpaper", {"wallpaper": filePath});
    });

    it("deviceLockedStatus", function () {
        spyOn(mockedWebworks, "exec").andCallFake(function (success, fail, service, action, args) {
            success("notLocked");
        });

        expect(sysClient.deviceLockedStatus).toEqual("notLocked");
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "deviceLockedStatus", undefined);
    });

    it("ALLOW", function () {
        expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "ALLOW", 0);
    });

    it("DENY", function () {
        expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "DENY", 1);
    });

    describe("device properties and registerEvents", function () {

        var mockDeviceProperties = {
            hardwareId: "123",
            softwareVersion: "456",
            name: "789"
        };

        beforeEach(function () {
            mockedWebworks.exec = jasmine.createSpy().andCallFake(function (success, fail, service, action, args) {
                success(mockDeviceProperties);
            });
            mockedWebworks.defineReadOnlyField = jasmine.createSpy();
            GLOBAL.window = {
                webworks: mockedWebworks
            };
            // client needs to be required for each test
            delete require.cache[require.resolve(apiDir + "/www/client")];
            sysClient = require(apiDir + "/www/client");
        });

        afterEach(function () {
            delete GLOBAL.window;
            delete require.cache[require.resolve(apiDir + "/www/client")];
            sysClient = null;
        });

        it("exec should have been called once for all system fields", function () {
            expect(mockedWebworks.exec.callCount).toEqual(2); // the extra call is for registerEvents
        });

        it("registerEvents", function () {
            expect(mockedWebworks.exec.argsForCall).toContain([jasmine.any(Function), jasmine.any(Function), ID, "registerEvents", null]);
        });

        it("readonly fields set", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "hardwareId", "123");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "softwareVersion", "456");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "name", "789");
        });
    });

    describe("properties", function () {

        describe("region", function () {
            beforeEach(function () {
                mockedWebworks.exec = jasmine.createSpy("exec").andCallFake(function (success, fail, namespace, field) {
                    if (field === "language") {
                        success("fr_CA");
                    } else if (field === "region") {
                        success("en_US");
                    }
                });
                mockedWebworks.defineReadOnlyField = jasmine.createSpy();
                GLOBAL.window = {
                    webworks: mockedWebworks
                };
                // client needs to be required for each test
                delete require.cache[require.resolve(apiDir + "/www/client")];
                sysClient = require(apiDir + "/www/client");
            });

            afterEach(function () {
                delete GLOBAL.window;
                delete require.cache[require.resolve(apiDir + "/www/client")];
                sysClient = null;
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
