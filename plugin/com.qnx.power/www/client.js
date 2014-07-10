/*
 * Copyright 2014  QNX Software Systems Limited
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
 * @name qnx.power
 * @static
 *
 * Controls shutdown and reboot for the target 
 */

var _self = {},
	_ID = 'com.qnx.power',
	_utils = cordova.require('cordova/utils');


/**
 * @desc Initiate a shutdown request
 * @param {Function} successCallback The function to call when successful.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {String} [reason] The zone to filter the results by.
 * @param {String} fast 1- fast shutdown without logging 0- slow with logging
 * @memberOf module:car.power
 * @method shutdown
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(audioMixerItems) {
 * 		console.log("Shutdown Initiated")			
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 *
 * //call the method
 * car.power.shutdown(successCallback, errorCallback, "userRequest","1");
 *
 *
 */
_self.shutdown = function (successCallback, errorCallback, reason, fast) {
	var args = {};
	if (reason !== null && fast !== null) {
		args.reason = reason;
		args.fast = fast;
		window.cordova.exec(successCallback, errorCallback, _ID, 'shutdown', args, false);
	} else {
		console.error("qnx.power.shutdown requires valid 'reason' and 'fast' parameters.");
	}
};


/**
 * @desc Initiate a reboot request
 * @param {Function} successCallback The function to call when successful.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {String} [reason] The zone to filter the results by.
 * @param {String} fast 1- fast reboot without logging 0- slow with logging
 * @memberOf module:car.power
 * @method reboot
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(audioMixerItems) {
 * 		console.log("Shutdown Initiated")			
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 *
 * //call the method
 * car.power.reboot(successCallback, errorCallback, "userRequest","1");
 *
 *
 */
_self.reboot = function (successCallback, errorCallback, reason, fast) {
	var args = {};
	if (reason !== null && fast !== null) {
		args.reason = reason;
		args.fast = fast;
		window.cordova.exec(successCallback, errorCallback, _ID, 'reboot', args, false);
	} else {
		console.error("qnx.power.reboot requires valid 'reason' and 'fast' parameters.");
	}
};

//Export
module.exports = _self;