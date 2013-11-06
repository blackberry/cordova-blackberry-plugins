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
var _push,
    _results = {};

module.exports = {
    startService: function (result, args, env) {
        var pushOptions = { "invokeTargetId" : args.invokeTargetId,
                            "appId" : args.appId,
                            "ppgUrl" : args.ppgUrl };

        _results["push.create.callback"] = result;
        _push.getInstance().startService(pushOptions);
        result.noResult(true);
    },

    createChannel: function (result, args, env) {
        _results["push.createChannel.callback"] = result;
        _push.getInstance().createChannel(args);
        result.noResult(true);
    },

    destroyChannel: function (result, args, env) {
        _results["push.destroyChannel.callback"] = result;
        _push.getInstance().destroyChannel(args);
        result.noResult(true);
    },

    extractPushPayload: function (result, args, env) {
        var invokeData = { "data" : args.data };

        result.ok(_push.getInstance().extractPushPayload(invokeData));
    },

    launchApplicationOnPush: function (result, args, env) {
        _results["push.launchApplicationOnPush.callback"] = result;
        _push.getInstance().launchApplicationOnPush(args.shouldLaunch);
        result.noResult(true);
    },

    acknowledge: function (result, args, env) {
        var acknowledgeData = { "id" : args.id,
                                "shouldAcceptPush" : args.shouldAcceptPush };

        _push.getInstance().acknowledge(acknowledgeData);
        result.ok();
    },

    registerCallback: function (result, args, env) {
        var id = args.id;

        _results[id] = result;
        result.noResult(true);
    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.Push = function () {
    var self = this,
        hasInstance = false;

    self.startService = function (args) {
        JNEXT.invoke(self.m_id, "startService " + JSON.stringify(args));
    };

    self.createChannel = function (args) {
        JNEXT.invoke(self.m_id, "createChannel");
    };

    self.destroyChannel = function (args) {
        JNEXT.invoke(self.m_id, "destroyChannel");
    };

    self.extractPushPayload = function (args) {
        var payload = JNEXT.invoke(self.m_id, "extractPushPayload " + JSON.stringify(args));
        return JSON.parse(payload.substring(payload.indexOf("{"), payload.lastIndexOf("}") + 1));
    };

    self.launchApplicationOnPush = function (args) {
        var shouldLaunch = args;

        if (shouldLaunch) {
            JNEXT.invoke(self.m_id, "registerToLaunch");
        } else {
            JNEXT.invoke(self.m_id, "unregisterFromLaunch");
        }
    };

    self.acknowledge = function (args) {
        JNEXT.invoke(self.m_id, "acknowledge " + JSON.stringify(args));
    };

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("libpushjnext")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libpushjnext.Push");

        if (self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    self.onEvent = function (strData) {
        var arData = strData.split(" "),
            strEventId = arData[0],
            args = arData[1],
            info = {};

        // Trigger the event handler of specific Push events
        if (strEventId === "push.create.callback") {
            _results[strEventId].callbackOk(JSON.parse(args), false);

        } else if (strEventId === "push.create.simChangeCallback") {
            _results[strEventId].callbackOk(null, false);

        } else if (strEventId === "push.create.pushTransportReadyCallback") {
            _results[strEventId].callbackOk(JSON.parse(args), true);

        } else if (strEventId === "push.createChannel.callback") {
            info.result = JSON.parse(arData[1]);
            info.token = arData[2];
            _results[strEventId].callbackOk(info, false);

        } else if (strEventId === "push.destroyChannel.callback") {
            _results[strEventId].callbackOk(JSON.parse(args), false);

        } else if (strEventId === "push.launchApplicationOnPush.callback") {
            _results[strEventId].callbackOk(JSON.parse(args), false);

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

_push = new JNEXT.Push();
