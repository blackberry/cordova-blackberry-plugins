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

var root = __dirname + "/../../../",
    apiDir = root + "plugin/com.blackberry.ui.dialog/",
    client = null,
    ID = "com.blackberry.ui.dialog",
    defineROFieldArgs = [];

describe("ui.dialog client", function () {
    beforeEach(function () {
        GLOBAL.cordova = {
            exec: jasmine.createSpy(),
            require: function () {
                return cordova.exec;
            }
        };
        client = require(apiDir + "www/client");
    });

    afterEach(function () {
        delete require.cache[require.resolve(apiDir + "/www/client")];
        delete GLOBAL.cordova;
    });

    it("should return constant for appropriate dialog styles", function () {
        expect(client["D_OK"]).toEqual(0);
        expect(client["D_SAVE"]).toEqual(1);
        expect(client["D_DELETE"]).toEqual(2);
        expect(client["D_YES_NO"]).toEqual(3);
        expect(client["D_OK_CANCEL"]).toEqual(4);
        expect(client["D_PROMPT"]).toEqual(5);
    });

    it("creates a dialog", function () {
        var message = "hello world",
            buttons = [ ],
            callback = function () {},
            settings = {};

        client.customAskAsync(message, buttons, callback, settings);
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "customAskAsync", { "message" : message, "buttons" : buttons, "callback" : callback, "settings" : settings });
    });

    it("creates a standard dialog", function () {
        var message = "hello world",
            type = 0,
            callback = function () {},
            settings = {};

        client.standardAskAsync(message, type, callback, settings);
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), ID, "standardAskAsync", { "message" : message, "type" : type, "callback" : callback, "settings" : settings });
    });
});
