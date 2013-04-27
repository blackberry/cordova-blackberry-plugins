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

var _utils = require("../../lib/utils"),
    _deviceEvents = require("../../lib/events/deviceEvents"),
    _lastType,
    _listeners = {},
    _actionMap;

function mapConnectionType(type, technology) {
    switch (type) {
    case 'wired':
        return 'ethernet';
    case 'wifi':
        return 'wifi';
    case 'bluetooth_dun':
        return 'bluetooth_dun';
    case 'usb':
        return 'usb';
    case 'vpn':
        return 'vpn';
    case 'bb':
        return 'rim-bb';
    case 'unknown':
        return 'unknown';
    case 'none':
        return 'none';
    case 'cellular':
        switch (technology) {
        case 'edge':
        case 'gsm':
            return '2g';
        case 'evdo':
            return '3g';
        case 'umts':
            return '3g';
        case 'lte':
            return '4g';
        }
    }
    return 'unknown';
}

function currentConnectionType() {
    var connInfo = qnx.webplatform.device.activeConnection;
    if (connInfo === null) {
        connInfo = {
            type: 'none'
        };
    }
    return mapConnectionType(connInfo.type, connInfo.technology);
}

_actionMap = {
    connectionchange: {
        event: "connectionChange",
        trigger: function (pluginResult, args) {
            var currentType = currentConnectionType();
            if (_lastType && currentType !== _lastType) {
                pluginResult.callbackOk({oldType: _lastType, newType: currentType}, true);
            }
            _lastType = currentType;
        }
    }
};

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
            _deviceEvents.removeEventListener(systemEvent, _listeners[eventName][env.webview.id]);
        }

        _deviceEvents.addEventListener(systemEvent, listener);
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
            _deviceEvents.removeEventListener(systemEvent, listener);
            delete _listeners[eventName][env.webview.id];
            result.noResult(false);
        }
    },

    type: function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        try {
            result.ok(currentConnectionType(), false);
        } catch (e) {
            result.error(e, false);
        }
    }
};
