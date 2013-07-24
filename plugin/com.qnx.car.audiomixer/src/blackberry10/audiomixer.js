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
 * The abstraction layer for mixer functionality
 *
 * @author mlapierre
 * $Id: audiomixer.js 4273 2012-09-25 17:51:22Z mlapierre@qnx.com $
 */

var	_pps = qnx.webplatform.pps,
	_mixerReaderPPS,
	_mixerWriterPPS,
	_volumeReaderPPS,
	_volumeWriterPPS,
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
		out.push({ setting: keys[i], zone: 'all', value: data[keys[i]] });
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
		//audio mixer reader
		_mixerReaderPPS = _pps.createObject("/pps/services/audio/mixer", _pps.PPSMode.DELTA);
		_mixerReaderPPS.onNewData = function(event) {
			if (_triggerUpdate && event && event.data)  {
				_triggerUpdate(dataFormat(event.data));
			}
		};
		_mixerReaderPPS.open(_pps.FileMode.RDONLY);

		//audio mixer writer
		_mixerWriterPPS = _pps.createObject("/pps/services/audio/mixer", _pps.PPSMode.DELTA);
		_mixerWriterPPS.open(_pps.FileMode.WRONLY);

		//volume reader
		_volumeReaderPPS = _pps.createObject("/pps/services/audio/status", _pps.PPSMode.DELTA);
		_volumeReaderPPS.onNewData = function(event) {
			if (_triggerUpdate && event && event.data && !isNaN(event.data["output.speaker.volume"])) {
				_triggerUpdate(dataFormat({ volume: event.data["output.speaker.volume"] }));
			}
			console.log('volume event', event)
		};
		_volumeReaderPPS.open(_pps.FileMode.RDONLY);

		//volume writer
		_volumeWriterPPS = _pps.createObject("/pps/services/audio/control", _pps.PPSMode.DELTA);
		_volumeWriterPPS.open(_pps.FileMode.WRONLY);

	},
	
	/**
	 * Sets the trigger function to call when a mixer event is fired
	 * @param {Function} trigger The trigger function to call when the event is fired
	 */
	setTriggerUpdate: function(trigger) {
		_triggerUpdate = trigger;
	},
	
	/**
	 * Return the audio mixer settings for a specific zone
	 * @param {String} [zone] The Zone to filter the results by
	 * @returns {Object} The requested settings
	 */
	get: function(zone) {

		//aggregate mixer and volume
		var out = _mixerReaderPPS.data.mixer;
		out.volume = _volumeReaderPPS.data.status["output.speaker.volume"];

		return dataFormat(out);
	},	
	/**
	 * Sets one or more audio parameters
	 * @param {String} setting A car.audiomixer.AudioMixerSetting value   
	 * @param {String} zone A car.Zone value   
	 * @param {Number} value The value to save
	 */
	set: function(setting, zone, value) {
		if (typeof setting == 'string' &&
			typeof zone == 'string' && 
			typeof value == 'number') {

			if (setting == 'volume') {
				if (!isNaN(value) && value >= 0 && value <= 100) {
					_volumeWriterPPS.write({
						id: 4,
						msg: "set_output_level", 
						dat: { 
							ctxt: 0, 
							output_id: 0, 
							level: value 
						}
					});
				}
			} else {
				var data = {};
				data[setting] = value;
				_mixerWriterPPS.write(data);
			}
		}
	},
};
