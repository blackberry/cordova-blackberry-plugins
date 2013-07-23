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
 * Allows control of HVAC systems 
 *
 * @author mlapierre
 * $Id: index.js 4273 2012-09-25 17:51:22Z mlapierre@qnx.com $
 */

var _hvac = require("./hvac"),
	_wwfix = require("../../lib/wwfix"),
	_eventResult;

/**
 * Initializes the extension 
 */
function init() {
	try {
		_hvac.init();
	} catch (ex) {
		console.error('Error in webworks ext: hvac/index.js:init():', ex);
	}
}
init();


/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Returns the current audio parameters
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	startEvents: function(success, fail, args, env) {
		_eventResult = new PluginResult(args, env)
		try {
			_hvac.setTriggerUpdate(function (data) {
				_eventResult.callbackOk(data, true);
			});
			_eventResult.noResult(true);
		} catch (e) {
			_eventResult.error("error in startEvents: " + JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the current audio parameters
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	stopEvents: function(success, fail, args, env) {
		var result = new PluginResult(args, env);
		try {
			//disable the event trigger
			_hvac.setTriggerUpdate(null);
			result.ok(undefined, false);

			//cleanup
			_eventResult.noResult(false);
			delete _eventResult;
		} catch (e) {
			result.error("error in stopEvents: " + JSON.stringify(e), false);
		}
	},

	/**
	 * Returns HVAC settings
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	get: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);

			var settings = (fixedArgs.settings) ? fixedArgs.settings.split(',') : null;
			var zones = (fixedArgs.zones) ? fixedArgs.zones.split(',') : null;
			var data = _hvac.get(settings, zones);

			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false)
		}
	},
	
	/**
	 * Sets one or more HVAC settings
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	set: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_hvac.set(fixedArgs.setting, fixedArgs.zone, fixedArgs.value);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false)
		}
	}
};

