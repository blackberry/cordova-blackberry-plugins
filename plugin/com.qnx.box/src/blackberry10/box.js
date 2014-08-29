/**
 * The abstraction layer for box service
 *
 * @author mlytvynyuk
 * $Id:$
 */
var _pps = qnx.webplatform.pps,
	_event = require("../../lib/event"),
	_controlPPS,
	_statusPPS,
	_clientId,
	_clientSecret,
	_triggerUpdate,
	Events = {
		EVENT_ACCESS_TOKEN_READY : 'accesstokenready',
		EVENT_ACCESS_TOKEN_ERROR : 'accesstokenerror',
		EVENT_INSTALLATION_PROGRESS : 'installstatus',
		EVENT_UNINSTALLATION_PROGRESS : 'uninstallstatus',
		EVENT_ERROR : 'generalerror'
	},
	Constants = {
		BASE_URL:'https://api.box.com/2.0',
		FOLDERS:'/folders',
		FOLDERS_ITEMS:'/folders/{id}/items',
		FOLDERS_COLLAB:'/folders/{id}/collaborations',
		FILES:'/files',
		FILES_CONTENT:'/files/{id}/content',
		FILES_VERSIONS:'/files/{id}/versions',
		SHARED_ITEMS:'/shared_items',
		COMMENTS:'/comments',
		DISCUSSIONS:'/discussions',
		COLLABORATIONS:'/collaborations',
		SEARCH:'/search',
		EVENTS:'/events',
		USERS:'/users',
		TOKENS:'/tokens',

		AUTH_URL:'https://api.box.com/oauth2/authorize',
		TOKEN_URL:'https://api.box.com/oauth2/token',

		PROTOCOL: 'qnxbox://'
	};

var overlayWebView = {};

/**
 * Function opens new webview with specified URL
 * @param {String} url an url of the resource which will be loaded in new webview
 * */
function createOverlay(url) {
	overlayWebView = qnx.webplatform.createWebView(function (e) {
		overlayWebView.visible = true;
		overlayWebView.active = true;
		overlayWebView.zOrder = 100;
		overlayWebView.enableCrossSiteXHR = true;
		overlayWebView.executeJavaScript("1 + 1");
		overlayWebView.url = url;
		overlayWebView.backgroundColor = 0x00FFFFFF;
		overlayWebView.setGeometry(0, 0, screen.width, screen.height);
		overlayWebView.onNetworkResourceRequested = networkResourceRequestedHandler;
	});
}

/**
 * NetworkResourceRequestedHandler  used to handle every network request for the webview,
 * in case if URI schema matches to one we interested in, kills the original webview and fires event with extracted parameters
 * @param {String} e contains string with data about requested resource
 * */
function networkResourceRequestedHandler(e) {
	var e_obj = JSON.parse(e);
	if (e_obj.targetType == 'TargetIsSubframe' && e_obj.url.indexOf(Constants.PROTOCOL) != -1) {
		overlayWebView.destroy();
		var params = e_obj.url.split("?")[1].split("&");
		var codeArr = params[1].split('=');
		var code = codeArr[1];

		getAccess(code);
	}
}

/**
 * Second step of OAuth2, uses code received on first step to obtain access_token and refresh_token
 * in case of success, tokens will be saved in localStorage for future use
 * @param {String} code Security code obtained on first step of OAuth2.
 * */
function getAccess(code) {

	var params = 'grant_type=authorization_code' +
		'&code=' + code +
		'&client_id=' + _clientId +
		'&client_secret=' + _clientSecret;

	authXHR(params);
}

/**
 * Refreshes the auth_token based on refresh_token
 * */
function refreshToken() {
	var refresh_token = localStorage.refresh_token;

	var params = 'grant_type=refresh_token' +
		'&refresh_token=' + refresh_token +
		'&client_id=' + _clientId +
		'&client_secret=' + _clientSecret;

	authXHR(params);
}

/**
 * Generic function to invoke auth API for box.com to request token or refresh token
 * @params {String} params POST request parameters
 * */
