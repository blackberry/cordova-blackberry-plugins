/*
 * Copyright 2013 - 2014.
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
 * @module car.navigation 
 * @static
 * @description Provide GPS navigation control.
 */

var _self = {},
	_ID = "com.qnx.car.navigation",
	_utils = cordova.require('cordova/utils'),
	_watches = {};

/**
 * @description Handle update events for this extension.
 * @param data {Array} The updated data provided by the event.
 * @private
 */
function onUpdate(data) {
	var keys = Object.keys(_watches);
	for (var i=0; i<keys.length; i++) {
		setTimeout(_watches[keys[i]](data), 0);
	}
}

/**
 * @description Watch for navigation updates.
 * @param {Function} callback The function to call when a change is detected.
 * @return {String} An ID for the added watch.
 * @memberOf module:car.navigation
 * @method watchNavigation
 * @example
 * 
 * //define a callback function
 * function myCallback(navigationStatus) {
 * }
 * 
 * var watchId = car.navigation.watchNavigation(myCallback);
 */
_self.watchNavigation = function (callback) {
	var watchId = _utils.createUUID();
	
	_watches[watchId] = callback;
	if (Object.keys(_watches).length === 1) {
		window.cordova.exec(onUpdate, null, _ID, 'startEvents', null, false);
	}

	return watchId;
}

