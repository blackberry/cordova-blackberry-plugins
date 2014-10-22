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
	_defaultZOrder = -2,
	_lastActiveZOrder = -1,
	_activeZOrder = 0,
	_chromeZOrder = 1,
	_uiWebviewZOrder = 2,
	_uiWebview,
	_lastActiveTabId = null,
	_activeTabId = null,
	_x = 0,
	_y = 0,
	_width = screen.width,
	_height = screen.height,
	_url =  "http://www.qnx.com",
	_overlay,
	_overlayHeight,
	_chromeHeight,
	_tabTrigger = [],
	_chromeWebview,
	resourceRequest = require("../../lib/webkitHandlers/networkResourceRequested");

/**
 *	Private method to triggers updates on all the watch functions.
 */
function triggerUpdate(e) {
	var callback,
		i;

	for (i = 0; i < _tabTrigger.length; i++) {
		callback = _tabTrigger[i];
		callback(e);
	}
}

/**
 *	Private method to re-order the tabs placing the active tab at the correct z-order
 */
function reorderTabs(tabId, removedTab) {
	var tab,
		killedTab = removedTab ? removedTab : -1;

	//Set the tab visibility and z-order first
	//so we don't see the other tabs shift and flicker
	// _tabList[tabId].visible = true;
	_tabList[tabId].zOrder = _activeZOrder;

	for (tab in _tabList ) {	
		if (_tabList[tab].id !== tabId) {
			_tabList[tab].zOrder = _defaultZOrder;
		}
	}
	if (_activeTabId !== null && _activeTabId !== killedTab) {
		_lastActiveTabId = _activeTabId;
	}
	_activeTabId = tabId;

	triggerUpdate({
		webview: tabId,
		type: "ActiveTab",
	});

}

/**
 *	Private method applies the default parameters to newly created webviews
 */
function applyDefaultParams(webview, args) {

	var x = _x,
		y = _y,
		w = _width,
		h = _height,
		url = _url;

	if (args.x !== undefined) {
		x = args.x;
	}
	if (args.y !== undefined) {
		y = args.y;
	}
	if (args.width !== undefined) {
		w = args.width;
	}
	if (args.height !== undefined) {
		h = args.height;
	}
	if (args.url !== undefined) {
		url = checkUrlProtocol(args.url);
	}

	webview.setGeometry(x, y, w, h);
	webview.url = url;
}

/**
 *	Private method to retrive the webview from the webview collection based on
 *	a supplied "tabId"
 */
function getWebview(tabId) {
	var tab = -1;
	if (_tabList[tabId].id === tabId) {	
		tab = _tabList[tabId];
	}
	return tab;
}

/**
 *	Private method called when the webview "created" event is 
 *	triggered. Sets the default parameters and attaches the 
 *	event listeners for Location Change and page load progress. 
 */
function onWebviewCreated(webview, args) {

	console.log("Webview:", webview.id, " created");
	triggerUpdate({
		type : "WebviewCreated",
		webview : webview.id
	});
	webview.addEventListener("LocationChange", function (e) {
		e = JSON.parse(e);
		if (_tabTrigger.length > 0 && e.type === "LocationChange") {
			e.webview = webview.id;
			e.title = webview.title;
			e.url = webview.url;
			triggerUpdate(e);
		}
	});
	webview.addEventListener("PropertyLoadProgressEvent", function (e) {
		if (_tabTrigger.length > 0 && e) {
			triggerUpdate({
				progress: e,
				type: "PropertyLoadProgressEvent",
				webview: webview.id
			});
		}
	});
	webview.enableDialogRequestedEvents = true;


	//we need to do this so the open window events fire
	qnx.webplatform.nativeCall('webview.setBlockPopups', webview.id, false);

	//add Handlers for the OpenWindow event
	webview.on("OpenWindow", function (webviewId, value, eventId, returnValue) {
		value = JSON.parse(value);
		if (value.isPopup === false) {
		createWebview({url: value.url});
		}
	});

	/*
	 *	This hooks up the dialog authentication responses and
	 *	ssl handshake dialogs. However in webplatform 10.3 there is
	 *	a bug where the Authentication dialog is broken, it will appear
	 *	but won't accept interaction. The bug is tracked by the following
	 *	Jira ticket https://jira.bbqnx.net/browse/BRWSR-17162
	 */ 
	_uiWebview.dialog.subscribeTo(webview);

	applyDefaultParams(webview, args);
	_activeTabId = webview.id;
	webview.visible = true;
	reorderTabs(_activeTabId);

}