function authXHR(params) {

	params = encodeURI(params);

	var requestToken = new XMLHttpRequest();

	requestToken.onreadystatechange = function receiveRequestToken() {
		if (requestToken.readyState == 4) {
			if (requestToken.responseText.length > 0) {
				var responseObj = JSON.parse(requestToken.responseText);
				if (responseObj) {
					localStorage.access_token = responseObj.access_token;
					localStorage.refresh_token = responseObj.refresh_token;
					_triggerUpdate({event: Events.EVENT_ACCESS_TOKEN_READY, data: responseObj});
				}
			} else {
				_triggerUpdate({event: Events.EVENT_ACCESS_TOKEN_ERROR, data: "Error: Authorisation failed"});
			}
		}
	};

	requestToken.open('POST', Constants.TOKEN_URL, true);
	requestToken.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	requestToken.send(params);
}

module.exports = {
	/**
	 * Initializes the extension
	 */
	init:function () {
		_statusPPS = _pps.create("/pps/services/appinst-mgr/status", _pps.PPSMode.DELTA);

		_statusPPS.onNewData = function (ppsEvent) {
			if (ppsEvent && ppsEvent.data && ( ppsEvent.data.state == "download" || ppsEvent.data.state == "install")) {

				var event = {
					state:ppsEvent.data.state,
					progress:ppsEvent.data.progress
				};

				// add extra parameter appid which will be available only during install
				if (ppsEvent.data.state == "install") {
					event.appid = ppsEvent.data.msg;
				}

				_triggerUpdate({event: Events.EVENT_INSTALLATION_PROGRESS, data: event});
			}

			if (ppsEvent && ppsEvent.data && ppsEvent.data.state == "uninstall") {
				_triggerUpdate({event: Events.EVENT_UNINSTALLATION_PROGRESS, data: { state:ppsEvent.data.state, progress:ppsEvent.data.progress }});
			}

			if (ppsEvent && ppsEvent.data && ppsEvent.data.status == "Error") {
				_triggerUpdate({event: Events.EVENT_ERROR, data: {message:ppsEvent.data.msg}});
			}
		};

		_controlPPS = _pps.create("/pps/services/appinst-mgr/control");

		if(!_statusPPS.open(_pps.FileMode.RDONLY) || !_controlPPS.open(_pps.FileMode.WRONLY)) {

			console.error('qnx.box box.js::init() - Error opening pps object.');

			_statusPPS.close();
			_controlPPS.close();
		}

		
		
	},

	/**
	 * Sets the trigger function to call when a box event is fired
	 * @param {Function} trigger The trigger function to call when the event is fired
	 */
	setTriggerUpdate: function(trigger) {
		_triggerUpdate = trigger;
	},

	/**
	 * Initialises box extension.
	 * @param clientId {String} Client id provided by box.com when registering application, part of OAuth2 authorisation process
	 * @param clientSecret {String} Client secret provided by box.com when registering application, part of OAuth2 authorisation process
	 * */
	authorise:function (clientId, clientSecret) {

		_clientId = clientId;
		_clientSecret = clientSecret;

		// check if access_token available
		if (localStorage.access_token && typeof(localStorage.access_token) != "undefined" && localStorage.access_token != "undefined") {
			// ask for refresh token instead
			refreshToken();
		} else {
			var params = 'response_type=code&client_id=' + clientId + '&state=authenticated';
			params = encodeURI(params);
			var url = Constants.AUTH_URL + '?' + params;
			createOverlay(url);
		}
	},

	/**
	 * Function starts download of specified bar file then install downloaded bar files
	 * @param {String} id  url of the file to download
	 */
	install:function (id) {
		var access_token = localStorage.access_token;
		var url = Constants.BASE_URL + Constants.FILES_CONTENT.replace('{id}', id);

		if (access_token && access_token.length > 0) {
			var message = {
				command: 'install',
				url: url,
				authtoken: access_token
			};
			_controlPPS.write(message);
		} else {
			_triggerUpdate({event: Events.EVENT_ERROR, data: {message: 'Error: Not Authorised'}});
		}
	},

	/**
	 * Function starts un-installation of specified application
	 * @param {Object} name Application name
	 */
	uninstall:function (name) {
		var message = {
			command:'uninstall',
			appname:name
		};
		_controlPPS.write(message);
	}
};