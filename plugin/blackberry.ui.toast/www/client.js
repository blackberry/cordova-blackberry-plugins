/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

cordova.define("cordova/plugin/blackberry.ui.toast", function (require, exports, module) {
    var toast = {},
        ID = "blackberry.ui.toast",
        _listeningForCallbacks = false,
        _storedButtonCallbacks = {},
        _storedDismissCallbacks = {};


    // Register to listen to all toast callbacks
    window.webworks.event.add("blackberry.event", 'toast.callback', function (toastId) {
        if (typeof _storedButtonCallbacks[toastId] === 'function') {
            //Dispatch the proper toast callback
            _storedButtonCallbacks[toastId]();
            delete _storedButtonCallbacks[toastId];
        }
    });


    window.webworks.event.add("blackberry.event", 'toast.dismiss', function (toastId) {
        if (typeof _storedDismissCallbacks[toastId] === 'function') {
            _storedDismissCallbacks[toastId]();
            delete _storedDismissCallbacks[toastId];

        }
        // No matter what remove the stored button callback since we dismissed the toast
        if (typeof _storedButtonCallbacks[toastId] === 'function') {
            delete _storedButtonCallbacks[toastId];
        }
    });

    toast.show = function (message, options) {
        var toastId = window.webworks.execSync(ID, 'show', {message : message, options : options});

        if (options && options.buttonCallback) {
            _storedButtonCallbacks[toastId] = options.buttonCallback;
        }
        if (options && options.dismissCallback) {
            _storedDismissCallbacks[toastId] = options.dismissCallback;
        }
        return toastId;
    };

    module.exports = toast;
});

if (typeof blackberry === "undefined") {
    blackberry = {};
}

if (typeof blackberry.ui === "undefined") {
    blackberry.ui = {};
}

blackberry.ui.toast = cordova.require("cordova/plugin/blackberry.ui.toast");
