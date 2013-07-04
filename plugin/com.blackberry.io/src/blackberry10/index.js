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
var _util = require("./../../lib/utils"),
    _webview;

function getHomeDir() {
    var homeDir = window.qnx.webplatform.getApplication().getEnv("HOME");

    // HOME environment variable starts with two slashes for some reason, get rid of the extra slash
    if (homeDir.match("^//")) {
        return homeDir.substring(1);
    } else {
        return homeDir;
    }
}

module.exports = {
    sandbox: function (result, args, env) {
        _webview = _util.requireWebview();

        //If sandbox arg is sent down this is the setter
        if (args && args.sandbox) {
            _webview.setSandbox(!!args.sandbox);
            result.ok(null, false);
        } else {
            // Since this is getter, it will always return "0" or "1" even after explicitly setting value to true or false
            result.ok(_webview.getSandbox() === "1", false);
        }
    },

    home: function (result, args, env) {
        result.ok(getHomeDir(), false);
    },

    sharedFolder: function (result, args, env) {
        var home = getHomeDir();
        result.ok(home + "/../shared", false);
    },

    SDCard: function (result, args, env) {
        result.ok("/accounts/1000/removable/sdcard", false);
    }
};
