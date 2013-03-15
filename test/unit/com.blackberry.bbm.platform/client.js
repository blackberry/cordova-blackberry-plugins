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
    apiDir = root + "plugin/com.blackberry.bbm.platform/",
    _ID = "com.blackberry.bbm.platform",
    client = null,
    mockedWebworks = {
        exec: jasmine.createSpy(),
        event: { once : jasmine.createSpy(),
                 isOn : jasmine.createSpy() }
    };

describe("bbm.platform", function () {
    beforeEach(function () {
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        mockedWebworks.exec.reset();
        client = require(apiDir + "www/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    describe("bbm.platform.register", function () {
        it("registers an application", function () {
            var options = { uuid : "blah" };

            client.register(options);
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "register", { "options" : options });
        });
    });

    describe("bbm.platform.self", function () {
        it("getDisplayPicture calls exec", function () {
            client.self.getDisplayPicture(function (img) { });
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/getDisplayPicture", { "eventId" : "bbm.self.getDisplayPicture" });
        });

        it("setStatus calls exec", function () {
            client.self.setStatus("available", "Hello");
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/setStatus", { "status" : "available", "statusMessage" : "Hello" });
        });

        it("setPersonalMessage calls exec", function () {
            client.self.setPersonalMessage("Hello World");
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/setPersonalMessage", { "personalMessage" : "Hello World" });
        });

        it("setDisplayPicture calls exec", function () {
            client.self.setDisplayPicture("/tmp/avatar.gif");
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/setDisplayPicture", { "displayPicture" : "/tmp/avatar.gif", "eventId": "bbm.self.setDisplayPicture" });
        });
    });

    describe("bbm.platform.self.profilebox", function () {
        it("addItem calls exec", function () {
            var args = {
                    options : {
                        text : "hello",
                        cookie : "hellocookie"
                    },
                    eventId : "bbm.self.profilebox.addItem"
                };

            client.self.profilebox.addItem(args.options, function (item) { });
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/profilebox/addItem", args);
        });

        it("removeItem calls exec", function () {
            var args = {
                    options : {
                        id : "hello123",
                    },
                    eventId : "bbm.self.profilebox.removeItem"
                };

            client.self.profilebox.removeItem(args.options);
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/profilebox/removeItem", args);
        });

        it("clearItems calls exec", function () {
            client.self.profilebox.clearItems();
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/profilebox/clearItems", undefined);
        });

        it("registerIcon calls exec", function () {
            var args = {
                    options : {
                        text : "hello",
                        cookie : "hellocookie",
                        iconId : 123
                    },
                    eventId : "bbm.self.profilebox.registerIcon"
                };

            client.self.profilebox.registerIcon(args.options); 
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/profilebox/registerIcon", args);
        });

        it("accessible property calls exec", function () {
            var accessible = client.self.profilebox.accessible;
            accessible = accessible;
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/profilebox/getAccessible", undefined);
        });

        it("item property calls exec", function () {
            var item = client.self.profilebox.item;
            item = item;
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "self/profilebox/getItems", undefined);
        });
    });

    describe("bbm.platform.users", function () {
        it("inviteToDownload calls exec", function () {
            client.users.inviteToDownload();
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "users/inviteToDownload", undefined);
        });
    });
});

