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
 * The abstraction layer for qnx application functionality
 */

var _pps = qnx.webplatform.pps,
	_writerPPS; 

/*
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension 
	 */
		init: function () {
		//writer
		_writerPPS = _pps.create("/pps/services/app-launcher", _pps.PPSMode.DELTA);
		_writerPPS.open(_pps.FileMode.WRONLY);
	},

	/**
	* Creates a request to start an application
	* @param id {String} The id of the application to start
	* @param data {Object} The startup data for the application
	*/
	start: function(id,data){
		var obj = {id:id, cmd:"launch app",app:id,dat:data};
		_writerPPS.write({req:obj});
	}
};