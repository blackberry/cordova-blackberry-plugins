/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var bbm = require("./BBMJNEXT").bbm,
    _utils = require("../../lib/utils"),
    Whitelist = require("../../lib/policy/whitelist").Whitelist,
    _whitelist = new Whitelist(),
    _listeners = {},
    _actionMap = {
        onaccesschanged: {
            context: require("./BBMEvents"),
            event: "onaccesschanged",
            triggerEvent: "onaccesschanged",
            trigger: function (pluginResult, allowed, reason) {
                pluginResult.callbackOk({"allowed": allowed, "reason": reason}, true);
            }
        },
        onupdate: {
            context: require("./BBMEvents"),
            event: "onupdate",
            triggerEvent: "onupdate",
            trigger: function (pluginResult, user, event) {
                pluginResult.callbackOk({"user": user, "event": event});
            }
        }
    };

module.exports = {
    startEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            context = _actionMap[eventName].context,
            systemEvent = _actionMap[eventName].event,
            listener = _actionMap[eventName].trigger.bind(null, result);

        if (!_listeners[eventName]) {
            _listeners[eventName] = {};
        }

        if (_listeners[eventName][env.webview.id]) {
            result.error("Underlying listener for " + eventName + " already already running for webview " + env.webview.id);
        } else {
            context.addEventListener(systemEvent, listener);
            _listeners[eventName][env.webview.id] = listener;
            result.noResult(true);
        }
    },

    stopEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            context = _actionMap[eventName].context,
            systemEvent = _actionMap[eventName].event,
            listener;

        if (!_listeners || !_listeners[eventName] || !_listeners[eventName][env.webview.id]) {
            result.error("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        } else {
            listener = _listeners[eventName][env.webview.id];
            context.removeEventListener(systemEvent, listener);
            delete _listeners[eventName][env.webview.id];
            result.noResult(false);
        }
    },

    register: function (success, fail, args, env) {
        if (args) {
            var result = new PluginResult(args, env);

            args.options = JSON.parse(decodeURIComponent(args.options));

            if (!args.options.uuid || args.options.uuid.length === 0) {
                result.error("Must specifiy UUID");
            }

            if (args.options.uuid.length < 32) {
                result.error("UUID is not valid length");
            } else {
                bbm.getInstance().register(args.options);
                result.noResult(true);
            }
        }
    },

    self : {
        appVersion : function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("appVersion"));
        },

        bbmsdkVersion: function (success, fail, args, env) {
            success(parseInt(bbm.getInstance().self.getProfile("bbmsdkVersion"), 10));
        },

        displayName: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("displayName"));
        },

        handle: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("handle"));
        },

        personalMessage: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("personalMessage"));
        },

        ppid: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("ppid"));
        },

        status: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("status"));
        },

        statusMessage: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("statusMessage"));
        },

        getDisplayPicture: function (success, fail, args, env) {
            var result = new PluginResult(args, env);

            bbm.getInstance().self.getDisplayPicture(result);

            result.noResult(true);
        },

        setStatus: function (success, fail, args, env) {
            if (args) {
                args.status = JSON.parse(decodeURIComponent(args.status));
                args.statusMessage = JSON.parse(decodeURIComponent(args.statusMessage));

                if (args.status !== "available" && args.status !== "busy") {
                    fail(-1, "Status is not valid");
                    return;
                }
            }

            bbm.getInstance().self.setStatus(args);
            success();
        },

        setPersonalMessage: function (success, fail, args, env) {
            if (args) {
                args.personalMessage = JSON.parse(decodeURIComponent(args.personalMessage));

                if (args.personalMessage.length === 0) {
                    fail(-1, "Personal message must not be empty");
                    return;
                }
            }

            bbm.getInstance().self.setPersonalMessage(args.personalMessage);
            success();
        },

        setDisplayPicture: function (success, fail, args, env) {
            var result = new PluginResult(args, env);

            args.displayPicture = JSON.parse(decodeURIComponent(args.displayPicture));

            if (args.displayPicture.length === 0) {
                result.error("Display picture must not be empty");
            } else if (!_whitelist.isAccessAllowed(args.displayPicture)) {
                result.error("URL denied by whitelist: " + args.displayPicture);
            } else {
                args.displayPicture = _utils.translatePath(args.displayPicture).replace(/file:\/\//, '');
                bbm.getInstance().self.setDisplayPicture(args.displayPicture, result);
                result.noResult(true);
            }
        },

        profilebox: {
            addItem: function (success, fail, args, env) {
                var result = new PluginResult(args, env);

                args.options = JSON.parse(decodeURIComponent(args.options));

                if (!args.options.text || args.options.text.length === 0) {
                    result.error("must specify text");
                } else if (!args.options.cookie || args.options.cookie.length === 0) {
                    result.error("Must specify cookie");
                } else if (args.options.iconId && args.options.iconId < 1) {
                    result.error("Invalid icon ID");
                } else {
                    bbm.getInstance().self.profilebox.addItem(args.options, result);
                    result.noResult(true);
                }
            },

            removeItem: function (success, fail, args, env) {
                var result = new PluginResult(args, env);

                args.options = JSON.parse(decodeURIComponent(args.options));

                if (!args.options.id || args.options.id.length === 0 || typeof args.options.id !== "string") {
                    result.error("Must specify valid item id");
                } else {
                    bbm.getInstance().self.profilebox.removeItem(args.options, result);
                    result.noResult(true);
                }
            },

            clearItems: function (success, fail, args, env) {
                bbm.getInstance().self.profilebox.clearItems();
                success();
            },

            registerIcon: function (success, fail, args, env) {
                var result = new PluginResult(args, env);

                args.options = JSON.parse(decodeURIComponent(args.options));

                if (!args.options.iconId || args.options.iconId <= 0) {
                    result.error("Must specify valid ID for icon");
                } else if (!args.options.icon || args.options.icon.length === 0) {
                    result.error("Must specify icon to register");
                } else if (!_whitelist.isAccessAllowed(args.options.icon)) {
                    result.error("URL denied by whitelist: " + args.displayPicture);
                } else {
                    args.options.icon = _utils.translatePath(args.options.icon).replace(/file:\/\//, '');
                    bbm.getInstance().self.profilebox.registerIcon(args.options, result);
                    result.noResult(true);
                }
            },

            getItems: function (success, fail, args, env) {
                success(bbm.getInstance().self.profilebox.getItems());
            },

            getAccessible : function (success, fail, args, env) {
                success(bbm.getInstance().self.profilebox.getAccessible());
            }
        }
    },

    users : {
        inviteToDownload: function (success, fail, args, env) {
            bbm.getInstance().users.inviteToDownload();
            success();
        }
    }
};
