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
  * Allows control of shutdown and reboot for the target
  */

var _power = require('./power'),
	_wwfix = require("../../lib/wwfix");

/**
 * Initializes the extension 
 */
function init() {
	try {
		_power.init();
	} catch (ex) {
		console.error('Error in cordova plugin: power/index.js:init():', ex);
	}
}
init();


/*
 * Exports are the publicly accessible functions
 */
module.exports = {

	 /**
	 * shutdowns the system
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 * {
	 *	 reason:"user requested",
	 *	 fast:1
	 * }
	 * @param env {Object} Environment variables
	 */
	shutdown: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			data;
		try {
			args = _wwfix.parseArgs(args);
			data = _power.shutdown(args.reason, args.fast);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * reboots the system
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 * {
	 *	 reason:"user requested",
	 *	 fast:1
	 * }
	 * @param env {Object} Environment variables
	 */
	reboot: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			data;
		try {
			args = _wwfix.parseArgs(args);
			data = _power.reboot(args.reason, args.fast);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	}
};

