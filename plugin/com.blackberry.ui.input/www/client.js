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
    ID = "cordova-plugin-touch-keyboard",
    deviceProperties,
    noop = function () {},
    execFunc = cordova.require("cordova/exec"),
    events = ["touchenabledkeyboard"],
    channels = events.map(function (eventName) {
        var thisChannel = cordova.addDocumentEventHandler(eventName),
            success = function (data) {
                thisChannel.fire(data);
            },
            fail = function (error) {
                console.log("Error initializing " + eventName + " listener: ", error);
            };
        thisChannel.onHasSubscribersChange = function () {
            if (this.numHandlers === 1) {
                execFunc(success, fail, ID, "startEvent", {eventName: eventName});
            } else if (this.numHandlers === 0) {
                execFunc(noop, noop, ID, "stopEvent", {eventName: eventName});
            }
        };
        return thisChannel;
    });

module.exports = _self;
