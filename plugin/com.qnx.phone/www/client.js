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
 * Provide the functionality of a phone
 *
 * <h3>Events</h3>
 * <dl><dt><h4>phoneready</h4></dt>
 * <dd><p>Triggered when phone is idle (no incoming, outgoing, active calls) and ready to accept commands</p>
 * <h5>callback parameter event</h5>
 * <p>{Object}</p>
 * <h5>Example</h5>
 *<pre><code>{
 *      service: {String}       // identifies the phone service
 *}</code></pre></dd></dl>
 *
 * <h4>phonecallactive</h4>
 * <p>Triggered when active phone call (recipient accepted the outgoing call or incoming call accepted locally)</p>
 * <h5>callback parameter event</h5> 
 * <p>{Object}</p>
 * <h5>Example</h5>
 *<pre><code>{
 *      service: {String}		// identifies the phone service
 *      callId: {String}		// incoming call phone number in case of Handsfree, can be BBID etc
 *}</code></pre></dd></dl>
 * 
 * <h4>phoneincoming</h4>
 * <p>Triggered when there is incoming call, phone is ringing</p>
 * <h5>callback parameter event</h5>
 * <p>{Object}</p>
 * <h5>Example</h5>
 * <pre><code>{
 *      service: {String}	// identifies the phone service
 *      callId: {String}	// incoming call phone number in case of Handsfree, can be BBID etc
 *}</code></pre></dd></dl>
 *
 * @module qnx.phone
 * @static
 */


 /*
  * TODO Add more granularity to phone events we need to be 
  * able handle dialing, ringing, on hold, etc as well.
  * TODO currently funnels everything via Handfsree service by default, 
  * make implementation more generic
  */

var _ID = "com.qnx.phone",
	_events = ["phoneready", "phonedialing", "phonecallactive", "phoneincoming"];

_events.map(function (eventName) {
	var channel = cordova.addDocumentEventHandler(eventName),
		success = function (data) {
			channel.fire(data);
		},
		fail = function (error) {
			console.log("Error initializing " + eventName + " listener: ", error);
		};

	channel.onHasSubscribersChange = function () {
		if (this.numHandlers === 1) {
			window.cordova.exec(success, fail, _ID, "startEvent", {eventName: eventName});
		} else if (this.numHandlers === 0) {
			window.cordova.exec(null, null, _ID, "stopEvent", {eventName: eventName});
		}
	};
});


/*
 * Exports are the publicly accessible functions
 */
module.exports = {	
	/**
	 * Defines identifier for HFP service
	 * */
	SERVICE_HFP: "SERVICE_HFP",

	/**
	 * 
	 * Dial a number
	 * @param {String} number Number to dial
	 * @param {String} service [optional] Identifier of the phone service; 
	 * if no parameter specified, function call will be routed to default, currently Handsfree, service 
	 * TODO Currently service is not in use
	 */
	dial: function (number, service) {
		window.cordova.exec(null, null, _ID, 'dial', { number: number });
	},
	/**
	 * Accept incoming call
	 * @param {String} callId ID to identify a call
	 * TODO Currently callId is not in use, because with existing implementation of Handsfree we can have only one active call
	 * @param {String} service [optional] Identifier of the phone service; if no parameter specified, 
	 * function call will be routed to default, currently Handsfree, service 
	 * TODO Currently service is not in use
	 */
	accept: function (callId, service) {
	    window.cordova.exec(null, null, _ID, 'accept');
	},
	/**
	 * Hang up current active call
	 * @param {String} callId ID to identify a call
	 * TODO Currently callId is not in use, because with existing implementation of Handsfree we can have only one active call
	 * @param {String} service [optional]Identifier of the phone service, if no parameter specified, function call will be routed to default, currently Handsfree, service 
	 * TODO Currently service is not in use
	 * */
	hangup: function (callId, service) {
	    window.cordova.exec(null, null, _ID, 'hangup');
	},
	/**
	 * Redial last called number
	 * @param {String} service [optional] Identifier of the phone service; if no parameter specified, function call will be routed to default, currently Handsfree, service 
	 * TODO Currently service is not in use
	 * */
	redial: function (service) {
	    window.cordova.exec(null, null, _ID, 'redial');
	},
	/**
	 * Put a call on hold
	 * @param {String} callId ID to identify a call
	 * TODO Currently callId is not in use, because with existing implementation of Handsfree we can have only one active call
	 * @param {Boolean} value True to put current call on hold, false to release current call from hold
	 * @param {String} service [optional] Identifier of the phone service; if no parameter specified, function call will be routed to default, currently Handsfree, service 
	 * TODO Currently service is not in use
	 * */
	hold: function (callId, value, service) {
		//TODO Implement this function and add appropriate events
	},
	/**
	 * Mute audio input for incoming phone call (mute mic)
	 * @param {String} callId ID to identify a call
	 * TODO Currently callId is not in use, because with existing implementation of Handsfree we can have only one active call
	 * @param {Boolean} value True to mute, false to unmute
	 * @param {String} service [optional] Identifier of the phone service; if no parameter specified, function call will be routed to default, currently Handsfree, service 
	 * TODO Currently service is not in use
	 * */
	mute: function (callId, value, service) {
		//TODO Implement this function and add appropriate events
	},
	/**
	 * Return the current state of the phone
	 * @param {String} service [optional] Identifier of the phone service; if no parameter specified, function call will be routed to default, currently Handsfree, service 
	 * TODO Currently service is not in use
	 * @returns {String} Current state of the phone
	 * */
	getState: function (service) {
   		var value = null,
			success = function (data, response) {
				value = data;
			},
			fail = function (data, response) {
				throw data;
			};

		try {
			window.cordova.exec(success, fail, _ID, 'getState', null);
		} catch (e) {
			console.error(e);
		}
		return value;
	},
	/**
	 * Call this method to return the list of active calls
	 * @param {String} service Identifier of the phone service, if no parameter specified function call will be routed to default, currently Handsfree, service [optional]
	 * TODO Currently service is not in use
	 * @return {Object} List of active calls
	 * */
	getActiveCalls: function (service) {
		//TODO Implement this function
	}
};