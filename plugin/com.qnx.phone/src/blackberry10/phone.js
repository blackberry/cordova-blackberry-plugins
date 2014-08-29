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
 * The abstraction layer for HFP functionality,
 * at the moment this is only one default implementation
 */

var _pps = qnx.webplatform.pps,
	_hfpControlPPS,
	_phoneReadyTrigger,
	_phoneDialingTrigger,
	_phoneIncomingTrigger,
	_phoneCallActiveTrigger;

var lastNumber = null;
var callId = null;

/**
 * phone status, indicates that Handsfree is up and running but not connected to any particular device
 * */
var HFP_INITIALIZED = "HFP_INITIALIZED";
/**
 * Handsfree status, indicates that Handsfree is successfully connected to the device
 * */
var HFP_CONNECTED_IDLE = "HFP_CONNECTED_IDLE";
/**
 * Handsfree status, indicates that Handsfree is dialing out
 * */
var HFP_CALL_OUTGOING_DIALING = "HFP_CALL_OUTGOING_DIALING";
/**
 * phone status, indicates that there is active phone call at the moment
 * */
var HFP_CALL_ACTIVE = "HFP_CALL_ACTIVE";
/**
 * Handsfree status, indicates that there is incoming call
 * */
var HFP_CALL_INCOMING = "HFP_CALL_INCOMING";

/**
 * Defines identifier for HFP service
 * */
var SERVICE_HFP = "SERVICE_HFP";

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension
	 */
	init:function () {
		//readerPPS
		_hfpControlPPS = _pps.create("/pps/services/handsfree/control", _pps.PPSMode.DELTA);

		try{
			_hfpControlPPS.open(_pps.FileMode.WRONLY);
		} catch (e) {
			throw new Error("qnx.phone::init [phone.js] PPS object /pps/services/handsfree/status cannot be opened")
		}

		_hfpStatusPPS = _pps.create("/pps/services/handsfree/status", _pps.PPSMode.DELTA);
		_hfpStatusPPS.onNewData = function (event) {
			if (event && event.data && event.data.cmd_status) {
				var cmd_status = event.data.cmd_status;
				// TODO Add code to process cmd_status, will fire error event with appropriate message (require extra HFP backend works)
			}

			if (event && event.data && event.data.state) {
				var state = event.data.state;

				switch (state) {
					case HFP_CONNECTED_IDLE:
						if (_phoneReadyTrigger) {
							_phoneReadyTrigger({service:SERVICE_HFP});
						}
						break;
					case HFP_CALL_OUTGOING_DIALING:
						// FIXME: The state_param event property should ALWAYS have the phone number for this event
						callId = event.data.state_param || callId;
						if (_phoneDialingTrigger) {
							_phoneDialingTrigger({service:SERVICE_HFP, callId:callId });
						}
						break;
					case  HFP_CALL_ACTIVE:
						// FIXME: The state_param event property should ALWAYS have the phone number for this event
						callId = event.data.state_param || callId;
						if (_phoneCallActiveTrigger) {
							// specifying service and callId, callId will be populated at this moment
							_phoneCallActiveTrigger({service:SERVICE_HFP, callId:callId });
						}
						break;
					case HFP_CALL_INCOMING:
						// FIXME: The state_param event property should ALWAYS have the phone number for this event
						callId = event.data.state_param || callId;
						if (_phoneIncomingTrigger && callId) {
							_phoneIncomingTrigger({service:SERVICE_HFP, callId:callId })
						}
						break;
				}
			}
		};
		try{
			_hfpStatusPPS.open(_pps.FileMode.RDONLY);
		} catch (e) {
			throw new Error("qnx.phone::init [phone.js] PPS object /pps/services/handsfree/status cannot be opened.")
		}

	},

	/**
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setPhoneReadyTrigger:function (trigger) {
		_phoneReadyTrigger = trigger;
	},
	/**
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setPhoneDialingTrigger:function (trigger) {
		_phoneDialingTrigger = trigger;
	},
	/**
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setPhoneIncomingTrigger:function (trigger) {
		_phoneIncomingTrigger = trigger;
	},
	/**
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setPhoneCallActiveTrigger:function (trigger) {
		_phoneCallActiveTrigger = trigger;
	},

	/**
	 * Dial a number
	 * @param {String} Number to dial
	 */
	dial:function (number) {
		if(number) {
			// saving outgoing call phone number to be able to redial later
			lastNumber = number;
			// saving outgoing call phone number as callid
			callId = number;
			if (_hfpStatusPPS.data.status.state == HFP_CONNECTED_IDLE) {
				_hfpControlPPS.write({
					"command":"HFP_CALL",
					"cmd_data":number
				});
			}
		}
	},

	/**
	 * Accept incoming call
	 */
	accept:function () {
		if (_hfpStatusPPS.data.status.state == HFP_CALL_INCOMING) {
			_hfpControlPPS.write({
				"command":"HFP_ACCEPT"
			})
		}
	},

	/**
	 * Hangs up current active call
	 * */
	hangup:function () {
		if (_hfpStatusPPS.data.status.state != HFP_CONNECTED_IDLE) {
			_hfpControlPPS.write({
				"command":"HFP_HANGUP"
			});
		}
	},

	/**
	 * Redials last called number
	 * */
	redial:function () {
		if (lastNumber) {
			this.dial(lastNumber);
		}
	},

	/**
	 * Return current state of the phone
	 * We will translate HFP statuses to generic Phone statuses
	 * @returns {String} current state of the phone
	 * */
	getState:function () {
		var state = _hfpStatusPPS.data.status.state;
		var result = "";
		switch(state) {
			case HFP_CONNECTED_IDLE: result = "PHONE_IDLE"; break;
			case HFP_CALL_ACTIVE: result = "CALL_ACTIVE"; break;
			case HFP_CALL_INCOMING: result = "CALL_INCOMING"; break;
			default: result = "PHONE_NOT_READY"; break;
		}
		return result;
	}
};