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
	_theme = require("./theme"),
	_eventResult;

/**
 * Initializes the extension 
 */
function init() {
	try {
		_theme.init();
	} catch (ex) {
		console.error('Error in webworks ext: theme/index.js:init():', ex);
	}
}
init();

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Returns the current audio parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	startEvents: function(success, fail, args, env) {
		_eventResult = new PluginResult(args, env)
		try {
			_theme.setTriggerUpdate(function (data) {
				_eventResult.callbackOk(data, true);
			});
			_eventResult.noResult(true);
		} catch (e) {
			_eventResult.error("error in startEvents: " + JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current audio parameters
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	stopEvents: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			//disable the event trigger
			_theme.setTriggerUpdate(null);
			result.ok(undefined, false);

			//cleanup
			_eventResult.noResult(false);
			delete _eventResult;
		} catch (e) {
			result.error("error in stopEvents: " + JSON.stringify(e), false);
		}
	},

	/**
	 * Returns a list of available themes
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	getList: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _theme.getList();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current theme
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	getActive: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _theme.getActive();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Sets the current theme
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	setActive: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_theme.setActive(fixedArgs.themeId);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	}
};
