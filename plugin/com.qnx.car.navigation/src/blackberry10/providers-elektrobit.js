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
 * Implements navigation functionality for Elektrobit
 */

var	_pps = qnx.webplatform.pps,
	_qdb = require('../../lib/qdb'),
	_db,
	_statusPPS,
	_controlReaderPPS,
	_controlWriterPPS,
	_triggerUpdate,
	_callbackCounter = 0,
	_callbackFunctions = {},
	
	GET_LOCATIONS = 'SELECT l.*, c.type FROM locations l LEFT JOIN categories c ON l.categoryId = c.id';
	
/**
 * Initialization function
 */
function init() {
	try {
		_db = _qdb.createObject();
		if (!_db || !_db.open('/dev/qdb/navigation')) {
			console.log("car.navigation::init [providers-elektrobit.js] Error opening db; path=/dev/qdb/navigation");
		}
	} catch (ex) {
		console.error('Error in webworks ext: navigation/providers-elektrobit.js:init():', ex);
	}
}
init();

/**
 * Track callback functions for asynchronous requests
 * @param {Function} success The function to call on success
 * @param {Function} fail The function to call on failure
 * @return {Number} A unique id for the callback
 */
function setupCallback(success, fail) {
	_callbackCounter ++;
	_callbackFunctions[_callbackCounter] = {
		success: success,
		fail: fail
	};
	return _callbackCounter;
}

/**
 * Method called when the navigation status object changes
 * @param {Object} event The PPS event
 */
function onStatusEvent(event) {
	if (event && event.changed && _triggerUpdate) {
		var data = {};
		if (event.changed.navigating) {
			data["isNavigating"] = event.data.navigating;
		}
		if (event.changed.total_time_remaining) {
			data["totalTimeRemaining"] = event.data.total_time_remaining;
		}
		if (event.changed.total_distance_remaining) {
			data["totalDistanceRemaining"] = event.data.total_distance_remaining;
		}
		if (event.changed.destination) {
			data["destination"] = event.data.destination;
		}
		if (event.changed.maneuvers) {
			data["maneuvers"] = event.data.maneuvers;
		}
		if (Object.keys(data).length > 0) {
			_triggerUpdate(data);
		}
	}
}

/**
 * Method called when the navigation control object has a response ready
 * @param {Object} event The PPS event
 */
function onControlEvent(event) {
	if (event && event.data && event.data.res) {
		switch (event.data.res) {
			case 'getPOIs':
			case 'getPOIsByName':
			case 'search':
				handleSearchResults(event.data);
				break;

			case 'navigateTo': 
				handleNavigateToComplete(event.data);
				break;
		}
	}
}

/**
 * Function called when navigateTo has completed
 * @param data {Object} The incoming PPS data
 */
function handleNavigateToComplete(data) {
	if (typeof _callbackFunctions[data.id] == 'object') {
		try {
			if (typeof data.err == 'number') {
				if (typeof _callbackFunctions[data.id].error == 'function') {
					_callbackFunctions[data.id].error({ 
						code: parseInt(data.err), 
						message: data.errstr || 'An unknown error has occured'
					});
				}
			} else {
				if (typeof _callbackFunctions[data.id].success == 'function') {
					_callbackFunctions[data.id].success();
				}
			}
		} catch (ex) {
			if (typeof _callbackFunctions[data.id].error == 'function') {
				_callbackFunctions[data.id].error(-1, ex.message);
			}
		} finally {
			delete _callbackFunctions[data.id];
		}
	}
}

/**
 * Function called when a search result is available
 * @param data {Object} The incoming PPS data
 */
