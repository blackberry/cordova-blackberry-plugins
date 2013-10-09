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
 * car.mediaplayer index.js.
 * Responsible for defining the blackberry.event action map, initializing the mediaplayer.js implementation,
 * and routing synchronous and asynchronous calls to the mediaplayer.js implementation.
 */

var _wwfix = require("../../lib/wwfix"),
	_mediaplayer = require("./mediaplayer"),
	_context = require("./context"),
	_eventResults = {};

/**
 * Utility function which validates the existence and proper typing of an arguments object, as well as to define default values
 * on for omitted optional arguments.
 * @param {Object} args The arguments object.
 * @param {Object} config The argument configuration object.
 * @returns {Boolean} True if the arguments pass validation against the configuration, False if not.
 * @private
 */
function validateArguments(args, config) {
	var valid = true;

	// Validate function arguments
	if(typeof args !== 'object' || typeof config !== 'object') {
		console.error('car.mediaplayer/index.js::validateArguments - Invalid arguments.');
		throw new TypeError('Invalid arguments.');
	}
	
	// Iterate through each item in the configuration object
	for(var name in config) {
		var type = config[name].type,
			nullable = config[name].nullable,
			optional = config[name].optional,
			defaultValue = config[name].defaultValue;
		
		// Set the default value if the argument is optional and undefined
		if(args[name] === undefined && optional && defaultValue !== undefined) {
			args[name] = defaultValue;
		}
		
		// Validate the argument
		if((args[name] === undefined && !optional)
			|| (typeof args[name] !== type && (!nullable || nullable && args[name] !== null))) {
			console.warn('car.mediaplayer/index.js::validateArguments - ' +
					'Invalid value ' + args[name] +
					' for argument ' + name + '.' +
					' Configuration: ' + JSON.stringify(config[name]));
			valid = false;
			break;
		}
	}
	
	return valid;
}

/**
 * Initializes the extension
 */
function init() {
	try {
		_mediaplayer.init();
	} catch (ex) {
		console.error('Error in webworks ext: mediaplayer/index.js::init():', ex);
	}
}

