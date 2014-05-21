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

var _self = {},
    _ID = "com.blackberry.screenshot",
    exec = cordova.require("cordova/exec");

	/**
    * execute(options) performs the screenshot.
    *
    *   options is a json object containing:
    *
    *           rect: {x: int, y:int, w: int, h: int}
    *
    *               the rectangle to capture (optional, defaults to full screen)
    *
    *           quality: int
	*
    *               jpeg/png quality factor (1-100, default 90)
    *
    *           dest: string
    *
    *               either "data:", which returns the image as a data-URL (default) using "mime" argument
    *               or a complete file path with extension, which saves the image to the file
    *
    *           mime: string
    *
    *               for "data:" destination, defines the mime type to encode (defaults to image/jpeg)
	*
    *           chmod: int
    *
    *               for screenshots to file, which chmod should be performed
    *
    * returns either:
    *   - the data: url (including data: prefix)
    *   - or error: followed by an error message
    *   - or the full path of the destination file
    */

_self.execute = function (args, successCallback, failCallback) {
    var success = function (data, response) {
            if (typeof successCallback === 'function') {
                successCallback(data, response);
            } else {
                // print data by default
                console.log(data);
            }
        },
        fail = function (data, response) {
            if (typeof failCallback === 'function') {
                failCallback(data, response);
            } else {
                // print the error by default
                console.log("Error: " + data);
            }
        };

    args = args || {};

    exec(success, fail, _ID, "execute", {userargs: args}, true);
};

module.exports = _self;