/**
 * @description Stop watching for navigation updates.
 * @param {String} watchId The watch ID returned by <code>car.navigation.watchNavigation()</code>.
 * @memberOf module:car.navigation
 * @method cancelWatch 
 * @example
 * 
 * car.navigation.cancelWatch(watchId);
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
 * @description Get the current user's preferred locations.
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method getFavourites 
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(locations) {
 *		//iterate through all the locations
 *		for (var i=0; i&lt;locations.length; i++) {
 *			console.log("location id = " + locations[i].id + "\n" +
 *						"location name = " + locations[i].name + "\n" +
 *						"location number = " + locations[i].number
 *						"location street = " + locations[i].street + "\n" +
 *						"location city = " + locations[i].city + "\n" +
 *						"location province = " + locations[i].province + "\n" +
 *						"location postalCode = " + locations[i].postalCode + "\n" +
 *						"location country = " + locations[i].country + "\n" +
 *						"location type = " + locations[i].type + "\n" +
 *						"location latitude = " + locations[i].latitude + "\n" +
 *						"location longitude = " + locations[i].longitude
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.navigation.getFavourites(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/getFavourites
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [
 *			{
 *				id: 1
 *				name: "Lester B Pearson Int'l-T1 Departure",
 *				number: "",
 *				street: "",
 *				city: "Mississaugua",
 *				province: "Ontario",
 *				postalCode: "L5P ",
 *				country: "Canada",
 *				type: "transportation",
 *				latitude: 43.68169,
 *				longitude: -79.611198
 *			}, {
 *				id: 2
 *				name: "CBC Museum",
 *				number: "250",
 *				street: "Front St W",
 *				city: "Toronto",
 *				province: "Ontario",
 *				postalCode: "M5V",
 *				country: "Canada",
 *				type: "museum",
 *				latitude: 43.644203,
 *				longitude: -79.387566
 *			}
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.getFavourites = function(successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'getFavourites', null, false);
};

/**
 * @description Add a location to the current user's preferred locations.
 * @param {Object} location The location to add.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method addFavourite  
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log("favourite has been added");
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * var myLocation = { city: "Toronto", country: "Canada", latitude: 43.645256, longitude: -79.389229, name: "Starbucks", number: "224", postalCode: "M5V", province: "Ontario", street: "Wellington St W" };
 * 
 * //call the method
 * car.navigation.addFavourite(myLocation, successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/addFavourite?city=Toronto&country=Canada&latitude=43.645256&longitude=-79.389229&name=Starbucks&number=224&postalCode=M5V&province=Ontario&street=Wellington%20St%20W
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
_self.addFavourite = function(location, successCallback, errorCallback) {
	var args = location;
	window.cordova.exec(successCallback, errorCallback, _ID, 'addFavourite', args, false);
};

/**
 * @description Remove a location from the current user's preferred locations.
 * @param {Number} favouriteId The ID to remove as returned by <code>car.navigation.getFavourites()</code>.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method removeFavourite  
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log("favourite has been removed");
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.navigation.removeFavourite(2, successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/removeFavourite?favouriteId=2
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
_self.removeFavourite = function(favouriteId, successCallback, errorCallback) {
	var args = { 
		favouriteId: favouriteId
	};
	window.cordova.exec(successCallback, errorCallback, _ID, 'removeFavourite', args, false);
};

/**
 * @description Get the current user's navigation history.
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method getHistory   
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(locations) {
 *		//iterate through all the locations
 *		for (var i=0; i&lt;locations.length; i++) {
 *			console.log("location id = " + locations[i].id + "\n" +
 *						"location name = " + locations[i].name + "\n" +
 *						"location number = " + locations[i].number
 *						"location street = " + locations[i].street + "\n" +
 *						"location city = " + locations[i].city + "\n" +
 *						"location province = " + locations[i].province + "\n" +
 *						"location postalCode = " + locations[i].postalCode + "\n" +
 *						"location country = " + locations[i].country + "\n" +
 *						"location type = " + locations[i].type + "\n" +
 *						"location latitude = " + locations[i].latitude + "\n" +
 *						"location longitude = " + locations[i].longitude
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.navigation.getHistory(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/getHistory
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [
 *			{
 *				id: 1
 *				name: "Lester B Pearson Int'l-T1 Departure",
 *				number: "",
 *				street: "",
 *				city: "Mississaugua",
 *				province: "Ontario",
 *				postalCode: "L5P ",
 *				country: "Canada",
 *				type: "transportation",
 *				latitude: 43.68169,
 *				longitude: -79.611198
 *			}, {
 *				id: 2
 *				name: "CBC Museum",
 *				number: "250",
 *				street: "Front St W",
 *				city: "Toronto",
 *				province: "Ontario",
 *				postalCode: "M5V",
 *				country: "Canada",
 *				type: "museum",
 *				latitude: 43.644203,
 *				longitude: -79.387566
 *			}
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.getHistory = function(successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'getHistory', null, false);
};

/**
 * @description Clear the current user's navigation history.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method clearHistory    
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log("history has been cleared");
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.navigation.clearHistory(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/clearHistory
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
_self.clearHistory = function(successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'clearHistory', null, false);
};

/**
 * @description Browse the Point of Interest (POI) database near a location.
 * @param {Number} [categoryId] A category ID to browse; defaults to 0 for root category
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {Object} [location] Find a POI near this location; defaults to current location.
 * @memberOf module:car.navigation
 * @method browsePOI
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(locations) {
 *		//iterate through all the locations
 *		for (var i=0; i&lt;locations.length; i++) {
 *			console.log("location id = " + locations[i].id + "\n" +
 *						"location name = " + locations[i].name + "\n" +
 *						"location number = " + locations[i].number
 *						"location street = " + locations[i].street + "\n" +
 *						"location city = " + locations[i].city + "\n" +
 *						"location province = " + locations[i].province + "\n" +
 *						"location postalCode = " + locations[i].postalCode + "\n" +
 *						"location country = " + locations[i].country + "\n" +
 *						"location type = " + locations[i].type + "\n" +
 *						"location latitude = " + locations[i].latitude + "\n" +
 *						"location longitude = " + locations[i].longitude
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * var myLocation = { city: "Mississaugua", country: "Canada" };
 * 
 * //call the method - location object is optional. 
 * car.navigation.browsePOI(7, successCallback, errorCallback);
 *
 *
 *
 * @example REST - without location filter
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/browsePOI?categoryId=7
 *
 * 
 *
 * @example REST - with location filter. Any of the location parameters can be used arbitrarily in the query string.
 * This example would be equivalent to: car.navigation.browsePOI(7, successCallback, errorCallback, { city: "Mississaugua", country: "Canada" });
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/browsePOI?categoryId=7&city=Mississaugua&country=Canada
 *
 *
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [
 *			{
 *				id: 1
 *				name: "Lester B Pearson Int'l-T1 Departure",
 *				number: "",
 *				street: "",
 *				city: "Mississaugua",
 *				province: "Ontario",
 *				postalCode: "L5P ",
 *				country: "Canada",
 *				type: "transportation",
 *				latitude: 43.68169,
 *				longitude: -79.611198
 *			}, {
 *				...
 *			}
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.browsePOI = function(categoryId, successCallback, errorCallback, location) {
	var args = location || {};
	if (!isNaN(categoryId)) {
		args['categoryId'] = categoryId;
	}
	window.cordova.exec(successCallback, errorCallback, _ID, 'browsePOI', args, false);
};

/**
 * @description Search the Point of Interest (POI) database near a location.
 * @param {String} name The name of the location.
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {Object} [location] Find a POI near this location; defaults to current location.
 * @memberOf module:car.navigation
 * @method searchPOI 
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(locations) {
 *		//iterate through all the locations
 *		for (var i=0; i&lt;locations.length; i++) {
 *			console.log("location id = " + locations[i].id + "\n" +
 *						"location name = " + locations[i].name + "\n" +
 *						"location number = " + locations[i].number
 *						"location street = " + locations[i].street + "\n" +
 *						"location city = " + locations[i].city + "\n" +
 *						"location province = " + locations[i].province + "\n" +
 *						"location postalCode = " + locations[i].postalCode + "\n" +
 *						"location country = " + locations[i].country + "\n" +
 *						"location type = " + locations[i].type + "\n" +
 *						"location latitude = " + locations[i].latitude + "\n" +
 *						"location longitude = " + locations[i].longitude
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * var myLocation = { city: "Toronto", country: "Canada" };
 *
 * //call the method
 * car.navigation.searchPOI("starbucks", successCallback, errorCallback, myLocation);
 *
 *
 *
 * @example REST - without location filter
 *
 * Request:
 * http://&lt;car-ip&gt;/car.navigation/searchPOI?name=starbucks
 *
 * 
 *
 * @example REST - with location filter. Any of the location parameters can be used arbitrarily in the query string.
 * This example would be equivalent to: car.navigation.searchPOI("starbucks", successCallback, errorCallback, { city: "Toronto", country: "Canada" });
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/searchPOI?name=starbucks&city=Toronto&country=Canada
 *
 *
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [
 *			{
 *				id: 1
 *				name: "Starbucks",
 *				number: "224",
 *				street: "Wellington St W",
 *				city: "Toronto",
 *				province: "Ontario",
 *				postalCode: "M5V",
 *				country: "Canada",
 *				type: "transportation",
 *				latitude: 43.645256,
 *				longitude: -79.389229
 *			}, {
 *				...
 *			}
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.searchPOI = function(name, successCallback, errorCallback, location) {
	var args = location || {};
	if (name) {
		args['name'] = name;
	}
	window.cordova.exec(successCallback, errorCallback, _ID, 'searchPOI', args, false);
};

/**
 * @description Show a set of locations on a map.
 * @param {Array} locations An array of locations to show on the map as returned by
 * <code>car.navigation.browsePOI()</code>, <code>car.navigation.search()</code>,
 * <code>car.navigation.getFavourites()</code>, or <code>car.navigation.getHistory()</code>.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method showOnMap  
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log("showOnMap has been completed");
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * var myLocations = [
 *		{ city: "Toronto", country: "Canada", latitude: 43.645256, longitude: -79.389229, name: "Starbucks", number: "224", postalCode: "M5V", province: "Ontario", street: "Wellington St W" },
 *		{ city: "Toronto", country: "Canada", latitude: 43.639709, longitude: -79.382027, number: "208", postalCode: "M5J", province: "Ontario", street: "Queens Quay W" }
 * ];
 * 
 * //call the method - location object is optional. 
 * car.navigation.showOnMap(myLocations, successCallback, errorCallback);
 *
 *
 *
 * @example REST 
 *	The locations variable is a URL encoded, serialized JSON array of locations 
 *	To encode/serialize from JavaScript: encodeURIComponent(JSON.stringify(myLocations));
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/showOnMap?locations=%5B%7B%22id%22%3A1%2C%22name%22%3A%22Starbucks%22%2C%22number%22%3A%22224%22%2C%22street%22%3A%22Wellington%20St%20W%22%2C%22city%22%3A%22Toronto%22%2C%22province%22%3A%22Ontario%22%2C%22postalCode%22%3A%22M5V%22%2C%22country%22%3A%22Canada%22%2C%22type%22%3Anull%2C%22distance%22%3A344%2C%22latitude%22%3A43.645256%2C%22longitude%22%3A-79.389229%7D%2C%7B%22id%22%3A2%2C%22name%22%3A%22Starbucks%22%2C%22number%22%3A%22208%22%2C%22street%22%3A%22Queens%20Quay%20W%22%2C%22city%22%3A%22Toronto%22%2C%22province%22%3A%22Ontario%22%2C%22postalCode%22%3A%22M5J%22%2C%22country%22%3A%22Canada%22%2C%22type%22%3Anull%2C%22distance%22%3A515%2C%22latitude%22%3A43.639709%2C%22longitude%22%3A-79.382027%7D%5D
 *
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
_self.showOnMap = function(locations, successCallback, errorCallback) {
	var args = { 
		locations: locations 
	};
	window.cordova.exec(successCallback, errorCallback, _ID, 'showOnMap', args, false);
};

/**
 * @description Zoom the current map.
 * @param {Number} scale The zoom scale, relative to the current view.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method zoomMap
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log("zoomMap has been completed");
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method - zoom in
 * car.navigation.zoomMap(2, successCallback, errorCallback);
 *
 * //call the method - zoom out 
 * car.navigation.zoomMap(0.5, successCallback, errorCallback);
 *
 *
 *
 * @example REST - zoom in
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/zoomMap?scale=2
 *
 *
 * @example REST - zoom out
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/zoomMap?scale=0.5
 *
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
_self.zoomMap = function(scale, successCallback, errorCallback) {
	var args = { 
		scale: scale 
	};
	window.cordova.exec(successCallback, errorCallback, _ID, 'zoomMap', args, false);
};

/**
 * @description Pan the current map.
 * @param {Number} deltaX The number of pixels to move the map on the X axis.
 * @param {Number} deltaY The number of pixels to move the map on the Y axis.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method panMap
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log("panMap has been completed");
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * //call the method
 * car.navigation.panMap(100, 100, successCallback, errorCallback);
 *
 *
 *
 * @example REST - pan the map
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/panMap?deltaX=100&deltaY=100
 *
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
_self.panMap = function(deltaX, deltaY, successCallback, errorCallback) {
	var args = { 
		deltaX: deltaX, 
		deltaY: deltaY 
	};
	window.cordova.exec(successCallback, errorCallback, _ID, 'panMap', args, false);
};

/**
 * @description Find a location based on a partial address.
 * @param {Object} location The location to search for.
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method searchAddress
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(locations) {
 *		//iterate through all the locations
 *		for (var i=0; i&lt;locations.length; i++) {
 *			console.log("location id = " + locations[i].id + "\n" +
 *						"location name = " + locations[i].name + "\n" +
 *						"location number = " + locations[i].number
 *						"location street = " + locations[i].street + "\n" +
 *						"location city = " + locations[i].city + "\n" +
 *						"location province = " + locations[i].province + "\n" +
 *						"location postalCode = " + locations[i].postalCode + "\n" +
 *						"location country = " + locations[i].country + "\n" +
 *						"location type = " + locations[i].type + "\n" +
 *						"location latitude = " + locations[i].latitude + "\n" +
 *						"location longitude = " + locations[i].longitude
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * var myLocation = { number: "224", street: "Wellington", city: "Toronto", province: "Ontario" };
 * 
 * //call the method - location object is optional. 
 * car.navigation.searchAddress(myLocation, successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/searchAddress?number=224&street=Wellington&city=Toronto&province=Ontario
 *
 *
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [
 *			{
 *				id: 1
 *				name: "Starbucks",
 *				number: "224",
 *				street: "Wellington St W",
 *				city: "Toronto",
 *				province: "Ontario",
 *				postalCode: "M5V",
 *				country: "Canada",
 *				type: "transportation",
 *				latitude: 43.645256,
 *				longitude: -79.389229
 *			}, {
 *				...
 *			}
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * }
 */
