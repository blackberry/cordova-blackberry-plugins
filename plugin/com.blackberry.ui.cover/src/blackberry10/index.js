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

var _utils = require("./../../lib/utils"),
    _appEvents = require("./../../lib/events/applicationEvents"),
    _listeners = {},
    _actionMap = {
        entercover: {
            event: "windowCoverEnter",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        },
        exitcover: {
            event: "windowCoverExit",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        }
    };

function processCover(cover) {
    if (cover.cover.type === 'file') {
        cover.cover.path = _utils.translatePath(cover.cover.path).replace(/file:\/\//, '');
    }
    return cover;
}

module.exports = {

    startEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            systemEvent = _actionMap[eventName].event,
            listener = _actionMap[eventName].trigger.bind(null, result);

        if (!_listeners[eventName]) {
            _listeners[eventName] = {};
        }

        if (_listeners[eventName][env.webview.id]) {
            //TODO: Change back to erroring out after reset is implemented
            //result.error("Underlying listener for " + eventName + " already running for webview " + env.webview.id);
            _appEvents.removeEventListener(systemEvent, _listeners[eventName][env.webview.id]);
        }

        _appEvents.addEventListener(systemEvent, listener);
        _listeners[eventName][env.webview.id] = listener;
        result.noResult(true);
    },

    stopEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            listener = _listeners[eventName][env.webview.id],
            systemEvent = _actionMap[eventName].event;

        if (!listener) {
            result.error("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        } else {
            _appEvents.removeEventListener(systemEvent, listener);
            delete _listeners[eventName][env.webview.id];
            result.noResult(false);
        }
    },

    resetCover: function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        try {
            window.wp.getApplication().updateCover({"cover": "reset"});
            result.ok(null, false);
        } catch (e) {
            console.log(e);
            result.error("Unable to reset cover");
        }
    },

    coverSize: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            coverSize,
            response;
        try {
            coverSize = window.wp.getApplication().coverSize;
            response = (typeof coverSize === "string") ? JSON.parse(coverSize) : coverSize;
            result.ok(response, false);
        } catch (e) {
            console.log(e);
            result.error("Unable to get coverSize");
        }
    },

    updateCover: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            processedCover;
        try {
            processedCover = processCover(JSON.parse(decodeURIComponent(args.cover)));
            window.wp.getApplication().updateCover(processedCover);
            result.ok(null, false);
        } catch (e) {
            console.log(e);
            result.error("Unable to update cover");
        }
    }
};
