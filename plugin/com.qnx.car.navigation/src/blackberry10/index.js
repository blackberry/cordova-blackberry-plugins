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
 * Allows control of GPS navigation 
 */

var _wwfix = require("../../lib/wwfix"),
	_eventResult,

	_utils = require("./../../lib/utils"),
	_profile = _utils.loadExtensionModule("com.qnx.car.profile", "index"),
	_provider = null;


/**
 * Initializes the extension 
 */
function init() {
	try {

		//NOTE: Commenting out navigation provider selection logic because we only
		//		support electrobit right now.

		//determine the configured navigation provider
		// var settingsExt = _utils.loadExtensionModule("settings", "settings");
		// var settings = settingsExt.get(['navigationProvider']);

		//check if the navigation provider exists
		// if (settings.navigationProvider) {
		// 	try {
				_provider = require('./providers-' + 'elektrobit'); // + settings.navigationProvider);
				_provider.init();
		// 	} catch(ex) {
		// 		// If this is an XMLHttpRequestException, then it's likely because the specified provider file simply does not exist
		// 		// So, if this is another type of exception, we'll rethrow since there may be another problem
		// 		if (ex instanceof XMLHttpRequestException === false) {
		// 			throw ex;
		// 		} else {
		// 			console.error('qnx.navigation index.js::init() - Unknown or invalid navigationProvider "' + (settings.navigationProvider || '') + '".');
		// 		}
		// 	}
		// } else {
		// 	console.error('qnx.navigation index.js::init() - navigationProvider not set!');
		// }
		
	} catch (ex) {
		console.error('car.navigation index.js::init() - Error occurred during initialization.', ex);
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
			_provider.setTriggerUpdate(function (data) {
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
			_provider.setTriggerUpdate(null);
			result.ok(undefined, false);

			//cleanup
			_eventResult.noResult(false);
			delete _eventResult;
		} catch (e) {
			result.error("error in stopEvents: " + JSON.stringify(e), false);
		}
	},

	/**
	 * Gets the current user's favourite locations
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	getFavourites: function(success, fail, args, env) {
		_profile.getNavigationFavourites(success, fail, args, env);
	},
	
	/**
	 * Adds a location to the current user's favourite locations
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	addFavourite: function(success, fail, args, env) {
		_profile.addNavigationFavourite(success, fail, args, env);
	},
	
	/**
	 * Removes a location from the current user's favourite locations
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	removeFavourite: function(success, fail, args, env) {
		_profile.removeNavigationFavourite(success, fail, args, env);
	},
	
	/**
	 * Gets the current user's navigation history
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	getHistory: function(success, fail, args, env) {
		_profile.getNavigationHistory(success, fail, args, env);
	},
	
	/**
	 * Clears the current user's navigation history
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	clearHistory: function(success, fail, args, env) {
		_profile.clearNavigationHistory(success, fail, args, env);
	},
	
	/**
	 * Adds a location to the navigation history for a given user
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	addToNavigationHistory: function(success, fail, args, env) {
		_profile.addToNavigationHistory(success, fail, args, env);
	},
	
	/**
	 * Browse the POI database to find a destination
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	browsePOI: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var categoryId = (!isNaN(fixedArgs.categoryId)) ? fixedArgs.categoryId : undefined;
			//hack: remove callback id because it messes up location search
			if (typeof fixedArgs.callbackId !== 'undefined') {
				delete fixedArgs.callbackId
			}
			var location = fixedArgs;

			if (location && !isNaN(location.categoryId)) {
				delete location.categoryId;
			}

			if (Object.keys(location).length <= 0) {
				location = null;
			}
			
			var data = _provider.browsePOI(categoryId, location, function(data) {
				result.callbackOk(data, false);
			}, function(error) {
				result.error(error, false);
			});
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Search the POI database to find a destination
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	searchPOI: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			var name = (fixedArgs.name) ? fixedArgs.name : null;

			//hack: remove callback id because it messes up location search
			if (typeof fixedArgs.callbackId !== 'undefined') {
				delete fixedArgs.callbackId
			}
			var location = fixedArgs;

			if (location && location.name) {
				delete location.name;
			}

			if (Object.keys(location).length <= 0) {
				location = null;
			}

			_provider.searchPOI(name, location, function(data) {
				result.callbackOk(data, false);
			}, function(error) {
				result.error(error, false);
			});
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Shows a set of Destinations on a map
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	showOnMap: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_provider.showOnMap(fixedArgs.locations);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Zoom the current map
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	zoomMap: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_provider.zoomMap(fixedArgs.scale);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Pans the current map
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	panMap: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			_provider.zoomMap(fixedArgs.deltaX, fixedArgs.deltaY);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Search to find a destination in the POI database or an address
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	searchAddress: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			//hack: remove callback id because it messes up location search
			if (typeof fixedArgs.callbackId !== 'undefined') {
				delete fixedArgs.callbackId
			}
			var location = fixedArgs;
			_provider.searchAddress(location, function(data) {
				result.callbackOk(data, false);
			}, function(error) {
				result.error(error, false);
			});
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Search to find a destination in the POI database or an address
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	navigateTo: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var fixedArgs = _wwfix.parseArgs(args);
			//hack: remove callback id because it messes up location search
			if (typeof fixedArgs.callbackId !== 'undefined') {
				delete fixedArgs.callbackId
			}
			var location = fixedArgs;
			_provider.navigateTo(location, function(data) {
				result.callbackOk(data, false);
			}, function(error) {
				result.error(error, false);
			});
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Cancels the navigation if it is in progress
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	cancelNavigation: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			_provider.cancelNavigation();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Gets the current navigation route
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	getRoute: function (success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _provider.getRoute();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Gets details about the current status of the navigation engine
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied
	 * @param {Object} env Environment variables
	 */
	getStatus: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		try {
			var data = _provider.getStatus();
			result.ok(data, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	}
};

