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
var _extDir = __dirname + "/../../../plugin/",
    _libDir = __dirname + "/../../../lib/",
    env = {},
    contextmenu,
    overlayWebView,
    mockedPluginResult,
    mockedContextMenu = {
        addItem: jasmine.createSpy().andCallFake(function (success, fail, args, env) {
            if (args && typeof args.handler === 'function') {
                args.handler('Copy', '1');
            }
        }),
        removeItem: jasmine.createSpy(),
        overrideItem: jasmine.createSpy(),
        clearOverride: jasmine.createSpy(),
        defineCustomContext: jasmine.createSpy(),
        disablePlatformItem: jasmine.createSpy(),
        enablePlatformItem: jasmine.createSpy(),
        listDisabledPlatformItems: jasmine.createSpy(),
        enabled : true
    },
    mockedQnx = {
        webplatform: {
            getController: function () {
                return {
                    addEventListener: function (eventType, callback) {
                        callback();
                    }
                };
            },
            createUIWebView: function () {
                return {
                    contextMenu : mockedContextMenu
                };
            }
        }
    };

describe("com.blackberry.ui.contextmenu index", function () {

    beforeEach(function () {
        GLOBAL.qnx = mockedQnx;
        GLOBAL.window = {
            qnx: mockedQnx
        };
        contextmenu = require(_extDir + "com.blackberry.ui.contextmenu");
        overlayWebView = require(_libDir + "overlayWebView");
        overlayWebView.create();
        overlayWebView.contextMenu = mockedContextMenu;
        mockedPluginResult = {
            ok: jasmine.createSpy("PluginResult.ok"),
            error: jasmine.createSpy("PluginResult.error"),
            noResult: jasmine.createSpy("PluginResult.noResult"),
            callbackOk: jasmine.createSpy("PluginResult.callbackOk")
        };
        GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);
    });

    afterEach(function () {
        delete GLOBAL.qnx;
        delete GLOBAL.window;
        delete GLOBAL.PluginResult;
    });

    it("can set the enabled property to false properly", function () {
        var args = {
            enabled: false
        };

        contextmenu.enabled(null, null, args, env);
        expect(overlayWebView.contextMenu.enabled).toEqual(false);
        expect(mockedPluginResult.ok).toHaveBeenCalled();
    });

    it("can set and read the enabled property to true", function () {
        var args = {
            enabled: true
        };

        contextmenu.enabled(null, null, args, env);
        expect(overlayWebView.contextMenu.enabled).toEqual(true);
        expect(mockedPluginResult.ok).toHaveBeenCalled();
    });

    it("Will not set the property when incorrect parameters are passed", function () {
        var args = {
            enabled: true
        };

        contextmenu.enabled(null, null, args, env);
        expect(mockedContextMenu.enabled).toEqual(true);
        args = {
            enabled: "false"
        };
        expect(mockedContextMenu.enabled).toEqual(true);
        expect(mockedPluginResult.ok).toHaveBeenCalled();
    });

    it("can add a custom menu item", function () {
        var args = {
                contexts: encodeURIComponent(JSON.stringify(['ALL'])),
                action: encodeURIComponent(JSON.stringify({actionId: 'explosion'}))
            },
            expectedArgs = {
                contexts: ['ALL'],
                action: {actionId: 'explosion'},
                handler: jasmine.any(Function)
            };

        contextmenu.addItem(null, null, args, env);
        expect(mockedContextMenu.addItem).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), expectedArgs, env);
    });

    it("properly passes the sourceId from the handler back to the callback", function () {
        var args = {
            contexts: encodeURIComponent(JSON.stringify(['ALL'])),
            action: encodeURIComponent(JSON.stringify({actionId: 'explosion'}))
        };

        contextmenu.addItem(null, null, args, env);
        expect(mockedPluginResult.callbackOk).toHaveBeenCalledWith("1", true);
    });

    it("can remove a custom menu item", function () {
        var id = 42,
            args = {
                contexts: encodeURIComponent(JSON.stringify(['ALL'])),
                actionId: encodeURIComponent(JSON.stringify(id))
            },
            expectedArgs = {
                contexts: ['ALL'],
                actionId: id
            };

        contextmenu.removeItem(null, null, args, env);
        expect(mockedContextMenu.removeItem).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), expectedArgs, env);
    });

    it("can define a custom context", function () {
        var args = {
            context: encodeURIComponent(JSON.stringify("myContext")),
            options: encodeURIComponent(JSON.stringify({
                includeContextItems: ['IMAGE'],
                includePlatformItems: false,
                includeMenuServiceItems: false
            }))
        };

        contextmenu.defineCustomContext(null, null, args, env);
        expect(mockedContextMenu.defineCustomContext).toHaveBeenCalledWith("myContext", {
            includeContextItems: ['IMAGE'],
            includePlatformItems: false,
            includeMenuServiceItems: false
        });
    });

    it("has an override menu item function", function () {
        expect(contextmenu.overrideItem).toBeDefined();
    });

    it("has an clearmenu item function", function () {
        expect(contextmenu.clearOverride).toBeDefined();
    });

    it("can override a platform menu item", function () {
        var args = {
            action: encodeURIComponent(JSON.stringify({actionId: 'Paste'}))
        };
        contextmenu.overrideItem(null, null, args, env);
        expect(mockedContextMenu.overrideItem).toHaveBeenCalledWith({ actionId: 'Paste'}, jasmine.any(Function));
    });

    it("can override a platform MenuService menu item", function () {
        var args = {
            action: encodeURIComponent(JSON.stringify({actionId: 'MenuService-Share'}))
        };
        contextmenu.overrideItem(null, null, args, env);
        expect(mockedContextMenu.overrideItem).toHaveBeenCalledWith({ actionId: 'MenuService-Share'}, jasmine.any(Function));
    });

    it("can clear an overriden platform menu item", function () {
        var args = {
            actionId: encodeURIComponent(JSON.stringify('Copy'))
        };
        contextmenu.clearOverride(null, null, args, env);
        expect(mockedContextMenu.clearOverride).toHaveBeenCalledWith('Copy');
    });

    it("can clear an overriden menu item", function () {
        var args = {
            actionId: encodeURIComponent(JSON.stringify('MenuService-Share'))
        };
        contextmenu.clearOverride(null, null, args, env);
        expect(mockedContextMenu.clearOverride).toHaveBeenCalledWith('MenuService-Share');
    });

    it("can disable a platform menu item", function () {
        var args = {
            actionId: encodeURIComponent(JSON.stringify('Paste')),
            context: encodeURIComponent(JSON.stringify('INPUT'))
        };
        contextmenu.disablePlatformItem(null, null, args, env);
        expect(mockedContextMenu.disablePlatformItem).toHaveBeenCalledWith(args.context, args.actionId);
    });

    it("can enable a disabled platform menu item", function () {
        var args = {
            actionId: encodeURIComponent(JSON.stringify('Paste')),
            context: encodeURIComponent(JSON.stringify('INPUT'))
        };
        contextmenu.enablePlatformItem(null, null, args, env);
        expect(mockedContextMenu.enablePlatformItem).toHaveBeenCalledWith(args.context, args.actionId);
    });

    it("can list all disabled platform menu items", function () {
        contextmenu.listDisabledPlatformItems(null);
        expect(mockedContextMenu.listDisabledPlatformItems).toHaveBeenCalled();
    });
});
