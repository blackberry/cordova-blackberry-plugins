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
	_lastActiveZOrder = 2,
	_activeZOrder = 3,
	_chromeZOrder = 4,
	_UIWebviewZOrder = 5,
	_lastActiveTabId = null,
	_activeTabId = null,
	_x = 0,
	_y = 0,
	_width = screen.width,
	_height = screen.height,
	_url =  "www.qnx.com",
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
		url = args.url;
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

	//We bind directly because adding an event listener through addEventListener doens't work for 'SSLHandshakingFailed'
	webview.onSSLHandshakingFailed = function (e) {
		if (_tabTrigger.length > 0 && e) {
			triggerUpdate({
				certificateInfo: e,
				type: "SSLHandshakingFailed",
				webview: webview.id
			});
		}
	};
	applyDefaultParams(webview, args);
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
		_tabTrigger.push(trigger);
	},

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
				//since this is the UI dialog boost the default zOrder otherwise it will be clipped by the UI webview
				webviews[wv].zOrder = _UIWebviewZOrder;
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
			_url = args.url;
		}
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
		var webview;
		//TODO: in the future add support so we can pass in config parameters
		// right into the createWebView method instead of an empty object
		webview = qnx.webplatform.createWebView({}, function () {
			onWebviewCreated(webview, args);
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
	},

	/**
	 *	Adds an exception for an SSL certificate that isn't trusted
	 *	@param tabId {Number} the id of the webview that triggered the sslHandshakeFailure
	 *	@param streamId {Number} the streamId of the sslHandshakeFailure
	 *	@param sslAction {String} can be one of the following "SSLActionTrust", "SSLActionReject", "SSLActionNone"
	 *	
	 */
	continueSSLHandshake: function (tabId, streamId, sslAction) {
		qnx.callExtensionMethod("webview.continueSSLHandshaking", tabId, streamId, sslAction);
	}
};