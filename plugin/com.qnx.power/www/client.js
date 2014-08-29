/*
 * Copyright 2014. 
 * QNX Software Systems Limited. ALl rights reserved.
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
 * @module qnx.power
 * @static
 * @description Controls the shutdown and reboot of the target.
 */

var _self = {},
	_ID = 'com.qnx.power',
	_utils = cordova.require('cordova/utils');


/**
 * @description Initiate a shutdown request.
 * @param {Function} successCallback The function to call when successful.
 * @param {Function} [errorCallback] The function to call if there's an error.
 * @param {String} [reason] The zone to filter the results by.
 * @param {String} fast Whether to use fast or slow shutdown. Set to "1" for fast shutdown(without
 *                      logging), otherwise set to "0" for slow showdown (with with logging).
 * @memberOf module:qnx.power
 * @method shutdown
 * @example 
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
 * qnx.power.shutdown(successCallback, errorCallback, "userRequest","1");
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
 * @description Initiate a reboot request.
 * @param {Function} successCallback The function to call when successful.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {String} [reason] The zone to filter the results by.
 * @param {String} fast Whether to use fast or slow reboot. Set to "1" for fast reboot (without
 *                      logging), otherwise set to "0" for slow reboot (with with logging).
 * @memberOf module:qnx.power
 * @method reboot
 * @example 
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
 * qnx.power.reboot(successCallback, errorCallback, "userRequest","1");
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