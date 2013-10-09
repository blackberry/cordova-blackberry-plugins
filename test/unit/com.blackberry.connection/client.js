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

var _extDir = __dirname + "/../../../plugin",
    _apiDir = _extDir + "/com.blackberry.connection",
    _ID = "com.blackberry.connection",
    client,
    channelRegistry = {},
    MockedChannel;

describe("connection", function () {
    beforeEach(function () {
        MockedChannel = function () {
            return {
                onHasSubscribersChange: undefined,
                numHandlers: undefined
            };
        };
        GLOBAL.cordova = {
            exec: jasmine.createSpy().andCallFake(function (success) {
                success("wifi");
            }),
            require: function () {
                return cordova.exec;
            },
            addDocumentEventHandler: jasmine.createSpy("cordova.addDocumentEventHandler").andCallFake(function (eventName) {
                channelRegistry[eventName] = new MockedChannel();
                return channelRegistry[eventName];
            }),
            fireDocumentEvent: jasmine.createSpy("cordova.fireDocumentEvent")
        };
        client = require(_apiDir + "/www/client");
        spyOn(console, "error");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        delete require.cache[require.resolve(_apiDir + "/www/client")];
    });

    describe("connection constants", function () {

        it("defines constants", function () {
            expect(client["UNKNOWN"]).toBeDefined();
            expect(client["ETHERNET"]).toBeDefined();
            expect(client["WIFI"]).toBeDefined();
            expect(client["BLUETOOTH_DUN"]).toBeDefined();
            expect(client["USB"]).toBeDefined();
            expect(client["VPN"]).toBeDefined();
            expect(client["BB"]).toBeDefined();
            expect(client["CELL_4G"]).toBeDefined();
            expect(client["NONE"]).toBeDefined();
            expect(client["CELL_2G"]).toBeDefined();
            expect(client["CELL_3G"]).toBeDefined();
        });
    });

    describe("connection.type", function () {
        it("calls exec and equals to exec return value", function () { 
            expect(client.type).toEqual("wifi");
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "type");
        });

        it("return UNKNOWN if exec throws error", function () {
            cordova.exec.andThrow("Too bad"); 
            expect(client.type).toEqual("unknown");
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "type");
        });
    });
});
