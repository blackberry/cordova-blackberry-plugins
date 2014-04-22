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
 * @module qnx.browser
 * @description This plugin exists to enable the creation of a basic browser application. 
 *				DO NOT USE THIS PLUGIN IN ANY NEW APPLICATIONS.
 *
 * @deprecated
 * @private
 */

var _ID = "com.qnx.browser",
	_utils = cordova.require('cordova/utils'),
	_watches = {};


/**
 * Handles update events for this extension
 * @param data {Array} The updated data provided by the event 
 * @private
 */
function onUpdate(data) {
	var keys = Object.keys(_watches);
	for (var i = 0; i < keys.length; i++) {
		setTimeout(_watches[keys[i]](data), 0);
	}
}

/*
 * Exports the publicly accessible functions
 */
module.exports = {

	/**
	 * Watch for webview updates
	 * @param {Function} callback The function to call when a change is detected.
	 * @return {String} An ID for the added watch.
	 * @memberOf module:car.browser 
	 * @method watchTab
	 * @example
	 *
	 * //define a callback function
	 * function myCallback(tabUpdates) {
	 *		//iterate through the changed items
	 *		for (var i=0; i&lt;tabUpdates.length; i++) {
	 *			//Currently updates related to "LocationChange" and  "PropertyLoadProgressEvent"
	 *			//This is iteration one and could be expanded upon
	 *			console.log("tab updates: " + tabUpdates[i] + '\n')	
	 *		}
	 * }
	 * 
	 * var watchId = car.browser.watchTab(myCallback);
	 */
	watchTab : function (callback) {
		var watchId = _utils.createUUID();
		
		_watches[watchId] = callback;
		if (Object.keys(_watches).length === 1) {
			window.cordova.exec(onUpdate, null, _ID, 'startEvents', null, false);
		}

		return watchId;
	},

	/**	
	 * Stop watching webview changes
	 * @param {Number} watchId The watch ID returned by <i>car.browser.watchTab()</i>.
	 * @memberOf module:car.browser
	 * @method cancelWatch
	 * @example
	 * 
	 * car.browser.cancelWatch(watchId);
	 */
	cancelWatch : function (watchId) {
		if (_watches[watchId]) {
			delete _watches[watchId];
			if (Object.keys(_watches).length === 0) {
				window.cordova.exec(null, null, _ID, 'stopEvents', null, false);
			}
		}
	},

	/**	
	 * Set the default parameters to apply to a webview when its created
	 * @param {Function} success The method to call when setDefaultTabParameters completes successfully
	 * @param {Function} fail The method to call when setDefaultTabParameters doesn't complete successfully
	 * @memberOf module:car.browser
	 * @method setDefaultTabParameters
	 * @example
	 * 
	 * //define a callback functions
	 * function success() {
	 *		//console.log("Default paramters successfully set");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("Failed to set default webview parameters", e);
	 * }
	 * car.browser.setDefaultTabParameters(success, failure, 0, 0, 800, 400, "www.qnx.com");
	 */
	setDefaultTabParameters: function (success, fail, x, y, width, height, url) {

		var options = {};
		if (x !== undefined) {
			options.x = x;
		}
		if (y !== undefined) {
			options.y = y;
		}
		if (width !== undefined) {
			options.width = width;
		}
		if (height !== undefined) {
			options.height = height;
		}
		if (url !== undefined) {
			options.url = url;
		}

		try {
			window.cordova.exec(success, fail, _ID, 'setDefaultTabParameters', options);
		} catch (e) {
			console.error(e);
		}
	},
	/**
	 * Create a new tab(webview)
	 * @param {Function} success The function to call when the tab is created successfully.
	 * @param {Function} failure The function to call when there is a error creating a tab.
	 * @return {String} An ID for the newly created tab.
	 * @memberOf module:car.browser 
	 * @method addTab
	 * @example
	 *
	 * //define callback functions
	 * function success(tabId) {
	 *		console.log("Tab: ", tabId, " was created ");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error creating a tab: ", e);
	 * }
	 * car.browser.addTab(success, failure);
	 */
	addTab: function (success, fail) {
		try {
			window.cordova.exec(success, fail, _ID, 'addTab');
		} catch (e) {
			console.error(e);
		}
	},
	/**
	 * Remove a created tab(webview)
	 * @param {Function} success The function to call the tab is removed successfully.
	 * @param {Function} failure The function to call when there is a error removing a tab.
	 * @return {String} The id of the removed tab.
	 * @memberOf module:car.browser 
	 * @method removeTab
	 * @example
	 *
	 * //define callback functions
	 * function success(tabId) {
	 *		console.log("Tab: ", tabId, " was removed ");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error removing a tab: ", e);
	 * }
	 * car.browser.removeTab(success, failure, 5);
	 */
	removeTab: function (success, fail, tabId) {
		var args = {};
		if (tabId === undefined || !tabId || tabId < 0) {
			console.error("qnx.browser.removeTab requires a valid tabId, please check your input parameter: ", tabId);
			return;
		} else {
			args.id = tabId;
		}

		try {
			window.cordova.exec(success, fail, _ID, 'removeTab', args);
		} catch (e) {
			console.error(e);
		}
	},

	/**
	 * Get the active tab(webview) id.
	 * @param {Function} success The function to call with the tabId.
	 * @param {Function} failure The function to call when there is a error getting the tabId.
	 * @return {String} The id of the active tab.
	 * @memberOf module:car.browser 
	 * @method getActiveTab
	 * @example
	 *
	 * //define callback functions
	 * function success(tabId) {
	 *		console.log("Tab: ", tabId, " is the active tab ");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error getting the active tab: ", e);
	 * }
	 * car.browser.getActiveTab(success, failure);
	 */
	getActiveTab: function (success, fail) {
		try {
			window.cordova.exec(success, fail, _ID, 'getActiveTab');
		} catch (e) {
			console.error(e);
		}
	},
	/**
	 * Set the active tab(webview) id.
	 * @param {Function} success The function to call with the active tab id.
	 * @param {Function} failure The function to call when there is a error setting the tabId.
	 * @return {String} The id of the active tab.
	 * @memberOf module:car.browser 
	 * @method setActiveTab
	 * @example
	 *
	 * //define callback functions
	 * function success(tabId) {
	 *		console.log("Tab: ", tabId, " is now the active tab ");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error setting the active tab: ", e);
	 * }
	 * car.browser.setActiveTab(success, failure, 5);
	 */
	setActiveTab: function (success, fail, tabId) {
		var args = {};
		if (tabId !== undefined && tabId && tabId > 0) {
			args.id = tabId;
			try {
				window.cordova.exec(success, fail, _ID, 'setActiveTab', args);
			} catch (e) {
				console.error(e);
			}
		} else {
			console.error("qnx.browser.setActiveTab() requires valid param: tabId");
		}
	},

	/**
	 * Update the url of the currently active tab(webview).
	 * @param {Function} success The function to call with the updated url.
	 * @param {Function} failure The function to call when there is a error setting the url.
	 * @return {String} The updated url of the active tab.
	 * @memberOf module:car.browser 
	 * @method updateUrl
	 * @example
	 *
	 * //define callback functions
	 * function success(url) {
	 *		console.log("The url of the active tabs is now:",url);
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error updating the url: ", e);
	 * }
	 * car.browser.updateUrl(success, failure, "www.qnx.com");
	 */
	updateUrl: function (success, fail, url) {
		var args = {};
		if (url === undefined || !url) {
			console.error("qnx.browser.updateUrl requires a valid url, please check your input parameter: ", url);
			return;
		} else {
			args.url = url;
		}

		try {
			window.cordova.exec(success, fail, _ID, 'updateUrl', args);
		} catch (e) {
			console.error(e);
		}
	},

	/**
	 * Reload the active tab(webview).
	 * @param {Function} success The function to call when reload succeeds.
	 * @param {Function} failure The function to call when there is a error reloading the tab.
	 * @memberOf module:car.browser 
	 * @method reload
	 * @example
	 *
	 * //define callback functions
	 * function success(tabId) {
	 *		console.log("Tab was successfully reloaded");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error reloading the tab: ", e);
	 * }
	 * car.browser.reload(success, failure);
	 */
	reload: function (success, fail) {
		try {
			window.cordova.exec(success, fail, _ID, 'reload');
		} catch (e) {
			console.error(e);
		}
	},

	/**
	 * Stop the active tab(webview) from loading.
	 * @param {Function} success The function to call when the stop command succeeds.
	 * @param {Function} failure The function to call when there is a error stopping the tab.
	 * @memberOf module:car.browser 
	 * @method stop
	 * @example
	 *
	 * //define callback functions
	 * function success(tabId) {
	 *		console.log("Tab was successfully reloaded");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error reloading the tab: ", e);
	 * }
	 * car.browser.stop(success, failure);
	 */
	stop: function (success, fail) {
		try {
			window.cordova.exec(success, fail, _ID, 'stop');
		} catch (e) {
			console.error(e);
		}
	}
};