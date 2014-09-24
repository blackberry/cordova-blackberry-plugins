/*
 * Copyright 2014.
 * QNX Software Systems Limited. All rights reserved.
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
 * @description Enables the creation of a basic browser application.
 *              Tabs for the browser are represented by WebViews.
 * 
 */

var _ID = "com.qnx.browser",
	_utils = cordova.require('cordova/utils'),
	_watches = {};


/**
 * @description Handles update events for this plugin.
 * @param {Array} data The updated data provided by the event.
 *
 */
function onUpdate(data) {
	var keys = Object.keys(_watches),
		i;
	for (i = 0; i < keys.length; i++) {
		setTimeout(_watches[keys[i]](data), 0);
	}
}

/*
 * Exports the publicly accessible functions.
 */
module.exports = {

	/**
	 * @description Watch for updates to a tab. A tab represents a WebView.
	 *              <p>The following events cause an update:
	 *              <ul>
	 *              <li>LocationChange: The URL in the WebView changed.</li>
	 *              <li>PropertyLoadProgressEvent: New properties are being loaded into the WebView.</li>
	 *              </ul></p>
	 * @param {Function} callback The function to call when a change is detected.
	 * @return {String} The identifier for the callback that was added.
	 * @memberOf module:car.browser 
	 * @method watchTab
	 * @example
	 *
	 * //Define a callback function.
	 * function myCallback(tabUpdates) {
	 *		//Iterate through the changed items.
	 *		for (var i=0; i&lt;tabUpdates.length; i++) {
	 *			//Currently updates related to "LocationChange" and "PropertyLoadProgressEvent".
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
	 * @description Stop monitoring the tab for changes.
	 *              A tab represents a WebView.
	 * @param {Number} watchId The watch ID returned by <code>car.browser.watchTab()</code>.
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
	 * @description Initialize the browser plugin.
	 * @param {String} chromeUrl The URL of the WebView that handles all the user interface and application logic.
	 * @param {Number} uiHeight The height you want your WebView to be when the overlay is hidden.
	 * @param {Number} overlayHeight The height you want for your WebView to be when the overlay is visible.
	 * @memberOf module:car.browser
	 * @method init
	 * @example
	 * 
	 *	var	chromeUrl = "local:///index.html",
	 *		uiHeight = 50,
	 *		overlayHeight = 50;
	 *
	 * car.browser.init(chromeUrl, uiHeight, overlayHeight);
	 */
	init : function (chromeUrl, uiHeight, overlayHeight) {
		var args = {};

		if (chromeUrl && chromeUrl !== undefined && chromeUrl !== '') {
			args.url = chromeUrl;
		} else {
			console.error("Error: qnx.browser.init requires a valid url to be passed in '", chromeUrl, "' is not valid");
		}
		
		if (uiHeight && uiHeight !== undefined) {
			args.uiHeight = uiHeight;
		} else {
			console.error("Error: qnx.browser.init requires a valid uiHeight to be passed in '", uiHeight, "' is not valid");
		}

		if (overlayHeight && overlayHeight) {
			args.overlayHeight = overlayHeight;
		} else {
			console.error("Error: qnx.browser.init requires a valid overlayHeight to be passed in '", overlayHeight, "' is not valid");
		}

		try {
			window.cordova.exec(null, null, _ID, 'init', args);
		} catch (e) {
			console.error(e);
		}
	},

	/**	
	 * @description Set the default parameters to apply to a tab when it's created.
	 *              A tab represents a WebView.
	 * @param {Function} success The function to call when <code>setDefaultTabParameters</code> successfully completes.
	 * @param {Function} fail The function to call when <code>setDefaultTabParameters</code> doesn't successfully completes.
	 * @param {Number} x The x-axis location for the top-left corner of the WebView.
	 * @param {Number} y The y-axis location for the top-left corner of the WebView.
	 * @param {String} url The default URL to load.
	 * @memberOf module:car.browser
	 * @method setDefaultTabParameters
	 * @example
	 * 
	 * //Define callback functions.
	 * function success() {
	 *		console.log("Default paramters successfully set");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("Failed to set default WebView parameters", e);
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
	 * @description Hide the overlay.
	 * @param {Function} success The function to call when the overlay is hidden.
	 * @param {Function} failure The function to call if there's an error hiding the overlay.
	 * @memberOf module:car.browser 
	 * @method hideOverlay
	 * @example
	 *
	 * //Define callback functions.
	 * function success() {
	 *		console.log("Overlay hidden");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error hiding the overlay: ", e);
	 * }
	 * car.browser.hideOverlay(success, failure);
	 */
	hideOverlay: function (success, fail) {
		try {
			window.cordova.exec(success, fail, _ID, 'hideOverlay');
		} catch (e) {
			console.error(e);
		}
	},

	/**
	 * @description Show the overlay. The the overlay is shown, it's made visible to the user.
	 * @param {Function} success The function to call when the overlay is shown.
	 * @param {Function} failure The function to call if there is an error showing the overlay.
	 * @memberOf module:car.browser 
	 * @method showOverlay
	 * @example
	 *
	 * //Define callback functions.
	 * function success() {
	 *		console.log("Overlay shown");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error showing the overlay: ", e);
	 * }
	 * car.browser.showOverlay(success, failure);
	 */
	showOverlay: function (success, fail) {
		try {
			window.cordova.exec(success, fail, _ID, 'showOverlay');
		} catch (e) {
			console.error(e);
		}
	},

	/**
	 * @description Create a new tab. A tab represents a WebView.
	 * @param {Function} success The function to call when the tab is created successfully.
	 * @param {Function} failure The function to call when there is a error creating a tab.
	 * @param {Object} [options] The settings used to configure a WebView. 
	 * @return {String} The identifier for the new WebView.
	 * @memberOf module:car.browser 
	 * @method addTab
	 * @example
	 *
	 * //Define callback functions.
	 * function success(tabId) {
	 *		console.log("Tab: ", tabId, " was created ");
	 * }
	 * 
	 * function failure(e) {
	 *		console.error("There was an error creating a tab: ", e);
	 * }
	 * car.browser.addTab(success, failure);
	 */
	addTab: function (success, fail, options) {
		var args = {};

		if (options.x !== undefined) {
			args.x = options.x;
		}
		if (options.y !== undefined) {
			args.y = options.y;
		}
		if (options.width !== undefined) {
			args.width = options.width;
		}
		if (options.height !== undefined) {
			args.height = options.height;
		}
		if (options.url !== undefined) {
			args.url = options.url;
		}

		try {
			window.cordova.exec(success, fail, _ID, 'addTab', args);
		} catch (e) {
			console.error(e);
		}
	},
	/**
	 * @description Remove a created tab. A tab is represents a WebView.
	 * @param {Function} success The function to call the tab is successfully removed.
	 * @param {Function} failure The function to call when there's an error removing a tab.
	 * @return {String} tabId The identifier of the tab that was removed.
	 * @memberOf module:car.browser 
	 * @method removeTab
	 * @example
	 *
	 * //Define callback functions.
	 * function success(tabId) {
	 *		console.log("Tab: ", tabId, " was removed");
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
	 * @description Get the active tab. The active tab is the identifier of the WebView.
	 * @param {Function} success The function to call with the identifier of the active WebView.
	 * @param {Function} failure The function to call when there is a error getting the identifier of the active WebView.
	 * @return {String} The identifier of the active WebView.
	 * @memberOf module:car.browser 
	 * @method getActiveTab
	 * @example
	 *
	 * //Define callback functions.
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
	 * @description  Set the active tab using the identifier. The active tab represents the active WebView.
	 * @param {Function} success The function to call with the active WebView identifier.
	 * @param {Function} failure The function to call when there is a error setting the WebView identifier.
	 * @return {String} tabId The identifier of the active WebView.
	 * @memberOf module:car.browser 
	 * @method setActiveTab
	 * @example
	 *
	 * //Define callback functions.
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
	 * @description Update the URL of the currently active tab. The active tab represents the active WebView.
	 * @param {Function} success The function to call with the updated URL.
	 * @param {Function} failure The function to call when there is a error setting the URL.
	 * @return {String} url The new URL for the active WebView.
	 * @memberOf module:car.browser 
	 * @method updateUrl
	 * @example
	 *
	 * //Define callback functions.
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
	 * @description Reload the active tab. The active tab represents the active WebView.
	 * @param {Function} success The function to call when reload succeeds.
	 * @param {Function} failure The function to call when there is a error reloading the WebView.
	 * @memberOf module:car.browser 
	 * @method reload
	 * @example
	 *
	 * //Define callback functions.
	 * function success() {
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
	 * @description Stop the active tab from loading. The active tab represents the active WebView.
	 * @param {Function} success The function to call when the stop command succeeds.
	 * @param {Function} failure The function to call when there is a error stopping the WebView.
	 * @memberOf module:car.browser 
	 * @method stop
	 * @example
	 *
	 * //Define callback functions.
	 * function success(tabId) {
	 *		console.log("The tab was successfully reloaded");
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