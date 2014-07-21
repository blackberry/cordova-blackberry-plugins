/*
 * Copyright 2013-2014.
 * QNX Software Systems Limited. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"). You
 * may not reproduce, modify or distribute this software except in
 * compliance with the License. You may obtain a copy of the License
 * at: http://www.apache.org/licenses/LICENSE-2.0.
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OF ANY KIND, either express or implied.
 * This file may contain contributions from others, either as
 * contributors under the License or as licensors under other terms.
 * Please review this entire file for other proprietary rights or license
 * notices, as well as the applicable QNX License Guide at
 * http://www.qnx.com/legal/licensing/document_archive/current_matrix.pdf
 * for other information.
 */

/**
 * @module qnx.settings
 * @static
 * @description Provides access to system settings.
 */

var _self = {},
	_ID = "com.qnx.settings",
	_noop = function () {},
	_events = ["settingsupdate"];


_events.map(function (eventName) {
	var channel = cordova.addDocumentEventHandler(eventName),
		success = function (data) {
			channel.fire(data);
		},
		fail = function (error) {
			console.log("Error initializing " + eventName + " listener: ", error);
		};

	channel.onHasSubscribersChange = function () {
		if (this.numHandlers === 1) {
			window.cordova.exec(success, fail, _ID, "startEvent", {eventName: eventName});
		} else if (this.numHandlers === 0) {
			window.cordova.exec(_noop, _noop, _ID, "stopEvent", {eventName: eventName});
		}
	};
});

/*
 * Exports are the publicly accessible functions.
 */
module.exports = {
	/**
	 * @description Return the system settings.
	 * <p><b>Note</b>: The list of settings isn't fixed and depends on your system configuration.</p>
	 * @param {Array} [service] A list of settings to retrieve. When this parameter is omitted,
	 *                         all settings are returned.
	 * @returns {Object} The requested settings.
	 */
	get: function (settings) {
   		var value = null,
   			args = {
   				settings: settings
   			},
			success = function (data, response) {
				value = data;
			},
			fail = function (data, response) {
				throw data;
			};

		try {
			window.cordova.exec(success, fail, _ID, 'get', args);
		} catch (e) {
			console.error(e);
		}
		return value;
	},
	
	/**
	 * @description Set one or more system settings.
	 * <p><b>Note</b>: The list of settings isn't fixed and depends on your system configuration.</p>
	 * @param {Object} args The system settings to set. 
	 */
	set: function (args) {
	    window.cordova.exec(null, null, _ID, 'set', args);
	},	
};
