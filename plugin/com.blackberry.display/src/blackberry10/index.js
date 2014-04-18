/*
* Copyright (c) 2014 BlackBerry Limited.
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

var preventSleep,
    resultObjs = {},
    threadCallback = null;

module.exports = {

    // Code can be declared and used outside the module.exports object,
    // but any functions to be called by client.js need to be declared
    // here in this object.

    setPreventSleep: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            views = qnx.webplatform.getWebViews(),
            handle = null,
            z = -1,
            values,
            i;

        args = JSON.parse(decodeURIComponent(args.input));
        for (i = 0; i < views.length; i++) {
            if (views[i].visible && views[i].zOrder > z) {
                z = views[i].zOrder;
                handle = views[i].jsScreenWindowHandle;
            }
        }
        if (handle !== null) {
            values = { value: args, handle: handle };
            result.ok(preventSleep.getInstance().setPreventSleep(result.callbackId, values), false);
        } else {
            result.error("Unable to get window handle", false);
        }
    },
    isSleepPrevented: function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        result.ok(preventSleep.getInstance().isSleepPrevented() === "1", false);
    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin for connection
///////////////////////////////////////////////////////////////////

JNEXT.PreventSleep = function () {
    var self = this,
        hasInstance = false;

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("libdisplay")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libdisplay.PreventSleepJS");

        if (self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    self.setPreventSleep = function (callbackId, input) {
        return JNEXT.invoke(self.m_id, "setPreventSleep " + callbackId + " " + JSON.stringify(input));
    };
    self.isSleepPrevented = function () {
        return JNEXT.invoke(self.m_id, "isSleepPrevented");
    };
    // Fired by the Event framework (used by asynchronous callbacks)
    self.onEvent = function (strData) {
        var arData = strData.split(" "),
            callbackId = arData[0],
            result = resultObjs[callbackId],
            data = arData.slice(1, arData.length).join(" ");

        if (result) {
            result.callbackOk(data, false);
            delete resultObjs[callbackId];
        }
    };

    self.m_id = "";
    self.getInstance = function () {
        if (!hasInstance) {
            hasInstance = true;
            self.init();
        }
        return self;
    };

};

preventSleep = new JNEXT.PreventSleep();
