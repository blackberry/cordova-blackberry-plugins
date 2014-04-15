/*
 * Copyright 2014 BlackBerry Limited
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
var barcodescannerJNEXT,
    resultObjs = {},
    readCallbackId,
    startedFlag = false,
    endedFlag = false,
    _utils = require("../../lib/utils");

module.exports = {

    // methods to start and stop scanning
    startRead: function (success, fail, args, env) {
        var result = new PluginResult(args, env);

        readCallbackId = result.callbackId;
        resultObjs[readCallbackId] = result;
        result.ok(barcodescannerJNEXT.getInstance().startRead(result.callbackId), true);
        success();
    },
    stopRead: function (success, fail, args, env) {
        var result = new PluginResult(args, env);

        resultObjs[result.callbackId] = result;
        result.ok(barcodescannerJNEXT.getInstance().stopRead(result.callbackId), true);
        success();
    },
    add: function (success, fail) {
        console.log('Frame Available event listening');
    },
    remove: function (success, fail) {
        console.log('End listening to frames');
    }
};


JNEXT.BarcodeScannerJNEXT = function () {
    var self = this,
        hasInstance = false;

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("libbarcodescanner")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libbarcodescanner.BarcodeScannerJS");

        if (self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    // Fired by the Event framework (used by asynchronous callbacks)

    self.onEvent = function (strData) {
        var result,
            arData = strData.split(" "),
            receivedEvent = arData[0],
            data = receivedEvent +  " " + arData[1],
            callbackId = arData[2] || "",
            events = [
                "community.barcodescanner.codefound.native",
                "community.barcodescanner.errorfound.native",
                "community.barcodescanner.frameavailable.native",
                "community.barcodescanner.started.native",
                "community.barcodescanner.ended.native"
            ];

        if (receivedEvent === "community.barcodescanner.started.native") {
            endedFlag = false;
        }

        if (receivedEvent === "community.barcodescanner.ended.native") {
            startedFlag = false;
            endedFlag = true;
            result = resultObjs[callbackId];
            result.callbackOk(data, true);
            delete resultObjs[readCallbackId];
            readCallbackId = null;
        }

        if (!endedFlag) {
            if (!startedFlag) {
                result = resultObjs[callbackId];
                startedFlag = true;
            } else {
                result = resultObjs[readCallbackId];
            }

            if (events.indexOf(receivedEvent) !== -1) {
                result.callbackOk(data, true);
            }
        }

    };

    // Thread methods
    self.startRead = function (callbackId) {
        return JNEXT.invoke(self.m_id, "startRead " + callbackId);
    };
    self.stopRead = function (callbackId) {
        return JNEXT.invoke(self.m_id, "stopRead " + callbackId);
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

barcodescannerJNEXT = new JNEXT.BarcodeScannerJNEXT();
