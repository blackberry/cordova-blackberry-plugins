/*
 * Copyright 2014  QNX Software Systems Limited
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
 * Allows for creation, removal and control of browser tabs
 */

var _wwfix = require("../../lib/wwfix"),
	_utils = require("./../../lib/utils"),
	_browser = require("./browser"),
	_eventResult;

/**
 * Exports are the publicly accessible functions
 */
module.exports = {

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	startEvents: function (success, fail, args, env) {
		_eventResult = new PluginResult(args, env);
		try {
			_browser.setTriggerUpdate(function (data) {
				_eventResult.callbackOk(data, true);
			});
			_eventResult.noResult(true);
		} catch (e) {
			_eventResult.error("error in startEvents: " + JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	stopEvents: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			//disable the event trigger
			_browser.setTriggerUpdate(null);
			result.ok(undefined, false);

			//cleanup
			_eventResult.noResult(false);
			delete _eventResult;
		} catch (e) {
			result.error("error in stopEvents: " + JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	setDefaultTabParameters: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			fixedArgs = null,
			data = null;

		try {
			fixedArgs = _wwfix.parseArgs(args);
			data = _browser.setDefaultTabParameters(fixedArgs);
				
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}

	},

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	addTab: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			fixedArgs = null,
			data = null;

		try {
			fixedArgs = _wwfix.parseArgs(args);
			data = _browser.addTab(fixedArgs);
				
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	removeTab: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			fixedArgs = null,
			data = null;

		try {
			fixedArgs = _wwfix.parseArgs(args);
			data = _browser.removeTab(fixedArgs.id);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}

	},

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	getActiveTab: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			// fixedArgs = null,
			data = null;

		try {
			// fixedArgs = _wwfix.parseArgs(args);
			data = _browser.getActiveTab();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	setActiveTab: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			fixedArgs = null,
			data = null;

		try {
			fixedArgs = _wwfix.parseArgs(args);
			data = _browser.setActiveTab(fixedArgs.id);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	updateUrl: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			fixedArgs = null,
			data = null;

		try {
			fixedArgs = _wwfix.parseArgs(args);
			data = _browser.updateUrl(fixedArgs.url);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	reload: function (success, fail, args, env) {
		var result = new PluginResult(args, env);

		try {
			_browser.reload();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current browser parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	stop: function (success, fail, args, env) {
		var result = new PluginResult(args, env);

		try {
			_browser.stop();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	}
};