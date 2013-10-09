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
    _ID = "com.blackberry.notification",
    _apiDir = _extDir + "/" + _ID,
    client,
    Notification;

describe("notification client creates Notification object attached to window", function () {
    var onShow,
        onError;

    beforeEach(function () {
        GLOBAL.window = {
            isFinite: isFinite
        };
        GLOBAL.cordova = {
            exec: jasmine.createSpy(),
            require: function () {
                return cordova.exec;
            }
        };
        client = require(_apiDir + "/www/client");
        Notification = window.Notification;
        onShow = jasmine.createSpy("Notification onshow");
        onError = jasmine.createSpy("Notification onerror");
    });

    afterEach(function () {
        Notification = null;
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = null;
        onShow = null;
        onError = null;
        delete GLOBAL.window;
        delete GLOBAL.cordova;
    });

    describe("Namespace, methods and properties", function () {
        it("should have a Notification object attached to window", function () {
            expect(Notification).toBeDefined();
        });

        it("should have static permission field that equal to 'granted'", function () {
            expect(Notification.permission).toEqual("granted");
        });

        it("should have static 'requestPermission' method", function () {
            expect(Notification.requestPermission).toBeDefined();
            expect(typeof Notification.requestPermission).toEqual("function");
        });

        it("should have static 'remove' method", function () {
            expect(Notification.remove).toBeDefined();
            expect(typeof Notification.remove).toEqual("function");
        });

        it("should have 'close' method belongs to instance", function () {
            var notification = new Notification("N Title");
            expect(notification.close).toBeDefined();
            expect(typeof notification.close).toEqual("function");
        });
    });

    describe("Constructor", function () {
        it("should be able to construct Notification object", function () {
            var notification = new Notification("N Title");
            expect(notification).toBeDefined();
            expect(typeof notification).toEqual("object");
        });

        it("should have 'close' method belongs to Notification instance", function () {
            var notification = new Notification("N Title");
            expect(notification.close).toBeDefined();
            expect(typeof notification.close).toEqual("function");
        });

        it("should call exec when Notification object is created", function () {
            new Notification("N Title");

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "notify", jasmine.any(Object));
            expect(cordova.exec.mostRecentCall.args[4].id).toBeDefined();
            expect(cordova.exec.mostRecentCall.args[4].title).toBeDefined();
            expect(cordova.exec.mostRecentCall.args[4].options).toBeDefined();
            expect(typeof cordova.exec.mostRecentCall.args[4].options).toEqual("object");
            expect(cordova.exec.mostRecentCall.args[4].options.tag).toBeDefined();
        });

        it("should call exec with all required fields when calling Notification constructor", function () {
            new Notification("N Title");

            expect(cordova.exec.mostRecentCall.args[4].id).toBeDefined();
            expect(cordova.exec.mostRecentCall.args[4].title).toBeDefined();
            expect(cordova.exec.mostRecentCall.args[4].options).toBeDefined();
            expect(typeof cordova.exec.mostRecentCall.args[4].options).toEqual("object");
            expect(cordova.exec.mostRecentCall.args[4].options.tag).toBeDefined();
        });


        it("should throw an exception when title is not provided", function () {
            expect(function () {
                new Notification();
            }).toThrow();
        });

        it("should throw an exception when title is not a string", function () {
            expect(function () {
                new Notification(1);
            }).toThrow();
        });
    });

    describe("'remove' method", function () {
        it("should call exec when 'remove' method called", function () {
            Notification.remove("TheTag");

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "remove", jasmine.any(Object));
        });

        it("should call exec with tag when 'remove' method called", function () {
            var tag = "TheTag";

            Notification.remove(tag);

            expect(cordova.exec.mostRecentCall.args[4].tag).toBeDefined();
            expect(cordova.exec.mostRecentCall.args[4].tag).toEqual(tag);
        });


        it("should not call exec when not tag passed to 'remove'", function () {
            Notification.remove();

            expect(cordova.exec).not.toHaveBeenCalled();
        });
    });

    describe("'close' method", function () {
        it("should call exec with for method 'remove' when 'close' method is called", function () {
            var notification = new Notification("TheTitle");

            notification.close();

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "remove", jasmine.any(Object));
        });

        it("should call exec with corresponding tag when 'close' method called", function () {
            var tag = "TheTag",
                notification = new Notification("TheTitle", {'tag': tag});

            notification.close();

            expect(cordova.exec.mostRecentCall.args[4].tag).toBeDefined();
            expect(cordova.exec.mostRecentCall.args[4].tag).toEqual(tag);
        });

        it("should always call exec with tag set even if no tag was provided to 'close' method", function () {
            var notification = new Notification("TheTitle");
            cordova.exec.reset();

            notification.close();
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "remove", jasmine.any(Object));
            expect(cordova.exec.mostRecentCall.args[4].tag).toBeDefined();
        });
    });
});
