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

var _apiDir = __dirname + "/../../../plugin/com.blackberry.bbm.platform/",
    _libDir = __dirname + "/../../../lib/",
    MockPluginResult,
    index = null,
    context = null;

describe("bbm.platform index", function () {

    beforeEach(function () {

        MockPluginResult = function () {};
        MockPluginResult.prototype.callbackOk = jasmine.createSpy("PluginResult.callbackOk");
        MockPluginResult.prototype.callbackError = jasmine.createSpy("PluginResult.callbackError");
        MockPluginResult.prototype.ok = jasmine.createSpy("PluginResult.ok");
        MockPluginResult.prototype.error = jasmine.createSpy("PluginResult.error");
        MockPluginResult.prototype.noResult = jasmine.createSpy("PluginResult.noResult");

        GLOBAL.PluginResult = MockPluginResult;

        GLOBAL.JNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("1"),
            invoke: jasmine.createSpy().andReturn(2),
            registerEvents: jasmine.createSpy().andReturn(true),
            getgid: jasmine.createSpy().andReturn(jasmine.any(String))
        };

        context = require(_apiDir + "BBMEvents.js");
        spyOn(context, "addEventListener");
        spyOn(context, "removeEventListener");

        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.PluginResult;
        delete GLOBAL.JNEXT;
        index = null;
        delete require.cache[require.resolve(_apiDir + "index")];
    });

    describe("bbm.platform", function () {
        describe("register", function () {
            it("can call success", function () {
                var options = { "uuid": "464d3ba0-caba-11e1-9b23-0800200c9a66" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.register(null, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "register " + JSON.stringify(options));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("can call fail", function () {
                var options = { "uuid": "9b23-0800200c9a66" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.register(null, null, args, null);

                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith("UUID is not valid length");
            });
        });
    });

    describe("bbm.platform.self", function () {
        describe("self profile", function () {

            it("appVersion", function () {
                var success = jasmine.createSpy();

                index.self.appVersion(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "appVersion");
                expect(success).toHaveBeenCalled();
            });

            it("bbmsdkVersion", function () {
                var success = jasmine.createSpy();

                index.self.bbmsdkVersion(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "bbmsdkVersion");
                expect(success).toHaveBeenCalled();
            });

            it("displayName", function () {
                var success = jasmine.createSpy();

                index.self.displayName(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "displayName");
                expect(success).toHaveBeenCalled();
            });

            it("handle", function () {
                var success = jasmine.createSpy();

                index.self.handle(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "handle");
                expect(success).toHaveBeenCalled();
            });

            it("personalMessage", function () {
                var success = jasmine.createSpy();

                index.self.personalMessage(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "personalMessage");
                expect(success).toHaveBeenCalled();
            });

            it("ppid", function () {
                var success = jasmine.createSpy();

                index.self.ppid(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "ppid");
                expect(success).toHaveBeenCalled();
            });

            it("status", function () {
                var success = jasmine.createSpy();

                index.self.status(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "status");
                expect(success).toHaveBeenCalled();
            });

            it("statusMessage", function () {
                var success = jasmine.createSpy();

                index.self.statusMessage(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "statusMessage");
                expect(success).toHaveBeenCalled();
            });
        });

        describe("getDisplayPicture", function () {
            it("can call getDisplayPicture", function () {
                var args = {};

                index.self.getDisplayPicture(null, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getDisplayPicture");
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

        });

        describe("setStatus", function () {
            it("can call setStatus and succeed", function () {
                var success = jasmine.createSpy(),
                    args,
                    status = "available",
                    statusMessage = "Hello World";

                status = encodeURIComponent(status);
                statusMessage = encodeURIComponent(statusMessage);
                args = { "status": JSON.stringify(status), "statusMessage": JSON.stringify(statusMessage) };

                index.self.setStatus(success, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.setStatus " + JSON.stringify(args));
                expect(success).toHaveBeenCalled();
            });

            it("can call setStatus and fail", function () {
                var fail = jasmine.createSpy(),
                    args,
                    status = "hello",
                    statusMessage = "";

                status = encodeURIComponent(status);
                statusMessage = encodeURIComponent(statusMessage);
                args = { "status": JSON.stringify(status), "statusMessage": JSON.stringify(statusMessage) };

                index.self.setStatus(null, fail, args, null);

                expect(fail).toHaveBeenCalled();
            });
        });

        describe("setPersonalMessage", function () {
            it("can call setPersonalMessage and succeed", function () {
                var success = jasmine.createSpy(),
                    args,
                    personalMessage = "Hello World";

                args = { "personalMessage": encodeURIComponent(JSON.stringify(personalMessage)) };

                index.self.setPersonalMessage(success, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.setPersonalMessage " + personalMessage);
                expect(success).toHaveBeenCalled();
            });

            it("can call setPersonalMessage and fail", function () {
                var fail = jasmine.createSpy(),
                    args,
                    personalMessage = "";

                args = { "personalMessage": encodeURIComponent(JSON.stringify(personalMessage)) };

                index.self.setPersonalMessage(null, fail, args, null);

                expect(fail).toHaveBeenCalled();
            });
        });

        describe("setDisplayPicture", function () {
            it("can call setDisplayPicture and succeed", function () {
                var displayPicture = "/tmp/avatar.gif",
                    args = {"displayPicture": encodeURIComponent(JSON.stringify(displayPicture))};

                index.self.setDisplayPicture(null, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.setDisplayPicture " + displayPicture);
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("can call setDisplayPicture and fail", function () {
                var args,
                    displayPicture = "";

                args = {"displayPicture": encodeURIComponent(JSON.stringify(displayPicture))};

                index.self.setDisplayPicture(null, null, args, null);

                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith(jasmine.any(String));
            });
        });
    });

    describe("bbm.platform.users.profilebox", function () {
        describe("addItem", function () {
            it("can call addItem and succeed", function () {
                var options = { "text": "hello", "cookie": "hello" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.addItem(null, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.addItem " + JSON.stringify(options));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("can call addItem and fail", function () {
                var options = { "text": "", "cookie": "" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.addItem(null, null, args, null);

                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith(jasmine.any(String));
            });
        });

        describe("removeItem", function () {
            it("can call removeItem and succeed", function () {
                var options = { "text": "", "cookie" : "", "id": "abc123" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.removeItem(null, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.removeItem " + JSON.stringify(options));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("can call removeItem and fail", function () {
                var options = { "text": "", "cookie": "" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.removeItem(null, null, args, null);

                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith(jasmine.any(String));
            });
        });

        describe("clearItems", function () {
            it("can call clearItems and succeed", function () {
                var success = jasmine.createSpy();

                index.self.profilebox.clearItems(success, null, null, null);

                expect(success).toHaveBeenCalled();
            });
        });

        describe("registerIcon", function () {
            it("can call registerIcon and succeed", function () {
                var options = { "icon": "/tmp/icon.png", "iconId": 123 },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.registerIcon(null, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.registerIcon " + JSON.stringify(options));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("can call registerIcon and fail", function () {
                var options = { "icon": "" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.registerIcon(null, null, args, null);

                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith(jasmine.any(String));
            });
        });

        describe("getAccessible", function () {
            it("can call getAccessible and succeed", function () {
                var success = jasmine.createSpy();

                index.self.profilebox.getAccessible(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.getAccessible");
                expect(success).toHaveBeenCalled();
            });
        });

        describe("getItems", function () {
            it("can call getItems and succeed", function () {
                var success = jasmine.createSpy();

                index.self.profilebox.getItems(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.getItems");
                expect(success).toHaveBeenCalled();
            });
        });
    });

    describe("bbm.platform.users", function () {
        beforeEach(function () {
            GLOBAL.window = {};
            GLOBAL.qnx = {
                webplatform: {
                    getApplication: function () {
                        return {
                            cards: {
                                bbm: {
                                    inviteToDownload: {
                                        open: function (details, done, cancel, callback) {
                                            callback();
                                        }
                                    }
                                }
                            }
                        };
                    }
                }
            };
        });

        afterEach(function () {
            delete GLOBAL.window;
            delete GLOBAL.qnx;
        });

        it("calls users inviteToDownload", function () {
            var success = jasmine.createSpy("success"),
                fail = jasmine.createSpy("fail");

            index.users.inviteToDownload(success, fail, null);
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "users.inviteToDownload");
        });
    });

    describe("bbm platform events", function () {

        describe("onaccesschanged", function () {
            it("can be registered, triggered and unregistered", function () {
                var eventName = "onaccesschanged",
                    args = { "eventName": encodeURIComponent(JSON.stringify(eventName)) },
                    env = { webview: { id: 42} },
                    trigger;

                context.addEventListener.andCallFake(function (eventName, listener) {
                    trigger = listener;
                });


                index.startEvent(null, null, args, env);
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(context.addEventListener).toHaveBeenCalledWith(eventName, jasmine.any(Function));

                trigger({});
                expect(MockPluginResult.prototype.callbackOk).toHaveBeenCalled();

                index.stopEvent(null, null, args, env);
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(context.removeEventListener).toHaveBeenCalledWith(eventName, jasmine.any(Function));
            });

        });
    });
});
