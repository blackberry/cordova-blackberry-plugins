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
 * @module car.radio
 * @static
 *
 * @description Manages the radio interface
 */

var _ID = "com.qnx.car.radio",
	_self = {},
	_utils = cordova.require('cordova/utils'),
	_watchesRadio = {};
	_watchesPresets = {};

/**
 * Handles radio update events
 * @param data {Array} The updated data provided by the event 
 * @private
 */
function onUpdateRadio(data) {
	var keys = Object.keys(_watchesRadio);
	for (var i=0; i<keys.length; i++) {
		setTimeout(_watchesRadio[keys[i]](data), 0);
	}
}

/**
 * Handles preset update events 
 * @param data {Array} The updated data provided by the event 
 * @private
 */
function onUpdatePresets(data) {
	var keys = Object.keys(_watchesPresets);
	for (var i=0; i<keys.length; i++) {
		setTimeout(_watchesPresets[keys[i]](data), 0);
	}
}

/**
 * Watch for metadata updates
 * @param {Function} callback The function to call when a change is detected.
 * @return {Number} An ID for the added watch.
 * @memberOf module:car.radio
 * @method watchRadio 
 * @example
 * 
 * //define a callback function
 * function myCallback(metadata) {
 *		console.log("tuner = " + data.tuner + "\n" +
 *					"artist = " + data.artist + "\n" +
 *					"genre = " + data.genre + "\n" +
 *					"song = " + data.song + "\n" +
 *					"station = " + data.station + "\n" +
 *					"stationName = " + data.stationName + "\n" +
 *					"hd = " + data.hd
 *		);
 * }
 * 
 * var watchId = car.radio.watchRadio(myCallback);
 */
_self.watchRadio = function (callback) {
	var watchId = _utils.createUUID();
	
	_watchesRadio[watchId] = callback;
	if (Object.keys(_watchesRadio).length === 1) {
		window.cordova.exec(onUpdateRadio, null, _ID, 'startEvent', { eventName: 'radioUpdate' }, false);
	}

	return watchId;
};

/**
 * Watch for preset updates
 * @param {Function} callback The function to call when a change is detected.
 * @return {Number} An ID for the added watch.
 * @memberOf module:car.radio
 * @method watchPresets  
 * @example
 * 
 * function myCallback(presets) {
 *		//iterate through all the presets
 *		for (var i=0; i&lt;presets.length; i++) {
 *			console.log("preset tuner = " + presets[i].tuner + "\n" +
 *						"preset station = " + presets[i].station + "\n" +
 *						"preset index = " + presets[i].index + "\n" +
 *						"preset group = " + presets[i].group
 *			);
 *		}
 * }
 * 
 * var watchId = car.radio.watchPresets(myCallback);
 */
_self.watchPresets = function (callback) {
	var watchId = _utils.createUUID();
	
	_watchesPresets[watchId] = callback;
	if (Object.keys(_watchesPresets).length === 1) {
		window.cordova.exec(onUpdatePresets, null, _ID, 'startEvent', { eventName: 'presetUpdate' }, false);
	}

	return watchId;
};

/**
 * Stop watching for metadata updates
 * @param {Number} watchId The watch ID as returned by <i>car.radio.watchRadio()</i> or <i>car.radio.watchPresets()</i>.
 * @memberOf module:car.radio
 * @method cancelWatch   
 * @example
 * 
 * car.radio.cancelWatch(watchId);
 */
_self.cancelWatch = function (watchId) {
	//is this a radio events watch?
	if (_watchesRadio[watchId]) {
		delete _watchesRadio[watchId];
		if (Object.keys(_watchesRadio).length === 0) {
			window.cordova.exec(null, null, _ID, 'stopEvent', { eventName: 'radioUpdate' }, false);
		}
	} else if (_watchesPresets[watchId]) {
		delete _watchesPresets[watchId];
		if (Object.keys(_watchesPresets).length === 0) {
			window.cordova.exec(null, null, _ID, 'stopEvent', { eventName: 'presetUpdate' }, false);
		}
	}
};

