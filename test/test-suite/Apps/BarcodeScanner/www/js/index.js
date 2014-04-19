/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	barcodeScanner: null,
	results: null,
    gotCode: false,
	appContainer: null,
	canvasContainer: null,

	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', app.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		results = document.getElementById("results")
		canvasContainer = document.getElementById('barcodeScanner_stop')
		canvasContainer.style.display = "none"

		var canvas = document.getElementById('myCanvas')
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		app.barcodeScanner = blackberry.barcodescanner;
		appContainer = document.getElementById("appContainer")
		document.getElementById('barcodeScanner_start').addEventListener('click', app.startRead, false)
		canvasContainer.addEventListener('click', app.stopRead, false)
	},

	startRead: function() {
		canvasContainer.style.display = "block"
		gotCode = false
		appContainer.style.display = "none"

		app.barcodeScanner.startRead(app.codeFound, app.errorFound, "myCanvas")
	},

	stopRead: function() {
		canvasContainer.style.display = "none"
		app.barcodeScanner.stopRead(app.onStopRead, app.errorFound, "myCanvas")
	},

	onStopRead: function(data) {
		appContainer.style.display = "block"
	},

	errorFound: function(data){
		console.log("Error : "+data.error + " description : "+ data.description);
	},

	writeOut: function(message) {
		results.innerText = results.innerText + message;
		results.appendChild(document.createElement('br'));
	},

	codeFound: function(data) {
        if (!gotCode) {
            gotCode = true;
            alert(data.value);
	        //app.writeOut(data.value);
            app.stopRead();
        }
    }
};
