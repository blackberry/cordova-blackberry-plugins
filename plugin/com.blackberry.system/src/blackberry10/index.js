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
var Whitelist = require("../../lib/policy/whitelist").Whitelist,
    _whitelist = new Whitelist(),
    _utils = require("../../lib/utils"),
    _applicationEvents = require("../../lib/events/applicationEvents"),
    _deviceEvents = require("../../lib/events/deviceEvents"),
    _actionMap = {
        batterystatus: {
            context: _deviceEvents,
            event: "battery.statusChange",
            triggerEvent: "batterystatus",
            trigger: function (pluginResult, data) {
                pluginResult.callbackOk(data, true);
            }
        },
        batterylow: {
            context: _deviceEvents,
            event: "battery.chargeLow",
            triggerEvent: "batterylow",
            trigger: function (pluginResult, data) {
                pluginResult.callbackOk(data, true);
            }
        },
        batterycritical: {
            context: _deviceEvents,
            event: "battery.chargeCritical",
            triggerEvent: "batterycritical",
            trigger: function (pluginResult, data) {
                pluginResult.callbackOk(data, true);
            }
        },
        languagechanged: {
            context: _applicationEvents,
            event: "systemLanguageChange",
            triggerEvent: "languagechanged",
            trigger: function (pluginResult, language) {
                pluginResult.callbackOk(language, true);
            }
        },
        regionchanged: {
            context: _applicationEvents,
            event: "systemRegionChange",
            triggerEvent: "regionchanged",
            trigger: function (pluginResult, region) {
                pluginResult.callbackOk(region, true);
            }
        },
        fontchanged: {
            context: _applicationEvents,
            event: "fontchanged",
            triggerEvent: "fontchanged",
            trigger: function (pluginResult, fontFamily, fontSize) {
                pluginResult.callbackOk({'fontFamily': fontFamily, 'fontSize': fontSize}, true);
            }
        },
        perimeterlocked: {
            context: _applicationEvents,
            event: "windowLock",
            triggerEvent: "perimeterlocked",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(null, true);
            }
        },
        perimeterunlocked: {
            context: _applicationEvents,
            event: "windowUnlock",
            triggerEvent: "perimeterunlocked",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(null, true);
            }
        }
    },
    ERROR_ID = -1,
    _listeners = {};

module.exports = {

    startEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            context = _actionMap[eventName].context,
            systemEvent = _actionMap[eventName].event,
            listener = _actionMap[eventName].trigger.bind(null, result);

        if (!_listeners[eventName]) {
            _listeners[eventName] = {};
        }

        if (_listeners[eventName][env.webview.id]) {
            result.error("Underlying listener for " + eventName + " already already running for webview " + env.webview.id);
        } else {
            context.addEventListener(systemEvent, listener);
            _listeners[eventName][env.webview.id] = listener;
            result.noResult(true);
        }
    },

    stopEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            listener = _listeners[eventName][env.webview.id],
            context = _actionMap[eventName].context,
            systemEvent = _actionMap[eventName].event;

        if (!listener) {
            result.error("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        } else {
            context.removeEventListener(systemEvent, listener);
            delete _listeners[eventName][env.webview.id];
            result.noResult(false);
        }
    },

    hasCapability: function (success, fail, args) {
        var SUPPORTED_CAPABILITIES = [
                "input.touch",
                "location.gps",
                "media.audio.capture",
                "media.video.capture",
                "media.recording",
                "network.bluetooth",
                "network.wlan"
            ],
            // TODO string argument surrounded by %22
            // preserve dot for capabiliity
            capability = args.capability.replace(/[^a-zA-Z.]+/g, "");

        success(SUPPORTED_CAPABILITIES.indexOf(capability) >= 0);
    },

    getFontInfo: function (success, fail) {
        var fontFamily,
            fontSize;

        try {
            fontFamily = window.qnx.webplatform.getApplication().getSystemFontFamily();
            fontSize = window.qnx.webplatform.getApplication().getSystemFontSize();

            success({'fontFamily': fontFamily, 'fontSize': fontSize});
        } catch (e) {
            fail(ERROR_ID, e);
        }
    },

    getDeviceProperties: function (success, fail) {
        try {
            var returnObj = {
                "hardwareId" : window.qnx.webplatform.device.hardwareId,
                "softwareVersion" : window.qnx.webplatform.device.scmBundle,
                "name" : window.qnx.webplatform.device.deviceName
            };
            success(returnObj);
        } catch (err) {
            fail(ERROR_ID, err.message);
        }
    },

    region: function (success, fail) {
        var region;

        try {
            region = window.qnx.webplatform.getApplication().systemRegion;
            success(region);
        } catch (e) {
            fail(ERROR_ID, e.message);
        }
    },

    getCurrentTimezone: function (success, fail) {
        try {
            success(window.qnx.webplatform.device.timezone);
        } catch (err) {
            fail(ERROR_ID, err.message);
        }
    },

    getTimezones: function (success, fail) {
        try {
            window.qnx.webplatform.device.getTimezones(success);
        } catch (err) {
            fail(ERROR_ID, err.message);
        }
    },

    setWallpaper: function (success, fail, args) {
        try {
            var path = _utils.translatePath(JSON.parse(decodeURIComponent(args.wallpaper)));

            // Removing file:// form the path because newWallpaper can't handle it.
            path = path.replace(/file:\/\//, '');
            window.qnx.webplatform.getApplication().newWallpaper(path);
            success();
        } catch (err) {
            fail(ERROR_ID, err.message);
        }
    },

    deviceLockedStatus: function (success, fail) {
        var callback;

        try {
            callback = function (state) {
                success(state);
            };
            window.qnx.webplatform.getApplication().isDeviceLocked(callback);
        } catch (err) {
            fail(ERROR_ID, err.message);
        }
    }
};
