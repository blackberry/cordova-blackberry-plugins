/*
 * Copyright 2013  QNX Software Systems Limited
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
 * @module qnx.application.event
 * @static
 *
 * @description Send events to an application, as well as to pause, resume, and reselect events 
 */

var _ID = "com.qnx.application.event",
	_noop = function () {},
	_events = ["pause", "resume", "reselect", "appdata"];


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
 * Exports are the publicly accessible functions
 */
module.exports = {

	/**
	 * Register the key (application name) for pause, resume, and reselect events
	 * @param {String} key The application key
	 */
	register: function(key) {
		window.cordova.exec(null, null, _ID, 'register', { key: key });
	},
	
	/**
	 * Get the screen window group name for the specified key
	 * @param {String} key The application key
	 */
	getWindowGroup: function(key) {
   		var value = null,
   			args = {
   				key: key
   			},
			success = function (data, response) {
				value = data;
			},
			fail = function (data, response) {
				throw data;
			};

		try {
			window.cordova.exec(success, fail, _ID, 'getWindowGroup', args);
			return value;
		} catch (e) {
			console.error(e);
		}
	},

	/**
	 * Get the data passed to the application on startup
	 * @return {Mixed} The data passed to the application on startup, or null
	 */
	getData: function() {
   		var value = null,
			success = function (data, response) {
				value = data;
			},
			fail = function (data, response) {
				throw data;
			};

		try {
			window.cordova.exec(success, fail, _ID, 'getData', null);
			return value;
		} catch (e) {
			console.error(e);
		}
	},
};

