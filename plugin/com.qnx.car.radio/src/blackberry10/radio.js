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
 * The abstraction layer for radio functionality.
 */

var	_pps = qnx.webplatform.pps,
	_tunersPPS = {},
	_statusPPS,
	_controlPPS,
	_zonePPS,
	_presetsPPS,
	_presetsPPSWriter,
	_triggerUpdate,
	_triggerPresets,
	//define here until there is a better way to fetch them
	TUNER_LIST = ['am', 'fm'];

/**
 * Get the current status.
 * @return {Object} A radio status object.
 * Ex:
 *
 * {
 * 	tuner: 'fm',
 * 	station: 91.5,
 * 	artist: 'Bjork',
 * 	artwork:
 * 	genre: 'News & Entertainment',
 * 	song: 'All is Full of Love',
 * 	stationName: 'CBC Radio 1',
 * 	hd: false
 * }
 */
function getStatus() {
	var tuner = _zonePPS.data.zones.all,
			status = _tunersPPS[tuner].data[tuner],
			obj = {
							tuner				: tuner,
							station 		: status.station,
							artist			: status.artist,
							// enable this when we support it, currently service returns undefined
							// artwork			: status.artwork,
							genre				: status.genre,
							song				: status.song,
							stationName	: status.stationName,
							hd					: status.hd
						};
	return obj;
}

/**
 * Returns the list of available tuners.
 * @return {Object} An object containing attributes corresponding to each tuner object. The attribute name
 * is the name of the tuner.
 */
function getTuners() {
	var tuners = [];

	for( key in _tunersPPS) {
		var tuner = {
			tuner: key,
			//seems the service isn't providing type anymore so hardcode for now?
			type: 'analog',
			settings: {
				rangeMin: _tunersPPS[key].data[key].range.min,
				rangeMax: _tunersPPS[key].data[key].range.max,
				rangeStep: _tunersPPS[key].data[key].range.step
			}
		}

		tuners.push(tuner);
	}
	return tuners;
};

/**
 * Get the presets for the current tuner. Optionally, a tuner name can be specified, returning
 * presets for the specified tuner.
 * @param {String} tuner The tuner for the presets
 * @return {Array} An array of presets.
 */
