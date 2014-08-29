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
 * @module qnx.box
 * @description custom extension for the QNX App Portal application, implements box.com APIs
 */

var _ID = "com.qnx.box",
	_utils = cordova.require('cordova/utils'),
	constants = require("./common"),
	events = require("./events"),
	_watches = {};

/**
 * Handles update events for this extension
 * @param data {Array} The updated data provided by the event 
 * @private
 */
function onUpdate(data) {
	var keys = Object.keys(_watches);
	for (var i=0; i<keys.length; i++) {
		setTimeout(_watches[keys[i]](data), 0);
	}
}

/**
 * Created and initialises event handler XHR to get metadata for file or folder
 * @param {Function} success Handler will be invoked when there is a response available
 * @param {Function} error Handler will be invoked when there error happened
 * @returns instance of nely created XHR object
 * */
function prepareXHR(success, error) {
	var requestToken = new XMLHttpRequest();

	requestToken.onreadystatechange = function receiveRequestToken() {
		if (requestToken.readyState == 4) {
			if (requestToken.responseText.length > 0) {
				var responceObj = JSON.parse(requestToken.responseText);
				if (responceObj && success) {
					success(responceObj);
				} else if (!responceObj && error) {
					error("Error: Failed to obtain metadata");
				}
			} else {
				error("Error: Failed to obtain metadata");
			}
		}
	};
	return requestToken;
}

/**
 * Check is there are tokens stored in localStorage , when stored we are assuming that we are authorised
 * @returns true if authorised, false if not
 * */
function isAuthorised() {
	return (localStorage.access_token && localStorage.access_token !== "undefined" && localStorage.refresh_token && localStorage.refresh_token !== "undefined");
}

/**
 * Exports are the publicly accessible functions
 */
