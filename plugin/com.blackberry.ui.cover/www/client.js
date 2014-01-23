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

var _ID = "com.blackberry.ui.cover",
    _self = {},
    exec = cordova.require("cordova/exec"),
    badges = true,
    cover = {
        cover: {
            type: 'snapshot',
            capture: {}
        }
    },
    events = ["entercover", "exitcover"],
    textLabels = [];

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

_self.setContent = function (type, options) {
    switch (type) {
    case _self.TYPE_IMAGE:
        if (cover.cover.capture) {
            delete cover.cover.capture;
        }
        cover.cover.type = type;
        cover.cover.path = options.path;
        break;
    case _self.TYPE_SNAPSHOT:
        if (cover.cover.path) {
            delete cover.cover.path;
        }
        cover.cover.type = type;
        cover.cover.capture = options;
        break;
    default:
        break;
    }
};

_self.setTransition = function (transition) {
    cover["transition"] = transition;
};

_self.resetCover = function () {
    delete cover["text"];
    delete cover["transition"];
    delete cover["badges"];
    _self.labels = [];
    _self.showBadges = true;
    exec(function () {}, function () {}, _ID, "resetCover");
};

_self.updateCover = function () {
    cover["text"] = _self.labels;
    cover["badges"] = _self.showBadges;
    exec(function () {}, function () {}, _ID, "updateCover", {"cover": cover});
};

Object.defineProperty(_self, "coverSize", {
    get: function () {
        var value,
            success = function (data, response) {
                value = data;
            },
            fail = function (data, response) {
                throw data;
            };
        exec(success, fail, _ID, "coverSize");
        return value;
    }
});

Object.defineProperty(_self, "labels", {
    get: function () {
        return textLabels;
    },
    set: function (newLabels) {
        textLabels = newLabels;
    }
});

Object.defineProperty(_self, "showBadges", {
    get: function () {
        return badges;
    },
    set: function (value) {
        badges = value;
    }
});

Object.defineProperty(_self, "TYPE_IMAGE", {"value": "file", "writable": false});
Object.defineProperty(_self, "TYPE_SNAPSHOT", {"value": "snapshot", "writable": false});
Object.defineProperty(_self, "TRANSITION_FADE", {"value": "fade", "writable": false});
Object.defineProperty(_self, "TRANSITION_NONE", {"value": "none", "writable": false});
Object.defineProperty(_self, "TRANSITION_DEFAULT", {"value": "default", "writable": false});
Object.defineProperty(_self, "TRANSITION_SLIDE", {"value": "slide", "writable": false});

module.exports = _self;
