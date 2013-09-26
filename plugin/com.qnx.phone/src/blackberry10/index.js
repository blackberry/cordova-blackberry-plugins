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
 * Defines Phone operations
 */

var _wwfix = require("../../lib/wwfix"),
	_phone = require("./phone"),
	_appEvents = require("./../../lib/events/applicationEvents"),
	_actionMap = {
		/**
		 * @event
		 * Triggered when ready to accept commands (HFP connected and not busy)
		 */
		phoneready:{
			context:require("./context"),
			event:"phoneready",
			triggerEvent: "phoneready",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		},
		/**
		 * @event
		 * Triggered when phone is dialing out
		 */
		phonedialing:{
			context:require("./context"),
			event:"phonedialing",
			triggerEvent: "phonedialing",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		},
		/**
		 * @event
		 * Triggered when phone has active call
		 */
		phonecallactive:{
			context:require("./context"),
			event:"phonecallactive",
			triggerEvent: "phonecallactive",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		},
		/**
		 * @event
		 * Triggered when there is incoming call
		 */
		phoneincoming:{
			context:require("./context"),
			event:"phoneincoming",
			triggerEvent: "phoneincoming",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		}
	},
	_listeners = {};

/**
 * Initializes the extension 
 */
function init() {
	try {
		_phone.init();
	} catch (ex) {
		console.error('Error in webworks ext: phone/index.js:init():', ex);
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
	 * Dial a number
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	dial: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _phone.dial(fixedArgs.number);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	/**
	 * Accept incoming call
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	accept: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			_phone.accept();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	/**
	 * Hangs up current active call
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	hangup: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			_phone.hangup();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	/**
	 * Redials last called number
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	redial: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			_phone.redial();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	/**
	 * Return current state of phone
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getState: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var data = _phone.getState();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	}
};

