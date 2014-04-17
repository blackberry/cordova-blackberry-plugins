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
    _ID = "com.blackberry.ui.cover",
    _apiDir = _extDir + "/" + _ID,
    client,
    success,
    fail,
    channelRegistry = {},
    MockedChannel;

function isDefinedAndEquals(property, value) {
    expect(property).toBeDefined();
    expect(property).toEqual(value);
}

describe("client ui.cover", function () {
    beforeEach(function () {
        MockedChannel = function () {
            return {
                onHasSubscribersChange: undefined,
                numHandlers: undefined
            };
        };
        GLOBAL.cordova = {
            exec: jasmine.createSpy("exec"),
            require: function () {
                return cordova.exec;
            },
            addDocumentEventHandler: jasmine.createSpy("cordova.addDocumentEventHandler").andCallFake(function (eventName) {
                channelRegistry[eventName] = new MockedChannel();
                return channelRegistry[eventName];
            }),
            fireDocumentEvent: jasmine.createSpy("cordova.fireDocumentEvent")
        };
        client = require(_apiDir + "/www/client");
        success = jasmine.createSpy("success");
        fail = jasmine.createSpy("fail");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        delete require.cache[require.resolve(_apiDir + "/www/client")];
    });

    it("constants are defined", function () {
        isDefinedAndEquals(client.TYPE_SNAPSHOT, "snapshot");
        isDefinedAndEquals(client.TYPE_IMAGE, "file");
        isDefinedAndEquals(client.TRANSITION_FADE, "fade");
        isDefinedAndEquals(client.TRANSITION_SLIDE, "slide");
        isDefinedAndEquals(client.TRANSITION_NONE, "none");
        isDefinedAndEquals(client.TRANSITION_DEFAULT, "default");
    });

    it("reset cover calls exec with the correct parameters", function () {
        client.resetCover("fullSize", success, fail);
        expect(cordova.exec).toHaveBeenCalledWith(success, fail, _ID, "resetCover", {name: "fullSize"});
    });

    it("getCoverSizes calls exec with the correct parameters", function () {
        client.getCoverSizes(success, fail);
        expect(cordova.exec).toHaveBeenCalledWith(success, fail, _ID, "coverSizes");
    });

    it("updateCover calls exec with the correct parameters", function () {
        var covers = {
            fullSize: {
                cover: {
                    type: "snapshot",
                    capture: {
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 200}},
                text: [{
                    label: "Label", 
                    size: 3
                }],
                transition: "default",
                badges: true
            }
        };
        client.updateCovers(covers, success, fail);
        expect(cordova.exec).toHaveBeenCalledWith(success, fail, _ID, "updateCovers", {"covers": covers}); 
    });
});
