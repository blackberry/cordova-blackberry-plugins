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

var _apiDir = __dirname + "/../../../plugin/com.blackberry.notification/",
    _libDir = __dirname + "/../../../lib/",
    index,
    mockNotification,
    MockPluginResult;

describe("notification index", function () {
    beforeEach(function () {
        mockNotification = {
            notify: jasmine.createSpy("Notification 'notify' method"),
            remove: jasmine.createSpy("Notification 'remove' method")
        };

        MockPluginResult = function () {};
        MockPluginResult.prototype.callbackOk = jasmine.createSpy("PluginResult.callbackOk");
        MockPluginResult.prototype.callbackError = jasmine.createSpy("PluginResult.callbackError");
        MockPluginResult.prototype.ok = jasmine.createSpy("PluginResult.ok");
        MockPluginResult.prototype.error = jasmine.createSpy("PluginResult.error");
        MockPluginResult.prototype.noResult = jasmine.createSpy("PluginResult.noResult");


        GLOBAL.qnx = {
            webplatform: {
                notification: mockNotification
            }
        };

        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.qnx;
        delete require.cache[require.resolve(_apiDir + "index")];
    });

    describe("methods", function () {
        var args,
            notifyArgs;

        beforeEach(function () {
            args = {
                id : "100",
                title : JSON.stringify(encodeURIComponent("TheTitle")),
                options: encodeURIComponent(JSON.stringify({
                    tag: "TheTag"
                }))
            };
            notifyArgs = {
                id: 100,
                title: "TheTitle",
                options: {
                    tag: "TheTag"
                }
            };
        });

        afterEach(function () {
            args = null;
            notifyArgs = null;
        });

        it("Should have 'notify' method defined", function () {
            expect(index.notify).toBeDefined();
            expect(typeof index.notify).toEqual("function");
        });

        it("Should have 'remove' method defined", function () {
            expect(index.remove).toBeDefined();
            expect(typeof index.remove).toEqual("function");
        });

        describe("notify method", function () {
            it("Should invoke notification notify method when making a call with required parameters", function () {
                index.notify(new MockPluginResult(), args);
                expect(mockNotification.notify).toHaveBeenCalledWith(notifyArgs, jasmine.any(Function));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(mockNotification.remove).toHaveBeenCalledWith(notifyArgs.options.tag);
            });

            it("Should invoke notification notify method when making a call with all parameters", function () {
                args.options = JSON.stringify({
                    tag: encodeURIComponent("TheTag"),
                    'body': encodeURIComponent("TheSubtitle"),
                    'target': encodeURIComponent("The.Target"),
                    'targetAction': encodeURIComponent("The.Target.Action"),
                    'payload': encodeURIComponent("Payload"),
                    'payloadType': encodeURIComponent("PayloadType"),
                    'payloadURI': encodeURIComponent("http://www.payload.uri")
                });

                notifyArgs.options.body = "TheSubtitle";
                notifyArgs.options.target = "The.Target";
                notifyArgs.options.targetAction = "The.Target.Action";
                notifyArgs.options.payload = "Payload";
                notifyArgs.options.payloadType = "PayloadType";
                notifyArgs.options.payloadURI = "http://www.payload.uri";

                index.notify(new MockPluginResult(), args);
                expect(mockNotification.notify).toHaveBeenCalledWith(notifyArgs, jasmine.any(Function));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(mockNotification.remove).toHaveBeenCalledWith(notifyArgs.options.tag);
            });

            it("Should invoke notification notify with default targetAction if target is provided but no targetAction wasn't", function () {
                var defaultTargetAction = "bb.action.OPEN";

                args.options = JSON.stringify({tag: encodeURIComponent("TheTag"), 'target': encodeURIComponent("The.Target")});
                notifyArgs.options.target = "The.Target";
                notifyArgs.options.targetAction = defaultTargetAction;

                index.notify(new MockPluginResult(), args);
                expect(mockNotification.notify).toHaveBeenCalledWith(notifyArgs, jasmine.any(Function));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(mockNotification.remove).toHaveBeenCalledWith(notifyArgs.options.tag);
            });

            it("Should invoke notificatoin notify with no default targetAction if target is an empty string", function () {
                args.options = JSON.stringify({tag: encodeURIComponent("TheTag"), 'target': ""});
                notifyArgs.options.target = "";

                index.notify(new MockPluginResult(), args);
                expect(mockNotification.notify).toHaveBeenCalledWith(notifyArgs, jasmine.any(Function));
                expect(mockNotification.notify.mostRecentCall.args[0].targetAction).not.toBeDefined();
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(mockNotification.remove).toHaveBeenCalledWith(notifyArgs.options.tag);
            });

            it("Should invoke notification notify with no default targetAction if target is not provided", function () {
                index.notify(new MockPluginResult(), args);
                expect(mockNotification.notify).toHaveBeenCalledWith(notifyArgs, jasmine.any(Function));
                expect(args.options.target).not.toBeDefined();
                expect(args.options.targetAction).not.toBeDefined();
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(mockNotification.remove).toHaveBeenCalledWith(notifyArgs.options.tag);
            });

            it("Should set target from first occurrence of applicaiton type target in config and pass it to notify method", function () {
                var viewerTarget = "bb.notification.target.viewer",
                    appTargetFirst = "bb.notification.target.app.first",
                    appTargetSecond = "bb.notification.target.app.second",
                    defaultTargetAction = "bb.action.OPEN",
                    config = require(_libDir + "config");


                config["invoke-target"] = [{
                    "@": {"id": viewerTarget},
                    "type": "VIEWER"
                },
                {
                    "@": {"id": appTargetFirst},
                    "type": "APPLICATION"
                },
                {
                    "@": {"id": appTargetSecond},
                    "type": "APPLICATION"
                }];

                this.after(function () {
                    delete require.cache[require.resolve(_libDir + "config")];
                });

                notifyArgs.options.target = appTargetFirst;
                notifyArgs.options.targetAction = defaultTargetAction;

                index.notify(new MockPluginResult(), args);
                expect(mockNotification.notify).toHaveBeenCalledWith(notifyArgs, jasmine.any(Function));
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(mockNotification.remove).toHaveBeenCalledWith(notifyArgs.options.tag);
            });

            it("Should not set target and targetAction if not provided and no in config", function () {
                index.notify(new MockPluginResult(), args);
                expect(mockNotification.notify).toHaveBeenCalledWith(notifyArgs, jasmine.any(Function));
                expect(args.options.target).not.toBeDefined();
                expect(args.options.targetAction).not.toBeDefined();
                expect(MockPluginResult.prototype.noResult).toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(mockNotification.remove).toHaveBeenCalledWith(notifyArgs.options.tag);
            });
        });
        describe("remove method", function () {
            it("Should call notification remove method when remove is called.", function () {
                index.remove(new MockPluginResult(), {tag: encodeURIComponent(JSON.stringify("TheTag"))});
                expect(mockNotification.remove).toHaveBeenCalledWith(notifyArgs.options.tag);
                expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).not.toHaveBeenCalled();
                expect(mockNotification.remove).toHaveBeenCalledWith(notifyArgs.options.tag);
            });

            it("Should throw an error when no tag is provided.", function () {
                index.remove(new MockPluginResult());
                expect(mockNotification.remove).not.toHaveBeenCalledWith(notifyArgs.options.tag);
                expect(MockPluginResult.prototype.ok).not.toHaveBeenCalled();
                expect(MockPluginResult.prototype.error).toHaveBeenCalledWith(jasmine.any(String));
                expect(mockNotification.remove).not.toHaveBeenCalledWith(notifyArgs.options.tag);
            });
        });
    });
});
