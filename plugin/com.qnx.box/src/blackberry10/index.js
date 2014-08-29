/**
 * Implementation of box service
 *
 * @author mlytvynyuk
 * $Id:$
 * */
var _wwfix = require("../../lib/wwfix"),
	_box = require("./box");
/**
 * Initializes the extension
 */
function init() {
	try {
		_box.init();
	} catch (ex) {
		console.error('Error in cordova plugin: box/index.js:init():', ex);
	}
}

init();

/*
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
			_box.setTriggerUpdate(function (data) {
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
		var _eventResult = new PluginResult(args, env);
		try {
			//disable the event trigger
			_box.setTriggerUpdate(null);
			_eventResult.ok(undefined, false);

			//cleanup
			_eventResult.noResult(false);
			delete _eventResult;
		} catch (e) {
			_eventResult.error("error in stopEvents: " + JSON.stringify(e), false);
		}
	},

	/**
	 * First step of OAuth2, redirects user to box.com page which allows user to login,
	 * and allow Test Track application to access his account
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied. Available arguments for this call are:
	 * {
	 *         clientId: {String},
	 *         clientSecret: {String}
	 * }
	 * @param {Object} env Environment variables
	 */
	authorise: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			data;
		try {
			args = _wwfix.parseArgs(args);
			data = _box.authorise(args.clientId, args.clientSecret);
			result.ok(data, false);
			
		} catch (e) {
			result.error(JSON.stringify(e), false)
		}
	},

	/**
	 * Function starts download of specified bar file then install downloaded bar files
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied. Available arguments for this call are:
	 * {
	 *      id: {String}
	 * }
	 * @param {Object} env Environment variables
	 */
	install: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			data;
		try {
			args = _wwfix.parseArgs(args);
			data = _box.install(args.id);
			result.ok(data, false);
			
		} catch (e) {
			result.error(JSON.stringify(e), false)
		}

	},

	/**
	 * Function starts uninstallation of specified application
	 * @param {Function} success Function to call if the operation is a success
	 * @param {Function} fail Function to call if the operation fails
	 * @param {Object} args The arguments supplied. Available arguments for this call are:
	 * {
	 *     name:{String}
	 * }
	 * @param {Object} env Environment variables
	 */
	uninstall: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
			data;
		try {
			args = _wwfix.parseArgs(args);
			data = _box.uninstall(args.name);
			result.ok(data, false);
			
		} catch (e) {
			result.error(JSON.stringify(e), false)
		}
	}
};