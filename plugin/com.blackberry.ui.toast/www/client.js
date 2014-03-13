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

var toast = {},
    execSync = cordova.require("cordova/exec"),
    ID = "com.blackberry.ui.toast";

toast.show = function (message, options) {
    var toastId,
        success = function (message) {
            if (message.reason === "buttonClicked") {
                if (typeof options.buttonCallback === "function") {
                    options.buttonCallback();
                }
            } else if (message.reason === "dismissed") {
                if (typeof options.dismissCallback === "function") {
                    options.dismissCallback();
                }
            } else if (message.reason === "created") {
                toastId = message.toastId;
            }
        },
        //TODO: Add an errorCallback to the options for this API and call it here
        fail = function (message) { };

    execSync(success, fail, ID, 'show', {message : message, options : options}, true);

    return toastId;
};

module.exports = toast;
