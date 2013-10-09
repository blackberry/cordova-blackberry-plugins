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
 * The abstraction layer for settings functionality
 */

var	_pps = qnx.webplatform.pps,
	_readerPPS,
	_writerPPS,
	_triggerUpdate;

/**
 * Initializes the extension 
 */
function init() {
	try {
		// readerPPS
		_readerPPS = _pps.createObject("/pps/qnxcar/system/settings", _pps.PPSMode.DELTA);
		_readerPPS.onNewData = function(event) {
			if (_triggerUpdate && event && event.data) {
				_triggerUpdate(event.data);
			}
		};

		// writerPPS
		_writerPPS = _pps.createObject("/pps/qnxcar/system/settings", _pps.PPSMode.DELTA);
		
		// Open the PPS objects
		if(!_readerPPS.open(_pps.FileMode.RDONLY) || !_writerPPS.open(_pps.FileMode.WRONLY)) {

			console.error('qnx.settings settings.js::init() - Error opening "/pps/qnxcar/system/settings".');

			_readerPPS.close();
			_writerPPS.close();
		}
	} catch(ex) {
		console.error('qnx.settings/settings.js::init() - Error occurred during initialization.', ex);
	}
};
init();

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Sets the trigger function to call when an event is fired
	 * @param trigger {Function} The trigger function to call when an event is fired
	 */
	setTriggerUpdate: function(trigger) {
		_triggerUpdate = trigger;
	},
	
	/**
	 * Returns system settings
	 * @param settings {Array} A list of settings to get [optional]
	 * @returns {Object} The requested settings
	 * NOTE: the list of settings is not fixed and depends on your system configuration
	 */
	get: function(settings) {
		if (settings && settings.length > 0) {
			var out = {};
			for (var i=0; i<settings.length; i++) {
				out[settings[i]] = _readerPPS.data.settings[settings[i]];
			}
			return out;
		} else {
			return _readerPPS.data.settings;
		}
	},
	
	/**
	 * Sets one or more system settings
	 * @param args {Object} The system settings to set
	 * NOTE: the list of settings is not fixed and depends on your system configuration
	 */
	set: function(settings) {
		if (settings && Object.keys(settings).length > 0) {
			//write args to pps
			_writerPPS.write(settings);
		}
	},
};
