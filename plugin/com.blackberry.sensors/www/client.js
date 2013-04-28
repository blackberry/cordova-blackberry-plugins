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
    sensorArray = null,
    noop = function () {},
    execFunc = cordova.require("cordova/exec"),
    events = ["deviceaccelerometer", "devicemagnetometer", "devicegyroscope", "devicecompass",
              "deviceproximity", "devicelight", "devicegravity", "devicerotationmatrix",
              "deviceorientation", "deviceazimuthpitchroll", "deviceholster", "devicelinearacceleration"],
    channels = events.map(function (eventName) {
        var channel = cordova.addDocumentEventHandler(eventName),
            success = function (data) {
                channel.fire(data);
            },
            fail = function (error) {
                console.log("Error initializing " + eventName + " listener: ", error);
            };

        channel.onHasSubscribersChange = function () {
            if (this.numHandlers === 1) {
                execFunc(success, fail, _ID, "startEvent", {eventName: eventName});
            } else if (this.numHandlers === 0) {
                execFunc(noop, noop, _ID, "stopEvent", {eventName: eventName});
            }
        };
        return channel;
    });

Object.defineProperty(_self, "supportedSensors", {
    get: function () {
        var success = function (data, response) {
                sensorArray = data;
            },
            fail = function (data, response) {
                throw data;
            };

        if (sensorArray === null) {
            execFunc(success, fail, _ID, "supportedSensors");
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
    execFunc(success, fail, _ID, "setOptions", args);
    return result;
};

module.exports = _self;
