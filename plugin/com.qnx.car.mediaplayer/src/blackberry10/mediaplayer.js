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
 * car.mediaplayer mediaplayer.js.
 * Responsible for interfacing with the jPlayer JNEXT plugin.
 */

var _jPlayer = require('../../lib/jPlayer'),
	_jPlayerObj = null,
	_callbackCounter = 0,
	_callbackFunctions = {},
	_mediaSourceChangeTrigger = null,
	_trackSessionChangeTrigger = null,
	_playerStateChangeTrigger = null,
	_trackChangeTrigger = null,
	_trackPositionChangeTrigger = null;

// Constants
var ROOT_MEDIA_NODE_ID = '/';

// mm_player state variables
/**
 * Flag indicating that cached state has been initialized. Prevents unnecessary initialization calls if
 * multiple open operations for the same player are performed.
 */
var _stateCacheInitialized = false;

/**
 * Stores the current track session ID. This assumes that a maximum of one player is open at any given time.
 */
var _currentTrackSessionId = null;

/**
 * Registers success and fail callback functions, returning a unique callback identifier.
 * @param {Function} success The success callback function.
 * @param {Function} fail The failure callback function.
 * @returns {String} The unique callback ID.
 */
function registerCallbackFunctions(success, fail) {
	_callbackCounter++;
	_callbackFunctions[_callbackCounter] = {
		success: success,
		fail: fail
	};
	return String(_callbackCounter);
}

/**
 * Triggers a response event with the respnse ID given in the event data.
 * @param {Object} event The response event object.
 */
var emitResponseEvent = function(event) {
	console.log('car.mediaplayer/mediaplayer.js::emitResponseEvent', event);
	// We need at least an event payload with an id property so we can fire our response event
	if(event && event.id) {
		if(_callbackFunctions[event.id]) {
			try {
				if(event.data !== undefined && event.data !== null) {
					console.log('car.mediaplayer/mediaplayer.js::emitResponseEvent - Calling success callback for request with ID ' + event.id);
					_callbackFunctions[event.id].success(event.data);
				} else if(event.error) {
					console.log('car.mediaplayer/mediaplayer.js::emitResponseEvent - Calling fail callback for request with ID ' + event.id, _callbackFunctions[event.id].fail);
					_callbackFunctions[event.id].fail(
						typeof event.error.code === 'number' ? event.error.code : -1,
						typeof event.error.msg === 'string' ? event.error.msg : 'Unknown error');
				} else {
					console.log('car.mediaplayer/mediaplayer.js::emitResponseEvent - Calling fail callback for request with ID ' + event.id, _callbackFunctions[event.id].fail);
					_callbackFunctions[event.id].fail(-1, 'No event data returned for asynchronous response with ID ' + event.id);
				}
			} catch(ex) {
				console.log('car.mediaplayer/mediaplayer.js::emitResponseEvent - Calling fail callback for request with ID ' + event.id, _callbackFunctions[event.id].fail);
				_callbackFunctions[event.id].fail(-1, ex.message);
			} finally {
				delete _callbackFunctions[event.id];
			}
		} else {
			console.error('car.mediaplayer/mediaplayer.js::emitResponseEvent - Callback not registered for event with ID ' + event.id);
		}
	} else {
		console.error('car.mediaplayer/mediaplayer.js::emitResponseEvent - Insufficient event information to invoke callback');
	}
};

/**
 * Translates the media source as supplied from jPlayer into the data structure
 * expected to clients of the extension/plugin.
 * @param {Object} mediaSource The jPlayer media source data structure.
 * @returns {Object} The translated media source data structure.
 * @private
 */
var translateMediaSource = function(mediaSource) {
	if(mediaSource && typeof mediaSource === 'object') {
		// Status
		if(mediaSource.hasOwnProperty('status')) {
			// Translate the media source status property into a ready flag. As long as at least the first
			// pass has been completed, consider the media source ready.
			mediaSource.ready = mediaSource.status !== _jPlayerObj.MediaSourceStatus.MS_STATUS_NOT_READY;
			
			// Remove the status property since we don't want it exposed
			delete mediaSource.status;
		}
	}
	
	return mediaSource;
};

/**
 * jPlayer onMediaSourceChange callback handler. Translates the media source data structures before calling the
 * media source change trigger.
 * @param {Object} event onMediaSourceChange jPlayer event data object.
 * @private
 */
var onMediaSourceChange = function(event) {
	console.log('car.mediaplayer/mediaplayer.js::onMediaSourceChange', event);

	if(event && event.mediaSource) {
		event.mediaSource = translateMediaSource(event.mediaSource);
	}
	
	_mediaSourceChangeTrigger && _mediaSourceChangeTrigger(event);
};

