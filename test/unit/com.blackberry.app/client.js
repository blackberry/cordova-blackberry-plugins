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
    _ID = "com.blackberry.app",
    _apiDir = _extDir + "/" + _ID,
    client,
    MockedChannel,
    channelRegistry = {},
    mockData = {
        author: "testAuthor",
        authorEmail: "testEmail",
        authorURL: "testURL",
        copyright: "testCopyright",
        description: {
            "default": "testDescription",
            "fr-FR": "testDescription-FR",
            "en": "testDescription-en"
        },
        id : "testId",
        license: "testLicense",
        licenseURL: "testLicenseURL",
        name: {
            "default": "testName",
            "fr-FR": "testName-FR",
            "en": "testName-EN"
        },
        version: "testVersion",
        orientation: "portrait-primary",
        windowState: "fullscreen"
    };

describe("app client", function () {

    beforeEach(function () {
        MockedChannel = function () {
            return {
                onHasSubscribersChange: undefined,
                numHandlers: undefined
            };
        };
        GLOBAL.cordova = {
            exec: jasmine.createSpy().andCallFake(function (success, fail, ID, func) {
                if (func === "getReadOnlyFields") {
                    success(mockData);
                }
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
        GLOBAL.window = {
            orientation: 0,
            cordova: GLOBAL.cordova
        };
        GLOBAL.navigator = {
            language: ""
        };
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.cordova;
        delete GLOBAL.navigator;
        client = null;
    });

    it("exec should have been called once for all app fields", function () {
        expect(window.cordova.exec).toHaveBeenCalled();
        expect(window.cordova.exec.callCount).toEqual(1);
    });

    describe("author", function () {
        it("should be populated", function () {
            expect(client.author === mockData.author);
        });
    });

    describe("authorEmail", function () {
        it("should be populated", function () {
            expect(client.authorEmail === mockData.authorEmail);
        });
    });

    describe("authorURL", function () {
        it("should be populated", function () {
            expect(client.authorURL === mockData.authorURL);
        });
    });

    describe("copyright", function () {
        it("should be populated", function () {
            expect(client.copyright === mockData.copyright);
        });
    });

    describe("description", function () {
        it("should be populated with default localized value", function () {
            navigator.language = "IDoNotExist";
            expect(client.description === mockData.description["default"]);
        });

        it("should be populated with localized value when provided", function () {
            navigator.language = "fr-FR";
            expect(client.description === mockData.description["fr-FR"]);
        });

        it("should be populated with localized language value, when region value not available", function () {
            navigator.language = "en-FR";
            expect(client.description === mockData.description["en"]);
        });
    });

    describe("id", function () {
        it("should be populated", function () {
            expect(client.id === mockData.id);
        });
    });

    describe("license", function () {
        it("should be populated", function () {
            expect(client.license === mockData.license);
        });
    });

    describe("licenseURL", function () {
        it("should be populated", function () {
            expect(client.licenseURL === mockData.licenseURL);
        });
    });

    describe("name", function () {
        it("should be populated with default localized value", function () {
            GLOBAL.window.navigator = {language: "IDoNotExist"};
            expect(client.name === mockData.name["default"]);
        });

        it("should be populated with localized value when provided", function () {
            GLOBAL.window.navigator = {language: "fr-FR"};
            expect(client.name === mockData.name["fr-FR"]);
        });

        it("should be populated with localized language value, when region value not availble", function () {
            GLOBAL.window.navigator = {language: "en-FR"};
            expect(client.name === mockData.name["en"]);
        });
    });

    describe("version", function () {
        it("should be populated", function () {
            expect(client.version === mockData.version);
        });
    });

    describe("minimize", function () {
        it("should call exec", function () {
            client.minimize();
            expect(window.cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "minimize");
        });
    });

    describe("exit", function () {
        it("should call exec", function () {
            client.exit();
            expect(window.cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "exit");
        });
    });

    describe("orientation", function () {
        it("should be populated", function () {
            expect(client.orientation === mockData.orientation);
        });
    });

    describe("windowState", function () {
        it("should be populated", function () {
            expect(client.windowState === mockData.windowState);
        });
    });
    
    describe("lockOrientation", function () {
        it("should call exec", function () {
            client.lockOrientation('portrait-primary', false);
            expect(window.cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "lockOrientation", { orientation: 'portrait-primary', receiveRotateEvents: false });
        });
    });

    describe("unlockOrientation", function () {
        it("should call exec", function () {
            client.unlockOrientation();
            expect(window.cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "unlockOrientation");
        });
    });

    describe("rotate", function () {
        it("should call exec", function () {
            client.rotate('landscape');
            expect(window.cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "rotate", {orientation: 'landscape'});
        });
    });
});