module.exports = {

	clientId: null,
	clientSecret: null,

	/**
	 * Watch for PPS object changes
	 * @param {Function} callback The function to call when a change is detected.
	 * @return {String} An ID for the added watch.
	 * @example
	 * 
	 * //define a callback function
	 * function myCallback(myData) {
	 *		//just send data to log
	 *		console.log("Changed data: " , myData);
	 *		}
	 * }
	 * 
	 * var watchId = qnx.box.watchBoxEvents(myCallback);
	 */

	watchBoxEvents: function (callback) {
		var watchId = _utils.createUUID();
	
		_watches[watchId] = callback;
		if (Object.keys(_watches).length === 1) {
			window.cordova.exec(onUpdate, null, _ID, 'startEvents', null, false);
		}

		return watchId;
	},

	/**
	 * Stop watching for PPS changes
	 * @param {Number} watchId The watch ID as returned by <i>qnx.box.watchBoxEvents()</i>.
	 * @example
	 * 
	 * qnx.box.cancelWatch(watchId);
	 */
	cancelWatch: function (watchId) {
		if (_watches[watchId]) {
			delete _watches[watchId];
			if (Object.keys(_watches).length === 0) {
				window.cordova.exec(null, null, _ID, 'stopEvents', null, false);
			}
		}
	},


	/**
	 * Initialises box extension.
	 * @param {Function} success Handler will be invoked when there is a response available
	 * @param {Function} error Handler will be invoked when there error happened
	 * @param {String} clientId Client id provided by box.com when registering application, part of OAuth2 authorisation process
	 * @param {String} clientSecret Client secret provided by box.com when registering application, part of OAuth2 authorisation process
	 * */
	authorise: function (clientId, clientSecret) {
		try {
			var value = {},
				args = {
					clientId: clientId,
					clientSecret: clientSecret
				},
				success = function (data, response) {
					value.success = true;
					value.data = data;
					value.response = response;
					return value;
				},
				fail = function (data, response) {
					value.success = false;
					value.data = data;
					value.response = response;
					return value;
				};

			window.cordova.exec(success, fail, _ID, 'authorise', args, false);
		} catch (e) {
			console.error(e);
		}

	},

	/**
	 * Fires up XHR to get metadata for the folder
	 * @param {Function} success Handler will be invoked when there is a response available
	 * @param {Function} error Handler will be invoked when there error happened
	 * @param {String} id of the folder
	 * */
	getFolder: function (success, error, id) {
		if (!id) {
			error({message: "Error: No Id Specified"});
		} else if (!isAuthorised()) {
			error({message: "Error: Not Authorised"});
		} else {
			var access_token = localStorage.access_token;

			var requestToken = prepareXHR(success, error);

			requestToken.open('GET', constants.BASE_URL + constants.FOLDERS + '/' + id, true); // root folder
			requestToken.setRequestHeader("Authorization", "Bearer " + access_token);
			requestToken.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			requestToken.send();
		}
	},

	/**
	 * Fires up XHR to get metadata for the file
	 * @param {Function} success Handler will be invoked when there is a response available
	 * @param {Function} error Handler will be invoked when there error happened
	 * @param {String} id of the file
	 * */
	getFile: function (success, error, id) {
		if (!id) {
			error({message: "Error: No Id Specified"});
		} else if (!isAuthorised()) {
			error({message: "Error: Not Authorised"});
		} else {
			var access_token = localStorage.access_token;

			var requestToken = prepareXHR(success, error);

			requestToken.open('GET', constants.BASE_URL + constants.FILES + '/' + id, true); // root folder
			requestToken.setRequestHeader("Authorization", "Bearer " + access_token);
			requestToken.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			requestToken.send();
		}
	},

	/**
	 * Function returns URL for the file with specified id
	 * @param {String} id id of the file
	 * */
	getFileURL: function (id) {
		var result = constants.BASE_URL + constants.FILES_CONTENT.replace('{id}', id);
		return result;
	},

	/**
	 * Function returns content of file with specified id
	 * @param {Function} success Callback will be invoked when there are file content available
	 * @param {Function} error Callback will be invoked when there there is an error
	 * @param {String} id id of the file
	 * */
	getFileContent: function (success, error, id) {
		if (!id) {
			error({message: "Error: No Id Specified"});
		} else if (!isAuthorised()) {
			error({message: "Error: Not Authorised"});
		} else {

			var access_token = localStorage.access_token;
			var requestToken = new XMLHttpRequest();

			requestToken.onreadystatechange = function receiveRequestToken() {
				if (requestToken.readyState == 4) {
					if (requestToken && requestToken.responseText.length > 0 && success) {
						var args = {};
						args.id = id;
						args.responseText = requestToken.responseText;
						success(args);
					}
				}
			};

			requestToken.open('GET', constants.BASE_URL + constants.FILES_CONTENT.replace('{id}', id), true);
			requestToken.setRequestHeader("Authorization", "Bearer " + access_token);
			requestToken.send();
		}
	},

	/**
	 * Function returns content of image with specified id
	 * @param {Function} success Callback will be invoked when there are file content available
	 * @param {Function} error Callback will be invoked when there there is an error
	 * @param {String} id id of the file
	 * */
	getImage: function (success, error, id) {
		if (!id) {
			error({message: "Error: No Id Specified"});
		} else if (!isAuthorised()) {
			error({message: "Error: Not Authorised"});
		} else {

			var access_token = localStorage.access_token;
			var requestToken = new XMLHttpRequest();
			requestToken.overrideMimeType('text/plain; charset=x-user-defined')

			requestToken.onreadystatechange = function receiveRequestToken() {
				if (requestToken.readyState == 4) {
					if (success)
						success(requestToken.response);
				}
			};

			requestToken.open('GET', constants.BASE_URL + constants.FILES_CONTENT.replace('{id}', id), true);
			requestToken.setRequestHeader("Authorization", "Bearer " + access_token);
			requestToken.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			requestToken.responseType = 'arraybuffer'
			requestToken.send();
		}
	},

	/**
	 * Function starts download of specified bar file then installs downloaded bar file
	 * Download is specific for box.com
	 * @param {Function} success Callback will be invoked when there are file content available
	 * @param {Function} error Callback will be invoked when there there is an error
	 * @param {String} id File id
	 */
	install: function (success, error, id) {
		return window.cordova.exec(success, error, _ID, 'install', { id:id }, false);
	},

	/**
	 * Function starts uninstallation of specified application
	 * @param {Object} name Application name
	 * @param {Function} success Callback will be invoked when there are file content available
	 * @param {Function} error Callback will be invoked when there there is an error
	 */
	uninstall: function (success, error, name) {
		return window.cordova.exec(success, error, _ID, 'uninstall', { name:name }, false);
	}
};

/**
 * Register implicit getter and setter for Install progress event handlers
 */
Object.defineProperty(module.exports, "onInstallProgress", {
	get:function () {
		return this.installprogresscb;
	},
	/**
	 * Sets the specified callback as callback to handle all Installation progress events
	 * @param cb {Function} callback
	 * */
	set:function (cb) {
		this.installprogresscb = cb;
		//TODO find a cordova solution
		// window.webworks.event.add('blackberry.event', events.EVENT_INSTALLATION_PROGRESS, this.installprogresscb);
	}
});

/**
 * Register implicit getter and setter for UnInstall progress event handlers
 */
Object.defineProperty(module.exports, "onUnInstallProgress", {
	get:function () {
		return this.uninstallprogresscb;
	},
	/**
	 * Sets the specified callback as callback to handle all UnInstallation progress events
	 * @param cb {Function} callback
	 * */
	set:function (cb) {
		this.uninstallprogresscb = cb;
		// window.webworks.event.add('blackberry.event', events.EVENT_UNINSTALLATION_PROGRESS, this.uninstallprogresscb);
	}
});