// Initialize immediately
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
	 * Opens the specified player name.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		playerName: {String}
	 *	}
	 * @param env {Object} Environment variables
	 */
	open: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.open(fixedArgs.playerName)
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Closes the specified player name.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		playerName: {String}
	 *	}
	 * @param env {Object} Environment variables
	 */
	close: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.close(fixedArgs.playerName)
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Returns the list of available media sources connected to the device.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied.
	 * @param env {Object} Environment variables
	 */
	getMediaSources: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.getMediaSources(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			});
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Browse a media source for media.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		mediaSourceId: {Number},
	 *		mediaNodeId: {String},
	 *		limit: {Number},
	 *		offset: {Number}
	 *	}
	 * @param env {Object} Environment variables
	 */
	browse: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.browse(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			},
			fixedArgs.mediaSourceId,
			fixedArgs.mediaNodeId,
			fixedArgs.limit,
			fixedArgs.offset);

			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Search for media items in a specific media source.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		mediaSourceId: {Number},
	 *		mediaNodeId: {String},
	 *		searchTerm: {String},
	 *		limit: {Number},
	 *		offset: {Number}
	 *	}
	 * @param env {Object} Environment variables
	 */
	search: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.search(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			},
			fixedArgs.mediaSourceId,
			fixedArgs.mediaNodeId,
			fixedArgs.searchTerm,
			fixedArgs.limit,
			fixedArgs.offset);

			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Creates a new track session.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied
	 * @param env {Object} Environment variables
	 */
	createTrackSession: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			if(!validateArguments(fixedArgs, {
				mediaSourceId: { type: 'number' },
				mediaNodeId: { type: 'string', nullable: true, optional: true, defaultValue: null },
				index: { type: 'number', optional: true, defaultValue: 0 },
				limit: { type: 'number', optional: true, defaultValue: -1 },
				offset: { type: 'number', optional: true, defaultValue: 0 }
			})) {
				fail(-1, 'Invalid arguments.');
			} else {
				_mediaplayer.createTrackSession(function(data) {
					result.callbackOk(data, false);
				}, function(data) {
					result.callbackError(data, false);
				},
				fixedArgs.mediaSourceId,
				fixedArgs.mediaNodeId,
				fixedArgs.index,
				fixedArgs.limit,
				fixedArgs.offset);
			}
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Destroys an existing track session.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		trackSessionId: {Number}
	 *	}
	 * @param env {Object} Environment variables
	 */
	destroyTrackSession: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.destroyTrackSession(fixedArgs.trackSessionId);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Retrieves the current track session information.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied.
	 * @param env {Object} Environment variables
	 */
	getTrackSessionInfo: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.getTrackSessionInfo(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			});
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Retrieves media from the current track session.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		limit: {Number},
	 *		offset: {Number}
	 *	}
	 * @param env {Object} Environment variables
	 */
	getTrackSessionItems: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.getTrackSessionItems(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			},
			fixedArgs.limit,
			fixedArgs.offset);
	
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Retrieves the currently playing track information.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied.
	 * @param env {Object} Environment variables
	 */
	getCurrentTrack: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.getCurrentTrack(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			});
	
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Retrieve the current playback position, in milliseconds, of the current track.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied.
	 * @param env {Object} Environment variables
	 */
	getCurrentTrackPosition: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.getCurrentTrackPosition(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			});
	
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Retrieves metadata for specified media.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		mediaSourceId: {Number},
	 *		mediaNodeId: {String}
	 *	}
	 * @param env {Object} Environment variables
	 */
	getMetadata: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.getMetadata(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			},
			fixedArgs.mediaSourceId,
			fixedArgs.mediaNodeId);
	
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},

	/**
	 * Retrieves extended metadata properties for the specified media.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		mediaSourceId: {Number},
	 *		mediaNodeId: {String},
	 *		properties: {String[]}
	 *	}
	 * @param env {Object} Environment variables
	 */
	getExtendedMetadata: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.getExtendedMetadata(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			},
			fixedArgs.mediaSourceId,
			fixedArgs.mediaNodeId,
			fixedArgs.properties);
	
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Returns the state of the media player.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied.
	 * @param env {Object} Environment variables
	 */
	getPlayerState: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.getPlayerState(function(data) {
				result.callbackOk(data, false);
			}, function(data) {
				result.callbackError(data, false);
			});
	
			result.noResult(true);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Play or resume playback.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied.
	 * @param env {Object} Environment variables
	 */
	play: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.play();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Pause playback.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	pause: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.pause();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Stop playback.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	stop: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.resume();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Skip to the next track in the active track session.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	next: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.next();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Skip to the previous track in the active track session.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
	 * @param env {Object} Environment variables
	 */
	previous: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.previous();
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Jumps to the specified index in the current track session.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		index: {Number}
	 *	}
	 * @param env {Object} Environment variables
	 */
	jump: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.jump(fixedArgs.index);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Seek to a specific position in the current track.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		position: {Number}
	 *	}
	 * @param env {Object} Environment variables
	 */
	seek: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.seek(fixedArgs.position);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Set the playback rate of the media player.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		playbackRate: {Number}
	 *	}
	 * @param env {Object} Environment variables
	 */
	setPlaybackRate: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.setPlaybackRate(fixedArgs.playbackRate);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Set the shuffle mode for the active track session.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		shuffleMode: {MediaPlayer.ShuffleMode}
	 *	}
	 * @param env {Object} Environment variables
	 */
	shuffle: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.shuffle(fixedArgs.shuffleMode);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
	
	/**
	 * Set the repeat mode for the active track session.
	 * @param success {Function} Function to call if the operation is a success
	 * @param fail {Function} Function to call if the operation fails
	 * @param args {Object} The arguments supplied. Available arguments for this call are:
	 *	{
	 *		repeatMode: {MediaPlayer.RepeatMode}
	 *	}
	 * @param env {Object} Environment variables
	 */
	repeat: function(success, fail, args, env) {
		var result = new PluginResult(args, env)
		var fixedArgs = _wwfix.parseArgs(args);
		try {
			_mediaplayer.repeat(fixedArgs.repeatMode);
			result.ok(undefined, false);
		} catch (e) {
			result.error(JSON.stringify(e), false);
		}
	},
};

