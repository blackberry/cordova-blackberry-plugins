/*
 * Copyright 2014 BlackBerry Limited
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

var _extDir = __dirname + "/../../../plugin",
    _ID = "com.blackberry.barcodescanner",
    _apiDir = _extDir + "/" + _ID,
    funcSpy,
    reading,
    client;

describe("screenshot client", function () {
    beforeEach(function () {
        GLOBAL.cordova = {
            exec: jasmine.createSpy(),
            require: function () {
                return cordova.exec;
            }
        };
        GLOBAL.window = {
            cordova: GLOBAL.cordova
        };
        GLOBAL.blackberry = {
            io: {
                sandbox: null
            }
        };
        GLOBAL.canvas = {
            style: {
                display: null
            }
        };
        funcSpy = jasmine.createSpy('funcSpy');
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.canvas;
        delete GLOBAL.blackberry;
        delete GLOBAL.window;
        delete GLOBAL.cordova;
        client = null;
    });

    describe("startRead", function () {
        it("should call exec", function () {
            client.startRead(funcSpy, funcSpy, "canvasName");

            expect(blackberry.io.sandbox).toEqual(false);
            expect(window.cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "startRead", null, true);
        });
    });

    describe("stopRead", function () {
        it("should call exec", function () {
            client.stopRead(funcSpy, funcSpy);

            expect(window.cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "stopRead", null, true);
        });
    });
});
