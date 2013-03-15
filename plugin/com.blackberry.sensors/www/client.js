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
    _ID = "com.blackberry.sensors",
    sensorArray = null;

Object.defineProperty(_self, "supportedSensors", {
    get: function () {
        var success = function (data, response) {
                sensorArray = data;
            },
            fail = function (data, response) {
                throw data;
            };

        if (sensorArray === null) {
            window.webworks.exec(success, fail, _ID, "supportedSensors");
        }
        return sensorArray;
    }
});

_self.setOptions = function (sensor, options) {
    var args = { "options" : options },
        result,
        success = function (data, response) {
            result = data;
        },
        fail = function (data, response) {
            throw data;
        };
    args.options.sensor = sensor;
    window.webworks.exec(success, fail, _ID, "setOptions", args);
    return result;
};

window.webworks.exec(function () {}, function () {}, _ID, "registerEvents", null);

module.exports = _self;