/**
 * Return the list of available tuners
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.radio
 * @method getTuners  
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(tuners) {
 *		//iterate through all the tuners
 *		for (var i=0; i&lt;tuners.length; i++) {
 *			console.log("tuner name = " + tuners[i].tuner + "\n" +
 *						"tuner type = " + tuners[i].type + "\n" +
 *						"tuner range min = " + tuners[i].settings.rangeMin + "\n" +
 *						"tuner range max = " + tuners[i].settings.rangeMax + "\n" +
 *						"tuner range step = " + tuners[i].settings.rangeStep
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.radio.getTuners(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/radio/getTuners
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [ 
 * 			{ 
 *				tuner: 'am', 
 *				type: 'analog', 
 *				settings: {
 *					rangeMin: 880,
 *					rangeMax: 1600,
 *					rangeStep: 10
 *				}
 *			}, { 
 *				tuner: 'fm', 
 *				type: 'analog', 
 *				settings: {
 *					rangeMin: 88.9,
 *					rangeMax: 107.1,
 *					rangeStep: 0.2
 *				}
 *			}
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.getTuners = function(successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'getTuners', null, false);
};
		
/**
 * Set the active tuner by name
 * @param {String} tuner The name of tuner to set as active.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.radio
 * @method setTuner
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log('tuner was successfully set');
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.radio.setTuner('fm', successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/radio/setTuner?tuner=fm
 *
 * Success Response:
 * {
 *		code: 1,
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.setTuner = function(tuner, successCallback, errorCallback) {
	var args = { 
		tuner: tuner 
	};
	window.cordova.exec(successCallback, errorCallback, _ID, 'setTuner', args, false);
};

/**
 * @description <p>Tune to a specific station, optionally targeting a specific tuner
 * <p>If the specified tuner is not the active tuner, then the station will be 
 * automatically selected the next time that tuner is set as active.
 * @param {Number} station The target station.
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {String} [tuner] The tuner name. If not specified, the active tuner is used.
 * @memberOf module:car.radio
 * @method setStation
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log('station was successfully set');
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.radio.setStation(88.5, successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/radio/setStation?station=88.5
 *
 * Success Response:
 * {
 *		code: 1,
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.setStation = function(station, successCallback, errorCallback, tuner) {
	var args = { 
		station: station 
	};
	if (tuner) {
		args.tuner = tuner;
	}
	window.cordova.exec(successCallback, errorCallback, _ID, 'setStation', args, false);
};

/**
 * @description <p>Get the presets for the current tuner
 * <p>Optionally, a tuner name can be specified, returning
 * presets for the specified tuner.
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {String} [tuner] The tuner of the presets. If not specified, the active tuner is used.
 * @memberOf module:car.radio
 * @method getPresets
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(presets) {
 *		//iterate through all the presets
 *		for (var i=0; i&lt;presets.length; i++) {
 *			console.log("preset tuner = " + presets[i].tuner + "\n" +
 *						"preset station = " + presets[i].station + "\n" +
 *						"preset index = " + presets[i].index + "\n" +
 *						"preset group = " + presets[i].group
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.radio.getPresets(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/radio/getPresets
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [ 
 * 			{ 
 *				tuner: 'am', 
 *				station: '880', 
 *				index: 0, 
 *				group: 'am1', 
 *			}, { 
 *				tuner: 'am', 
 *				station: '1010', 
 *				index: 1, 
 *				group: 'am1', 
 *			},{
 *				...	
 *			}
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.getPresets = function(successCallback, errorCallback, tuner) {
	var args = {};
	if (tuner) {
		args.tuner = tuner;
	}
    window.cordova.exec(successCallback, errorCallback, _ID, 'getPresets', args, false);
};

/**
 * @description <p>Set the current station as a preset at the specified index
 * <p>You can optionally specify a different station and tuner as a preset. 
 * @param {Number} index The preset index.
 * @param {String} group The preset group.
 * @param {Number} [station] The station to set as the preset. If this is not specified, the current station is used.
 * @param {String} [tuner] The tuner of the presets. If not specified, the active tuner is used.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.radio
 * @method setPreset
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log('preset was successfully set');
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.radio.setPreset(0, 'am1', 1030, 'am', successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/radio/setPreset?index=0&group=am1&station=1030&tuner=am
 *
 * Success Response:
 * {
 *		code: 1,
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.setPreset = function(index, group, station, tuner, successCallback, errorCallback) {
	var args = { 
		index: index,
		group: group
	};
	if (station) {
		args["station"] = station;
	}
	if (tuner) {
		args["tuner"] = tuner;
	}
	window.cordova.exec(successCallback, errorCallback, _ID, 'setPreset', args, false);
};

/**
 * Seek for the next radio station in the specified direction
 * @param {String} direction The direction to seek ('up' or 'down').
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.radio
 * @method seek
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log('seek was successfully called');
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.radio.seek('up', successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/radio/seek?direction=up
 *
 * Success Response:
 * {
 *		code: 1,
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.seek = function(direction, successCallback, errorCallback) {
	var args = { 
		direction: direction 
	};
    window.cordova.exec(successCallback, errorCallback, _ID, 'seek', args, false);
};

/**
 * Scan for available radio stations in the specified direction
 * @param {String} direction The direction to seek ('up' or 'down').
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.radio
 * @method scan
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log('scan was successfully called');
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.radio.scan('up', successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/radio/scan?direction=up
 *
 * Success Response:
 * {
 *		code: 1,
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.scan = function(direction, successCallback, errorCallback) {
	var args = { 
		direction: direction 
	};
    window.cordova.exec(successCallback, errorCallback, _ID, 'scan', args, false);
};

/**
 * Stop station scanning if in progress
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.radio
 * @method scanStop
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log('scanStop was successfully called');
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.radio.scanStop(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/radio/scanStop
 *
 * Success Response:
 * {
 *		code: 1,
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.scanStop = function(successCallback, errorCallback) {
    window.cordova.exec(successCallback, errorCallback, _ID, 'scanStop', null, false);
};

/**
 * Get the current station metadata
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.radio
 * @method getStatus
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(data) {
 *			console.log("tuner = " + data.tuner + "\n" +
 *						"artist = " + data.artist + "\n" +
 *						"genre = " + data.genre + "\n" +
 *						"song = " + data.song + "\n" +
 *						"station = " + data.station + "\n" +
 *						"stationName = " + data.stationName + "\n" +
 *						"hd = " + data.hd
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.radio.getStatus(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/radio/getStatus
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: {
 *     		tuner: 'fm'
 *     		artist: 'Bjork',
 *     		genre: 'News & Entertainment',
 *     		song: 'All is Full of Love',
 *     		station: 91.5,
 *     		stationName: 'CBC Radio 1',
 *     		hd: false
 *		}
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.getStatus = function(successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'getStatus', null, false);
};


//Export
module.exports = _self;