function getPresets(tuner) {
		var presets = [],
				ppsPresets = _presetsPPS.data.presets[tuner];

		for (var i=0; i<ppsPresets.length; i++) {
			presets.push({
				tuner: tuner,
				group: tuner + '1',
				index: i,
				station: ppsPresets[i]
			});
		}
		return presets;
};

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension
	 */
	init: function() {

		_statusPPS = _pps.create("/pps/qnxcar/radio/status", _pps.PPSMode.DELTA);
		_statusPPS.open(_pps.FileMode.RDONLY);

		if(_statusPPS.data.status.ready) {

			var tuner;
			for( var i = 0; i < TUNER_LIST.length; i++ ){

				tuner = _pps.create("/pps/qnxcar/radio/tuners/"+TUNER_LIST[i], _pps.PPSMode.DELTA);
				tuner.onNewData = function(data) {
					if(getStatus().tuner === data.objName) {
						if (_triggerUpdate) {
							_triggerUpdate(getStatus());
						}
					}
				}
				tuner.open(_pps.FileMode.RDONLY);
				_tunersPPS[TUNER_LIST[i]] = tuner;
			}

			_zonePPS = _pps.create("/pps/qnxcar/radio/zones", _pps.PPSMode.DELTA);
			_zonePPS.onNewData = function(data) {
				if (_triggerUpdate) {
					_triggerUpdate(getStatus());
				}
			};
			_zonePPS.open(_pps.FileMode.RDONLY);

			_presetsPPS = _pps.create("/pps/qnxcar/radio/presets", _pps.PPSMode.DELTA);
			_presetsPPS.onNewData = function(data) {
				if (_triggerPresets && data && data.changed) {
					var tuners = getTuners();
					for (var i=0; i<tuners.length; i++) {
						if (typeof data.changed[tuners[i].tuner] !== 'undefined') {
							_triggerPresets(getPresets(tuners[i].tuner));
						}
					}
				}
			};
			_presetsPPS.open(_pps.FileMode.RDONLY);

			_presetsPPSWriter = _pps.create("/pps/qnxcar/radio/presets", _pps.PPSMode.DELTA);
			_presetsPPSWriter.open(_pps.FileMode.WRONLY);

			_controlPPS = _pps.create("/pps/qnxcar/radio/control", _pps.PPSMode.DELTA);
			_controlPPS.open(_pps.FileMode.WRONLY);

		} else {
			console.error("Radio service isn't ready");
		}


	},

	/**
	 * Sets the trigger function to call when a status event is fired
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setTriggerUpdate: function(trigger) {
		_triggerUpdate = trigger;
	},


	/**
	 * Sets the trigger function to call when a preset event is fired
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setTriggerPresets: function(trigger) {
		_triggerPresets = trigger;
	},

	/**
	 * Returns the list of available tuners.
	 * @return {Object} An object containing attributes corresponding to each tuner object. The attribute name
	 * is the name of the tuner.
	 */
	getTuners: function() {
		return getTuners();
	},

	/**
	 * Sets the active tuner by name.
	 * @param tuner {String} The name of tuner to set as active
	 * @param zone {String} The name of the zone to set the active tuner on
	 */
	setTuner: function(tuner, zone) {
		_controlPPS.write({
			'msg':'setActiveTuner',
			'id':2,
			'dat':{'tuner':tuner, 'zone':zone}
		});
	},

	/**
	 * Tune to a specific station, optionally targeting a specific tuner. If the specified
	 * tuner is not the active tuner, then the station will be automatically selected the next
	 * time that tuner is set as active.
	 * @param station {Number} The target station
	 * @param tuner {String} (optional) The target tuner name
	 */
	setStation: function(station, tuner) {
		_controlPPS.write({
			'msg':'tune',
			'id':2,
			'dat':{"tuner":tuner, "station":station}
		});
	},

	/**
	 * Get the presets for the current tuner. Optionally, a tuner name can be specified, returning
	 * presets for the specified tuner.
	 * @param {String} tuner The tuner for the presets
	 * @return {Array} An array of presets.
	 */
	getPresets: function(tuner) {
		return getPresets(tuner);
	},

	/**
	 * Sets the current station as a preset at the specified index. A station and tuner can optionally
	 * be specified to set the non-current station as a preset, and/or for the non-active tuner.
	 * @param index {Number} The preset index
	 * @param group {Number} The preset group
	 * @param station {Number} (optional) The station to set as the preset. If not specified, the current station will be used.
	 * @param tuner {String} (optional) The station's tuner. If not specified, the active tuner will be used.
	 */
	setPreset: function(index, group, station, tuner) {
		var obj = {};

		obj[tuner] = _presetsPPS.data.presets[tuner];
		obj[tuner][index] = station.toFixed();

		_presetsPPSWriter.write(obj);
	},

	/**
	 * Seek for the next radio station in the given direction
	 * @param direction {String} The direction to seek ('up' or 'down')
	 * @param tuner {String} the tuner to seek on
	 */
	seek: function(direction, tuner) {
		_controlPPS.write({
			'msg':'seek',
			'id':2,
			'dat':{"tuner":tuner, "direction":direction}
		});
	},

	/**
	 * Scan for available radio stations in the given direction.
	 * @param {String} direction The direction to scan ('up' or 'down')
	 * @param {String} tuner The tuner to start scanning
	 */
	scan: function(direction, tuner) {
		_controlPPS.write({
			'msg':'scan',
			'id':2,
			'dat':{ tuner: tuner, direction: direction}
		});
	},

	/**
	 * Stop station scanning if in progress.
	 */
	scanStop: function() {
			_controlPPS.write({
				'msg':'scanStop',
				'id':2,
				'dat':{"tuner":getStatus().tuner}
			});
	},

	/**
	 * Get the current status.
	 * @return {Object} A radio status object.
	 */
	getStatus: function() {
		return getStatus();
	},
};
