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
 * @module car.sensors
 * @static
 *
 * @description Provides access to custom automotive sensors.
 */

var _self = {},
	_ID = "com.qnx.car.sensors",
	_utils = cordova.require('cordova/utils'),
	_watches = {};


// Sensor enumeration
_self.Sensor = require('./Sensor');


/**
 * Handles update events for this extension
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
 * Watch for sensor changes
 * @param {Function} callback The function to call when a change is detected.
 * @return {String} An ID for the added watch.
 * @memberOf module:car.sensors
 * @method watchSensors
 * @example
 * 
 * //define a callback function
 * function myCallback(sensorData) {
 *		//iterate through all the sensors
 		var sensors = Object.keys(sensorData);
 *		for (var i=0; i&lt;sensors.length; i++) {
 *			console.log("sensor name = " + sensors[i] + "; sensor value = " + sensorData[sensors[i]]);
 *		}
 * }
 * 
 * var watchId = car.sensors.watchSensors(myCallback);
 */
_self.watchSensors = function (callback) {
	var watchId = _utils.createUUID();
	
	_watches[watchId] = callback;
	if (Object.keys(_watches).length === 1) {
		window.cordova.exec(onUpdate, null, _ID, 'startEvents', null, false);
	}

	return watchId;
}


/**
 * Stop watching sensor changes
 * @param {Number} watchId The watch ID as returned by <i>car.sensors.watchSensors()</i>.
 * @memberOf module:car.sensors
 * @method cancelWatch 
 * @example
 * 
 * car.sensors.cancelWatch(watchId);
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
 * @description <p>Return the current vehicle sensors
 * <p>If successful, the <i>successCallback</i> method is called with an object describing
 * the available sensors, their location (if applicable), and their values.
 * @param {Function} successCallback The function to call with the result on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {Array} [sensors] A list of <b>car.sensor.Sensor</b> values to whitelist.
 * @memberOf module:car.sensors
 * @method get 
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(sensorData) {
 *		//iterate through all the sensors
 		var sensors = Object.keys(sensorData);
 *		for (var i=0; i&lt;sensors.length; i++) {
 *			console.log("sensor name = " + sensors[i] + "; sensor value = " + sensorData[sensors[i]]);
 *		}
 *
 *		//get the speed
 *		if (typeof sensorData[car.sensors.Sensor.SPEED] !== 'undefined') {
 *			console.log("speed = " + sensorData[car.sensors.Sensor.SPEED]);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //optional: define a list of sensors by which to filter
 * var sensors = [ car.sensors.Sensor.SPEED, car.sensors.Sensor.RPM ];
 * //NOTE: this is equivalent to doing: var sensors = [ 'speed', 'rpm' ];
 *
 * //call the method
 * car.sensors.get(successCallback, errorCallback, sensors);
 *
 *
 * @example REST - with a filter
 *
 * Request:
 * http://&lt;car-ip&gt;/car/sensors/get?sensors=speed,rpm
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: { speed: 50, rpm: 2000 }
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.get = function (successCallback, errorCallback, sensors) {
	var args = (sensors) ? { sensors: sensors.join(',') } : null;
	window.cordova.exec(successCallback, errorCallback, _ID, 'get', args, false);
};


// Export
module.exports = _self;

