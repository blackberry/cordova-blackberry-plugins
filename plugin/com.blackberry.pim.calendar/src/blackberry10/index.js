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

var pimCalendar,
    _utils = require("../../lib/utils"),
    config = require("../../lib/config"),
    calendarUtils = require("./calendarUtils"),
    CalendarError = require("./CalendarError");

function checkPermission() {
    return _utils.hasPermission(config, "access_pimdomain_calendars");
}

function getCurrentTimezone() {
    var timezone = null;

    try {
        timezone = window.qnx.webplatform.device.timezone;
    } catch (e) {
        // do nothing
    }

    return timezone;
}

function processJnextSaveOrRemoveData(result, JnextData) {
    var data = JnextData;

    if (data._success === true) {
        result.callbackOk(data, false);
    } else {
        result.callbackError(data.code, false);
    }
}

function processJnextFindData(eventId, eventHandler, JnextData) {
    var data = JnextData,
        i,
        more = false,
        resultsObject = {},
        birthdayInfo;

    if (!data.events) {
        data.events = []; // if JnextData.events return null, return an empty array
    }

    if (data._success === true) {
        eventHandler.error = false;
    }

    // Concatenate results; do not add the same contacts
    for (i = 0; i < eventHandler.searchResult.length; i++) {
        resultsObject[eventHandler.searchResult[i].id] = true;
    }

    for (i = 0; i < data.events.length; i++) {
        if (resultsObject[data.events[i].id]) {
            // Already existing
        } else {
            eventHandler.searchResult.push(data.events[i]);
        }
    }

    if (eventHandler.error) {
        eventHandler.result.callbackError(data.code, false);
    } else {
        eventHandler.result.callbackOk({
            "folders": data.folders,
            "events": eventHandler.searchResult
        }, false);
    }
}