/**
 * jPlayer onTrackSessionChange callback handler. Updates the current track session ID state cache and then calls the
 * track session change trigger, if it exists.
 * @param {Object} event onTrackSessionChange jPlayer event data object.
 * @private
 */
var onTrackSessionChange = function(event) {
	console.log('car.mediaplayer/mediaplayer.js::onTrackSessionChange', event);
	// jPlayer implementation currently only has one track session being active at a time, so 
	// we can store track session change created event data as the current track session ID.
	// Holding on to the current track session ID allows us to automatically use this data to perform
	// jump and getTrackSessionItems calls on the current track session automatically.
	if(typeof event === 'object'
			&& event.hasOwnProperty('type')
			&& event.hasOwnProperty('trackSessionId')) {
		if(event.type === _jPlayerObj.TrackSessionEvent.CREATED) {
			_currentTrackSessionId = event.trackSessionId;
		} else if(event.type === _jPlayerObj.TrackSessionEvent.DESTROYED && event.trackSessionId === _currentTrackSessionId) {
			_currentTrackSessionId = null;
		}
	}	
	
	// Call the track position change trigger if it exists
	_trackSessionChangeTrigger && _trackSessionChangeTrigger(event);
};

/**
 * emitMediaSourcesResponse interceptor handler. Translates the jPlayer media source data structure before
 * emitting the response event.
 * @param event {Object} The emitMediaSourcesResponse object. 
 * @private
 */
var emitMediaSourcesResponse = function(event) {
	console.log('car.mediaplayer/mediaplayer.js::emitMediaSourcesResponse', event);
	
	// Modify each media source in the result
	if(event && event.data && typeof event.data.length === 'number') {
		for(var i = 0; i < event.data.length; i++) {
			event.data[i] = translateMediaSource(event.data[i]);
		}
	}
	
	emitResponseEvent(event);
};

/**
 * Current track session information initialization success handler. Updates the local currentTrackSessionId state.
 * @param event {Object} The emitCurrentTrackSessionInfoResponse object. 
 * @private
 */
