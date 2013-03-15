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

var _extDir = __dirname + "/../../../plugin",
    _ID = "com.blackberry.io",
    _apiDir = _extDir + "/" + _ID,
    client,
    sandbox,
    mockedWebworks = {
        exec: jasmine.createSpy("exec").andCallFake(function (success, fail, service, action, args) {
            if (action === "home") {
                success("/home");
            } else if (action === "sharedFolder") {
                success("/shared");
            } else if (action === "SDCard") {
                success("/sdcard");
            } else if (action === "sandbox") {
                if (args) {
                    sandbox = args.sandbox;
                } else {
                    success(false);
                }
            }
        })
    };

beforeEach(function () {
    GLOBAL.window = {
        webworks: mockedWebworks
    };
    client = require(_apiDir + "/www/client");
});

afterEach(function () {
    delete GLOBAL.window;
});

describe("io client", function () {
    it("sandbox getter calls exec", function () {
        expect(client.sandbox).toEqual(false);
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "sandbox");
    });

    it("sandbox setter calls exec", function () {
        client.sandbox = false;
        expect(sandbox).toBeFalsy();
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "sandbox", {"sandbox": false});
    });

    it("home calls exec", function () {
        expect(client.home).toEqual("/home");
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "home");
    });

    it("sharedFolder calls exec", function () {
        expect(client.sharedFolder).toEqual("/shared");
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "sharedFolder");
    });

    it("SDCard calls exec", function () {
        expect(client.SDCard).toEqual("/sdcard");
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "SDCard");
    });
});
