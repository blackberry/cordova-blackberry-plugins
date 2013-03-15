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
    mockedWebworks;

function isDefinedAndEquals(property, value) {
    expect(property).toBeDefined();
    expect(property).toEqual(value);
}

describe("client ui.cover", function () {
    beforeEach(function () {
        mockedWebworks = {
            exec: jasmine.createSpy("mocked webworks exec")
        };
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        mockedWebworks = null;
        delete GLOBAL.window;
        client = null;
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
        client.resetCover();
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "resetCover");
    });

    it("coverSize calls exec with the correct parameters", function () {
        expect(client.coverSize).toEqual(undefined);
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "coverSize");
    });

    it("updateCover calls exec with the correct parameters", function () {
        client.setContent(client.TYPE_IMAGE, {path: "/path/to/an/image.png"});
        client.setTransition(client.TRANSITION_DEFAULT);
        client.labels.push({"label": "Text Label", "size": 8, "color": "#FF0000", "wrap": false});
        client.showBadges = false;
        client.updateCover();
        expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "updateCover", {"cover": {
            cover: {
                type: client.TYPE_IMAGE,
                path: "/path/to/an/image.png"
            },
            transition: client.TRANSITION_DEFAULT,
            text: [{"label": "Text Label", "size": 8, "color": "#FF0000", "wrap": false}],
            badges: false
        }});
    });

});
