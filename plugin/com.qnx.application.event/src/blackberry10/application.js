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
 * The abstraction layer for qnx application events
 */

var _pps = qnx.webplatform.pps,
	_commandReaderPPS,
	_appdataReaderPPS,
	_windowGroup,
	_webview = require("../../lib/webview"),
	_windowGroupPPS,
	_pauseTrigger,
	_resumeTrigger,
	_reselectTrigger,
	_appdataTrigger,
	_handlers = {},
	_key;

/**
 * Opens the windowgroup PPS object
 */
function init () {
	try {
		_windowGroupPPS = _pps.create("/pps/system/navigator/windowgroup", _pps.PPSMode.DELTA);
		_windowGroupPPS.open(_pps.FileMode.WRONLY);
	} catch (ex) {
		console.error('Error in webworks ext: application.event/application.js:init():', ex);
	}
}
init();

/**
 * Method called when a command event is received
 * @param event {Object} The PPS event for the command object
 */
function onCommand(event) {
	// filter on the id of the target app
	var id = Object.keys(event.changed)[0];

	// is the target app local?
	if (_handlers.hasOwnProperty(id)) {
		//yes, manually trigger the event in the webview
		var webview = window.qnx.webplatform.createWebView({WebViewId: _handlers[id].key}),
			actionEvent = event.data[id].action;

		webview.executeJavaScript("webworks.event.trigger('" + actionEvent + "', '" + encodeURIComponent(JSON.stringify([event.data[id].args])) + "')");
	}
	else {
		//no, use the trigger to dispatch the event in the webview
		if (event && event.data && event.data.hasOwnProperty(_key) && typeof event.data[_key].action != "undefined") {
			switch (event.data[_key].action) {
				case 'reselect':
					if (_reselectTrigger) {
						_reselectTrigger(event.data[_key].args);
					}
					break;
				case 'pause':
					if (_pauseTrigger) {
						_pauseTrigger(event.data[_key].args);
					}
					break;
				case 'resume':
					if (_resumeTrigger) {
						_resumeTrigger(event.data[_key].args);
					}
					break;
			}
		}
	}
};

/**
 * Method called when opened pps object ready
 * Contains data from opened PPS obect
 * @param event {Object} content the appdata object
 */
function onAppDataReady(event) {
	if (_appdataTrigger && event && event[_key]) {
		_appdataTrigger(event[_key]);
	}
}

/**
 * Method called when app data received
 * @param event {Object} The PPS event for the appdata object
 */
function onAppData(event) {
	if (_appdataTrigger && event && event.data && event.data[_key]) {
		_appdataTrigger(event.data[_key]);
	}
}

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Registers the application and sets up the event triggers
	 * @param key {String} The key.	 This should be the application's key.
	 */
	register: function(key) {
		_key = key;
		_windowGroup = this.getWindowGroup(key);

		//listen for app commands
		if (typeof _commandReaderPPS === "undefined") {
			_commandReaderPPS = _pps.create("/pps/system/navigator/command", _pps.PPSMode.DELTA);
			_commandReaderPPS.onNewData = onCommand;
			_commandReaderPPS.open(_pps.FileMode.RDONLY);
		}
		//listen for startup arguments
		if (typeof _appdataReaderPPS === "undefined") {
			_appdataReaderPPS = _pps.create("/pps/system/navigator/appdata", _pps.PPSMode.DELTA);
			_appdataReaderPPS.onFirstReadComplete = onAppDataReady;
			_appdataReaderPPS.onNewData = onAppData;
			_appdataReaderPPS.open(_pps.FileMode.RDONLY);
		}

		// convenience feature to provide apps with their application's window group name.
		var obj = {};
		obj['[n]' + _key] = _windowGroup;
		_windowGroupPPS.write(obj);
	},

	/**
	 * Retrieves the screen window group. Specific to this application.
	 * @param id {String}  [optional] The application's id
	 */
	getWindowGroup: function(id) {
		if (id) {
			if (_handlers.hasOwnProperty(id)) {
				return _handlers[id].windowGroup;
			} else {
				return _webview.windowGroup();
			}
		} else {
			return _webview.windowGroup();
		}
	},

	/**
	 * Adds a local trigger to the app.
	 * Only occurs if the app is loaded locally by the Navigator
	 * @param args {Object} The argument obj
	 * Ex. {
	 * 		id: {String}, // The application id
	 *		key: {Number}, // The webview id
	 *		windowGroup: {String}, // The screen window group string
	 * }
	 */
	addLocalTrigger: function(args) {
		//If there are no registered listeners for this event, create an array to hold them
		if (!_handlers.hasOwnProperty(args.id)) {
			_handlers[args.id] = {key:args.key, windowGroup: args.windowGroup};
		}
	},

	/**
	 * Sets the trigger function to call when a pause event is fired
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setPauseTrigger: function(trigger) {
		_pauseTrigger = trigger;
	},

	/**
	 * Sets the trigger function to call when a resume event is fired
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setResumeTrigger: function(trigger) {
		_resumeTrigger = trigger;
	},

	/**
	 * Sets the trigger function to call when a reselect event is fired
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setReselectTrigger: function(trigger) {
		_reselectTrigger = trigger;
	},

	/**
	 * Sets the trigger function to call when a reselect event is fired
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	setAppDataTrigger: function(trigger) {
		_appdataTrigger = trigger;
	},

	/**
	 * Gets the data passed to the application on startup
	 * @return {Mixed} The data passed to the application on startup, or null
	 */
	getData: function() {
		return (_appdataReaderPPS.data.appdata && _appdataReaderPPS.data.appdata[_key]) ? _appdataReaderPPS.data.appdata[_key] : null;
	}
};


