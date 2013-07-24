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
 * Implementation for car.sensors API
 *
 * @author mlapierre
 * $Id: sensors.js 4273 2012-09-25 17:51:22Z mlapierre@qnx.com $
 */

var	_pps = qnx.webplatform.pps,
	_readerPPS,
	_triggerUpdate;

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	
	/**
	 * Initializes the extension 
	 */
	init: function() {
		_readerPPS = _pps.createObject("/pps/qnxcar/sensors", _pps.PPSMode.DELTA);
		_readerPPS.onNewData = function(event) {
			if (_triggerUpdate && event && event.data) {
				_triggerUpdate(event.data);
			}
		};
		_readerPPS.open(_pps.FileMode.RDONLY);
	},
	
	/**
	 * Sets the trigger function to call when an event is fired
	 * @param {Function} trigger The trigger function to call when an event is fired
	 */
	setTriggerUpdate: function(trigger) {
		_triggerUpdate = trigger;
	},
	
	/**
	 * Returns the current vehicle sensors
	 * @param {Array} [sensors] A list of sensors to get
	 * @returns {Object} The requested vehicle sensors
	 */
	get: function(sensors) {
		if (sensors && sensors.length > 0) {
			var out = {};
			for (var i=0; i<sensors.length; i++) {
				out[sensors[i]] = _readerPPS.data.sensors[sensors[i]];
			}
			return out;
		} else {
			return _readerPPS.data.sensors;
		}
	},
};
