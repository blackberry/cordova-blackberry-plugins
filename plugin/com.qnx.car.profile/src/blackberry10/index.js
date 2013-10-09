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
 * Manages the system user information
 */

var _profile = require("./profile"),
	_wwfix = require("../../lib/wwfix"),
	_eventResult;

/**
 * Initializes the extension 
 */
function init() {
	try {
		_profile.init();
	} catch (ex) {
		console.error('Error in webworks ext: profile/index.js:init():', ex);
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
			_profile.setTriggerUpdate(function (data) {
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
			_profile.setTriggerUpdate(null);
			result.ok(undefined, false);

			//cleanup
			_eventResult.noResult(false);
			delete _eventResult;
		} catch (e) {
			result.error("error in stopEvents: " + JSON.stringify(e), false);
		}
	},

	/**
	 * Retrieves the current profile information
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	getActive: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _profile.getActive();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Change the active profile
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	setActive: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_profile.setActive(fixedArgs.profileId);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Return a list of available profiles
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	getList: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _profile.getList();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Adds a profile
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	addProfile: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var data = _profile.addProfile(fixedArgs.name, fixedArgs.avatar, fixedArgs.theme, fixedArgs.bluetoothDeviceId);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Updates a given profile
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	updateProfile: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_profile.updateProfile(fixedArgs.profileId, fixedArgs.name, fixedArgs.avatar, fixedArgs.theme, fixedArgs.bluetoothDeviceId);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Delete a given profile
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	deleteProfile: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_profile.deleteProfile(fixedArgs.profileId);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},


	/**
	 * Gets all the settings save for a given profile
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	getSettings: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var settings = (fixedArgs.settings) ? fixedArgs.settings.split(',') : null;
			var data = _profile.getSettings(_profile.getActive().id, settings);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Sets a profile preference setting
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	setSetting: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_profile.setSetting(_profile.getActive().id, fixedArgs.key, fixedArgs.value);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Get the navigation history for a given user
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getNavigationHistory: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _profile.getNavigationHistory(_profile.getActive().id);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Clears the navigation history for a given user
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	clearNavigationHistory: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			_profile.clearNavigationHistory(_profile.getActive().id);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Adds a location to the navigation history for a given user
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	addToNavigationHistory: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_profile.addToNavigationHistory(_profile.getActive().id, fixedArgs);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Get the navigation favourites for a given user
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	getNavigationFavourites: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _profile.getNavigationFavourites(_profile.getActive().id);
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Adds a navigation location to the user's favourites
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	addNavigationFavourite: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_profile.addNavigationFavourite(_profile.getActive().id, fixedArgs);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Removes a navigation location to the user's favourites
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	removeNavigationFavourite: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_profile.removeNavigationFavourite(fixedArgs.favouriteId);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},	
};