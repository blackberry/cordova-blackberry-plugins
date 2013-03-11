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

cordova.define("cordova/plugin/blackberry.io", function (require, exports, module) {
    var io = {},
        ID = "blackberry.io";

    function getFieldValue(field) {
        var value;

        try {
            value = window.webworks.execSync(ID, field);
        } catch (e) {
            console.error(e);
        }

        return value;
    }

    function defineGetter(field) {
        Object.defineProperty(io, field, {
            get: function () {
                return getFieldValue(field);
            }
        });
    }

    Object.defineProperty(io, "sandbox", {
        get: function () {
            return getFieldValue("sandbox");
        },

        set: function (value) {
            try {
                window.webworks.execSync(ID, "sandbox", {"sandbox": value});
            } catch (e) {
                console.error(e);
            }
        }
    });

    defineGetter("home");
    defineGetter("sharedFolder");
    defineGetter("SDCard");

    module.exports = io;
});

if (typeof blackberry === "undefined") {
    blackberry = {};
}

blackberry.io = cordova.require("cordova/plugin/blackberry.io");
