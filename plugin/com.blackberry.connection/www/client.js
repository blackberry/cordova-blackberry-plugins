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

var _self = {},
    _ID = "com.blackberry.connection",
    exec = cordova.require("cordova/exec"),
    events = ["connectionchange"],
    UNKNOWN = "unknown";

events.map(function (eventName) {
    var channel = cordova.addDocumentEventHandler(eventName),
        success = function (data) {
            channel.fire(data);
        },
        fail = function (error) {
            console.log("Error initializing " + eventName + " listener: ", error);
        };
    channel.onHasSubscribersChange = function () {
        if (this.numHandlers === 1) {
            exec(success, fail, _ID, "startEvent", {eventName: eventName});
        } else if (this.numHandlers === 0) {
            exec(function () {}, function () {}, _ID, "stopEvent", {eventName: eventName});
        }
    };
});

function defineReadOnlyField(obj, field, value) {
    Object.defineProperty(obj, field, {
        "value": value,
        "writable": false
    });
}

Object.defineProperty(_self, "type", {
    get: function () {
        var type,
            success = function (data, response) {
                type = data;
            },
            fail = function (data, response) {
                throw data;
            };

        try {
            exec(success, fail, _ID, "type");
        } catch (e) {
            type = UNKNOWN;
            console.error(e);
        }

        return type;
    }
});

/*
 * Define constants for type constants
 */
defineReadOnlyField(_self, "UNKNOWN", UNKNOWN);
defineReadOnlyField(_self, "ETHERNET", "ethernet");
defineReadOnlyField(_self, "WIFI", "wifi");
defineReadOnlyField(_self, "BLUETOOTH_DUN", "bluetooth_dun");
defineReadOnlyField(_self, "USB", "usb");
defineReadOnlyField(_self, "VPN", "vpn");
defineReadOnlyField(_self, "BB", "rim-bb");
defineReadOnlyField(_self, "CELL_4G", "4g");
defineReadOnlyField(_self, "NONE", "none");
defineReadOnlyField(_self, "CELL_2G", "2g");
defineReadOnlyField(_self, "CELL_3G", "3g");

module.exports = _self;