_self.searchAddress = function(location, successCallback, errorCallback) {
	var args = location;
	window.cordova.exec(successCallback, errorCallback, _ID, 'searchAddress', args, false);
};

/**
 * @description Navigate to a specific location.
 * @param {Object} location The location to navigate to.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @param {Function} [startedCallback] The function to call when navigation starts.
 * @param {Function} [updateCallback] The function to call when navigation status is updated.
 * @param {Function} [stoppedCallback] The function to call when navigation ends.
 * @memberOf module:car.navigation
 * @method navigateTo
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log("navigation has been started");
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 *
 * var myLocation = { city: "Toronto", country: "Canada", latitude: 43.645256, longitude: -79.389229, name: "Starbucks", number: "224", postalCode: "M5V", province: "Ontario", street: "Wellington St W" };
 * 
 * //call the method
 * car.navigation.navigateTo(myLocation, successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/navigateTo?city=Toronto&country=Canada&latitude=43.645256&longitude=-79.389229&name=Starbucks&number=224&postalCode=M5V&province=Ontario&street=Wellington%20St%20W
 *
 *
 *
 * Success Response:
 * {
 *		code: 1,
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * } 
 */
_self.navigateTo = function(location, successCallback, errorCallback) {
	var args = location;

	window.cordova.exec(successCallback, errorCallback, _ID, 'navigateTo', args, false);
	window.cordova.exec(null, null, _ID, 'addToNavigationHistory', args, false);
};

