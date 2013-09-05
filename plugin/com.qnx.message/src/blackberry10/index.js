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
	_message = require("./message"),
	_appEvents = require("./../../lib/events/applicationEvents"),
	_actionMap = {
		/**
		 * @event
		 * Triggered when the messages service state changes
		 */
		messageservicestatechange:{
			context:require("./context"),
			event:"messageservicestatechange",
			triggerEvent: "messageservicestatechange",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		},
		/**
		 * @event
		 * Triggered when there list of messages available
		 */
		messageservicefindresult:{
			context: require("./context"),
			event: "messageservicefindresult",
			triggerEvent: "messageservicefindresult",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		},
		/**
		 * @event
		 * Triggered when there request for list of messages failed
		 */
		messageservicefindfail:{
			context:require("./context"),
			event:"messageservicefindfail",
			triggerEvent: "messageservicefindfail",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		},
		/**
		 * @event
		 * Triggered when there full messages available
		 */
		messageservicemessageresult:{
			context:require("./context"),
			event:"messageservicemessageresult",
			triggerEvent: "messageservicemessageresult",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		},
		/**
		 * @event
		 * Triggered when request of full messages failed
		 */
		messageservicemessagefail:{
			context:require("./context"),
			event:"messageservicemessagefail",
			triggerEvent: "messageservicemessagefail",
			trigger: function (pluginResult, data) {
				pluginResult.callbackOk(data, true);
			} 
		},
		/**
		 * @event
		 * Triggered when there is a notification from service
		 */
		messageservicenotification:{
			context:require("./context"),
			event:"messageservicenotification",
			triggerEvent: "messageservicenotification",
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
		_message.init();
	} catch (ex) {
		console.error('Error in webworks ext: message/index.js:init():', ex);
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
	 * Return a list of message accounts.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getAccounts: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var messageType = typeof(fixedArgs['messageType']) === 'string' ? fixedArgs['messageType'] : null;
			var data = _message.getAccounts(messageType);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
		
	/**
	 * Return an array of zero or more messages.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	find: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);

			var filter 		= typeof(fixedArgs['filter']) 		=== 'object' 	? fixedArgs['filter'] 		: null;
			var orderBy 	= typeof(fixedArgs['orderBy']) 		=== 'string' 	? fixedArgs['orderBy'] 		: null;
			var isAscending = typeof(fixedArgs['isAscending']) 	=== 'boolean' 	? fixedArgs['isAscending'] 	: null;
			var limit 		= typeof(fixedArgs['limit']) 		=== 'number' 	? fixedArgs['limit'] 		: null;
			var offset 		= typeof(fixedArgs['offset']) 		=== 'number' 	? fixedArgs['offset'] 		: null;

			var data = _message.find(filter, orderBy, isAscending, limit, offset);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Gets a list of folders for the specified account.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getFolders: function(success, fail, args, env) {
		// TODO Implement
	},
	
	/**
	 * Method retrieves message from the database, check first if message exist in database and return is, if not initiated
	 * PPS request to fetch message by provided message handle.
	 * The message is returned asynchronously, and can be retrieved by listening to the messageservicemessageresult
	 * event. Returns a fully populated message, including full subject, contents, recipient list, and attachments.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getMessage: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _message.getMessage(fixedArgs.accountId, fixedArgs.handle);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Saves a message.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	save: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _message.save(fixedArgs.message);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Removes a message.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	remove: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _message.remove(fixedArgs.message);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * move a message to another folder
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	move: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _message.move(fixedArgs.message, args.folder);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Sends a message.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	send: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _message.send(fixedArgs.message);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Gets the current state of the phone book profile service.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getState: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _message.getState();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	}
};

