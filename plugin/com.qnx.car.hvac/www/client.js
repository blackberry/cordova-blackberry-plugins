/*
 * Copyright 2013 - 2014.
 * QNX Software Systems Limited. All rights reserved.
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
 * @module car.hvac
 * @static
 * @description Control the HVAC system.
 */

var _self = {},
	_ID = 'com.qnx.car.hvac',
	_utils = cordova.require('cordova/utils'),
	_watches = {};


//to refer to the temperature setting
_self.HvacSetting = require('./HvacSetting');

//to refer to the defrost direction
_self.HvacFanDirection = require('./HvacFanDirection');

/**
 * @description Handle update events for this plugin.
 * @param data {Array} The updated data provided by the event 
 * @private
 */
function onUpdate(data) {
	var keys = Object.keys(_watches);
	for (var i=0; i<keys.length; i++) {
		setTimeout(_watches[keys[i]](data), 0);
	}
}

/**
 * @description Watch for HVAC changes.
 * @param {Function} callback The function to call when a change is detected.
 * @return {String} An ID for the added watch.
 * @memberOf module:car.hvac
 * @method watchHvac
 * @example
 * 
 * //define a callback function
 * function myCallback(hvacItems) {
 *		//iterate through the changed items
 *		for (var i=0; i&lt;hvacItems.length; i++) {
 *			console.log("hvac item setting = " + hvacItems[i].setting + '\n' +	//a car.hvac.HvacSetting value
 *						"hvac item zone = " + hvacItems[i].zone + '\n' +		//a car.Zone value
 *						"hvac item value = " + hvacItems[i].value + '\n\n');	//a mixed value type, depending on the setting
 *		}
 * }
 * 
 * var watchId = car.hvac.watchHvac(myCallback);
 */
_self.watchHvac = function (callback) {
	var watchId = _utils.createUUID();
	
	_watches[watchId] = callback;
	if (Object.keys(_watches).length === 1) {
		window.cordova.exec(onUpdate, null, _ID, 'startEvents', null, false);
	}

	return watchId;
}

/**
 * @description Stop watching HVAC items.
 * @param {String} watchId The watch ID returned by <code>car.hvac.watchHvac()</code>.
 * @memberOf module:car.hvac
 * @method cancelWatch
 * @example
 * 
 * car.hvac.cancelWatch(watchId);
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
 *@description Return HVAC settings for the specified filter.
 * <p>If successful, <code>car.hvac.get()</code> calls the <code>successCallback</code> function with an array of setting objects
 * containing the setting (<code>car.hvac.HvacSetting</code>), the zone (<code>car.Zone</code>), and the value (number/string/boolean).
 * @param {Function} successCallback The function to call with the result.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {Array} [settings] An array of <code>car.hvac.HvacSetting</code> values to whitelist.
 * @param {Array} [zones] An array of <code>car.Zone</code> values to whitelist. 
 * @memberOf module:car.hvac
 * @method get
 * @see car.hvac.HvacSetting  
 * @see car.Zone
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(hvacItems) {
 *		//iterate through all the hvac items
 *		for (var i=0; i&lt;hvacItems.length; i++) {
 *			console.log("hvac item setting = " + hvacItems[i].setting + '\n' +	//a car.hvac.HvacSetting value
 *						"hvac item zone = " + hvacItems[i].zone + '\n' +		//a car.Zone value
 *						"hvac item value = " + hvacItems[i].value + '\n\n');	//a mixed value type, depending on the setting
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 *
 * //call the method
 * car.hvac.get(successCallback, errorCallback);
 *
 *
 * @example REST - without any filters
 *
 * Request:
 * http://&lt;car-ip&gt;/car/hvac/get
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [
 *			{ setting: 'temperature', zone: 'frontLeft', value: 20 },
 *			{ setting: 'temperature', zone: 'frontRight', value: 22 },
 *			{ setting: 'temperature', zone: 'rear', value: 22 },
 *			{ setting: 'airConditioning', zone: 'everywhere', value: true },
 *			...
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 *
 *
 * @example REST - with settings and zone filters
 *
 * Request:
 * http://&lt;car-ip&gt;/car/hvac/get?settings=temperature,heatedSeats&zones=frontLeft,frontRight
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [
 *			{ setting: 'temperature', zone: 'frontLeft', value: 20 },
 *			{ setting: 'temperature', zone: 'frontRight', value: 22 },
 *			{ setting: 'heatedSeat', zone: 'frontLeft', value: 5 },
 *			{ setting: 'heatedSeat', zone: 'frontRight', value: 0 }
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.get = function(successCallback, errorCallback, settings, zones) {
	var args = {};

	if (typeof settings == 'object' && settings.length > 0) {
		args.settings = settings.join(',');
	}

	if (typeof zones == 'object' && zones.length > 0) {
		args.zones = zones.join(',');
	}

	window.cordova.exec(successCallback, errorCallback, _ID, 'get', args, false);
};

/**
 * @description Save an HVAC setting.
 * @param {String} setting A <code>car.hvac.HvacSetting</code> value.
 * @param {String} zone A <code>car.Zone</code> value.
 * @param {Mixed} value The value to save.
 * @param {Function} [successCallback] The function to call with the result.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.hvac 
 * @method set
 * @see car.hvac.HvacSetting
 * @see car.Zone  
 * @example
 *
 * //set the temperature in the entire car to 50
 * car.hvac.set(car.hvac.HvacSetting.TEMPERATURE, car.Zone.EVERYWHERE, 50);
 * //NOTE: this is equivalent to doing: car.hvac.set('temperature', 'everywhere', 50);
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/hvac/set?setting=temperature&zone=frontLeft&value=25
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
_self.set = function(setting, zone, value, successCallback, errorCallback) {
	var args = { 
		setting: setting, 
		zone: zone, 
		value: value 
	};
	window.cordova.exec(successCallback, errorCallback, _ID, 'set', args, false);
};


// Export
module.exports = _self;


