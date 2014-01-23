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
var _apiDir = __dirname + "/../../../plugin/com.blackberry.connection/",
    _libDir = __dirname + "/../../../lib/",
    deviceEvents = require(_libDir + "events/deviceEvents"),
    mockedQnx,
    mockedPluginResult,
    index;

describe("connection index", function () {
    beforeEach(function () {
        GLOBAL.qnx = mockedQnx = {
            webplatform: {
                device: {
                    activeConnection: {
                        type: 'wifi',
                        technology: ''
                    }
                }
            }
        };
        GLOBAL.window = {
            qnx: mockedQnx
        };
        mockedPluginResult = {
            ok: jasmine.createSpy("PluginResult.ok"),
            error: jasmine.createSpy("PluginResult.error"),
            noResult: jasmine.createSpy("PluginResult.noResult"),
            callbackOk: jasmine.createSpy("PluginResult.callbackOk")
        };
        GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.qnx;
        delete GLOBAL.window;
        delete GLOBAL.PluginResult;
        mockedPluginResult = null;
    });

    describe("connection", function () {
        describe("type", function () {
            it("can call success", function () {
                var success = jasmine.createSpy();

                index.type(success);

                expect(mockedPluginResult.ok).toHaveBeenCalledWith("wifi", false);
            });

            it("can call fail", function () {
                var fail = jasmine.createSpy();
                delete mockedQnx.webplatform.device;

                index.type(null, fail, null, null);

                expect(mockedPluginResult.error).toHaveBeenCalledWith(jasmine.any(Object), false);
                expect(mockedPluginResult.error.calls[0].args[0].message).toEqual("Cannot read property 'activeConnection' of undefined");
            });

            it('maps device connection types to constants', function () {
                var map = {
                    'wired': 'ethernet',
                    'wifi': 'wifi',
                    'bluetooth_dun': 'bluetooth_dun',
                    'usb': 'usb',
                    'vpn': 'vpn',
                    'bb': 'rim-bb',
                    'unknown': 'unknown',
                    'none': 'none'
                };
                Object.getOwnPropertyNames(map).forEach(function (type) {
                    var success = jasmine.createSpy();
                    mockedQnx.webplatform.device.activeConnection.type = type;
                    index.type(success);
                    expect(mockedPluginResult.ok).toHaveBeenCalledWith(map[type], false);
                });
            });

            it('maps cellular technologies to appropriate constants', function () {
                var map = {
                    'edge': '2g',
                    'evdo': '3g',
                    'umts': '3g',
                    'lte': '4g'
                };

                mockedQnx.webplatform.device.activeConnection.type = 'cellular';
                Object.getOwnPropertyNames(map).forEach(function (technology) {
                    var success = jasmine.createSpy();
                    mockedQnx.webplatform.device.activeConnection.technology = technology;
                    index.type(success);
                    expect(mockedPluginResult.ok).toHaveBeenCalledWith(map[technology], false);
                });
            });
        });

        describe("connectionChange", function () {

            var noop = function () {};

            it("startEvent", function () {
                var eventName = "connectionchange",
                    env = {webview: {id: 42 }};

                spyOn(deviceEvents, "addEventListener");
                spyOn(deviceEvents, "removeEventListener");

                index.startEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
                expect(deviceEvents.addEventListener).toHaveBeenCalledWith("connectionChange", jasmine.any(Function));
                expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);

                //Will remove if adding twice
                index.startEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
                expect(deviceEvents.removeEventListener).toHaveBeenCalledWith("connectionChange", jasmine.any(Function));
            });

            it("stopEvent", function () {
                var eventName = "connectionchange",
                    env = {webview: {id: 42 }};

                spyOn(deviceEvents, "addEventListener");
                spyOn(deviceEvents, "removeEventListener");

                index.startEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
                index.stopEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
                expect(deviceEvents.removeEventListener).toHaveBeenCalledWith("connectionChange", jasmine.any(Function));
                expect(mockedPluginResult.noResult).toHaveBeenCalledWith(false);

                //Will not stop an unstarted event
                index.stopEvent(noop, noop, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
                expect(mockedPluginResult.error).toHaveBeenCalledWith("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
            });

        });

    });
});
