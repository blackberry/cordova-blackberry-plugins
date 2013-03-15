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
    mockedWebworks = {},
    fields = [
        "UNKNOWN",
        "ETHERNET",
        "WIFI",
        "BLUETOOTH_DUN",
        "USB",
        "VPN",
        "BB",
        "CELL_4G",
        "NONE",
        "CELL_2G",
        "CELL_3G"
    ],
    fieldValues = [
        "unknown",
        "ethernet",
        "wifi",
        "bluetooth_dun",
        "usb",
        "vpn",
        "rim-bb",
        "4g",
        "none",
        "2g",
        "3g"
    ],
    defineROFieldArgs = [];

function unloadClient() {
    // explicitly unload client for it to be loaded again
    delete require.cache[require.resolve(_apiDir + "/www/client")];
    client = null;
}

describe("connection", function () {
    beforeEach(function () {
        mockedWebworks.exec = jasmine.createSpy().andCallFake(
            function (success, fail, service, action, args) {
                success("wifi");
            }
        );
        mockedWebworks.defineReadOnlyField = jasmine.createSpy();
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        // client needs to be required for each test
        client = require(_apiDir + "/www/client");

        fields.forEach(function (field, index) {
            defineROFieldArgs.push([client, field, fieldValues[index]]);
        });
        spyOn(console, "error");
    });

    afterEach(function () {
        unloadClient();
        defineROFieldArgs = [];
        delete GLOBAL.window;
        delete GLOBAL.cordova;
    });

    describe("connection constants", function () {
        it("call defineReadOnlyField for each constant", function () {
            expect(mockedWebworks.defineReadOnlyField.callCount).toEqual(fields.length);
        });

        it("call defineReadOnlyField with right params", function () {
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("UNKNOWN")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("ETHERNET")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("WIFI")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("BLUETOOTH_DUN")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("USB")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("VPN")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("BB")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("CELL_4G")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("NONE")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("CELL_2G")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("CELL_3G")]);
        });
    });

    describe("connection.type", function () {
        it("calls exec and equals to exec return value", function () {
            expect(client.type).toEqual("wifi");
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "type");
        });

        it("return UNKNOWN if exec throws error", function () {
            mockedWebworks.exec = jasmine.createSpy().andThrow("Too bad");
            expect(client.type).toEqual("unknown");
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "type");
        });
    });
});
