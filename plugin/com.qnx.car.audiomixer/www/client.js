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
 * @static
 * @module car.audiomixer
 * @description Control the audio mixer.
 */

var _self = {},
	_ID = 'com.qnx.car.audiomixer',
	_utils = cordova.require('cordova/utils'),
	_watches = {};


// to refer to the audio mixer setting
_self.AudioMixerSetting = require('./AudioMixerSetting');


/**
 * @description Handle update events for this extension.
 * @param data {Array} The updated data provided by the event.
 * @private
 */
function onUpdate(data) {
	var keys = Object.keys(_watches);
	for (var i=0; i<keys.length; i++) {
		setTimeout(_watches[keys[i]](data), 0);
	}
}

/**
 * @description Monitor for audio mixer changes.
 * @param {Function} callback The function to call when a change is detected.
 * @return {String} The identifier (ID) for the added watch.
 * @memberOf module:car.audiomixer 
 * @method watchAudioMixer
 * @example
 * //define a callback function
 * function myCallback(audioMixerItems) {
 *		//iterate through the changed items
 *		for (var i=0; i&lt;audioMixerItems.length; i++) {
 *			console.log("audio mixer item setting = " + audioMixerItems[i].setting + '\n' +	//a car.audiomixer.AudioMixerSetting value
 *						"audio mixer item zone = " + audioMixerItems[i].zone + '\n' +		//a car.Zone value
 *						"audio mixer item value = " + audioMixerItems[i].value + '\n\n');	//a numeric value
 *		}
 * }
 * 
 * var watchId = car.audiomixer.watchAudioMixer(myCallback);
 */
_self.watchAudioMixer = function (callback) {
	var watchId = _utils.createUUID();
	
	_watches[watchId] = callback;
	if (Object.keys(_watches).length === 1) {
		window.cordova.exec(onUpdate, null, _ID, 'startEvents', null, false);
	}

	return watchId;
}


/**	
 * @description Stop watching audio mixer changes.
 * @param {Number} watchId The watch ID returned by <code>car.audiomixer.watchAudioMixer()</code>.
 * @memberOf module:car.audiomixer
 * @method cancelWatch
 * @example
 * 
 * car.audiomixer.cancelWatch(watchId);
 */
_self.cancelWatch = function (watchId) {
	if (_watches[watchId]) {
		delete _watches[watchId];
		if (Object.keys(_watches).length === 0) {
			window.cordova.exec(null, null, _ID, 'stopEvents', null, false);
		}
	}
}


/**
 * @description Return the audio mixer settings for a specific zone.
 * <p>If the call is successful, <code>car.audiomixer.get()</code> calls the <code>successCallback</code>
 * function with the <code>car.Zone</code> object for the specific zone.</p>
 * @param {Function} successCallback The function to call with the result on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {String} [zone] The zone to filter the results by.
 * @memberOf module:car.audiomixer
 * @method get
 * @see car.Zone 
 * @example 
 * //define your callback function(s)
 * function successCallback(audioMixerItems) {
 *		//iterate through all the audio mixer items
 *		for (var i=0; &lt;i<audioMixerItems.length; i++) {
 *			console.log("audio mixer item setting = " + audioMixerItems[i].setting + '\n' +	//a car.audiomixer.AudioMixerSetting value
 *						"audio mixer item zone = " + audioMixerItems[i].zone + '\n' +		//a car.Zone value
 *						"audio mixer item value = " + audioMixerItems[i].value);			//a numeric value
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //Optional: Provide a car.Zone filter to retrieve values for only that zone.
 * //If omitted, settings for all zones will be returned.
 * var zone = car.Zone.FRONT;
 *
 * //call the method
 * car.audiomixer.get(successCallback, errorCallback, zone);
 *
 *
 * @example REST - Single zone.
 * Request:
 * http://<car-ip>/car/audiomixer/get?zone=all
 *
 * Response:
 * {
 *		code: 1,
 *		data: [
 * 			{ setting: 'volume', zone: 'all', value: 50 }
 *		]
 * }
 *
 *
 * @example REST - Multizone.
 * Request:
 * http://<car-ip>/car/audiomixer/get
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [
 *			{ setting: 'volume', zone: 'all', value: 50 },
 *			{ setting: 'bass', zone: 'all', value: 6 },
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.get = function(successCallback, errorCallback, zone) {
	var args = {};
	if (zone) {
		args.zone = (typeof zone == 'string' && zone.length > 0) ? zone : null;
	}
	window.cordova.exec(successCallback, errorCallback, _ID, 'get', args, false);
};


/**
 * @description Save an audio mixer setting.
 * @param {String} setting The <code>car.audiomixer.AudioMixerSetting</code> value.  
 * @param {String} zone A <code>car.Zone</code> value.   
 * @param {Number} value The value to save.
 * @param {Function} [successCallback] The function to call when the function call is successful.
 * @param {Function} [errorCallback] The function to call if there's an error.
 * @memberOf module:car.audiomixer
 * @method set
 * @see car.audiomixer.AudioMixerSetting
 * @see car.Zone  
 *
 * @example
 * //option 1: Set the volume in the entire car to 50 using constants.
 * car.audiomixer.set(car.audiomixer.AudioMixerSetting.VOLUME, car.Zone.ALL, 50);
 *
 * //option 2: Set the volume in the entire car to 50 without using constants.
 * car.audiomixer.set('volume', 'all', 50);
 *
 *
 * @example REST
 * Request:
 * http://<car-ip>/car/audiomixer/set?setting=volume&zone=all&value=50
 *
 * Success Response:
 * {
 *		code: 1
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.set = function(setting, zone, value, successCallback, errorCallback) {
	var args = { 
		setting: setting, 
		zone: zone, 
		value: value 
	};
	window.cordova.exec(successCallback, errorCallback, _ID, 'set', args, false);
};


//Export
module.exports = _self;