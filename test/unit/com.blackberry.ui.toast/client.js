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

var root = __dirname + "/../../../../",
    ID = "com.blackberry.ui.toast",
    apiDir = root + "plugin/" + ID + "/",
    client = null;

describe("ui.toast", function () {
    beforeEach(function () {
        GLOBAL.cordova = {
            exec: jasmine.createSpy("exec"),
            require: function () {
                return cordova.exec;
            }
        };
        client = require(apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        delete require.cache[require.resolve(apiDir + "/www/client")];
    });

    it("creates a simple toast", function () {
        var message = "this is a simple toast";

        client.show(message);
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "show", { message: message });
    });

    it("creates a complex toast with click and dismiss handlers", function () {
        var message = "this is a complex toast",
            buttonText = "button!",
            buttonCallback = jasmine.createSpy(),
            dismissCallback = jasmine.createSpy();

        client.show(message, { buttonText : buttonText, buttonCallback : buttonCallback, dismissCallback: dismissCallback});
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "show", { message: message, options: { buttonText : buttonText, buttonCallback : buttonCallback, dismissCallback: dismissCallback}});
    });

    it("creates a complex toast with only click handler", function () {
        var message = "this is a complex toast",
            buttonText = "button!",
            buttonCallback = jasmine.createSpy();

        client.show(message,  {buttonText : buttonText, buttonCallback : buttonCallback});
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "show", { message: message, options: {  buttonText : buttonText, buttonCallback : buttonCallback}});
    });

    it("creates a complex toast with only dismiss handler", function () {
        var message = "this is a complex toast",
            buttonText = "button!",
            dismissCallback = jasmine.createSpy();

        client.show(message,  {buttonText : buttonText, dismissCallback : dismissCallback});
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "show", { message : message, options: {buttonText : buttonText, dismissCallback : dismissCallback}});
    });

    it("creates a complex toast with no handlers", function () {
        var message = "this is a complex toast",
            buttonText = "button!";

        client.show(message, {buttonText : buttonText});
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "show", { message: message, options: {buttonText: buttonText}});
    });
});
