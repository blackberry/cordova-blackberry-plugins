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
	_writerPPS,
	_readerPPS,
	_appObjList = {}; 

/**
 * Builds a list of application names and an organized group of application objects
 * for convenient retrieval later.
 */
function buildNameList () {
	var applications;
		
	applications = _readerPPS.data.applications;

	// reinitialize _appObjList
	delete _appObjList;
	_appObjList = {};

	for (var key in applications) {
		var item = applications[key],
			itemData = item.split(",");
			
		// skip if this is the android player
		if (key.indexOf('sys.android') == 0)
			continue;

		// create an app object then adjust for variances in the applications pps object
		var appData = {
			name: itemData[1],
			group: itemData[2],
			id: key,
			uri: 'null',
			icon: 'default'
		};

		// some applications use sys.uri or uri to identify themselves as chromeless browser apps
		if (appData.id.indexOf("sys.uri") != -1) {
			appData.uri = itemData[10];
		} else {
			if (appData.id.indexOf("uri") != -1) {
				appData.uri = itemData[3];
			}
		}

		// some applications have the icon in a different path
		appData.icon = (appData.id.indexOf("uri") === 0) ? itemData[0] : ("/" + key + "/" + itemData[0]);

		// some webworks applications append the icon dimensions in the middle of the path. 
		appData.icon = appData.icon.replace(/{(\d+x\d+)}/g, "");

		_appObjList[appData.name] = appData;

	}
}

/*
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension 
	 */
	init: function () {
		//reader
		_readerPPS = _pps.create("/pps/system/navigator/applications/applications", _pps.PPSMode.DELTA);
		_readerPPS.onNewData = function (event) {
			buildNameList();
			// if (event) {
			// 	if (event.changed) {
			// 		if (_installedTrigger) { 
			// 			_installedTrigger(event); 
			// 		}
			// 	} else if (event.remove) {
			// 		if (_uninstalledTrigger) { 
			// 			_uninstalledTrigger(event); 
			// 		}
			// 	}
			// }
		};
		
		//writer
		_writerPPS = _pps.create("/pps/services/app-launcher", _pps.PPSMode.DELTA);


		// Open the PPS objects
		if(!_readerPPS.open(_pps.FileMode.RDONLY) || !_writerPPS.open(_pps.FileMode.WRONLY)) {

			console.error('qnx.application application.js::init() - Error opening PPS objects.');

			_readerPPS.close();
			_writerPPS.close();
		}
		
		buildNameList();
	},

	/**
	* Creates a request to start an application
	* @param id {String} The id of the application to start
	* @param data {Object} The startup data for the application
	*/
	start: function(id,data){
		var obj = {id:id, cmd:"launch app",app:id,dat:data};
		_writerPPS.write({req:obj});
	},

	/**
	 * Returns the list of applications
	 * @return {Object} A collection of the installed application objects
	 */
	getList: function() {
		return _appObjList;
	}
};