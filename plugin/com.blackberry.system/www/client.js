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
    ID = "com.blackberry.system",
    deviceProperties;

function getFieldValue(field, args) {
    var value = null,
        success = function (data, response) {
            value = data;
        },
        fail = function (data, response) {
            throw data;
        };

    try {
        window.webworks.exec(success, fail, ID, field, args);
    } catch (e) {
        console.error(e);
    }

    return value;
}

function getDeviceProperty(field) {
    var value;

    if (!deviceProperties) {
        deviceProperties = getFieldValue("getDeviceProperties");
    }

    value = deviceProperties ? deviceProperties[field] : null;

    return value;
}

function defineGetter(field, getterArg) {
    var getter = getterArg || function () {
        return getFieldValue(field);
    };
    Object.defineProperty(_self, field, {
        get: getter
    });
}

_self.hasPermission = function (module) {
    return getFieldValue("hasPermission", {"module": module});
};

_self.hasCapability = function (capability) {
    return getFieldValue("hasCapability", {"capability": capability});
};

_self.getFontInfo = function () {
    return getFieldValue("getFontInfo");
};

_self.getCurrentTimezone = function () {
    return getFieldValue("getCurrentTimezone");
};

_self.getTimezones = function () {
    return getFieldValue("getTimezones");
};

_self.setWallpaper = function (path) {
    window.webworks.exec(function () {}, function () {}, ID, "setWallpaper", {"wallpaper": path});
};

defineGetter("region");
defineGetter("language", function () {
    return navigator.language;
});
defineGetter("deviceLockedStatus");

window.webworks.defineReadOnlyField(_self, "ALLOW", 0);
window.webworks.defineReadOnlyField(_self, "DENY", 1);
window.webworks.defineReadOnlyField(_self, "hardwareId", getDeviceProperty("hardwareId"));
window.webworks.defineReadOnlyField(_self, "softwareVersion", getDeviceProperty("softwareVersion"));
window.webworks.defineReadOnlyField(_self, "name", getDeviceProperty("name"));

window.webworks.exec(function () {}, function () {}, ID, "registerEvents", null);

module.exports = _self;
