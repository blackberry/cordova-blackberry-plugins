/*
 * Copyright 2012 Research In Motion Limited.
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
var _apiDir = __dirname + "/../../../plugin/com.blackberry.app/",
    _libDir = __dirname + "/../../../lib/",
    index,
    mockedMinimize,
    mockedExit,
    mockedRotate,
    mockedLockRotation,
    mockedUnlockRotation,
    mockedWindowState,
    mockedQnx,
    mockedPluginResult,
    config;

function getWebPlatformEventName(e) {
    switch (e) {
    case "pause":
        return "inactive";
    case "resume":
        return "active";
    case "windowstatechanged":
        return "stateChange";
    case "orientationchange":
        return [ 'rotate', 'rotateWhenLocked' ];
    default:
        return e;
    }
}


describe("app index", function () {

    beforeEach(function () {
        config = require(_libDir + "config");
        index = require(_apiDir + "index");
        mockedMinimize = jasmine.createSpy("minimize");
        mockedExit = jasmine.createSpy("exit");
        mockedRotate = jasmine.createSpy();
        mockedLockRotation = jasmine.createSpy();
        mockedUnlockRotation = jasmine.createSpy();
        mockedWindowState = jasmine.createSpy("windowState");
        mockedQnx = {
            webplatform: {
                getApplication: function () {
                    return {
                        minimizeWindow: mockedMinimize,
                        exit: mockedExit,
                        rotate: mockedRotate,
                        lockRotation: mockedLockRotation,
                        unlockRotation: mockedUnlockRotation,
                        windowState: mockedWindowState
                    };
                }
            }
        };
        GLOBAL.window = {
            qnx: mockedQnx
        };
        GLOBAL.qnx = mockedQnx;
        mockedPluginResult = {
            ok: jasmine.createSpy("PluginResult.ok"),
            error: jasmine.createSpy("PluginResult.error"),
            noResult: jasmine.createSpy("PluginResult.noResult")
        };
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.qnx;
        require.cache = {};
    });

    describe("getReadOnlyFields", function () {
        it("can call ok", function () {
            var expectedReturn = {
                    author : "Me",
                    authorEmail : "guocat@gmail.com",
                    authorURL : "http://bbtools_win7_01/yui",
                    copyright : "@Rebecca",
                    description : "this is the description",
                    id : "",
                    license : "This is a license",
                    licenseURL : "",
                    name : "wwTest",
                    version : "1.0.0.0"
                };
            index.getReadOnlyFields(mockedPluginResult);
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(expectedReturn, false);
        });
    });

    describe("lockOrientation", function () {
        it("calls webplatform rotate and lock methods", function () {
            var mockArgs = { orientation : encodeURIComponent("\"landscape-primary\""), recieveRotateEvents: undefined };

            index.lockOrientation(mockedPluginResult, mockArgs);
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(true, false);
            expect(mockedRotate).toHaveBeenCalledWith("left_up");
            expect(mockedLockRotation).toHaveBeenCalledWith(true);
        });
        it("allows recieveRotateEvents to be set to false", function () {
            var mockArgs = { recieveRotateEvents: false, orientation : encodeURIComponent("\"landscape-primary\"") };

            index.lockOrientation(mockedPluginResult, mockArgs, null);
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(true, false);
            expect(mockedRotate).toHaveBeenCalledWith("left_up");
            expect(mockedLockRotation).toHaveBeenCalledWith(false);
        });
    });

    describe("unlockOrientation", function () {
        it("calls webplatform unlockRotation method", function () {
            index.unlockOrientation(mockedPluginResult);
            expect(mockedPluginResult.ok).toHaveBeenCalled();
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
            expect(mockedUnlockRotation).toHaveBeenCalled();
        });
    });

    describe("rotate", function () {
        it("calls webplatform rotate method", function () {
            index.rotate(mockedPluginResult, {orientation: encodeURIComponent("\"landscape\"")});
            expect(mockedPluginResult.ok).toHaveBeenCalled();
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
            expect(mockedRotate).toHaveBeenCalledWith('left_up');
        });
        it("calls result.error when the orientation is invalid", function () {
            index.rotate(mockedPluginResult, {orientation: encodeURIComponent("\"UpsideDown\"")});
            expect(mockedPluginResult.ok).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalledWith(jasmine.any(String));
            expect(mockedRotate).not.toHaveBeenCalled();
        });
    });

    describe("currentOrientation", function () {
        it("converts 0 degrees from window.orientation to portrait-primary", function () {
            window.orientation = 0;

            index.currentOrientation(mockedPluginResult);
            expect(mockedPluginResult.ok).toHaveBeenCalledWith("portrait-primary", false);
        });

        it("converts 90 degrees from window.orientation to portrait-primary", function () {
            window.orientation = 90;

            index.currentOrientation(mockedPluginResult);
            expect(mockedPluginResult.ok).toHaveBeenCalledWith("landscape-secondary", false);
        });

        it("converts 180 degrees from window.orientation to portrait-primary", function () {
            window.orientation = 180;

            index.currentOrientation(mockedPluginResult);
            expect(mockedPluginResult.ok).toHaveBeenCalledWith("portrait-secondary", false);
        });

        it("converts -90 degrees from window.orientation to portrait-primary", function () {
            window.orientation = -90;

            index.currentOrientation(mockedPluginResult);
            expect(mockedPluginResult.ok).toHaveBeenCalledWith("landscape-primary", false);
        });

        it("converts 270 degrees from window.orientation to portrait-primary", function () {
            window.orientation = 270;
            index.currentOrientation(mockedPluginResult);
            expect(mockedPluginResult.ok).toHaveBeenCalledWith("landscape-primary", false);
        });
    });

    describe("minimize", function () {
        it("can call minimize on the qnx.weblplatform Application", function () {
            index.minimize(mockedPluginResult);
            expect(mockedMinimize).toHaveBeenCalled();
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(null, false);
        });
    });

    describe("exit", function () {
        it("can call exit on the qnx.weblplatform Application", function () {
            index.exit(mockedPluginResult);
            expect(mockedExit).toHaveBeenCalled();
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(null, false);
        });
    });

    describe("windowState", function () {
        it("can call ok with windowState", function () {
            index.windowState(mockedPluginResult);
            expect(mockedPluginResult.ok).toHaveBeenCalledWith(mockedWindowState, false);
        });
    });

    describe("events", function () {

        it("startEvent", function () {
            var applicationEvents = require(_libDir + "events/applicationEvents"),
                eventName = "windowstatechanged",
                env = {webview: {id: 42 }};

            spyOn(applicationEvents, "addEventListener");
            spyOn(applicationEvents, "removeEventListener");

            index.startEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(applicationEvents.addEventListener).toHaveBeenCalledWith("stateChange", jasmine.any(Function));
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);

            //Will remove if adding twice
            index.startEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(applicationEvents.removeEventListener).toHaveBeenCalledWith("stateChange", jasmine.any(Function));
        });

        it("stopEvent", function () {
            var applicationEvents = require(_libDir + "events/applicationEvents"),
                eventName = "windowstatechanged",
                env = {webview: {id: 42 }};

            spyOn(applicationEvents, "addEventListener");
            spyOn(applicationEvents, "removeEventListener");

            index.startEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            index.stopEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(applicationEvents.removeEventListener).toHaveBeenCalledWith("stateChange", jasmine.any(Function));
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(false);

            //Will not stop an unstarted event
            index.stopEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(mockedPluginResult.error).toHaveBeenCalledWith("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        });

    });

});
