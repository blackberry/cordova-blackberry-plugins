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

var LIB_FOLDER = "../../lib/",
    contextmenu,
    _utils = require(LIB_FOLDER + 'utils');

function enabled(success, fail, args, env) {
    var result = new PluginResult(args, env),
        _enabled;
    if (typeof args.enabled !== 'undefined') {
        _enabled = JSON.parse(decodeURIComponent(args.enabled));
        if (typeof(_enabled) === 'boolean') {
            wp.ui.contextmenu.enabled = _enabled;
        }
        result.ok(true, false);
    } else {
        result.ok(wp.ui.contextmenu.enabled, false);
    }
}

function overrideItem(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.action = JSON.parse(decodeURIComponent(args.action));
    args.handler = function (actionId) {
        result.callbackOk(null, true);
    };
    if (wp.ui.contextmenu.overrideItem(args.action, args.handler)) {
        result.noResult(true);
    } else {
        result.error("Item could not be overriden", false);
    }
}

function clearOverride(success, fail, args, env) {
    var result = new PluginResult(args, env),
        actionId = JSON.parse(decodeURIComponent(args.actionId));
    result.ok(wp.ui.contextmenu.clearOverride(actionId), false);
}

function addItem(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.contexts = JSON.parse(decodeURIComponent(args.contexts));
    args.action = JSON.parse(decodeURIComponent(args.action));
    args.handler = function (actionId, elementId) {
        result.callbackOk(elementId, true);
    };
    wp.ui.contextmenu.addItem(function (data) {
        result.noResult(true);
    }, function (e) {
        result.error(e, false);
    }, args, env);
}

function removeItem(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.contexts = JSON.parse(decodeURIComponent(args.contexts));
    args.actionId = JSON.parse(decodeURIComponent(args.actionId));
    wp.ui.contextmenu.removeItem(function (data) {
        result.ok(data, false);
    }, function (e) {
        result.error(e, false);
    }, args, env);
}

function defineCustomContext(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.context = JSON.parse(decodeURIComponent(args.context));
    args.options = JSON.parse(decodeURIComponent(args.options));
    wp.ui.contextmenu.defineCustomContext(args.context, args.options);
    result.ok(null, false);
}

contextmenu = {
    enabled: enabled,
    addItem: addItem,
    removeItem: removeItem,
    overrideItem: overrideItem,
    clearOverride: clearOverride,
    defineCustomContext: defineCustomContext
};

module.exports = contextmenu;
