/*
 * Copyright 2013-2014. 
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
 *
 * @module qnx.phone
 * @static
 * @description Provide the functionality of a phone.<br/><br/>
 *
 * <h2>Events</h2>
 * <dl><dt><h3>phoneready</h3></dt>
 * <dd><p>Triggered when the phone is idle (no incoming, outgoing, or active calls) and ready to accept commands.</p>
 * <h4>Callback parameter event</h4>
 * <p>{Object}</p>
 * <h4>Example</h4>
 *<pre><code>{
 *      service: {String}       // identifies the phone service
 *}</code></pre></dd></dl>
 *
 * <h3>phonecallactive</h3>
 * <p>Triggered when an active phone call is made (recipient accepted the outgoing call or locally accepted the incoming call).</p>
 * <h4>Callback parameter event</h4> 
 * <p>{Object}</p>
 * <h4>Example</h4>
 *<pre><code>{
 *      service: {String}		// identifies the phone service
 *      callId: {String}		// incoming call phone number in case of hands-free call, can be BBID etc.
 *}</code></pre></dd></dl>
 * 
 * <h3>phoneincoming</h3>
 * <p>Triggered when there's incoming call (phone is ringing).</p>
 * <h4>Callback parameter event</h4>
 * <p>{Object}</p>
 * <h4>Example</h4>
 * <pre><code>{
 *      service: {String}	// identifies the phone service
 *      callId: {String}	// incoming call phone number in the case of hands-free call, can be BBID etc.
 *}</code></pre></dd></dl>
 *
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
 * Exports are the publicly accessible functions.
 */
module.exports = {	
	/**
	 * Defines the identifier for the Hands-Free Profile(HFP) service.
	 * */
	SERVICE_HFP: "SERVICE_HFP",

	/**
	 * 
	 * @description Dial a number.
	 * <p><b>Note</b>: The <code>service</code> parameter is reserved for future use. </p>
	 * <p>When no parameters are specified, the function call is routed to the default service (Hands-Free service).</p>
     * @param {String} number The number to dial.
	 * @param {String} [service] Reserved for future use. Identifier of the phone service.
	 */
	dial: function (number, service) {
		window.cordova.exec(null, null, _ID, 'dial', { number: number });
	},
	/**
	 * @description Accept an incoming call.
	 * <p><b>Note</b>: The <code>callId</code> and <code>service</code> parameters are reserved for future use.</p>
	 * @param {String} callId Reserved for future use. <p>ID to identify a call.
	 *        With existing implementations of the Hands-free service, there's only one active call.</p>
	 * @param {String} [service] Reserved for future use. <p>Identifier of the phone service. 
	 *        When no parameter is specified, the function call is routed to the default service
	 *        (currently the Hands-free service).</p>
	 */
	accept: function (callId, service) {
	    window.cordova.exec(null, null, _ID, 'accept');
	},
	/**
	 * @description Hang up current active call.
	 * <p><b>Note</b>: The <code>callId</code> and <code>service</code> parameters are reserved for future use.</p>
	 * @param {String} [callId] Reserved for future use. <p>The identifier that identifies a call.
	 *        With existing implementations of the Hands-free service, there's only one active call.</p>
	 * @param {String} [service] Reserved for future use. <p>Identifier of the 
	          phone service, if no parameter specified, function call is routed to the default service (currently the Hands-free service).</p> 
	 *
	 * */
	hangup: function (callId, service) {
	    window.cordova.exec(null, null, _ID, 'hangup');
	},
	/**
	 * @description Redial last called number.
	 * <p><b>Note</b>: The <code>callId</code> parameter is reserved for future use. </p>
	 * @param {String} [service] Reserved for future use. 
	 *        <p>Identifier of the phone service. If no parameter is specified, the function 
	 *        is routed to the default service (currently the Hands-free service). </p>
	 * 
	 */
	redial: function (service) {
	    window.cordova.exec(null, null, _ID, 'redial');
	},
	/**
	 * @description Return the current state of the phone.
	 * <p><b>Note</b>: The <code>service</code> parameter isn't available for use.
	 * @param {String} [service] Reserved for future use. <p> Identifier of the phone service.
	 *        When no parameter specified, function call is routed to the default service (currently the Hands-free service).</p>
	 * @returns {String} The current state of the phone.
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
	}
};