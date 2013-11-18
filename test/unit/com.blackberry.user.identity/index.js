/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
*/

var _apiDir = __dirname + "/../../../plugin/com.blackberry.user.identity/",
    _libDir = __dirname + "/../../../lib/",
    index,
    encoderStringifier,
    callbackIdToEventId,
    MockPluginResult;

encoderStringifier = function (args) {
    var newObj = {},
        x;


    for (x in args) {
        if (args.hasOwnProperty(x)) {
            newObj[x] = encodeURIComponent(JSON.stringify(args[x]));
        }
    }

    return newObj;
};

callbackIdToEventId = function (args) {
    var arr = [],
        newObj = {},
        props;

    // switch callbackId property to _eventId property
    if (args.callbackId) {
        args["_eventId"] = args.callbackId;
        delete args.callbackId;
    }

    // moving eventId to to the front of the array
    for (props in args) {
        if (props === "_eventId") {
            arr.unshift([props, args[props]]);
        } else {
            arr.push([props, args[props]]);
        }
    }
    console.log(arr);
    // turn array to an object to be returned for comparison
    arr.forEach(function (val, ind) {
        newObj[val[0]] = val[1];
    });

    return newObj;
};

describe("user.identity index", function () {

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

        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.PluginResult;
        delete GLOBAL.JNEXT;
        index = null;
        delete require.cache[require.resolve(_apiDir + "index")];
    });

    it("getVersion", function () {
        index.getVersion(null, null, null, null);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "getVersion");
        expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
    });

    describe("registerProvider", function () {
        it("calls JNEXT and result.ok if provider exists", function () {
            var options = {
                    provider: "ids:rim:bbid"
                },
                args = encoderStringifier(options);

            index.registerProvider(null, null, args, null);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "registerProvider " + options.provider);
            expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
        });

        it("does not call JNEXT and result.ok if provider DNE", function () {
            index.registerProvider(null, null, null, null);
            expect(JNEXT.invoke).not.toHaveBeenCalledWith();
            expect(MockPluginResult.prototype.ok).not.toHaveBeenCalled();
        });
    });

    it("setOption", function () {
        var options = {
                option: 0,
                value: true
            },
            args = encoderStringifier(options);

        index.setOption(null, null, args, null);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "setOption " + JSON.stringify(options));
        expect(MockPluginResult.prototype.ok).toHaveBeenCalled();
    });

    it("getToken", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                tokenType: "AppWorld",
                appliesTo: "urn:bbid:appworld:appworld"
            },
            newArgs,
            args = encoderStringifier(options);

        index.getToken(null, null, args, null);
        newArgs = callbackIdToEventId(options);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "getToken " + JSON.stringify(newArgs));
    });

    it("clearToken", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                tokenType: "AppWorld",
                appliesTo: "urn:bbid:appworld:appworld"
            },
            newArgs,
            args = encoderStringifier(options);

        index.clearToken(null, null, args, null);
        newArgs = callbackIdToEventId(options);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "clearToken " + JSON.stringify(newArgs));

    });

    it("getProperties", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                propertyType: 0,
                userProperties: "properties"
            },
            args = encoderStringifier(options),
            newArgs = {
                _eventId: "hello",
                provider: "ids:rim:bbid",
                propertyType: 0,
                numProps: 1,
                userProperties: "properties"
            };

        index.getProperties(null, null, args, null);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), 'getProperties ' + JSON.stringify(newArgs));
    });

    it("getData", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 0,
                dataName: "hello"
            },
            newArgs,
            args = encoderStringifier(options);

        index.getData(null, null, args, null);
        newArgs = callbackIdToEventId(options);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "getData " + JSON.stringify(newArgs));
    });

    it("createData", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 0,
                dataName: "hello",
                dataValue: "yo"
            },
            newArgs,
            args = encoderStringifier(options);

        index.createData(null, null, args, null);
        newArgs = callbackIdToEventId(options);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "createData " + JSON.stringify(newArgs));
    });

    it("deleteData", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 0,
                dataName: "hello"
            },
            newArgs,
            args = encoderStringifier(options);

        index.deleteData(null, null, args, null);
        newArgs = callbackIdToEventId(options);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "deleteData " + JSON.stringify(newArgs));
    });

    it("setData", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 0,
                dataName: "hello",
                dataValue: "yo"
            },
            newArgs,
            args = encoderStringifier(options);

        index.setData(null, null, args, null);
        newArgs = callbackIdToEventId(options);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "setData " + JSON.stringify(newArgs));
    });

    it("listData", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 0
            },
            newArgs,
            args = encoderStringifier(options);

        index.listData(null, null, args, null);
        newArgs = callbackIdToEventId(options);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "listData " + JSON.stringify(newArgs));
    });

    it("challenge", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                challengeType: 0,
                challengeFlags: 0
            },
            newArgs,
            args = encoderStringifier(options);

        index.challenge(null, null, args, null);
        newArgs = callbackIdToEventId(options);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "challenge " + JSON.stringify(newArgs));
    });

    it("registerNotifier", function () {
        var options = {
                callbackId: "hello",
                provider: "ids:rim:bbid",
                notifierType: 0,
                notifierFlags: 0,
                notifierName: "yo"
            },
            newArgs,
            args = encoderStringifier(options);

        index.registerNotifier(null, null, args, null);
        newArgs = callbackIdToEventId(options);
        expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "registerNotifier " + JSON.stringify(newArgs));
    });
});
