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
var _apiDir = __dirname + "/../../../plugin/com.blackberry.pim.calendar/",
    _libDir = __dirname + "/../../../lib/",
    utils = require(_libDir + "utils"),
    CalendarFindOptions = require(_apiDir + "CalendarFindOptions"),
    CalendarEvent,
    CalendarError = require(_apiDir + "CalendarError"),
    index,
    mockJnextObjId = 123,
    mockedPluginResult = {
        callbackOk: jasmine.createSpy(),
        callbackError: jasmine.createSpy(),
        noResult: jasmine.createSpy(),
        ok: jasmine.createSpy(),
        error: jasmine.createSpy()
    },
    mockedExec = jasmine.createSpy("exec");

describe("pim.calendar/index", function () {
    beforeEach(function () {
        GLOBAL.cordova = {
            require: jasmine.createSpy().andReturn(mockedExec)
        };
        CalendarEvent = require(_apiDir + "www/CalendarEvent");
        GLOBAL.JNEXT = {
            require: jasmine.createSpy("JNEXT.require").andCallFake(function () {
                return true;
            }),
            createObject: jasmine.createSpy("JNEXT.createObject").andCallFake(function () {
                return mockJnextObjId;
            }),
            invoke: jasmine.createSpy("JNEXT.invoke").andCallFake(function (id, command) {
                if (command.indexOf("getCalendarFolders") !== -1) {
                    return JSON.stringify([{
                        id: "1",
                        accountId: "1"
                    }]);
                } else if (command.indexOf("getDefaultCalendarFolder") !== -1) {
                    return JSON.stringify({
                        id: "1",
                        accountId: "1"
                    });
                } else if (command.indexOf("getCalendarAccounts") !== -1) {
                    return JSON.stringify([{
                        id: "1"
                    }]);
                } else if (command.indexOf("getDefaultCalendarAccount") !== -1) {
                    return JSON.stringify({
                        id: "1"
                    });
                } else if (command.indexOf("getEvent") !== -1) {
                    return JSON.stringify({
                        _success: true,
                        event: {
                            id: "123"
                        }
                    });
                } else {
                    return JSON.stringify({});
                }
            }),
            registerEvents: jasmine.createSpy("JNEXT.registerEvent")
        };
        GLOBAL.window = {
            qnx: {
                webplatform: {
                    device: {
                        timezone: "America/New_York"
                    }
                }
            }
        };
        GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        GLOBAL.cordova = null;
        index = null;
    });

    it("JNEXT require/createObject/registerEvents are not called upon requiring index", function () {
        expect(JNEXT.require).not.toHaveBeenCalled();
        expect(JNEXT.createObject).not.toHaveBeenCalled();
        expect(JNEXT.registerEvents).not.toHaveBeenCalled();
    });

    it("find - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            findOptions = {
                limit: 5,
                detail: CalendarFindOptions.DETAIL_AGENDA,
                sort: [{
                    fieldName: 2,
                    desc: false
                }]
            },
            args = {
                options: encodeURIComponent(JSON.stringify(findOptions))
            };

        spyOn(utils, "hasPermission").andReturn(true);

        index.find(successCb, failCb, args);

        Object.getOwnPropertyNames(args).forEach(function (key) {
            args[key] = JSON.parse(decodeURIComponent(args[key]));
        });

        args["options"]["sourceTimezone"] = window.qnx.webplatform.device.timezone;

        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "find " + JSON.stringify(args));
        expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
    });

    it("find - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            findOptions = {
                filter: [{
                    fieldName: CalendarFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "John"
                }],
                limit: 5
            };

        spyOn(utils, "hasPermission").andReturn(false);

        index.find(successCb, failCb, {
            fields: encodeURIComponent(JSON.stringify(["name"])),
            options: encodeURIComponent(JSON.stringify(findOptions))
        });

        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(mockedPluginResult.error).toHaveBeenCalledWith(CalendarError.PERMISSION_DENIED_ERROR, false);
    });

    it("save - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            evt = {},
            args = {},
            key;

        spyOn(utils, "hasPermission").andReturn(true);

        for (key in evt) {
            if (evt.hasOwnProperty(key)) {
                args[key] = encodeURIComponent(JSON.stringify(evt[key]));
            }
        }

        index.save(successCb, failCb, args);

        Object.getOwnPropertyNames(args).forEach(function (key) {
            args[key] = JSON.parse(decodeURIComponent(args[key]));
        });

        args["sourceTimezone"] = window.qnx.webplatform.device.timezone;
        args["targetTimezone"] = "";

        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "save " + JSON.stringify(args));
        expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
    });

    it("save - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            evt = new CalendarEvent({
                "summary": "a test",
                "location": "test",
                "start": new Date("Jan 01, 2015, 12:00"),
                "end": new Date("Jan 01, 2015, 12:30")
            }),
            args = {},
            key;

        spyOn(utils, "hasPermission").andReturn(false);

        for (key in evt) {
            if (evt.hasOwnProperty(key)) {
                args[key] = encodeURIComponent(JSON.stringify(evt[key]));
            }
        }

        index.save(successCb, failCb, args);

        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(mockedPluginResult.error).toHaveBeenCalledWith(CalendarError.PERMISSION_DENIED_ERROR, false);
    });

    it("remove - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {
                accountId : encodeURIComponent(JSON.stringify(1)),
                calEventId : encodeURIComponent(JSON.stringify(2)),
                removeAll : encodeURIComponent(JSON.stringify(true))
            };

        spyOn(utils, "hasPermission").andReturn(true);

        index.remove(successCb, failCb, args);

        Object.getOwnPropertyNames(args).forEach(function (key) {
            args[key] = JSON.parse(decodeURIComponent(args[key]));
        });

        args["sourceTimezone"] = window.qnx.webplatform.device.timezone;

        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "remove " + JSON.stringify(args));
        expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);
    });

    it("remove - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy();

        spyOn(utils, "hasPermission").andReturn(false);

        index.remove(successCb, failCb, {
            accountId : encodeURIComponent(JSON.stringify(1)),
            calEventId : encodeURIComponent(JSON.stringify(2)),
            removeAll : encodeURIComponent(JSON.stringify(true))
        });

        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(mockedPluginResult.error).toHaveBeenCalledWith(CalendarError.PERMISSION_DENIED_ERROR, false);
    });

    it("getDefaultCalendarAccount - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};

        spyOn(utils, "hasPermission").andReturn(false);

        index.getDefaultCalendarAccount(successCb, failCb, args);

        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(mockedPluginResult.error).toHaveBeenCalledWith(CalendarError.PERMISSION_DENIED_ERROR, false);
    });

    it("getDefaultCalendarAccount - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};

        spyOn(utils, "hasPermission").andReturn(true);

        index.getDefaultCalendarAccount(successCb, failCb, args);

        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getDefaultCalendarAccount");
        expect(mockedPluginResult.ok).toHaveBeenCalledWith({
            id: "1"
        }, false);
    });

    it("getCalendarAccounts - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};

        spyOn(utils, "hasPermission").andReturn(false);

        index.getCalendarAccounts(successCb, failCb, args);

        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(mockedPluginResult.error).toHaveBeenCalledWith(CalendarError.PERMISSION_DENIED_ERROR, false);
    });

    it("getCalendarAccounts - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};

        spyOn(utils, "hasPermission").andReturn(true);

        index.getCalendarAccounts(successCb, failCb, args);

        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getCalendarAccounts");
        expect(mockedPluginResult.ok).toHaveBeenCalledWith([{
            id: "1"
        }], false);
    });

    it("getEvent - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {
                eventId: encodeURIComponent(JSON.stringify("123")),
                accountId: encodeURIComponent(JSON.stringify("1"))
            };

        spyOn(utils, "hasPermission").andReturn(false);

        index.getEvent(successCb, failCb, args);

        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(mockedPluginResult.error).toHaveBeenCalledWith(CalendarError.PERMISSION_DENIED_ERROR, false);
    });

    it("getEvent - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {
                eventId: encodeURIComponent(JSON.stringify("123")),
                accountId: encodeURIComponent(JSON.stringify("1"))
            };

        spyOn(utils, "hasPermission").andReturn(true);

        index.getEvent(successCb, failCb, args);

        Object.getOwnPropertyNames(args).forEach(function (key) {
            args[key] = JSON.parse(decodeURIComponent(args[key]));
        });

        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getEvent " + JSON.stringify(args));
        expect(mockedPluginResult.ok).toHaveBeenCalledWith({
            id: "123"
        }, false);
    });

    it("getDefaultCalendarFolder  - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy();

        spyOn(utils, "hasPermission").andReturn(true);

        index.getDefaultCalendarFolder(successCb, failCb, {});
        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getDefaultCalendarFolder");
        expect(mockedPluginResult.ok).toHaveBeenCalled();
    });
});