var initializeCurrentTrackSessionInfo = function(event) {
	console.log('car.mediaplayer/mediaplayer.js::initializeCurrentTrackSessionInfo', event);
	// Update the current track session ID
	_currentTrackSessionId = event.data ? event.data.trackSessionId : null;
};

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension,
	 * open and initialise required PPS object and event handlers
	 */
	init:function () {
		try {
			_jPlayerObj = _jPlayer.createObject();
		} catch(ex) {
			console.error('car.mediaplayer.mediaplayer.js::init - Could not create jPlayer object.');
		}
			
		if(_jPlayerObj) {
			// Attach result callback handlers
			_jPlayerObj.onMediaSourcesResult			= emitMediaSourcesResponse;
			_jPlayerObj.onBrowseResult					= emitResponseEvent;
			_jPlayerObj.onCurrentTrackInfoResult		= emitResponseEvent;
			_jPlayerObj.onCurrentTrackPositionResult	= emitResponseEvent;
			_jPlayerObj.onMetadataResult				= emitResponseEvent;
			_jPlayerObj.onExtendedMetadataResult		= emitResponseEvent;
			_jPlayerObj.onCreateTrackSessionResult		= emitResponseEvent;
			_jPlayerObj.onCurrentTrackSessionInfoResult	= emitResponseEvent;
			_jPlayerObj.onTrackSessionItemsResult		= emitResponseEvent;
			_jPlayerObj.onSearchResult					= emitResponseEvent;
			_jPlayerObj.onPlayerStateResult				= emitResponseEvent;
			
			// Attach async callback handlers
			_jPlayerObj.onMediaSourceChange = onMediaSourceChange;
			_jPlayerObj.onTrackSessionChange = onTrackSessionChange;
			_jPlayerObj.onPlayerStateChange = function(event) { _playerStateChangeTrigger && _playerStateChangeTrigger(event); };
			_jPlayerObj.onTrackChange = function(event) { _trackChangeTrigger && _trackChangeTrigger(event); };
			_jPlayerObj.onTrackPositionChange = function(event) { _trackPositionChangeTrigger && _trackPositionChangeTrigger(event); };
		}
	},
	
	// Debug
	invokeDummyEvent: function(name, data) {
		console.log('car.mediaplayer/mediaplayer.js::invokeDummyEvent', data);
		if(_jPlayerObj) {
			_jPlayerObj.invokeDummyEvent(name, data);
		}
	},
	
	/**
	 * Sets the media source change event trigger.
	 * @param {Function} trigger The event trigger function.
	 */
	setMediaSourceChangeTrigger: function(trigger) {
		console.log('car.mediaplayer/mediaplayer.js::setMediaSourceChangeTrigger', trigger);
		_mediaSourceChangeTrigger = trigger;
	},
	
	/**
	 * Sets the track session change event trigger.
	 * @param {Function} trigger The event trigger function.
	 */
	setTrackSessionChangeTrigger: function(trigger) {
		console.log('car.mediaplayer/mediaplayer.js::setTrackSessionChangeTrigger', trigger);
		_trackSessionChangeTrigger = trigger;
	},

	/**
	 * Sets the player state change event trigger.
	 * @param {Function} trigger The event trigger function.
	 */
	setPlayerStateChangeTrigger: function(trigger) {
		console.log('car.mediaplayer/mediaplayer.js::setPlayerStateChangeTrigger', trigger);
		_playerStateChangeTrigger = trigger;
	},

	/**
	 * Sets the track change event trigger.
	 * @param {Function} trigger The event trigger function.
	 */
	setTrackChangeTrigger: function(trigger) {
		console.log('car.mediaplayer/mediaplayer.js::setTrackChangeTrigger', trigger);
		_trackChangeTrigger = trigger;
	},

	/**
	 * Sets the track position change event trigger.
	 * @param {Function} trigger The event trigger function.
	 */
	setTrackPositionChangeTrigger: function(trigger) {
		console.log('car.mediaplayer/mediaplayer.js::setTrackPositionChangeTrigger', trigger);
		_trackPositionChangeTrigger = trigger;
	},
	
	/**
	 * Opens the specified player name.
	 * @param {String} playerName The player name to open. If the player does not exist it will automatically be created.
	 * @returns {Boolean} True if the player was opened successfully, False if not.
	 */
	open: function(playerName) {
		console.log('car.mediaplayer/mediaplayer.js::open', arguments);
		var success = false;
		if(_jPlayerObj) {
			success = _jPlayerObj.open(playerName); 
		
			// Initialize the state cache
			if(success && _stateCacheInitialized === false) {
				_stateCacheInitialized = true;
				this.getTrackSessionInfo(initializeCurrentTrackSessionInfo, function() {});
			}
		}
		return success;
	},
	
	/**
	 * Closes the specified player name.
	 * @param {String} playerName The player name to close.
	 * @returns {Boolean} True if the player was closed successfully, False if not.
	 */
	close: function(playerName) {
		console.log('car.mediaplayer/mediaplayer.js::close', arguments);
		var success = false;
		if(_jPlayerObj) {
			success = _jPlayerObj.close(playerName);

			// Clear the state cache
			if(success) {
				_stateCacheInitialized = false;
				_currentTrackSessionId = null;
			}
		}
		return success;
	},
	
	/**
	 * Returns the list of available media sources connected to the device.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	getMediaSources: function(success, fail) {
		console.log('car.mediaplayer/mediaplayer.js::getMediaSources', arguments);
		return _jPlayerObj ? _jPlayerObj.getMediaSources(registerCallbackFunctions(success, fail)) : false;
	},

	/**
	 * Browse a media source for media.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @param {Number} mediaSourceId The ID of the media source.
	 * @param {String} [mediaNodeId="/"] The ID of the media node to browse. If omitted or null, the root node will
	 * be retrieved.
	 * @param {Number} [limit=-1] The maximum number of records to retrieve. If omitted or negative,
	 * all records will be retrieved.
	 * @param {Number} [offset=0] The offset at which to start retrieving records. If omitted or negative,
	 * offset will be 0.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	browse: function(success, fail, mediaSourceId, mediaNodeId, limit, offset) {
		console.log('car.mediaplayer/mediaplayer.js::browse', arguments);
		return _jPlayerObj ? _jPlayerObj.browse(
				registerCallbackFunctions(success, fail),
				mediaSourceId,
				typeof mediaNodeId === 'string' && mediaNodeId.trim() !== '' ? mediaNodeId : ROOT_MEDIA_NODE_ID,
				typeof limit === 'number' ? limit : -1,
				typeof offset === 'number' ? offset: 0
			) : false;
	},
	
	/**
	 * Search for media items in a specific media source.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @param {Number} mediaSourceId The ID of the media source.
	 * @param {String} [mediaNodeId=null] The ID of the media node from which to search.
	 * @param {String} searchTerm The term to search for.
	 * @param {Number} [limit=-1] The maximum number of records to retrieve. If omitted or negative,
	 * all records will be retrieved.
	 * @param {Number} [offset=0] The offset at which to start retrieving records. If omitted or negative,
	 * offset will be 0.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	search: function(success, fail, mediaSourceId, mediaNodeId, searchTerm, limit, offset) {
		console.log('car.mediaplayer/mediaplayer.js::search', arguments);
		return _jPlayerObj ? _jPlayerObj.search(
				registerCallbackFunctions(success, fail),
				mediaSourceId,
				typeof mediaNodeId === 'string' && mediaNodeId.trim() !== '' ? mediaNodeId : ROOT_MEDIA_NODE_ID,
				searchTerm,
				typeof limit === 'number' ? limit : -1,
				typeof offset === 'number' ? offset: 0
			) : false;
	},
	
	/**
	 * Creates a track session based on the given MediaNode ID.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @param {Number} mediaSourceId The media source ID. 
	 * @param {?String} mediaNodeId The media node ID on which to base the track session.
	 * @param {Number} index The index of the item within the track session to set as current after creation.
	 * @param {Number} limit The maximum number of media nodes to add to the track session. A limit of -1 indicates no limit.
	 * @param {Number} offset The offset within the specified media node at which to start building the track session.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	createTrackSession: function(success, fail, mediaSourceId, mediaNodeId, index, limit, offset) {
		console.log('car.mediaplayer/mediaplayer.js::createTrackSession', arguments);
		return _jPlayerObj ? _jPlayerObj.createTrackSession(
				registerCallbackFunctions(success, fail),
				mediaSourceId,
				mediaNodeId === null ? ROOT_MEDIA_NODE_ID : mediaNodeId,
				index,
				limit,
				offset
			) : false;
	},

	/**
	 * Destroys an existing track session.
	 * @param {Number} trackSessionId The track session ID.
	 * @param {Function} success The success callback handler.
	 * @param {Function} [error] The error callback handler.
	 */
	destroyTrackSession: function(trackSessionId) {
		console.log('car.mediaplayer/mediaplayer.js::destroyTrackSession', arguments);
		return _jPlayerObj ? _jPlayerObj.destroyTrackSession(trackSessionId) : false;
	},
	
	/**
	 * Retrieves information about the current track session.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	getTrackSessionInfo: function(success, fail) {
		console.log('car.mediaplayer/mediaplayer.js::getTrackSessionInfo', arguments);
		// jPlayer API method is intentionally different here. car.mediaplayer abstracts the concept of multiple
		// track sessions, so 'current tracksession' is superfluous.
		return _jPlayerObj ? _jPlayerObj.getCurrentTrackSessionInfo(registerCallbackFunctions(success, fail)) : false;
	},
	
	/**
	 * Retrieves media from the current track session.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @param {Number} [limit-1] The maximum number of records to retrieve. If omitted or negative,
	 * all records will be retrieved.
	 * @param {Number} [offset=0] The offset at which to start retrieving records. If omitted or negative,
	 * offset will be 0.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	getTrackSessionItems: function(success, fail, limit, offset) {
		console.log('car.mediaplayer/mediaplayer.js::getTrackSessionItems', arguments);
		// Automatically add the current track session ID as an argument so that we're always operating off
		// of the current track session.
		return _jPlayerObj ? _jPlayerObj.getTrackSessionItems(
				registerCallbackFunctions(success, fail),
				_currentTrackSessionId,
				typeof limit === 'number' ? limit : -1,
				typeof offset === 'number' ? offset: 0
			) : false;
	},
	
	/**
	 * Retrieves the currently playing track information.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	getCurrentTrack: function(success, fail) {
		console.log('car.mediaplayer/mediaplayer.js::getCurrentTrack', arguments);
		return _jPlayerObj ? _jPlayerObj.getCurrentTrackInfo(registerCallbackFunctions(success, fail)) : false;
	},
	
	/**
	 * Retrieve the current playback position, in milliseconds, of the current track.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	getCurrentTrackPosition: function(success, fail) {
		console.log('car.mediaplayer/mediaplayer.js::getCurrentTrackPosition', arguments);
		return _jPlayerObj ? _jPlayerObj.getCurrentTrackPosition(registerCallbackFunctions(success, fail)) : false;
	},
	
	/**
	 * Retrieves metadata for the specified media.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @param {Number} mediaSourceId The MediaNode's media source ID.
	 * @param {String} mediaNodeId The MediaNode ID.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	getMetadata: function(success, fail, mediaSourceId, mediaNodeId) {
		console.log('car.mediaplayer/mediaplayer.js::getMetadata', arguments);
		return _jPlayerObj ? _jPlayerObj.getMetadata(registerCallbackFunctions(success, fail), mediaSourceId, mediaNodeId) : false;
	},
	
	/**
	 * Retrieves extended metadata properties for the specified media.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @param {Number} mediaSourceId The MediaNode's media source ID.
	 * @param {String} mediaNodeId The MediaNode ID.
	 * @param {String[]} properties An array of extended metadata property names to retrieve.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	getExtendedMetadata: function(success, fail, mediaSourceId, mediaNodeId, properties) {
		console.log('car.mediaplayer/mediaplayer.js::getExtendedMetadata', arguments);
		return _jPlayerObj ? _jPlayerObj.getExtendedMetadata(
				registerCallbackFunctions(success, fail),
				mediaSourceId,
				mediaNodeId,
				properties
			) : false;
	},
	
	/**
	 * Returns the state of the media player.
	 * @param {Function} success Function to call if the operation is a success.
	 * @param {Function} fail Function to call if the operation fails.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	getPlayerState: function(success, fail) {
		console.log('car.mediaplayer/mediaplayer.js::getPlayerState', arguments);
		return _jPlayerObj ? _jPlayerObj.getPlayerState(registerCallbackFunctions(success, fail)) : false;
	},
	
	/**
	 * Start or resume playback of the current track session.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	play: function() {
		console.log('car.mediaplayer/mediaplayer.js::play');
		return _jPlayerObj ? _jPlayerObj.play() : false;
	},
	
	/**
	 * Pause playback.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	pause: function() {
		console.log('car.mediaplayer/mediaplayer.js::pause');
		return _jPlayerObj ? _jPlayerObj.pause() : false;
	},
	
	/**
	 * Stops playback.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	stop: function() {
		console.log('car.mediaplayer/mediaplayer.js::stop');
		return _jPlayerObj ? _jPlayerObj.stop() : false;
	},
	
	/**
	 * Resume playback.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	resume: function() {
		console.log('car.mediaplayer/mediaplayer.js::resume');
		return _jPlayerObj ? _jPlayerObj.resume() : false;
	},
	
	/**
	 * Skip to the next track in the active track session.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	next: function() {
		console.log('car.mediaplayer/mediaplayer.js::next');
		return _jPlayerObj ? _jPlayerObj.next() : false;
	},
	
	/**
	 * Skip to the previous track in the active track session.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	previous: function() {
		console.log('car.mediaplayer/mediaplayer.js::previous');
		return _jPlayerObj ? _jPlayerObj.previous() : false;
	},
	
	/**	
	 * Jumps to the specified track index in the current track session.
	 * @param {Number} index The track index within the current track session.
	 * @returns {Boolean} True if the call was successful, False if not.
	 */
	jump: function(index) {
		console.log('car.mediaplayer/mediaplayer.js::jump', arguments);
		return _jPlayerObj ? _jPlayerObj.jump(index) : false;
	},
	
	/**
	 * Seek to a specific position in the current track.
	 * @param {Number} position The track position, in ms.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	seek: function(position) {
		console.log('car.mediaplayer/mediaplayer.js::seek', arguments);
		return _jPlayerObj ? _jPlayerObj.seek(position) : false;
	},
	
	/**
	 * Set the playback rate of the media player.
	 * @param {Number} playbackRate A value of 1.0 is regular play speed. Negative numbers result in reverse playback.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	setPlaybackRate: function(playbackRate) {
		console.log('car.mediaplayer/mediaplayer.js::setPlaybackRate', arguments);
		return _jPlayerObj ? _jPlayerObj.setPlaybackRate(playbackRate) : false;
	},
	
	/**
	 * Set the shuffle mode for the active track session.
	 * @param {MediaPlayer.ShuffleMode} shuffleMode The shuffle mode as per the MediaPlayer.ShuffleMode enumeration. 
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	shuffle: function(shuffleMode) {
		console.log('car.mediaplayer/mediaplayer.js::shuffle', arguments);
		return _jPlayerObj ? _jPlayerObj.shuffle(shuffleMode) : false;
	},
	
	/**
	 * Set the repeat mode for the active track session.
	 * @param {MediaPlayer.RepeatMode} repeatMode The repeat mode as per the MediaPlayer.RepeatMode enumeration.
	 * @returns {Boolean} True if the operation was successful, False if not.
	 */
	repeat: function(repeatMode) {
		console.log('car.mediaplayer/mediaplayer.js::repeat', arguments);
		return _jPlayerObj ? _jPlayerObj.repeat(repeatMode) : false;
	}
};
