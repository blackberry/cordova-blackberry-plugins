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

var _self = {
        self: {
            profilebox: {}
        },
        users: {}
    },
    noop = function () {},
    exec = cordova.require("cordova/exec"),
    _ID = "com.blackberry.bbm.platform",
    _onAccessChangedChannel = cordova.addDocumentEventHandler("onaccesschanged"),
    _onUpdateChannel = cordova.addDocumentEventHandler("onupdate");

_onAccessChangedChannel.onHasSubscribersChange = function () {
    var success = function (data) {
            _onAccessChangedChannel.fire(data.allowed, data.reason);
        },
        fail = function (error) {
            console.log("Error initializing onaccesschanged listener: ", error);
        };
    if (this.numHandlers === 1) {
        exec(success, fail, _ID, "startEvent", {eventName: "onaccesschanged"});
    } else if (this.numHandlers === 0) {
        exec(noop, noop, _ID, "stopEvent", {eventName: "onaccesschanged"});
    }
};

_onUpdateChannel.onHasSubscribersChange = function () {
    var success = function (data) {
            _onUpdateChannel.fire(data.user, data.event);
        },
        fail = function (error) {
            console.log("Error initializing onupdate listener: ", error);
        };
    if (this.numHandlers === 1) {
        exec(success, fail, _ID, "startEvent", {eventName: "onupdate"});
    } else if (this.numHandlers === 0) {
        exec(noop, noop, _ID, "stopEvent", {eventName: "onupdate"});
    }
};

function getFieldValue(field, args) {
    var value,
        success = function (data) {
            value = data;
        },
        fail = function (data) {
            throw data;
        };

    try {
        exec(success, fail, _ID, field, args);
    } catch (e) {
        console.error(e);
    }

    return value;
}

function defineGetter(obj, field) {
    Object.defineProperty(obj, field.split("/")[1], {
        get: function () {
            return getFieldValue(field);
        }
    });
}

function createEventHandler(onSuccess, onError) {
    var callback;

    callback = function (data) {
        if (data) {
            if (data.error) {
                if (onError && typeof onError === "function") {
                    onError(data);
                }
            } else {
                if (onSuccess && typeof onSuccess === "function") {
                    onSuccess(data.success);
                }
            }
        }
    };

    return { "onSuccess": callback, "onError": function (args) {
                callback({ "error": args });
            }
    };
}

_self.register = function (options) {
    var args = { "options" : options };
    return getFieldValue("register", args);
};

defineGetter(_self.self, "self/appVersion");
defineGetter(_self.self, "self/bbmsdkVersion");
defineGetter(_self.self, "self/displayName");
defineGetter(_self.self, "self/handle");
defineGetter(_self.self, "self/personalMessage");
defineGetter(_self.self, "self/ppid");
defineGetter(_self.self, "self/status");
defineGetter(_self.self, "self/statusMessage");

_self.self.getDisplayPicture = function (success, error) {
    var args = {},
        handler = createEventHandler(success, error);
    return exec(handler.onSuccess, handler.onError, _ID, "self/getDisplayPicture", args);
};

_self.self.setStatus = function (status, statusMessage) {
    var args = {"status": status, "statusMessage": statusMessage};
    return getFieldValue("self/setStatus", args);
};

_self.self.setPersonalMessage = function (personalMessage) {
    var args = {"personalMessage": personalMessage};
    return getFieldValue("self/setPersonalMessage", args);
};

_self.self.setDisplayPicture = function (displayPicture, success, error) {
    var args = {"displayPicture": displayPicture},
        handler = createEventHandler(success, error);
    return exec(handler.onSuccess, handler.onError, _ID, "self/setDisplayPicture", args);
};

_self.self.profilebox.addItem = function (options, success, error) {
    var args = {"options": options},
        handler = createEventHandler(success, error);
    return exec(handler.onSuccess, handler.onError, _ID, "self/profilebox/addItem", args);
};

_self.self.profilebox.removeItem = function (options, success, error) {
    var args = {"options": options},
        handler = createEventHandler(success, error);
    return exec(handler.onSuccess, handler.onError, _ID, "self/profilebox/removeItem", args);
};

_self.self.profilebox.clearItems = function () {
    return getFieldValue("self/profilebox/clearItems");
};

_self.self.profilebox.registerIcon = function (options, success, error) {
    var args = {"options": options},
        handler = createEventHandler(success, error);
    return exec(handler.onSuccess, handler.onError, _ID, "self/profilebox/registerIcon", args);
};

_self.users.inviteToDownload = function () {
    return getFieldValue("users/inviteToDownload");
};

Object.defineProperty(_self.self.profilebox, "accessible", {
    get: function () {
        return getFieldValue("self/profilebox/getAccessible");
    }
});

Object.defineProperty(_self.self.profilebox, "item", {
    get: function () {
        return getFieldValue("self/profilebox/getItems");
    }
});

module.exports = _self;
