/*
 *  Licensed to the Apache Software Foundation (ASF) under one
 *  or more contributor license agreements.  See the NOTICE file
 *  distributed with this work for additional information
 *  regarding copyright ownership.  The ASF licenses this file
 *  to you under the Apache License, Version 2.0 (the
 *  "License"); you may not use this file except in compliance
 *  with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
*/

var _extDir = __dirname + "/../../../plugin/",
    _ID = "com.blackberry.user.identity",
    _apiDir = _extDir + _ID,
    client,
    anyFunct;

describe("user.identity client", function () {
    beforeEach(function () {
        anyFunct = jasmine.any(Function);
        GLOBAL.cordova = {
            require: function () {
                return cordova.exec;
            },
            exec: jasmine.createSpy("cordova.exec")
        };
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = null;
        anyFunct = null;
    });

    it("getVersion calls exec", function () {
        client.getVersion();
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "getVersion");
    });

    it("registerProvider calls exec", function () {
        var args = {
                provider: "ids:rim:bbid"
            };

        client.registerProvider(args.provider);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "registerProvider", args);
    });

    it("setOption calls exec", function () {
        var args = {
                option: 0,
                value: true
            };

        client.setOption(args.option, args.value);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "setOption", args);
    });

    it("getToken calls exec", function () {
        var args = {
                provider: "ids:rim:bbid",
                tokenType: 0,
                appliesTo: 1
            };

        client.getToken(args.provider, args.tokenType, args.appliesTo, anyFunct, anyFunct);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "getToken", args);
    });

    it("clearToken calls exec", function () {
        var args = {
                provider: "ids:rim:bbid",
                tokenType: 0,
                appliesTo: 1
            };

        client.clearToken(args.provider, args.tokenType, args.appliesTo, anyFunct, anyFunct);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "clearToken", args);
    });

    it("getData calls exec", function () {
        var args = {
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 0,
                dataName: "name"
            };

        client.getData(args.provider, args.dataType, args.dataFlags, args.dataName, anyFunct, anyFunct);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "getData", args);
    });

    it("createData calls exec", function () {
        var args = {
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 0,
                dataName: "name",
                dataValue: 1
            };

        client.createData(args.provider, args.dataType, args.dataFlags, args.dataName, args.dataValue, anyFunct, anyFunct);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "createData", args);
    });

    it("deleteData calls exec", function () {
        var args = {
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 0,
                dataName: "name"
            };

        client.deleteData(args.provider, args.dataType, args.dataFlags, args.dataName, anyFunct, anyFunct);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "deleteData", args);
    });

    it("setData calls exec", function () {
        var args = {
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 0,
                dataName: "name",
                dataValue: 1
            };

        client.setData(args.provider, args.dataType, args.dataFlags, args.dataName, args.dataValue, anyFunct, anyFunct);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "setData", args);
    });

    it("listData calls exec", function () {
        var args = {
                provider: "ids:rim:bbid",
                dataType: 0,
                dataFlags: 1
            };

        client.listData(args.provider, args.dataType, args.dataFlags, anyFunct, anyFunct);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "listData", args);
    });

    it("challenge calls exec", function () {
        var args = {
                provider: "ids:rim:bbid",
                challengeType: 0,
                challengeFlags: 1
            };

        client.challenge(args.provider, args.challengeType, args.challengeFlags, anyFunct, anyFunct);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "challenge", args);
    });

    it("registerNotifier calls exec", function () {
        var args = {
                provider: "ids:rim:bbid",
                notifierType: 0,
                notifierFlags: 1,
                notifierName: "name"
            };

        client.registerNotifier(args.provider, args.notifierType, args.notifierFlags, args.notifierName, anyFunct, anyFunct);
        expect(cordova.exec).toHaveBeenCalledWith(anyFunct, anyFunct, _ID, "registerNotifier", args);
    });
});