/**
 * @description Cancel the navigation if it is in progress.
 * @param {Function} [successCallback] The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method cancelNavigation 
 * @example 
 *
 * //define your callback function(s)
 * function successCallback() {
 *		console.log("navigation has been cancelled");
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 * 
 *
 * //call the method
 * car.navigation.cancelNavigation(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/cancelNavigation
 *
 *
 *
 * Success Response:
 * {
 *		code: 1,
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * } 
 */
_self.cancelNavigation = function(successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'cancelNavigation', null, false);
};

/**
 * @description Get the current navigation route.
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method getRoute
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(routeSegments) {
 *		//iterate through all the route segments
 *		for (var i=0; i&lt;routeSegments.length; i++) {
 *			console.log("route segment #" + i + "\n" +
 *						"currentRoad = " + routeSegments[i].currentRoad + '\n' +	//name of the current road
 *						"command = " + routeSegments[i].command + '\n' +			//command to execute to transition to the next road
 *						"distance = " + routeSegments[i].distance + '\n' +			//distance (in meters) covered by this segment
 *						"time = " + routeSegments[i].time + '\n' +					//amount of time (in minutes) required to cover this segment
 *						"latitude = " + routeSegments[i].latitude + '\n' +			//latitude at the end of this segment
 *						"longitude = " + routeSegments[i].longitude					//longitude at the end of this segment
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 * 
 *
 * //call the method
 * car.navigation.getRoute(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/getRoute
 *
 *
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: [
 *			{
 *				currentRoad: "Wellington St",
 *				command: "TR-L",
 *				distance: 5000,
 *				time: 5,
 *				latitude: 43.645256,
 *				longitude: -79.389229,
 *			}, {
 *				...
 *			}
 *		]
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * } 
 */
