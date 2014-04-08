/*
 * Copyright 2014 BlackBerry Limited.
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
    _ID = "com.blackberry.screenshot",
    _apiDir = _extDir + "/" + _ID,
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
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.cordova;
        client = null;
    });

    describe("execute", function () {
        it("should call exec", function () {
            var options = {dest: 'data:', mime: 'image/png'};

            client.execute(options);
            expect(window.cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "execute", {userargs: options}, true);
        });

        it("without any arguments should call exec", function () {
            client.execute();
            expect(window.cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "execute", {userargs: {}}, true);
        });
    });
});