function handleSearchResults(data) {
	if (typeof _callbackFunctions[data.id] == 'object') {
		try {
			if (data.id && _callbackFunctions[data.id]) {
				var result = _db.query(GET_LOCATIONS);
				var locations = _qdb.resultToArray(result);
				_callbackFunctions[data.id].success(locations);
			}
		} catch (ex) {
			_callbackFunctions[data.id].error(-1, ex.message);
		} finally {
			delete _callbackFunctions[data.id];
		}
	}
}

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension 
	 */
	init: function() {
		_statusPPS = _pps.createObject("/pps/qnxcar/navigation/status", _pps.PPSMode.DELTA);
		_statusPPS.onNewData = onStatusEvent;
		_statusPPS.open(_pps.FileMode.RDONLY);

		_controlReaderPPS = _pps.createObject("/pps/qnxcar/navigation/control", _pps.PPSMode.DELTA);
		_controlReaderPPS.onNewData = onControlEvent;
		_controlReaderPPS.open(_pps.FileMode.RDONLY);

		_controlWriterPPS = _pps.createObject("/pps/qnxcar/navigation/control", _pps.PPSMode.DELTA);
		_controlWriterPPS.open(_pps.FileMode.WRONLY);
	},

	/**
	 * Sets the trigger function to call when a navigation update event is fired
	 * @param {Function} trigger The trigger function to call when the event is fired
	 */
	setTriggerUpdate: function(trigger) {
		_triggerUpdate = trigger;
	},
	
	/**
	 * Browse the POI database near a location
	 * @param {Number} categoryId (Optional) A category id to browse; defaults to 0
	 * @param {Object} location (Optional) The location around which we want to find a POI; defaults to current location
	 * @param {Function} success The function to call on success
	 * @param {Function} fail The function to call on failure
	 */
	browsePOI: function(categoryId, location, success, fail) {
		if (isNaN(categoryId)) {
			categoryId = 0;
		}
		
		var result = _db.query("SELECT * FROM categories WHERE parentId=" + categoryId);
		var categories = _qdb.resultToArray(result);
		if (categories.length == 0) {
			//we need to do an async search for pois
			//setup the callback
			var id = setupCallback(success, fail);

			//make the request
			var dat = {
				category: categoryId,
			};
			if (typeof location == 'object' && location !== null) {
				dat['location'] = location;
			}
			_controlWriterPPS.write({
				id: id,
				msg: 'getPOIs',
				dat: dat,
			});
		} else {
			//categories are available, we can respond now
			success(categories);
		}
	},
	
	/**
	 * Search the POI database near a location
	 * @param name {String} The name of the location
	 * @param {String} id An identifier to return in the result of this query [optional]
	 * @param location {Object} The location around which we want to find a POI [optional, defaults to current location]
	 * @param {Function} success The function to call on success
	 * @param {Function} fail The function to call on failure
	 */
	searchPOI: function(name, location, success, fail) {
		//setup the callback
		var id = setupCallback(success, fail);

		//make the request
		var dat = {
			name: name,
		};
		if (typeof location == 'object' && location !== null) {
			dat['location'] = location;
		}
		_controlWriterPPS.write({
			msg: 'getPOIsByName',
			id: id,
			dat: dat,
		});
	},

	/**
	 * Shows a set of locations on a map
	 * @param locations {Array} An array of locations to show on the map
	 */
	showOnMap: function(locations) {
		_controlWriterPPS.write({
			msg: 'showOnMap',
			dat: {
				locations: locations,
			}
		});
	},
	
	/**
	 * Zoom the current map
	 * @param scale {Number} The zoom scale
	 */
	zoomMap: function(scale) {
		_controlWriterPPS.write({
			msg: 'zoomMap',
			dat: {
				scale: scale,
			}
		});
	},
	
	/**
	 * Pans the current map
	 * @param deltaX {Number} The number of pixels to move the map on the X axis
	 * @param deltaY {Number} The number of pixels to move the map on the Y axis
	 */
	panMap: function(deltaX, deltaY) {
		_controlWriterPPS.write({
			msg: 'panMap',
			dat: {
				deltaX: deltaX,
				deltaY: deltaY,
			}
		});
	},
	
	/**
	 * Search to find a location based on a partial address
	 * @param {Object} location The location we want to search for
	 * @param {Function} success The function to call on success
	 * @param {Function} fail The function to call on failure
	 */
	searchAddress: function(location, success, fail) {
		if (typeof location == 'object' && location !== null) {
			//setup the callback
			var id = setupCallback(success, fail);

			//make the request
			var dat = {};

			if (typeof location.country == 'string') {
				dat["country"] = location.country;
			}
			if (typeof location.city == 'string') {
				dat["city"] = location.city;
			}
			if (typeof location.street == 'string') {
				dat["street"] = location.street;
			}
			if (typeof location.number == 'string') {
				dat["number"] = location.number;
			}

			if (Object.keys(dat).length > 0) {
				_controlWriterPPS.write({
					msg: 'search',
					id: id,
					dat: dat
				});
			}
		}		
	},
	
	/**
	 * Navigate to a specific location
	 * @param location {Object} The location we want to navigate to
	 * @param {Function} success The function to call on success
	 * @param {Function} fail The function to call on failure
	 */
	navigateTo: function(location, success, fail) {
		var id = setupCallback(success, fail);
		_controlWriterPPS.write({
			msg: 'navigateTo',
			id: id,
			dat: {
				location: location
			}
		});
	},
	
	/**
	 * Cancels the navigation if it is in progress
	 */
	cancelNavigation: function() {
		_controlWriterPPS.write({
			msg: 'cancelNavigation',
		});
	},
	
	/**
	 * Gets the current navigation route
	 * @returns {Array} An array of navigation route segments, or null if not navigating
	 * Ex:
	 *	 [{
	 *		currentRoad: {String},		//name of the current road
	 *		command: {String},			//command to execute to transition to the next road
	 *		distance: {Number},			//distance covered by this segment, in metres
	 *		time: {Number},				//amount of time required to cover this segment, in minutes
	 *		latitude: {Number},			//latitude at the end of this segment
	 *		longitude: {Number},		//longitude at the end of this segment
	 *	}]
	 */
	getRoute: function() {
		try {
			return (_statusPPS.data.status.navigating) ? _statusPPS.data.status.route : null;
		} catch (e) {
			console.error('navigation/providers-elektrobit::getRoute error', e);
			return null;
		}
	},
	
	/**
	 * Gets details about the current status of the navigation engine
	 * @return {Object} A navigation status object
	 * Ex:
	 *	 {
	 *		isNavigating: {Boolean},			//true if navigation is in progress, otherwise false
	 *		segment: {Number},					//the index of the current route segment [present if isNavigating=true]
	 *		segmentDistanceRemaining: {Number},	//the distance remaining in the current segment, in metres [present if isNavigating=true]
	 *		totalTimeRemaining: {Number},		//the amount of time remaining in the route, in seconds [present if isNavigating=true]
	 *		totalDistanceRemaining: {Number},	//the distance remaining in the route, in metres [present if isNavigating=true]
	 *	};
	 */
	getStatus: function() {
		try {
			if (typeof _statusPPS.data.status.navigating == 'boolean' && _statusPPS.data.status.navigating === true) {
				return {
					isNavigating: 			true,
					maneuvers: 				_statusPPS.data.status.maneuvers,
					destination: 			_statusPPS.data.status.destination,
					totalTimeRemaining: 	_statusPPS.data.status.total_time_remaining,
					totalDistanceRemaining: _statusPPS.data.status.total_distance_remaining,
				};
			} else {
				return {
					isNavigating: 			false,
				};
			}
		} catch (e) {
			console.error('navigation/providers-elektrobit::getStatus error', e);
			return null;
		}
	},	
};
