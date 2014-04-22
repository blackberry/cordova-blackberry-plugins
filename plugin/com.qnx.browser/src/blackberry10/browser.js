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
 * The abstraction layer for qnx browser functionality
 */
var _tabList = {},
	_defaultZOrder = 1,
	_activeZOrder = 2,
	_lastActiveTabId = null,
	_activeTabId = null,
	_x = 0,
	_y = 0,
	_width = screen.width,
	_height = screen.height,
	_url =  "www.qnx.com",
	_triggerUpdate;

/**
 *	Private method to re-order the tabs placing the active tab at the correct z-order
 */
function reorderTabs(tabId) {
	// for (var i = 0; i < _tabList.length; i++) {
	if (_tabList[tabId].id === tabId) {
		_tabList[tabId].zOrder = _activeZOrder;
		
		if (_activeTabId !== null) {
			_lastActiveTabId = _activeTabId;
		}
		
		_activeTabId = tabId;
		_tabList[tabId].visible = true;

	} else {
		_tabList[tabId].zOrder = _defaultZOrder;
		_tabList[tabId].visible = false;
	}
	// }
}

/**
 *	Private method applies the default parameters to newly created webviews
 */
function applyDefaultParams(webview) {
	webview.setGeometry(_x, _y, _width, _height);
	webview.url = _url;
}

/**
 *	Private method to retrive the webview from the webview collection based on
 *	a supplied "tabId"
 */
function getWebview(tabId) {
	// for (var i =  0; i < _tabList.length; i++) {
	if (_tabList[tabId].id === tabId) {	
		return _tabList[tabId];
	}
	// }
}

/**
 *	Private method called when the webview "created" event is 
 *	triggered. Sets the default parameters and attaches the 
 *	event listeners for Location Change and page load progress. 
 */
function onWebviewCreated(webview) {
	console.log("Webview:", webview.id, " created");
	webview.addEventListener("LocationChange", function (e) {
		e = JSON.parse(e);
		if (_triggerUpdate && e.type === "LocationChange") {
			e.webview = webview.id;
			_triggerUpdate(e);
		}
	});
	webview.addEventListener("PropertyLoadProgressEvent", function (e) {
		if (_triggerUpdate && e) {
			_triggerUpdate({
				progress: e,
				type: "PropertyLoadProgressEvent",
				webview: webview.id
			});
		}
	});
	applyDefaultParams(webview);
	_activeTabId = webview.id;
	webview.visible = true;
}

/*
 * Exports are the publicly accessible functions
 */
module.exports = {

	/**
	 * Sets the trigger function to call when a webview event is fired
	 * @param {Function} trigger The trigger function to call when the event is fired
	 */
	setTriggerUpdate: function (trigger) {
		_triggerUpdate = trigger;
	},

	/**
	 *	Sets the default parameters that are applied to each "tab" when its created.
	 *	@param {Object} object containing configuration parameters
	 */
	setDefaultTabParameters: function (args) {
		if (args.x !== undefined) {
			_x = args.x;
		}
		if (args.y !== undefined) {
			_y = args.y;
		}
		if (args.width !== undefined) {
			_width = args.width;
		}
		if (args.height !== undefined) {
			_height = args.height;
		}
		if (args.url !== undefined) {
			_url = args.url;
		}
	},

	/**
	* Creates a request to create a tab
	* @param args {Object} The startup data for the webview
	* @returns {number} the number of the newly created webview
	*/
	addTab: function (args) {
		var webview;
		//TODO: in the future add support so we can pass in config parameters
		// right into the createWebView method instead of an empty object
		webview = qnx.webplatform.createWebView({}, function () {
			onWebviewCreated(webview);
		});
		_tabList[webview.id] = webview;
		return webview.id;
	},

	/**
	* Creates a request to remove a tab
	* @param tabId {Number} the id of the webview to remove
	* @returns {number} the id of the recently removed webview
	*/
	removeTab: function (tabId) {
		var id;
		if (_tabList[tabId].id === tabId) {
			id = _tabList[tabId].id;
			if (_lastActiveTabId !== null) {
				reorderTabs(_lastActiveTabId);
			}
			_tabList[tabId].destroy();
			return id;
		} else {
			console.error("Browser.js removeTab, tabId:" + tabId + " is not valid.");
		}

	},
	/**
	 * Returns the id of the currently active tab
	 * @returns {number} the id of the active tab
	 */
	getActiveTab: function () {
		return _activeTabId;
	},

	/**
	 *	Updates the active tab and sets it as the visible one.
	 *	@returns {number} the id of the now active tab
	 */
	setActiveTab: function (tabId) {
		reorderTabs(tabId);
		return _activeTabId;
	},

	/**
	 *	Updates the url of the active tab
	 *	@param url {String} the url to update the active tab with
	 *	@returns {String} the url passed to the active tab
	 */
	updateUrl: function (url) {
		var webview = getWebview(_activeTabId);
		webview.url = url;
		return url;
	},

	/**
	 *	Triggers the reload method on the active tab
	 */
	reload: function () {
		if (_activeTabId !== null) {
			var webview = getWebview(_activeTabId);
			webview.reload();
		} else {
			console.error("qnx.browser.reload() cannot be called when there are no tabs.");
		}
	},
	/**
	 * Triggers the stop method on the active tab
	 */
	stop: function () {
		if (_activeTabId !== null) {
			var webview = getWebview(_activeTabId);
			webview.stop();
		} else {
			console.error("qnx.browser.stop() cannot be called when there are no tabs.");
		}
	}
};