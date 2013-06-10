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
        delete GLOBAL.JNEXT;
        require.cache = {};
    });

    describe("bbm.platform", function () {
        describe("register", function () {
            it("will call noResult initially", function () {
                var options = { "uuid": "464d3ba0-caba-11e1-9b23-0800200c9a66" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.register(new MockPluginResult(), args);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "register " + JSON.stringify(options));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("will call error with invalid UUID", function () {
                var options = { "uuid": "9b23-0800200c9a66" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.register(new MockPluginResult(), args);

                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith("UUID is not valid length");
            });
        });
    });

    describe("bbm.platform.self", function () {
        describe("self profile", function () {

            it("appVersion", function () {
                index.self.appVersion(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "appVersion");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });

            it("bbmsdkVersion", function () {
                index.self.bbmsdkVersion(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "bbmsdkVersion");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });

            it("displayName", function () {
                index.self.displayName(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "displayName");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });

            it("handle", function () {
                index.self.handle(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "handle");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });

            it("personalMessage", function () {
                index.self.personalMessage(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "personalMessage");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });

            it("ppid", function () {
                index.self.ppid(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "ppid");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });

            it("status", function () {
                index.self.status(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "status");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });

            it("statusMessage", function () {
                index.self.statusMessage(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + "statusMessage");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });
        });

        describe("getDisplayPicture", function () {
            it("can call getDisplayPicture", function () {
                var args = {};

                index.self.getDisplayPicture(new MockPluginResult(), args);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getDisplayPicture");
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

        });

        describe("setStatus", function () {
            it("can call setStatus and succeed", function () {
                var args,
                    status = "available",
                    statusMessage = "Hello World";

                status = encodeURIComponent(status);
                statusMessage = encodeURIComponent(statusMessage);
                args = { "status": JSON.stringify(status), "statusMessage": JSON.stringify(statusMessage) };

                index.self.setStatus(new MockPluginResult(), args);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.setStatus " + JSON.stringify(args));
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });

            it("can call setStatus and result.error", function () {
                var args,
                    status = "hello",
                    statusMessage = "";

                status = encodeURIComponent(status);
                statusMessage = encodeURIComponent(statusMessage);
                args = { "status": JSON.stringify(status), "statusMessage": JSON.stringify(statusMessage) };

                index.self.setStatus(new MockPluginResult(), args);

                expect(JNEXT.invoke).not.toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).toHaveBeenCalled();
                expect(MockPluginResult.prototype.ok).not.toHaveBeenCalled();
            });
        });

        describe("setPersonalMessage", function () {
            it("can call setPersonalMessage and succeed", function () {
                var args,
                    personalMessage = "Hello World";

                args = { "personalMessage": encodeURIComponent(JSON.stringify(personalMessage)) };

                index.self.setPersonalMessage(new MockPluginResult(), args);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.setPersonalMessage " + personalMessage);
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
            });

            it("can call setPersonalMessage and error", function () {
                var args,
                    personalMessage = "";

                args = { "personalMessage": encodeURIComponent(JSON.stringify(personalMessage)) };

                index.self.setPersonalMessage(new MockPluginResult(), args);

                expect(JNEXT.invoke).not.toHaveBeenCalled();
                expect(MockPluginResult.prototype.ok).not.toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).toHaveBeenCalled();
            });
        });

        describe("setDisplayPicture", function () {
            it("can call setDisplayPicture and succeed", function () {
                var displayPicture = "/tmp/avatar.gif",
                    args = {"displayPicture": encodeURIComponent(JSON.stringify(displayPicture))};

                index.self.setDisplayPicture(new MockPluginResult(), args);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.setDisplayPicture " + displayPicture);
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("can call setDisplayPicture and error", function () {
                var args,
                    displayPicture = "";

                args = {"displayPicture": encodeURIComponent(JSON.stringify(displayPicture))};

                index.self.setDisplayPicture(new MockPluginResult(), args);

                expect(JNEXT.invoke).not.toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith(jasmine.any(String));
            });
        });
    });

    describe("bbm.platform.users.profilebox", function () {
        describe("addItem", function () {
            it("calls JNext and noResult", function () {
                var options = { "text": "hello", "cookie": "hello" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.addItem(new MockPluginResult(), args);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.addItem " + JSON.stringify(options));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("calls result.error", function () {
                var options = { "text": "", "cookie": "" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.addItem(new MockPluginResult(), args);

                expect(JNEXT.invoke).not.toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith(jasmine.any(String));
            });
        });

        describe("removeItem", function () {
            it("can call removeItem and succeed", function () {
                var options = { "text": "", "cookie" : "", "id": "abc123" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.removeItem(new MockPluginResult(), args);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.removeItem " + JSON.stringify(options));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("can call removeItem and error", function () {
                var options = { "text": "", "cookie": "" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.removeItem(new MockPluginResult(), args);

                expect(JNEXT.invoke).not.toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith(jasmine.any(String));
            });
        });

        describe("clearItems", function () {
            it("can call clearItems and succeed", function () {
                index.self.profilebox.clearItems(new MockPluginResult());

                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });
        });

        describe("registerIcon", function () {
            it("can call registerIcon and succeed", function () {
                var options = { "icon": "/tmp/icon.png", "iconId": 123 },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.registerIcon(new MockPluginResult(), args);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.registerIcon " + JSON.stringify(options));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
            });

            it("can call registerIcon and error", function () {
                var options = { "icon": "" },
                    args = { "options": encodeURIComponent(JSON.stringify(options)) };

                index.self.profilebox.registerIcon(new MockPluginResult(), args);

                expect(JNEXT.invoke).not.toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith(jasmine.any(String));
            });
        });

        describe("getAccessible", function () {
            it("can call getAccessible and succeed", function () {
                index.self.profilebox.getAccessible(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.getAccessible");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            });
        });

        describe("getItems", function () {
            it("can call getItems and succeed", function () {
                index.self.profilebox.getItems(new MockPluginResult());

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.profilebox.getItems");
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
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
            index.users.inviteToDownload(new MockPluginResult());
            expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
            expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
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

                index.startEvent(new MockPluginResult(), args, env);
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(context.addEventListener).toHaveBeenCalledWith(eventName, jasmine.any(Function));

                trigger({});
                expect(MockPluginResult.prototype.callbackOk).toHaveBeenCalled();

                index.stopEvent(new MockPluginResult(), args, env);
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalledWith(true);
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(context.removeEventListener).toHaveBeenCalledWith(eventName, jasmine.any(Function));
            });

        });
    });
});
