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

var _wwfix = require("../../lib/wwfix"),
	_settings = require("./settings"),
	_appEvents = require("./../../lib/events/applicationEvents"),
	_actionMap = {
		settingsupdate: {
			event: "settingsupdate",
			triggerEvent: "settingsupdate",
			context: require("./context"),
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		}
	},
	_listeners = {};


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
			var fixedArgs = _wwfix.parseArgs(args);
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
			var fixedArgs = _wwfix.parseArgs(args);
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
	 * Returns system settings
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	get: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _settings.get((fixedArgs && fixedArgs.settings) ? fixedArgs.settings : null);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Sets one or more system settings
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	set: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_settings.set(fixedArgs);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	}
};

