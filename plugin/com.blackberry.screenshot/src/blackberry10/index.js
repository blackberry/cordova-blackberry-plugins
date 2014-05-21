/*
 * https://github.com/jonwebb/webworks-bb10-screenshot
 *
 * Author: Jon Webb, jon@jonwebb.net
 *
 * Portions Copyright 2013 Innovatology.
 * Portions Copyright 2014 BlackBerry Limited.
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

var screenshotJNEXT,
    _utils = require("../../lib/utils");

module.exports = {
	/**
	* execute() finds the window handle, processes userargs then performs the screenshot
	*/
	execute: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
            userargs,
            wv,
            i;

		// userargs are encoded and need decoding & parsing into a json object
		userargs = JSON.parse(decodeURIComponent(args.userargs));
		// which window handle should we use?
		wv = qnx.webplatform.getWebViews();
		for (i = 0;i < wv.length;i++) {
			if (wv[i].zOrder === '0') {
				// found window handle.
				result.ok(screenshotJNEXT.getInstance().execute({
                    handle: wv[i].jsScreenWindowHandle,
                    userargs: userargs
				}));
				return;
			}
		}
		fail("error:no window handle");
	}
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.ScreenshotJNEXT = function ()
{
    var _self = this,
        hasInstance = false;

	_self.execute = function (args) {
		return JNEXT.invoke(_self._id, "execute " + JSON.stringify(args));
	};
	_self.onEvent = function (strData) {
		console.log(strData);
	};

    _self.getId = function () {
        return _self._id;
    };

    _self.init = function () {
        if (!JNEXT.require("libscreenshot")) {
            return false;
        }

        _self._id = JNEXT.createObject("libscreenshot.ScreenshotJS");

        if (!_self._id || _self._id === "") {
            return false;
        }

        JNEXT.registerEvents(_self);
    };

    _self._id = "";

    _self.getInstance = function () {
        if (!hasInstance) {
            _self.init();
            hasInstance = true;
        }
        return _self;
    };
};

screenshotJNEXT = new JNEXT.ScreenshotJNEXT();
