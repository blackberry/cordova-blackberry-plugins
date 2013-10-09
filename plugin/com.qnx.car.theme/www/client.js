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
 * @module car.theme
 * @static
 *
 * @description Provides access to HMI theming 
 */

var _self = {},
	_ID = "com.qnx.car.theme",
	_utils = cordova.require('cordova/utils'),
	_watches = {};


/**
 * Load a theme and inject the stylesheet into the DOM
 * @param {Object} theme The theme to load.
 * @private
 */
function loadTheme(theme) {
	if (theme && theme.id) {
	 	//verify that this application is themeable
	 	var styleNode = document.getElementById('theme-css');
	 	if (styleNode) {
	 		//find the name of the application
	 		var app = styleNode.getAttribute('app');

	 		//determing the CSS file for the application
			var themeCSS = 'platform:///apps/common/themes/' + theme.id + '/' + app + '/master.css';

	 		//apply the theme only if it is different than the current theme
	 		if (styleNode.getAttribute('href') !== themeCSS) {
		 		styleNode.setAttribute('href', themeCSS);
	 		}
	 	}
	}
 }

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
 * Watch for theme changes
 * @param {Function} callback The function to call when a change is detected.
 * @return {String} An ID for the added watch.
 * @memberOf module:car.theme
 * @method watchTheme
 * @example
 * 
 * //define a callback function
 * function myCallback(theme) {
 * 		console.log("theme id = " + theme.id + "; theme name = " + theme.name);
 * }
 * 
 * var watchId = car.theme.watchTheme(myCallback);
 */
_self.watchTheme = function (callback) {
	var watchId = _utils.createUUID();
	
	_watches[watchId] = callback;
	if (Object.keys(_watches).length === 1) {
		window.cordova.exec(onUpdate, null, _ID, 'startEvents', null, false);
	}

	return watchId;
}


/**
 * Stop watching theme changes
 * @param {String} watchId The watch ID as returned by <i>car.theme.watchTheme()</i>.
 * @memberOf module:car.theme
 * @method cancelWatch
 * @example
 * 
 * car.theme.cancelWatch(watchId);
 */
_self.cancelWatch = function (watchId) {
	if (_watches[watchId]) {
		delete _watches[watchId];
		if (Object.keys(_watches).length === 0) {
			window.cordova.exec(null, null, _ID, 'stopEvents', null, false);
		}
	}
}

/**
 * Return a list of available themes
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.theme
 * @method getList
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(themes) {
 *		//iterate through all the themes
 *		for (var i=0; i&lt;themes.length; i++) {
 *			console.log("theme id = " + themes[i].id + "; theme name = " + themes[i].name);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.theme.getList(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/theme/getList
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [ 
 *			{ id: 'default', name: 'Default' }, 
 *			{ id: 'titanium', name: 'Titanium' } 
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.getList = function(successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'getList', null, false);
};

/**
 * Return the current theme
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.theme
 * @method getActive
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(theme) {
 *		console.log("theme id = " + theme.id + "; theme name = " + theme.name);
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.theme.getActive(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/theme/getActive
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: { id: 'default', name: 'Default' }
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.getActive = function(successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'getActive', null, false);
};

/**
 * Change the current theme
 * @param {String} themeId The ID of the new theme.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.theme
 * @method setActive 
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log("theme has been changed");
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.theme.setActive('default', successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/theme/setActive?themeId=default
 *
 * Success Response:
 * {
 *		code: 1
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.setActive = function(themeId, successCallback, errorCallback) {
	var args = { 
		themeId: themeId 
	};
	window.cordova.exec(successCallback, errorCallback, _ID, 'setActive', args, false);
};


//Export
module.exports = _self;


// Listen for theme changes and react as necessary
document.addEventListener("deviceready", function() {
	car.theme.getActive(loadTheme);
	car.theme.watchTheme(loadTheme);
}, false);

