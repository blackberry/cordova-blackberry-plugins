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

 /*
 *   blackberry.pim.Calendar
 *   Properties:
 *      
 *   Methods:
 */

var exec = cordova.require("cordova/exec"),
    _self = {},
    _ID = "com.blackberry.pim.calendar",
    CalendarEvent = require("./CalendarEvent"),
    CalendarError = require("./CalendarError"),
    CalendarFindOptions = require("./CalendarFindOptions"),
    CalendarAccount = require("./CalendarAccount"),
    CalendarFolder = require("./CalendarFolder"),
    CalendarRepeatRule = require("./CalendarRepeatRule"),
    CalendarEventFilter = require("./CalendarEventFilter"),
    Attendee = require("./Attendee"),
    calendarUtils = require("./calendarUtils");

function getFolderKeyList(folders) {
    var folderKeys = [];

    if (folders && Array.isArray(folders)) {
        folders.forEach(function (folder) {
            folderKeys.push({
                "id": window.parseInt(folder.id, 10),
                "accountId": window.parseInt(folder.accountId, 10)
            });
        });
    }

    return folderKeys;
}

_self.createEvent = function (properties, folder) {
    var args = {},
        key;

    for (key in properties) {
        if (properties.hasOwnProperty(key)) {
            args[key] = properties[key];
        }
    }

    args.folder = folder;

    args.id = null;

    return new CalendarEvent(args);
};

_self.getCalendarAccounts = function () {
    var obj,
        success = function (data, response) {
            obj = data;
        },
        fail = function (data, response) {
            throw data;
        },
        accounts = [];

    exec(success, fail, _ID, "getCalendarAccounts");

    obj.forEach(function (account) {
        accounts.push(new CalendarAccount(account));
    });

    return accounts;
};

_self.getDefaultCalendarAccount = function () {
    var obj,
        success = function (data, response) {
            obj = data;
        },
        fail = function (data, response) {
            throw data;
        };

    exec(success, fail, _ID, "getDefaultCalendarAccount");

    // not a valid account - default account not accessible by app
    if (!obj || parseInt(obj.id, 10) <= 0) {
        return null;
    } else {
        return new CalendarAccount(obj);
    }
};

_self.getCalendarFolders = function () {
    var obj,
        success = function (data, response) {
            obj = data;
        },
        fail = function (data, response) {
            throw data;
        },
        folders = [];

    exec(success, fail, _ID, "getCalendarFolders");

    obj.forEach(function (props) {
        folders.push(new CalendarFolder(props));
    });

    return folders;
};

_self.getDefaultCalendarFolder = function () {
    var obj,
        success = function (data, response) {
            obj = data;
        },
        fail = function (data, response) {
            throw data;
        };

    exec(success, fail, _ID, "getDefaultCalendarFolder");

    // not a valid folder - default folder not accessible by app
    if (!obj || obj.type <= 0) {
        return null;
    } else {
        return new CalendarFolder(obj);
    }
};

_self.getEvent = function (eventId, folder) {
    if (!eventId || !folder || !folder.accountId) {
        return null;
    }

    var obj,
        success = function (data, response) {
            obj = data;
        },
        fail = function (data, response) {
            throw data;
        };


    exec(success, fail, _ID, "getEvent", {
        "eventId": eventId,
        "accountId": folder.accountId
    });

    if (obj) {
        return new CalendarEvent(calendarUtils.populateEvent(obj));
    } else {
        return null;
    }
};

_self.findEvents = function (findOptions, onFindSuccess, onFindError) {
    if (!onFindSuccess || typeof onFindSuccess !== "function") {
        calendarUtils.invokeErrorCallback(onFindError, CalendarError.INVALID_ARGUMENT_ERROR);
        return;
    }

    if (!calendarUtils.validateFindArguments(findOptions)) {
        calendarUtils.invokeErrorCallback(onFindError, CalendarError.INVALID_ARGUMENT_ERROR);
        return;
    }

    if (findOptions && findOptions.filter) {
        findOptions.filter.folders = getFolderKeyList(findOptions.filter.folders);
    }

    exec(
        function (searchResult) {
            var realEvents = [];

            searchResult.events.forEach(function (event) {
                event["folder"] = searchResult.folders[event.accountId + "-" + event.folderId];
                realEvents.push(new CalendarEvent(calendarUtils.populateEvent(event)));
            });

            onFindSuccess(realEvents);
        },
        function (code) {
            calendarUtils.invokeErrorCallback(onFindError, code);
        },
        _ID,
        "find",
        {
            "options": findOptions
        }
    );
};

_self.CalendarEvent = CalendarEvent;
_self.CalendarRepeatRule = CalendarRepeatRule;
_self.CalendarError = CalendarError;
_self.CalendarFindOptions = CalendarFindOptions;
_self.CalendarFolder = CalendarFolder;
_self.CalendarEventFilter = CalendarEventFilter;
_self.Attendee = Attendee;

module.exports = _self;
