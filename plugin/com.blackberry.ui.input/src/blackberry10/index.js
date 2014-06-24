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

/*
{ altActive: false,
  ctrlActive: false,
  isPost: true,
  isSend: false,
  modifiers: 0,
  shiftActive: false,
  timeStamp: 70491647507582,
  touchEventType: 'TouchStart',
  touchPoints:
   [ { id: 0,
       pixelViewportPosition: { x: 1243, y: 1780 },
       screenPosition: { x: 1243, y: 1780 },
       state: 'TouchPressed' } ],
  touchSourceDevice: 'CapacitiveKeyboard',
  type: 'UnhandledTouch' }
*/

/* these functions will be called once to return values which will be
 * constant for the life span of an instantiated app instance
 */
function getScreenHeight() { return screen.height; }
function getScreenWidth() { return screen.width; }
function getKeyboardOffset() { return 72; }
function getKeyboardHeight() { return 480; }

var _screenHeight = getScreenHeight(),
    _screenWidth = getScreenWidth(),
    _keyboardOffset = getKeyboardOffset(),
    _keyboardHeight = getKeyboardHeight(),
    _appEvents = require("./../../lib/events/applicationEvents"),
    _orientation,
    _shift,
    _eventMap = {
        TouchPressed: "keyboardtouchstart",
        TouchMoved: "keyboardtouchmove",
        TouchReleased: "keyboardtouchend"
    },
    _actionMap = {
        keyboardtouchstart: {
            event: "keyboardtouchstart",
            trigger: function (pluginResult, data) {
                pluginResult.callbackOk(data, true);
            }
        },
        keyboardtouchmove: {
            event: "keyboardtouchmove",
            trigger: function (pluginResult, data) {
                pluginResult.callbackOk(data, true);
            }
        },
        keyboardtouchend: {
            event: "keyboardtouchend",
            trigger: function (pluginResult, data) {
                pluginResult.callbackOk(data, true);
            }
        }
    },
    /* Input:
     *
     *   Top left corner of the screen is 0,0
     *   The bottom right of the screen is 1440,1440
     *
     * PP   0 - the BlackBerry LED at the top right
     *   The keyboard starts at 0,1440 and runs to 1440,1440+{keyboardheight}
     * LP -90 - the BlackBerry LED at bottom right (phone rotated to the right)
     *   The keyboard starts at -{rotated-keyboardheight},0 and runs to 0,1440
     * LS  90 - the BlackBerry LED at top left (phone rotated to the left)
     *   The keyboard starts at 1440,0 and runs to 1440+{keyboardheight},1440
     *
     * The matrix needs to be picked to do something useful
     */
    _listeners = {};

updateShift("portrait-primary");

function updateShift(o) {
    o = o || 'unknown';
    switch(o) {
        case "portrait-primary":
            _shift = {x: 0, y: - _screenHeight - _keyboardOffset};
            break;

        case "landscape-primary":
            _shift = {x: _keyboardHeight, y: 0};
            break;

        case "portrait-secondary":
            _shift = {x: 0, y: _keyboardHeight + _keyboardOffset};
            break;

        case "landscape-secondary":
            _shift = {x: - _screenHeight - _keyboardOffset, y: 0};
            break;

        default:
            _shift = {x: 0, y: 0};
    }

    _orientation = o;
    return _shift;
}

/* This takes an UnhandledTouch event:
 * filters it,
 * transforms the coordinates,
 * and then should send that off to the application...
 */
function processTouchEvent(env, e) {
    var point, state, type, listener;
    e = JSON.parse(e);
    if (e.touchSourceDevice !== 'CapacitiveKeyboard' ||
        !e.touchPoints ||
        !e.touchPoints.length) {
        return;
    }
    point = e.touchPoints[0];
    state = point.state;
    type = _eventMap[state];
    if (!_listeners[type] ||
        !_listeners[type][env.webviewId]) {
        return;
    }
    listener = _listeners[type][env.webviewId];
    listener({
        type: type,
        x: point.screenPosition.x + _shift.x,
        y: point.screenPosition.y + _shift.y,
        timeStamp: e.timeStamp
    });
}

function angleToOrientation(angle) {
    var orientation;

    switch (angle) {
    case 0:
        orientation = 'portrait-primary';
        break;
    case 90:
        orientation = 'landscape-secondary';
        break;
    case 180:
        orientation = 'portrait-secondary';
        break;
    case -90:
    case 270:
        orientation = 'landscape-primary';
        break;
    default:
        orientation = "unknown";
        break;
    }

    return orientation;
}

function edgeToOrientation(edge) {
    switch (edge) {
    case "left_up":
        return "landscape-primary";
    case "top_up":
        return "portrait-primary";
    case "bottom_up":
        return "portrait-secondary";
    case "right_up":
        return "landscape-secondary";
    default:
        return "unknown";
    }
}

function translateToDeviceOrientation(orientation) {
    // Convert HTML5 orientation syntax into device syntax
    switch (orientation) {
    case 'portrait':
    case 'portrait-primary':
        return 'top_up';

    case 'landscape':
    case 'landscape-primary':
        return 'left_up';

    case 'portrait-secondary':
        return 'bottom_up';

    case 'landscape-secondary':
        return 'right_up';

    default:
        return 'unknown';
    }
}
function rotateTrigger(width, height, angle) {
    updateShift(angleToOrientation(angle));
}

function rotateWhenLockedTrigger(edge) {
    updateShift(edgeToOrientation(edge));
}

var listenerCount = 0;
function register(env) {
    if (listenerCount++) {
        return;
    }

    try {
        qnx.webplatform.getWebViewById(env.webview.id).on("UnhandledTouch", processTouchEvent);
    } catch(e) {
        console.log(e);
    }
    _appEvents.addEventListener("rotate", rotateTrigger);
    _appEvents.addEventListener("rotateWhenLocked", rotateWhenLockedTrigger);
}

function unregister(env) {
    if (!listenerCount--) {
        return;
    }
    try {
        qnx.webplatform.getWebViewById(env.webview.id).un("UnhandledTouch", processTouchEvent);
    } catch(e) {
        console.log(e);
    }
    _appEvents.removeEventListener("rotate", rotateTrigger);
    _appEvents.removeEventListener("rotateWhenLocked", rotateWhenLockedTrigger);
}

module.exports = {

    startEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            ev = _actionMap[eventName],
            listener = ev.trigger.bind(null, result);

        if (!_listeners[eventName]) {
            _listeners[eventName] = {};
        }

        if (!_listeners[eventName][env.webview.id]) {
            register(env);
        }

        _listeners[eventName][env.webview.id] = listener;
        result.noResult(true);
    },

    stopEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            listener = _listeners[eventName][env.webview.id],
            ev = _actionMap[eventName];

        if (!listener) {
            result.error("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        } else {
            unregister(env);
            delete _listeners[eventName][env.webview.id];
            result.noResult(false);
        }
    }
};
