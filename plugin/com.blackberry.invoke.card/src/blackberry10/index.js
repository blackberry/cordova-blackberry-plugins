/*
 * Copyright 2011-2012 Research In Motion Limited.
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
var overlayWebView;

qnx.webplatform.getController().addEventListener('overlayWebView.initialized', function (webviewObj) {
    overlayWebView = webviewObj;
});

function trigger(pluginResult, type, arg) {
    var keepCallback = type === "invoke";

    pluginResult.callbackOk({
        "type": type,
        "pluginResult": arg
    }, keepCallback);
}

module.exports = {
    invokeMediaPlayer: function (pluginResult, args, env) {
        var options = args.options,
            done = function (data) {
                trigger(pluginResult, "done", data);
            },
            cancel = function (reason) {
                trigger(pluginResult, "cancel", reason);
            },
            invokeCallback = function (error) {
                trigger(pluginResult, "invoke", error);
            };

        window.qnx.webplatform.getApplication().cards.mediaplayerPreviewer.open(options, done, cancel, invokeCallback);
        pluginResult.noResult(true);
    },

    invokeCamera: function (pluginResult, args, env) {
        var mode = args.mode,
            done = function (path) {
                trigger(pluginResult, "done", path);
            },
            cancel = function (reason) {
                trigger(pluginResult, "cancel", reason);
            },
            invokeCallback = function (error) {
                trigger(pluginResult, "invoke", error);
            };

        window.qnx.webplatform.getApplication().cards.camera.open(mode, done, cancel, invokeCallback);
        pluginResult.noResult(true);
    },

    invokeFilePicker: function (pluginResult, args, env) {
        var options = args.options,
            done = function (path) {
                trigger(pluginResult, "done", path);
            },
            cancel = function (reason) {
                trigger(pluginResult, "cancel", reason);
            },
            invokeCallback = function (error) {
                trigger(pluginResult, "invoke", error);
            };

        window.qnx.webplatform.getApplication().cards.filePicker.open(options, done, cancel, invokeCallback);
        pluginResult.noResult(true);
    },

    invokeIcsViewer: function (pluginResult, args, env) {
        var options = args.options,
            done = function (path) {
                trigger(pluginResult, "done", path);
            },
            cancel = function (reason) {
                trigger(pluginResult, "cancel", reason);
            },
            invokeCallback = function (error) {
                trigger(pluginResult, "invoke", error);
            };

        window.qnx.webplatform.getApplication().cards.icsViewer.open(options, done, cancel, invokeCallback);
        pluginResult.noResult(true);
    },


    invokeCalendarPicker: function (pluginResult, args, env) {
        var options = args.options,
            done = function (file) {
                trigger(pluginResult, "done", file);
            },
            cancel = function (reason) {
                trigger(pluginResult, "cancel", reason);
            },
            invokeCallback = function (error) {
                trigger(pluginResult, "invoke", error);
            };

        window.qnx.webplatform.getApplication().cards.calendar.picker.open(options, done, cancel, invokeCallback);
        pluginResult.noResult(true);
    },

    invokeCalendarComposer: function (pluginResult, args, env) {
        var options = args.options,
            done = function (data) {
                trigger(pluginResult, "done", data);
            },
            cancel = function (reason) {
                trigger(pluginResult, "cancel", reason);
            },
            invokeCallback = function (error) {
                trigger(pluginResult, "invoke", error);
            };

        window.qnx.webplatform.getApplication().cards.calendar.composer.open(options, done, cancel, invokeCallback);
        pluginResult.noResult(true);
    },

    invokeEmailComposer: function (pluginResult, args, env) {
        var options = args.options,
            done = function (data) {
                trigger(pluginResult, "done", data);
            },
            cancel = function (reason) {
                trigger(pluginResult, "cancel", reason);
            },
            invokeCallback = function (error) {
                trigger(pluginResult, "invoke", error);
            };

        window.qnx.webplatform.getApplication().cards.email.composer.open(options, done, cancel, invokeCallback);
        pluginResult.noResult(true);
    },

    invokeTargetPicker: function (pluginResult, args, env) {
        var title = args.title,
            request = args.request,
            invocation = window.qnx.webplatform.getApplication().invocation,
            onError,
            onSuccess;

        onError = function (error) {
            pluginResult.callbackOk({
                "status": "error",
                "pluginResult": error
            }, false);
        };

        onSuccess = function (pluginResult) {
            pluginResult.callbackOk({
                "status": "success",
                "pluginResult": pluginResult
            }, false);
        };

        // Pulled from the query code, we should probably keep a consistent API
        // allows the developers to define APPLICATION, VIEWER etc in an array
        if (request["target_type"] && Array.isArray(request["target_type"])) {

            request["target_type"] = request["target_type"].filter(function (element) {
                var pluginResult = false;
                switch (element)
                {
                case "APPLICATION":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_APPLICATION;
                    break;
                case "CARD":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_CARD;
                    break;
                case "VIEWER":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_VIEWER;
                    break;
                case "SERVICE":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_SERVICE;
                    break;

                default:
                    pluginResult = true;
                    break;
                }
                return pluginResult;
            });

            delete request["target_type"];
        }

        if (request.hasOwnProperty('metadata')) {
            //Let's stringify it for them
            request.metadata = JSON.stringify(request.metadata);
        }

        overlayWebView.invocationlist.show(request, title, onSuccess, onError);
        pluginResult.noResult(true);
    }
};

