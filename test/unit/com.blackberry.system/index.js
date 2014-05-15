/*
 * Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var libDir = __dirname + "/../../../lib/",
    extDir = __dirname + "/../../../plugin/",
    ID = "com.blackberry.system",
    apiDir = extDir + ID + "/",
    Whitelist = require(libDir + "policy/whitelist").Whitelist,
    events = require(libDir + "event"),
    utils = require(libDir + "utils"),
    mockedPluginResult,
    mockApplication = {},
    sysIndex;

describe("system index", function () {

    beforeEach(function () {
        mockedPluginResult = {
            ok: jasmine.createSpy("PluginResult.ok"),
            error: jasmine.createSpy("PluginResult.error"),
            noResult: jasmine.createSpy("PluginResult.noResult")
        };
        GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);
        GLOBAL.window = {
            qnx: {
                webplatform: {
                    device: {
                        getTimezones: jasmine.createSpy().andCallFake(function (callback) {
                            callback(["America/New_York", "America/Los_Angeles"]);
                        }),
                        timezone: "hello123"
                    },
                    getApplication: jasmine.createSpy().andReturn(mockApplication)
                }
            }
        };
        sysIndex = require(apiDir + "index");
    });

    afterEach(function () {
        delete require.cache[require.resolve(apiDir + "index")];
        sysIndex = null;
        delete GLOBAL.window;
        delete GLOBAL.PluginResult;
    });

    describe("Events", function () {
        var noop = function () {};

        it("startEvent", function () {
            var applicationEvents = require(libDir + "events/applicationEvents"),
                eventName = "perimeterunlocked",
                env = {webview: {id: 42 }};

            spyOn(applicationEvents, "removeEventListener");
            spyOn(applicationEvents, "addEventListener");

            sysIndex.startEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(applicationEvents.addEventListener).toHaveBeenCalledWith("windowUnlock", jasmine.any(Function));
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);

            //Will start twice, and remove old event
            sysIndex.startEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(applicationEvents.removeEventListener).toHaveBeenCalledWith("windowUnlock", jasmine.any(Function));
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        });

        it("stopEvent", function () {
            var applicationEvents = require(libDir + "events/applicationEvents"),
                eventName = "perimeterunlocked",
                env = {webview: {id: 42 }};

            spyOn(applicationEvents, "addEventListener");
            spyOn(applicationEvents, "removeEventListener");

            sysIndex.startEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            sysIndex.stopEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(applicationEvents.removeEventListener).toHaveBeenCalledWith("windowUnlock", jasmine.any(Function));
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(false);

            //Will not stop an unstarted event
            sysIndex.stopEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(mockedPluginResult.error).toHaveBeenCalledWith("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        });

    });

    describe("qnx.webplatform.device properties", function () {

        it("can call fail if a property isn't present", function () {
            delete window.qnx.webplatform.device; 
            sysIndex.getDeviceProperties();
            expect(mockedPluginResult.error).toHaveBeenCalledWith(jasmine.any(String), false);
        });

        it("can call success with getDeviceProperties", function () {
            var hardwareId = "0x8500240a",
                softwareVersion = "10.0.6.99",
                name = "Device";

            window.qnx.webplatform.device.hardwareId = hardwareId;
            window.qnx.webplatform.device.scmBundle = softwareVersion;
            window.qnx.webplatform.device.deviceName = name;

            sysIndex.getDeviceProperties();

            expect(mockedPluginResult.ok).toHaveBeenCalledWith({
                "hardwareId" : hardwareId,
                "softwareVersion" : softwareVersion,
                "name": name
            }, false);
        });

    });


    describe("device region", function () {

        it("calls success when there is no error retrieving data", function () {
            mockApplication.systemRegion = (new Date()).getTime();

            sysIndex.region();
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(window.qnx.webplatform.getApplication().systemRegion, false);
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });

        it("calls fail when there is an error", function () {
            var errMsg = "Something bad happened";

            Object.defineProperty(mockApplication, "systemRegion", {
                get: function () {
                    throw new Error(errMsg);
                }
            });

            sysIndex.region();
            expect(mockedPluginResult.ok).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalledWith(errMsg, false);
        });
    });

    describe("font", function () {
        describe("font methods", function () {
            var fontFamily = "courier",
                fontSize = 10,
                mockedFontFamily,
                mockedFontSize,
                ERROR_ID = -1;

            beforeEach(function () {
                mockedFontFamily = jasmine.createSpy("getSystemFontFamily").andReturn(fontFamily);
                mockedFontSize = jasmine.createSpy("getSystemFontSize").andReturn(fontSize);
                GLOBAL.window = {
                    qnx: {
                        webplatform: {
                            getApplication: function () {
                                return {
                                    getSystemFontFamily: mockedFontFamily,
                                    getSystemFontSize: mockedFontSize
                                };
                            }
                        }
                    }
                };
            });

            afterEach(function () {
                delete GLOBAL.window;
                mockedFontFamily = null;
                mockedFontSize = null;
                delete GLOBAL.window;
            });

            it("can call fontFamily and fontSize the qnx.weblplatform Application", function () {
                sysIndex.getFontInfo();
                expect(mockedFontFamily).toHaveBeenCalled();
                expect(mockedFontSize).toHaveBeenCalled();
            });

            it("can call success callback when getFontInfo call succeed", function () {
                sysIndex.getFontInfo();
                expect(mockedPluginResult.ok).toHaveBeenCalledWith({'fontFamily': fontFamily, 'fontSize': fontSize}, false);
                expect(mockedPluginResult.error).not.toHaveBeenCalled();
            });
/*
            it("can call fail callback when getFontInfo call failed", function () {
                sysIndex.getFontInfo();
                expect(mockedPluginResult.ok).not.toHaveBeenCalledWith({'fontFamily': fontFamily, 'fontSize': fontSize}, false);
                expect(mockedPluginResult.error).toHaveBeenCalledWith(ERROR_ID, jasmine.any(Object), false);
            });*/
        });
    });

    describe("getCurrentTimezone", function () {
        it("return timezone from PPS", function () {
            sysIndex.getCurrentTimezone();
            expect(mockedPluginResult.ok).toHaveBeenCalledWith("hello123", false);
        });
    });

    describe("getTimezones", function () {
        it("return timezones from native", function () {
            sysIndex.getTimezones();
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(["America/New_York", "America/Los_Angeles"], false);
        });
    });

    describe("setWallpaper", function () {
        var mockApplication;

        beforeEach(function () {
            mockApplication = {};

            mockApplication.newWallpaper = jasmine.createSpy("newWallpaper method");
            mockApplication.getEnv = function (envName) {
                if (envName === "HOME") {
                    return "/accounts/1000/appdata/data";
                }
            };
            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        getApplication: jasmine.createSpy().andReturn(mockApplication)
                    }
                }
            };
        });

        afterEach(function () {
            mockApplication.newWallpaper = null;
            mockApplication = null;
            delete GLOBAL.window;
        });

        it("calls setWallpaper with success callback at the end for NOT local path", function () {
            var filePath = "/accounts/1000/shared/camera/IMG_00000001.jpg",
                request = {wallpaper: encodeURIComponent(JSON.stringify(filePath))};

            sysIndex.setWallpaper(null, null, request);

            expect(mockApplication.newWallpaper).toHaveBeenCalledWith(filePath);
            expect(mockedPluginResult.ok).toHaveBeenCalled();
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });

        it("calls setWallpaper with success callback at the end for local path", function () {
            var imageName = "IMG_00000001.jpg",
                localPath = "local:///" + imageName,
                request = {wallpaper: encodeURIComponent(JSON.stringify(localPath))},
                tranlatedPath;

            sysIndex.setWallpaper(null, null, request);
            tranlatedPath = mockApplication.newWallpaper.mostRecentCall.args[0];

            // Checking if the image name is at the end of translated path
            expect(tranlatedPath.indexOf(imageName)).toEqual(tranlatedPath.length - imageName.length);

            expect(mockedPluginResult.ok).toHaveBeenCalled();
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });

        it("calls setWallpaper with path no prefixed 'file://' for NOT local path", function () {
            var filePathPrefix = "file://",
                filePath = "/accounts/1000/shared/camera/IMG_00000001.jpg",
                request = {wallpaper: encodeURIComponent(JSON.stringify(filePathPrefix + filePath))};

            sysIndex.setWallpaper(null, null, request);

            expect(mockApplication.newWallpaper).toHaveBeenCalledWith(filePath);
        });

        it("calls setWallpaper with path no prefixed 'file://' for local path", function () {
            var excludedPrefix = "file://",
                localPath = "local:///accounts/1000/shared/camera/IMG_00000001.jpg",
                request = {wallpaper: encodeURIComponent(JSON.stringify(localPath))},
                tranlatedPath;

            sysIndex.setWallpaper(null, null, request);
            tranlatedPath = mockApplication.newWallpaper.mostRecentCall.args[0];

            // Checking the tranlated path not prefixed with 'file://'
            expect(tranlatedPath.indexOf(excludedPrefix)).toEqual(-1);
        });
    });

    describe("deviceLockedStatus", function () {
        var mockApplication;

        beforeEach(function () {
            mockApplication = {};

            mockApplication.isDeviceLocked = jasmine.createSpy("isDeviceLocked").andCallFake(function (callback) {
                callback("notLocked");
            });

            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        getApplication: jasmine.createSpy().andReturn(mockApplication)
                    }
                }
            };
        });

        afterEach(function () {
            mockApplication.isDeviceLocked = null;
            mockApplication = null;
            delete GLOBAL.window;
        });

        it("returns status from webplatform", function () {
            sysIndex.deviceLockedStatus();
            expect(mockApplication.isDeviceLocked).toHaveBeenCalledWith(jasmine.any(Function));
            expect(mockedPluginResult.ok).toHaveBeenCalledWith("notLocked", false);
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });
    });

    describe("dataLockState", function () {
        var mockApplication;

        beforeEach(function () {
            mockApplication = {};

            mockApplication.getDataLockState = jasmine.createSpy("getDataLockState").andCallFake(function (callback) {
                callback("notLocked");
            });

            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        getApplication: jasmine.createSpy().andReturn(mockApplication)
                    }
                }
            };
        });

        afterEach(function () {
            mockApplication.getDataLockState = null;
            mockApplication = null;
            delete GLOBAL.window;
        });

        it("returns status from webplatform", function () {
            sysIndex.dataLockState();
            expect(mockApplication.getDataLockState).toHaveBeenCalledWith(jasmine.any(Function));
            expect(mockedPluginResult.ok).toHaveBeenCalledWith("notLocked", false);
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });
    });

    describe("dataLockTime", function () {
        var mockApplication;

        beforeEach(function () {
            mockApplication = {};

            mockApplication.getDataLockTime = jasmine.createSpy("getDataLockTime").andCallFake(function (callback) {
                callback(0);
            });

            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        getApplication: jasmine.createSpy().andReturn(mockApplication)
                    }
                }
            };
        });

        afterEach(function () {
            mockApplication.getDataLockTime = null;
            mockApplication = null;
            delete GLOBAL.window;
        });

        it("returns status from webplatform", function () {
            sysIndex.dataLockTime();
            expect(mockApplication.getDataLockTime).toHaveBeenCalledWith(jasmine.any(Function));
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(0, false);
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });
    });
});
