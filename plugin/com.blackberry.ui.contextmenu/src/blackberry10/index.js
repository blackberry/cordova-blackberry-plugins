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
    _overlayWebView,
    _utils = require(LIB_FOLDER + 'utils');

function enabled(result, args) {
    var _enabled;

    if (typeof args.enabled !== 'undefined') {
        _enabled = args.enabled;
        if (typeof(_enabled) === 'boolean') {
            _overlayWebView.contextMenu.enabled = _enabled;
        }
        result.ok(true, false);
    } else {
        result.ok(_overlayWebView.contextMenu.enabled, false);
    }
}

function overrideItem(result, args) {
    args.handler = function (actionId) {
        result.callbackOk(null, true);
    };
    if (_overlayWebView.contextMenu.overrideItem(args.action, args.handler)) {
        result.noResult(true);
    } else {
        result.error("Item could not be overriden", false);
    }
}

function clearOverride(result, args) {
    result.ok(_overlayWebView.contextMenu.clearOverride(args.actionId), false);
}

function addItem(result, args, env) {
    args.handler = function (actionId, elementId) {
        result.callbackOk(elementId, true);
    };
    _overlayWebView.contextMenu.addItem(function (data) {
        result.noResult(true);
    }, function (e) {
        result.error(e, false);
    }, args, env);
}

function removeItem(result, args, env) {
    _overlayWebView.contextMenu.removeItem(function (data) {
        result.ok(data, false);
    }, function (e) {
        result.error(e, false);
    }, args, env);
}

function defineCustomContext(result, args) {
    _overlayWebView.contextMenu.defineCustomContext(args.context, args.options);
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

qnx.webplatform.getController().addEventListener('ui.init', function () {
    _overlayWebView = require(LIB_FOLDER + 'overlayWebView');
});

module.exports = contextmenu;
