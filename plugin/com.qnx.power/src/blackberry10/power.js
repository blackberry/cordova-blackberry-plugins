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
 * The abstraction layer for shutdown functionality
 */

var	_pps = qnx.webplatform.pps,
	_shutdownWriterPPS,
	SHUTDOWN = "shutdown";

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension 
	 */
	init: function () {

		_shutdownWriterPPS = _pps.create("/pps/services/power/shutdown/control", _pps.PPSMode.DELTA);
		_shutdownWriterPPS.open(_pps.FileMode.WRONLY);
	},
	
	/**
	 * Sends the reboot command to the PPS
	 * @param reason {String} - shutdown reason
	 * @param fast {String} 1 - fast reboot without logging, 0 - slow with logging
	 * */
	reboot: function (reason, fast) {
		var payload,
			err;
		if (typeof reason === 'string' &&
			typeof fast === 'string') {

			payload = {
				msg: SHUTDOWN,
				id: "1",
				dat: {"shutdownType": "0", "reason": reason, "fast": fast}
			};
			_shutdownWriterPPS.write(payload);
		} else {
			err = 'qnx.power::reboot [power.js] Required parameters are invalid';
			console.error(err);
			throw new Error(err);
		}
	},	
	/**
	 * Sends the shutdown command to the PPS
	 * @param reason {String} - shutdown reason
	 * @param fast {String} 1 - fast reboot without logging, 0 - slow with logging
	 * */
	shutdown: function (reason, fast) {
		var payload,
			err;
		if (typeof reason === 'string' &&
			typeof fast === 'string') {

			payload = {
				msg: SHUTDOWN,
				id: "1",
				dat: {"shutdownType": "0", "reason": reason, "fast": fast}
			};
			_shutdownWriterPPS.write(payload);
		} else {
			err = 'qnx.power::shutdown [power.js] Required parameters are invalid';
			console.error(err);
			throw new Error(err);
		}
	}
};