module.exports = {
    find: function (result, args, env) {
        var parsedArgs = {},
            key;

        for (key in args) {
            if (args.hasOwnProperty(key)) {
                parsedArgs[key] = JSON.parse(decodeURIComponent(args[key]));
            }
        }

        if (!checkPermission()) {
            result.error(CalendarError.PERMISSION_DENIED_ERROR, false);
            return;
        }

        if (!calendarUtils.validateFindArguments(parsedArgs.options)) {
            result.error(CalendarError.INVALID_ARGUMENT_ERROR, false);
            return;
        }

        parsedArgs.options = parsedArgs.options || {};

        parsedArgs.options.sourceTimezone = getCurrentTimezone();
        if (!parsedArgs.options.sourceTimezone) {
            result.error(CalendarError.UNKNOWN_ERROR, false);
            return;
        }

        pimCalendar.getInstance().find(parsedArgs, result, processJnextFindData);
        result.noResult(true);
    },

    save: function (result, args, env) {
        var attributes = {},
            key;

        for (key in args) {
            if (args.hasOwnProperty(key)) {
                attributes[key] = JSON.parse(decodeURIComponent(args[key]));
            }
        }

        if (!checkPermission()) {
            result.error(CalendarError.PERMISSION_DENIED_ERROR, false);
            return;
        }

        attributes.sourceTimezone = getCurrentTimezone();
        if (!attributes.sourceTimezone) {
            result.error(CalendarError.UNKNOWN_ERROR, false);
            return;
        }

        if (attributes.timezone) {
            attributes.targetTimezone = attributes.timezone;
        } else {
            attributes.targetTimezone = "";
        }

        attributes._eventId = result.callbackId;

        pimCalendar.getInstance().save(attributes, result, processJnextSaveOrRemoveData);
        result.noResult(true);
    },

    remove: function (result, args, env) {
        var attributes = {
                "accountId" : JSON.parse(decodeURIComponent(args.accountId)),
                "calEventId" : JSON.parse(decodeURIComponent(args.calEventId)),
                "removeAll" : JSON.parse(decodeURIComponent(args.removeAll))
            };

        if (!checkPermission()) {
            result.error(CalendarError.PERMISSION_DENIED_ERROR, false);
            return;
        }

        if (args.hasOwnProperty("dateToRemove")) {
            attributes.dateToRemove = JSON.parse(decodeURIComponent(args.dateToRemove));
        }

        attributes.sourceTimezone = getCurrentTimezone();
        if (!attributes.sourceTimezone) {
            result.error(CalendarError.UNKNOWN_ERROR, false);
            return;
        }

        attributes._eventId = result.callbackId;

        pimCalendar.getInstance().remove(attributes, result, processJnextSaveOrRemoveData);
        result.noResult(true);
    },

    getDefaultCalendarAccount: function (result, args, env) {
        if (!_utils.hasPermission(config, "access_pimdomain_calendars")) {
            result.error(CalendarError.PERMISSION_DENIED_ERROR, false);
            return;
        }

        result.ok(pimCalendar.getInstance().getDefaultCalendarAccount(), false);
    },

    getCalendarAccounts: function (result, args, env) {
        if (!_utils.hasPermission(config, "access_pimdomain_calendars")) {
            result.error(CalendarError.PERMISSION_DENIED_ERROR, false);
            return;
        }

        result.ok(pimCalendar.getInstance().getCalendarAccounts(), false);
    },

    getEvent: function (pluginResult, args, env) {
        var findOptions = {},
            results,
            event = null;

        if (!_utils.hasPermission(config, "access_pimdomain_calendars")) {
            pluginResult.error(CalendarError.PERMISSION_DENIED_ERROR, false);
            return;
        }

        findOptions.eventId = JSON.parse(decodeURIComponent(args.eventId));
        findOptions.accountId = JSON.parse(decodeURIComponent(args.accountId));

        results = pimCalendar.getInstance().getEvent(findOptions);

        if (results._success) {
            if (results.event && results.event.id) {
                event = results.event;
            }
        }

        if (event) {
            pluginResult.ok(event, false);
        } else {
            pluginResult.error(CalendarError.UNKNOWN_ERROR, false);
        }
    },

    getCalendarFolders: function (result, args, env) {
        if (!checkPermission()) {
            result.error(CalendarError.PERMISSION_DENIED_ERROR, false);
            return;
        }

        result.ok(pimCalendar.getInstance().getCalendarFolders(), false);
    },

    getDefaultCalendarFolder: function (result, args, env) {
        if (!checkPermission()) {
            result.error(CalendarError.PERMISSION_DENIED_ERROR, false);
            return;
        }

        result.ok(pimCalendar.getInstance().getDefaultCalendarFolder(), false);
    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.PimCalendar = function ()
{
    var self = this,
        hasInstance = false;

    self.find = function (args, pluginResult, handler) {
        self.eventHandlers[args.callbackId] = {
            "result" : pluginResult,
            "action" : "find",
            "searchResult" : [],
            "handler" : handler,
            "error" : true
        };

        args._eventId = args.callbackId;

        JNEXT.invoke(self.m_id, "find " + JSON.stringify(args));
        return "";
    };

    self.getEvent = function (args) {
        var value = JNEXT.invoke(self.m_id, "getEvent " + JSON.stringify(args));
        return JSON.parse(value);
    };

    self.save = function (args, pluginResult, handler) {
        //register save eventHandler for when JNEXT onEvent fires
        self.eventHandlers[args._eventId] = {
            "result" : pluginResult,
            "action" : "save",
            "handler" : handler
        };
        JNEXT.invoke(self.m_id, "save " + JSON.stringify(args));
        return "";
    };

    self.remove = function (args, pluginResult, handler) {
        //register remove eventHandler for when JNEXT onEvent fires
        self.eventHandlers[args._eventId] = {
            "result" : pluginResult,
            "action" : "remove",
            "handler" : handler
        };
        JNEXT.invoke(self.m_id, "remove " + JSON.stringify(args));
        return "";
    };

    self.getDefaultCalendarAccount = function () {
        var value = JNEXT.invoke(self.m_id, "getDefaultCalendarAccount");
        return JSON.parse(value);
    };

    self.getCalendarAccounts = function () {
        var value = JNEXT.invoke(self.m_id, "getCalendarAccounts");
        return JSON.parse(value);
    };

    self.getCalendarFolders = function (args) {
        var result = JNEXT.invoke(self.m_id, "getCalendarFolders");
        return JSON.parse(result);
    };

    self.getDefaultCalendarFolder = function (args) {
        var result = JNEXT.invoke(self.m_id, "getDefaultCalendarFolder");
        return JSON.parse(result);
    };

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("libpimcalendar")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libpimcalendar.PimCalendar");

        if (self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    self.onEvent = function (strData) {
        var arData = strData.split(" "),
            strEventDesc = arData[0],
            args = {},
            eventHandler;

        if (strEventDesc === "result") {
            args.result = escape(strData.split(" ").slice(2).join(" "));
            eventHandler = self.eventHandlers[arData[1]];

            if (eventHandler.action === "save" || eventHandler.action === "remove") {
                eventHandler.handler(eventHandler.result, JSON.parse(decodeURIComponent(args.result)));
            } else if (eventHandler.action === "find") {
                eventHandler.handler(arData[1], eventHandler, JSON.parse(decodeURIComponent(args.result)));
            }
        }
    };

    self.m_id = "";
    self.eventHandlers = {};

    self.getInstance = function () {
        if (!hasInstance) {
            self.init();
            hasInstance = true;
        }
        return self;
    };
};

pimCalendar = new JNEXT.PimCalendar();
