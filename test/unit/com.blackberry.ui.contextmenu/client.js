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

var _ID = "com.blackberry.ui.contextmenu",
    _extDir = __dirname + "/../../../plugin",
    _apiDir = _extDir + "/" + _ID,
    client = null;

describe("com.blackberry.ui.contextmenu client", function () {

    beforeEach(function () {
        GLOBAL.cordova = {
            exec: jasmine.createSpy("exec").andCallFake(function (success) {
                success(true);
            }),
            require: function () {
                return cordova.exec;
            },
            addDocumentEventHandler: jasmine.createSpy().andReturn({
                onHasSubscribersChange: jasmine.createSpy()
            })
        };
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        delete GLOBAL.cordova;
    });

    it("enabled context menu calls exec", function () {
        client.enabled = true;
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "enabled", {"enabled": true});
    });

    it("disabled context menu calls exec", function () {
        client.enabled = false;
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "enabled", {"enabled": false});
    });

    it('expect context menu contexts to be defined properly', function () {
        expect(client.CONTEXT_ALL).toEqual("ALL");
        expect(client.CONTEXT_IMAGE).toEqual("IMAGE");
        expect(client.CONTEXT_IMAGE_LINK).toEqual("IMAGE_LINK");
        expect(client.CONTEXT_LINK).toEqual("LINK");
        expect(client.CONTEXT_INPUT).toEqual("INPUT");
        expect(client.CONTEXT_TEXT).toEqual("TEXT");
    });

    it('expect context menu action Ids to be defined properly', function () {
        expect(client.ACTION_CANCEL).toEqual("Cancel");
        expect(client.ACTION_CLEAR_FIELD).toEqual("ClearField");
        expect(client.ACTION_COPY).toEqual("Copy");
        expect(client.ACTION_COPY_IMAGE_LINK).toEqual("CopyImageLink");
        expect(client.ACTION_COPY_LINK).toEqual("CopyLink");
        expect(client.ACTION_CUT).toEqual("Cut");
        expect(client.ACTION_INSPECT_ELEMENT).toEqual("InspectElement");
        expect(client.ACTION_PASTE).toEqual("Paste");
        expect(client.ACTION_SAVE_IMAGE).toEqual("SaveImage");
        expect(client.ACTION_SAVE_LINK_AS).toEqual("SaveLinkAs");
        expect(client.ACTION_VIEW_IMAGE).toEqual("ViewImage");
        expect(client.ACTION_SELECT).toEqual("Select");
        expect(client.ACTION_MENU_SERVICE).toEqual("MenuService");
    });

    it("Cannot add a menu item without a context", function () {
        var myItem = {actionId: 'OpenLink', label: 'This is a lable'};
        expect(client.addItem(undefined, myItem, null)).toEqual('Adding a custom menu item requires a context');
    });

    it("Cannot add a menu item without an actionId", function () {
        var myItem = {label: 'OpenLink'},
            contexts = [client.CONTEXT_LINK];
        expect(client.addItem(contexts, myItem, null)).toEqual('Adding a custom menu item requires an actionId');
    });

    it("Cannot remove a menu item without an actionId", function () {
        var contexts = [client.CONTEXT_LINK];
        expect(client.removeItem(contexts, undefined, null)).toEqual('Removing a custom menu item requires an actionId');
    });

    it("Cannot remove a menu item without a context", function () {
        var myItem = {label: 'OpenLink'};
        expect(client.removeItem(undefined, myItem, null)).toEqual('Removing a custom menu item requires a context');
    });

    it("defineCustomContext calls exec", function () {
        var options = {
            includeContextItems: [client.CONTEXT_IMAGE],
            includePlatformItems: false,
            includeMenuServiceItems: false
        };

        client.defineCustomContext("myContext", options);
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "defineCustomContext", {context: "myContext", options: options});
    });

    it("Can override an item with an action and handler", function () {
        var myItem = {actionId: 'OpenLink', label: 'This is a lable'},
            handler = jasmine.createSpy();
        client.overrideItem(myItem, handler);
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'overrideItem', {action: myItem});
    });

    it("Can clear an item with an actionId", function () {
        var actionId = 'OpenLink';
        client.clearOverride(actionId);
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'clearOverride', {actionId: actionId});
    });

    it("can disable a platform provided item", function () {
        var context = client.CONTEXT_ALL,
            actionId = client.ACTION_OPEN_LINK;
        client.disablePlatformItem(context, actionId);
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'disablePlatformItem', {context: context, actionId: actionId});
    });

    it("can enable a disabled platform provided item", function () {
        var context = client.CONTEXT_ALL,
            actionId = client.ACTION_OPEN_LINK;
        client.enablePlatformItem(context, actionId);
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'enablePlatformItem', {context: context, actionId: actionId});
    });

    it("can list the disabled platform provided item", function () {
        client.listDisabledPlatformItems();
        expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, 'listDisabledPlatformItems');
    });
});
