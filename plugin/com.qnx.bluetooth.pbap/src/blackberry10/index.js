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
 * Allows access to device contact PIM storage.
 */
var _wwfix = require("../../lib/wwfix"),
	_actionMap = {
		/**
		 * @event
		 * Triggered when the contact service state has changed.
		 */
		bluetoothpbapstatechange: {
			context: require("./context"),
			event: "bluetoothpbapstatechange",
			triggerEvent: "bluetoothpbapstatechange",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		},
		/**
		 * @event
		 * Triggered when the contact service status has changed.
		 */
		bluetoothpbapstatuschange: {
			context: require("./context"),
			event: "bluetoothpbapstatuschange",
			triggerEvent: "bluetoothpbapstatuschange",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		}
	},
	_pbap = require("./pbap"),
	_listeners = {};

/**
 * Initializes the extension 
 */
function init() {
	try {
		_pbap.init();
	} catch (ex) {
		console.error('Error in webworks ext: blueooth.pbap/index.js:init():', ex);
	}
}
init();

/**
 * Exports are the publicly accessible functions
 */
module.exports = {

	/**
	 * Turn on event dispatching for a specific event name
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	startEvent: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var fixedArgs = _wwfix.parseArgs(args),
			 	eventName = fixedArgs.eventName,
				context = _actionMap[eventName].context,
				systemEvent = _actionMap[eventName].event,
				listener = _actionMap[eventName].trigger.bind(null, result);

			if (!_listeners[eventName]) {
				_listeners[eventName] = {};
			}

			if (_listeners[eventName][env.webview.id]) {
				//TODO: Stop all listeners on plugin reset and renable this error
				//result.error("Underlying listener for " + eventName + " already already running for webview " + env.webview.id);
				context.removeEventListener(systemEvent, _listeners[eventName][env.webview.id]);
			}

			context.addEventListener(systemEvent, listener);
			_listeners[eventName][env.webview.id] = listener;
			result.noResult(true);
 		} catch (e) {
			_eventResult.error("error in startEvent: " + JSON.stringify(e), false);
		}
   },

	/**
	 * Turn off event dispatching for a specific event name
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	stopEvent: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var fixedArgs = _wwfix.parseArgs(args),
			 	eventName = fixedArgs.eventName,
				context = _actionMap[eventName].context,
				systemEvent = _actionMap[eventName].event,
				listener;

		if (!_listeners || !_listeners[eventName] || !_listeners[eventName][env.webview.id]) {
			result.error("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
		} else {
			listener = _listeners[eventName][env.webview.id];
			context.removeEventListener(systemEvent, listener);
			delete _listeners[eventName][env.webview.id];
			result.noResult(false);
		}
		} catch (e) {
			_eventResult.error("error in stopEvent: " + JSON.stringify(e), false);
		}
	},

	/**
	 * 
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	find: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _pbap.find(typeof(fixedArgs['filter']) === 'object' ? fixedArgs['filter'] : null,
									typeof(fixedArgs['orderBy']) === 'string' ? fixedArgs['orderBy'] : null,
									typeof(fixedArgs['isAscending']) === 'boolean' ? fixedArgs['isAscending'] : null,
									typeof(fixedArgs['limit']) === 'number' ? fixedArgs['limit'] : null,
									typeof(fixedArgs['offset']) === 'number' ? fixedArgs['offset'] : null);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Creates or updates a contact.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	save: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_pbap.save(fixedArgs.contact);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Removes a contact.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	remove: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_pbap.remove(fixedArgs.contact);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Gets the current state of the contact service.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getState: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _pbap.getState();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Gets the current status of the contact service.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getStatus: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _pbap.getStatus();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Forces a phone book resynchronization with the connected device.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	refresh: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_pbap.refresh();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	}
};

