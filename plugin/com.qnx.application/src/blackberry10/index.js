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
 * Returns list of installed applications, requests to launch an application
 * Listens for installed/uninstalled/started/stopped applications
 */

var _wwfix = require("../../lib/wwfix"),
	_utils = require("./../../lib/utils"),
	_application = require("./application");

/**
 * Initializes the extension
 * Note: _application.init can't be called here.  
 * There may be a jscreen init issue.
 */
function init() {
	try {
		_application.init();
	} catch (ex) {
		console.error('Error in webworks ext: application/index.js:init():', ex);
	}
}
init();

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Creates a request to start an application
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: 
	 *	{
	 *		id: {String},
	 *	}
	 * @param env {Object} Environment variables
	 */

	start: function (success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _application.start(fixedArgs.id, fixedArgs.data);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Creates a request to get the list of installed applications
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: 
	 *	{
	 *		id: {String},
	 *	}
	 * @param env {Object} Environment variables
	 */

	getList: function (success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _application.getList();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	}
};