_self.getRoute = function (successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'getRoute', null, false);
};

/**
 * @description Get details about the current status of the navigation engine.
 * @param {Function} successCallback The function to call on success.
 * @param {Function} [errorCallback] The function to call if there is an error.
 * @memberOf module:car.navigation
 * @method getStatus 
 * @example
 *
 * //define your callback function(s)
 * function successCallback(status) {
 *			console.log("isNavigating = " + status.isNavigating + '\n' +							//true if navigation is in progress; otherwise, false
 *						"segment = " + status.segment + '\n' +										//the index of the current route segment [present if isNavigating=true]
 *						"segmentDistanceRemaining = " + status.segmentDistanceRemaining + '\n' +	//the distance (in meters) remaining in the current segment [present if isNavigating=true]
 *						"totalTimeRemaining = " + status.totalTimeRemaining + '\n' +				//the amount of time (in seconds) remaining in the route [present if isNavigating=true]
 *						"totalDistanceRemaining = " + status.totalDistanceRemaining					//the distance (in meters) remaining in the route [present if isNavigating=true]
 *			);
 *		}
 * }
 *
 * function errorCallback(error) {
 *		console.log(error.code, error.msg);
 * }
 * 
 *
 * //call the method
 * car.navigation.getStatus(successCallback, errorCallback);
 *
 *
 *
 * @example REST
 *
 * Request:
 * http://&lt;car-ip&gt;/car/navigation/getStatus
 *
 *
 *
 * Success Response:
 * {
 *		code: 1,
 *		data: {
 *			isNavigating: true,
 *			segment: 1,
 *			segmentDistanceRemaining: 5000,
 *			totalTimeRemaining: 10,
 *			totalDistanceRemaining: 12000,
 *		}
 * }
 *
 * Error Response:
 * {
 *		code: -1,
 *		msg: "An error has occurred"
 * } 
*/
_self.getStatus = function (successCallback, errorCallback) {
	window.cordova.exec(successCallback, errorCallback, _ID, 'getStatus', null, false);
};


//Export
module.exports = _self;