/**
 *	Private utility method used to check if a url has the
 *	"http" or "https" protocol specified in the url if it
 *	is just empty e.g. "qnx.com" we append "http://" to it
 */

function checkUrlProtocol(url) {
	var subString,
		verifiedUrl = url;

	subString = verifiedUrl.substring(0, 4);

	if (subString !== "http") {
		verifiedUrl = "http://" + verifiedUrl;
	}

	return verifiedUrl;
}

function createWebview(args) {

	var webview;

	webview = qnx.webplatform.createWebView({defaultSendEventHandlers: ['onChooseFile', 'onOpenWindow']}, function () {
		onWebviewCreated(webview, args);
	});
	_tabList[webview.id] = webview;

	return webview;

}

function updateUiWebview() {
	//since this is the UI dialog boost the default zOrder otherwise it will be clipped by the UI webview
	_uiWebview.zOrder = _uiWebviewZOrder;
	_uiWebview.setGeometry(_x, _y, _width, _height);
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
		_tabTrigger.push(trigger);
	},

	/**
	 * Does the initialization for the plugin and sets any configuration data
	 */
	init : function (args) {
		var webviews = qnx.webplatform.getWebViews(),
			wv;
		for (wv in webviews) {
			if (webviews[wv].url === args.url) {
				_chromeHeight = args.uiHeight;
				_overlayHeight =  _chromeHeight + args.overlayHeight;
				_chromeWebview = webviews[wv];
				_chromeWebview.zOrder = _chromeZOrder;
				_chromeWebview.setBackgroundColor(0x00ffffff);
				_chromeWebview.setGeometry(0, 0, _width, _chromeHeight);
			} else if (webviews[wv].dialog) {
				_uiWebview = webviews[wv];
				updateUiWebview();
			}
		}

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
			_url = checkUrlProtocol(args.url);
		}
		//make sure the ui webview is in sync with these changes
		updateUiWebview();
	},

	/**
	* Creates a request to hide the overlay
	*/
	hideOverlay: function () {
		_chromeWebview.setGeometry(0, 0, _width, _chromeHeight);
	},

	/**
	* Creates a request to show the overlay
	*/
	showOverlay: function () {
		_chromeWebview.setGeometry(0, 0, _width, _overlayHeight);
	},

	/**
	* Creates a request to create a tab
	* @param args {Object} The startup data for the webview
	* @returns {number} the number of the newly created webview
	*/
	addTab: function (args) {
		var webview = createWebview(args);
		return webview.id;
	},

	/**
	* Creates a request to remove a tab
	* @param tabId {Number} the id of the webview to remove
	* @returns {number} the id of the recently removed webview
	*/
	removeTab: function (tabId) {
		var tab,
			lastActive = null,
			id = _tabList[tabId].id;

		if (tabId === _activeTabId) {

			//if there was a "last active tab" switch to it
			lastActive = _lastActiveTabId;
			_lastActiveTabId = null;
			//check to make sure the "last active tab" isn't the one being removed
			if (lastActive === null || lastActive === tabId) {
				//search for a valid tab to become visible
				for (tab in _tabList ) {
					if (parseInt(tab) !== _tabList[tabId].id) {
						lastActive = _tabList[tab].id;
						break;
					}	
				}
				//if there isn't one, it means the user is closing the only tab, create a new one
				if (lastActive === null) {
					lastActive = this.addTab({});
				}
			}

			reorderTabs(lastActive, tabId);

		} else {
			//this ensures that current tab stays active in the ui
			reorderTabs(_activeTabId, tabId);
		}

		//Because of a bug in webplatform we need to bind to the destroyed event
		//Normally this should be accomplished by using a callback passed into the destroy method
		_tabList[tabId].addEventListener("Destroyed", 
			function (args) {
				//Now we call delete to fully remove it since its internal cleanup has finished
				_tabList[tabId].delete();
				delete _tabList[tabId];
			}
		);

		_tabList[tabId].destroy();

		triggerUpdate({
			type : "WebviewRemoved",
			webview : id
		});

		return id;
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

		webview.url = checkUrlProtocol(url);
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