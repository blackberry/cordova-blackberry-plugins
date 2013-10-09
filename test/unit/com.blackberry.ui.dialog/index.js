/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var root = __dirname + "/../../../",
    webview = require(root + "lib/webview"),
    overlayWebView = require(root + "lib/overlayWebView"),
    mockedPluginResult,
    index;

describe("ui.dialog index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            invoke : jasmine.createSpy(),
            require : jasmine.createSpy()
        };
        mockedPluginResult = {
            callbackOk: jasmine.createSpy("PluginResult.callbackOk"),
            error: jasmine.createSpy("PluginResult.error"),
            noResult: jasmine.createSpy("PluginResult.noResult")
        };
        GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);
        index = require(root + "plugin/com.blackberry.ui.dialog/index");
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        delete GLOBAL.PluginResult;
        delete require.cache[require.resolve(root + "plugin/com.blackberry.ui.dialog/index")];
    });

    it("makes sure that the dialog is called properly", function () {
        var args = {};

        spyOn(webview, "windowGroup").andReturn(42);
        args.message = "Hello World";
        args.buttons = [ "Yes", "No" ];
        args.settings = { title: "Hi" };
        args.message = encodeURIComponent(args.message);
        args.buttons = encodeURIComponent(JSON.stringify(args.buttons));
        args.settings = encodeURIComponent(JSON.stringify(args.settings));

        spyOn(overlayWebView, "showDialog");
        index.customAskAsync(null, null, args);

        expect(overlayWebView.showDialog).toHaveBeenCalled();
    });

    it("makes sure that a message is specified", function () {
        index.customAskAsync(null, null, {});
        expect(mockedPluginResult.error).toHaveBeenCalled();
    });

    it("makes sure that buttons are specified", function () {
        var args = {};
        args.message = "Hello World";
        args.message = encodeURIComponent(args.message);
        index.customAskAsync(null, null, args);
        expect(mockedPluginResult.error).toHaveBeenCalled();
    });
    it("makes sure that buttons is an array", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {buttons : 3};
        args.message = "Hello World";
        args.message = encodeURIComponent(args.message);
        index.customAskAsync(null, null, args);
        expect(mockedPluginResult.error).toHaveBeenCalledWith("buttons is not an array", false);
    });

    it("makes sure that the dialog is called properly for standard dialogs", function () {
        var args = {};

        spyOn(webview, "windowGroup").andReturn(42);
        args.message = "Hello World";
        args.type = 0;
        args.settings = { title: "Hi" };
        args.message = encodeURIComponent(args.message);
        args.type = encodeURIComponent(args.type);
        args.settings = encodeURIComponent(JSON.stringify(args.settings));

        spyOn(overlayWebView, "showDialog").andCallFake(function (messageObj, callback) {
            callback({
                "ok": true
            });
        });
        index.standardAskAsync(null, null, args);

        expect(overlayWebView.showDialog).toHaveBeenCalled();
        expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
        expect(mockedPluginResult.callbackOk).toHaveBeenCalledWith({
            "return": escape("Ok")
        }, false);
    });

    it("makes sure that a message is specified for standard dialogs", function () {
        var args = { type: encodeURIComponent(1) };
        index.standardAskAsync(null, null, args);
        expect(mockedPluginResult.error).toHaveBeenCalledWith("message is undefined", false);
    });

    it("makes sure the type is specified for standard dialogs", function () {
        var args = {};
        args.message = "Hello World";
        args.message = encodeURIComponent(args.message);
        index.standardAskAsync(null, null, args);
        expect(mockedPluginResult.error).toHaveBeenCalledWith("type is undefined", false);
    });

    it("makes sure the type is valid for standard dialogs", function () {
        var args = {};
        args.message = "Hello World";
        args.type = 6;
        args.message = encodeURIComponent(args.message);
        args.type = encodeURIComponent(args.type);

        index.standardAskAsync(null, null, args);

        expect(mockedPluginResult.error).toHaveBeenCalledWith("invalid dialog type: 6", false);
    });
});
