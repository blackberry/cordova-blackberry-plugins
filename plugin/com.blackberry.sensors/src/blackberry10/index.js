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

var sensors = require("./sensorsJNEXT").sensors,
    _utils = require("../../lib/utils"),
    _sensorEvents = require("./sensorsEvents"),
    _actionMap = {
        deviceaccelerometer: {
            context: _sensorEvents,
            event: "deviceaccelerometer",
            triggerEvent: "deviceaccelerometer",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        devicemagnetometer: {
            context: _sensorEvents,
            event: "devicemagnetometer",
            triggerEvent: "devicemagnetometer",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        devicegyroscope: {
            context: _sensorEvents,
            event: "devicegyroscope",
            triggerEvent: "devicegyroscope",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        devicecompass: {
            context: _sensorEvents,
            event: "devicecompass",
            triggerEvent: "devicecompass",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        deviceproximity: {
            context: _sensorEvents,
            event: "deviceproximity",
            triggerEvent: "deviceproximity",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        devicelight: {
            context: _sensorEvents,
            event: "devicelight",
            triggerEvent: "devicelight",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        devicegravity: {
            context: _sensorEvents,
            event: "devicegravity",
            triggerEvent: "devicegravity",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        devicelinearacceleration: {
            context: _sensorEvents,
            event: "devicelinearacceleration",
            triggerEvent: "devicelinearacceleration",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        devicerotationmatrix: {
            context: _sensorEvents,
            event: "devicerotationmatrix",
            triggerEvent: "devicerotationmatrix",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        deviceorientation: {
            context: _sensorEvents,
            event: "deviceorientation",
            triggerEvent: "deviceorientation",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        deviceazimuthpitchroll: {
            context: _sensorEvents,
            event: "deviceazimuthpitchroll",
            triggerEvent: "deviceazimuthpitchroll",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        deviceholster: {
            context: _sensorEvents,
            event: "deviceholster",
            triggerEvent: "deviceholster",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        }
    },
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

    setOptions: function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        if (args.options) {
            args.options = JSON.parse(decodeURIComponent(args.options));

            if (!args.options.sensor) {
                result.error(-1, "Must specify a sensor");
                return;
            }

            if (args.options.delay && typeof(args.options.delay) !== "number") {
                result.error(-1, "Delay must be a number");
                return;
            }

            if (args.options.queue && typeof(args.options.queue) !== "boolean") {
                result.error(-1, "Queue must be a boolean value");
                return;
            }

            if (args.options.batching && typeof(args.options.batching) !== "boolean") {
                result.error(-1, "Batching must be a boolean value");
                return;
            }

            if (args.options.background && typeof(args.options.background) !== "boolean") {
                result.error(-1, "Background must be a booleani value");
                return;
            }

            if (args.options.reducedReporting && typeof(args.options.reducedReporting) !== "boolean") {
                result.error(-1, "Reduced reporting must be a boolean value");
                return;
            }

            sensors.getInstance().setOptions(args.options);
            result.ok(null, false);
        } else {
            result.error(-1, "Need to specify arguments");
        }
    },

    supportedSensors: function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        result.ok(sensors.getInstance().supportedSensors(), false);
    }
};
