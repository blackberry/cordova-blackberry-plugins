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
 * Allows control of radio tuners, presets, and stations.
 */

var _wwfix = require("../../lib/wwfix"),
	_radio = require("./radio"),
	_context = require("./context"),
	_eventResults = {};

/**
 * Initializes the extension
 */
function init() {
	try {
		_radio.init();
	} catch (ex) {
		console.error('Error in webworks ext: radio/index.js:init():', ex);
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
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			if (fixedArgs && fixedArgs.eventName) {
				_eventResults[fixedArgs.eventName] = result;
				_context.addEventListener(fixedArgs.eventName, function (data) {
					result.callbackOk(data, true);
				});
				result.noResult(true);
			} else {
				throw "Invalid eventName";
			}
		} catch (e) {
			result.error("error in startEvent: " + JSON.stringify(e), false);
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
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			if (fixedArgs && fixedArgs.eventName) {
				//disable the event trigger
				_context.removeEventListener(fixedArgs.eventName);
				result.ok(undefined, false);

				//cleanup
				_eventResults[fixedArgs.eventName].noResult(false);
				delete _eventResults[fixedArgs.eventName];
			} else {
				throw "Invalid eventName";
			}
		} catch (e) {
			result.error("error in stopEvent: " + JSON.stringify(e), false);
		}
	},

	/**
	 * Returns the list of available tuners.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getTuners: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _radio.getTuners();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Sets the active tuner by name.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	setTuner: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_radio.setTuner(fixedArgs.tuner, fixedArgs.zone);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Tune to a specific station, optionally targeting a specific tuner. If the specified
	 * tuner is not the active tuner, then the station will be automatically selected the next
	 * time that tuner is set as active.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	setStation: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			var tuner = (typeof fixedArgs.tuner !== 'undefined') ? fixedArgs.tuner : _radio.getStatus().tuner;
			_radio.setStation(fixedArgs.station, tuner);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Get the presets for the current tuner. Optionally, a tuner name can be specified, returning
	 * presets for the specified tuner.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	getPresets: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			var tuner = (typeof fixedArgs.tuner !== 'undefined') ? fixedArgs.tuner : _radio.getStatus().tuner;
			var data = _radio.getPresets(tuner);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Sets the entire list of presets for the specified tuner(s).
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	setPreset: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			var tuner = (typeof fixedArgs.tuner !== 'undefined') ? fixedArgs.tuner : _radio.getStatus().tuner
			var station = (typeof fixedArgs.station !== 'undefined') ? fixedArgs.station : _radio.getStatus().station
			_radio.setPreset(fixedArgs.index, fixedArgs.group, station, tuner);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Seek for the next radio station in the given direction
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	seek: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_radio.seek(fixedArgs.direction, fixedArgs.tuner);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Scan for available radio stations in the given direction
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	scan: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_radio.scan(fixedArgs.direction, fixedArgs.tuner);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Stop scanning
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	scanStop: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			_radio.scanStop();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Get the current station metadata.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getStatus: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _radio.getStatus();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
};

