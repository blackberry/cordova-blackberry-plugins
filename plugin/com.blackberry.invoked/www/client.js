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
    _ID = "com.blackberry.invoked",
    _noop = function () {},
    _events = ["invoked", "oncardresize", "oncardclosed"],
    _channels = _events.map(function (eventName) {
        var channel = cordova.addWindowEventHandler(eventName),
            success = function (data) {
                channel.fire(data);
            };
        channel.onHasSubscribersChange = function () {
            if (this.numHandlers === 1) {
                window.webworks.exec(success,
                                     console.log.bind("Error initializing " + eventName + " listener: "),
                                     _ID, "startEvent", {eventName: eventName});
            } else if (this.numHandlers === 0) {
                window.webworks.exec(_noop, _noop, _ID, "stopEvent", {eventName: eventName});
            }
        };
        return channel;
    });

_self.cardResizeDone = function () {
    window.webworks.exec(_noop, _noop, _ID, "cardResizeDone");
};

_self.cardStartPeek = function (peekType) {
    window.webworks.exec(_noop, _noop, _ID, "cardStartPeek", {'peekType': peekType});
};

_self.cardRequestClosure = function (request) {
    window.webworks.exec(_noop, _noop, _ID, "cardRequestClosure", {request: request});
};

module.exports = _self;
