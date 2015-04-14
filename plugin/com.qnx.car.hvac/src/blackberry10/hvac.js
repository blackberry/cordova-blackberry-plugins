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
 * The abstraction layer for hvac functionality
 */

var	_pps = qnx.webplatform.pps,
	_statusPPS,
	_controlPPS,
	_triggerUpdate;


/**
 * Takes in PPS data and formats it for the extension callbacks
 * @param {Object} data The PPS data
 * @return {Array} An array of data formatted as per the extension documentation
 */
function dataFormat(data) {
	if (typeof data != 'object') {
		return null;
	}

	var keys = Object.keys(data);
	var out = [];
	for (var i=0; i<keys.length; i++) {
		var splitKey = keys[i].split('_');
		out.push({ setting: splitKey[0], zone: splitKey[1], value: data[keys[i]] });
	}
	return out;
}

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension
	 */
	init: function() {
		//readerPPS
		_statusPPS = _pps.create("/pps/qnxcar/hvac/status", _pps.PPSMode.DELTA);
		_statusPPS.onNewData = function(event) {
			if (_triggerUpdate && event && event.data) {
				_triggerUpdate(dataFormat(event.data));
			}
		};
		_statusPPS.open(_pps.FileMode.RDONLY);

		//writerPPS
		_controlPPS = _pps.create("/pps/qnxcar/hvac/control", _pps.PPSMode.DELTA);
		_controlPPS.open(_pps.FileMode.WRONLY);
	},

	/**
	 * Sets the trigger function to call when an event is fired
	 * @param {Function} trigger The trigger function to call when an event is fired
	 */
	setTriggerUpdate: function(trigger) {
		_triggerUpdate = trigger;
	},

	/**
	 * Returns HVAC settings
	 * @param settings {Array} [settings] A list of car.hvac.HvacSetting values to filter by
	 * @param zones {Array} [zones] A list of car.zones.Zone values to filter by
	 * @returns {Object} The requested setting values
	 */
	get: function(settings, zones) {
		var doSettingFilter = (settings && settings.length > 0);
		var doZoneFilter = (zones && zones.length > 0);

		//check if we need to filter
		if (doSettingFilter || doZoneFilter) {

			//we need to filter, retrieve all values from PPS
			var out = {};
			var keys = Object.keys(_statusPPS.data.status);

			//iterate through the values in PPS
			for (var i = 0; i < keys.length; i++) {

				//separate the setting from the zone
				var splitKey = keys[i].split('_');	// 0 = setting, 1 = zone

				//apply the setting filter
				if (doSettingFilter && settings.indexOf(splitKey[0]) < 0) {
					continue;
				}

				//apply the zone filter
				if (doZoneFilter && zones.indexOf(splitKey[1]) < 0) {
					continue;
				}

				//if we get here, the value passed both filters
				out[keys[i]] = _statusPPS.data.status[keys[i]]

			}
			//return all filtered values
			return dataFormat(out);
		} else {
			//no filter applied, return all values
			return dataFormat(_statusPPS.data.status);
		}
	},

	/**
	 * Sets an HVAC setting
	 * @param {String} setting The car.hvac.HvacSetting value
	 * @param {String} zone The car.Zone value
	 * @param {Mixed} value The value for the specified setting in the specified zone
	 */
	set: function(setting, zone, value) {
		if (typeof setting 	== 'string' &&
			typeof zone 	== 'string' &&
			typeof value 	!= 'undefined')
		{
			//write data to pps
			setting = setting + '_' + zone;

			_controlPPS.write({
				'msg':'set',
				'id':1,
				'dat':{
					'control':setting,
					'value':value
				}
			});
		}
	}
};
