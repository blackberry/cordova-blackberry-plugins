/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _self = {},
    _ID = "com.blackberry.user.identity",
    noop = function () {},
    exec = cordova.require("cordova/exec"),
    IDS_FAILURE = -1,  /*!< Indicates that the IDS API call function did not complete
							successfully.  Often the application can get
							additional information by checking the value of
							@c errno. */
    IDS_SUCCESS = 0,   /*!< Indicates that the IDS API call completed successfully.
							In asynchronous calls, the request has been sent
							and either the success or failure callback will be
							called when the response arrives. */

    IDS_DEFAULT_ERROR = 49999, /*!< 49999 Default error.  Internal error occurred
								while processing the request. */

	IDS_NAME_TOO_LONG = 50002,   /*!< 50002 */
	IDS_ACCOUNT_LOCALLY_LOCKED_OUT = 50003,   /*!< 50003 */
	IDS_USER_COULD_NOT_BE_AUTHENTICATED = 50004, /*!< 50004 */
	IDS_TOO_MANY_NAMES_PASSED = 50005, /*!< 50005 */
	IDS_INVALID_REQUEST = 50006, /*!< 50006  */
	IDS_DOES_NOT_EXIST = 50007,  /*!< 50007 */
	IDS_UNKNOWN_TOKEN_TYPE = 50008, /*!< 50008 */
	IDS_UNKNOWN_APPLIES_TO = 50009,  /*!< 50009 */
	IDS_NOT_ENOUGH_RESOURCES = 50010, /*!< 50010 */
	IDS_CANNOT_GET_TOKEN_WHILE_OFFLINE = 50011,  /*!< 50011 */
	IDS_ERROR_WHILE_CONTACTING_SERVICE = 50012,  /*!< 50012 Error while contacting
													identity service.  This
													could include network
													issues. */
	IDS_NULL_OR_UNKNOWN_PARAMETERS = 50015, /*!< 50015 */
	IDS_NOT_ALLOWED = 50017,  /*!< 50017 */
	IDS_VALUE_TOO_LARGE = 50107,   /*!< 50107 */
	IDS_ALREADY_EXISTS = 50159, /*!< 50159 */

	// Deprecated Return Codes no longer used
	IDS_PROPERTY_DOES_NOT_EXIST = 50007,  /*!< Deprecated. Use @c IDS_DOES_NOT_EXIST. */
	IDS_PROPERTY_NOT_AUTHORIZED = 50017,  /*!< Deprecated. Use @c IDS_NOT_ALLOWED. */
	IDS_CLEAR_TOKEN_FAIL = 50016, /*!< Deprecated. Use @c IDS_DEFAULT_ERROR */
	IDS_NAME_MUST_BE_SET = 50107;  /*!< Deprecated. Use @c IDS_NULL_OR_UNKNOWN_PARAMETERS */

_self.self = {};

_self.getVersion = function () {
	var version = -1,
		response = function (data) {
            version = data;
        };

	exec(response, noop, _ID, "getVersion");
	return version;
};

_self.registerProvider = function (provider) {
    var args = {
            "provider": provider
        },
        obj,
        response = function (data) {
            obj = JSON.parse(data);
        };

	exec(response, noop, _ID, "registerProvider", args);
	return obj;
};

_self.setOption = function (option, value) {
	var args = {
			"option": option,
			"value": value
		},
		obj,
		response = function (data) {
            obj = JSON.parse(data);
        };

	exec(response, noop, _ID, "setOption", args);
	return obj;
};


_self.getToken = function (idsProvider, tokenType, appliesTo, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"tokenType": tokenType,
		"appliesTo": appliesTo
    };

	exec(successCallback, failureCallback, _ID, "getToken", args);
};


_self.clearToken = function (idsProvider, tokenType, appliesTo, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"tokenType": tokenType,
		"appliesTo": appliesTo
    };

	exec(successCallback, failureCallback, _ID, "clearToken", args);
};

_self.getProperties = function (idsProvider, propertyType, userProperties, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"propertyType": propertyType,
		"userProperties": userProperties
    };

	exec(successCallback, failureCallback, _ID, "getProperties", args);
};

_self.getData = function (idsProvider, dataType, dataFlags, dataName, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"dataType": dataType,
		"dataFlags": dataFlags,
		"dataName": dataName
    };

	exec(successCallback, failureCallback, _ID, "getData", args);
};

_self.createData = function (idsProvider, dataType, dataFlags, dataName, dataValue, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"dataType": dataType,
		"dataFlags": dataFlags,
		"dataName": dataName,
		"dataValue": dataValue
    };

	exec(successCallback, failureCallback, _ID, "createData", args);
};

_self.deleteData = function (idsProvider, dataType, dataFlags, dataName, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"dataType": dataType,
		"dataFlags": dataFlags,
		"dataName": dataName
    };
	exec(successCallback, failureCallback, _ID, "deleteData", args);
};

_self.setData = function (idsProvider, dataType, dataFlags, dataName, dataValue, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"dataType": dataType,
		"dataFlags": dataFlags,
		"dataName": dataName,
		"dataValue": dataValue
    };

	exec(successCallback, failureCallback, _ID, "setData", args);
};

_self.listData = function (idsProvider, dataType, dataFlags, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"dataType": dataType,
		"dataFlags": dataFlags
    };

	exec(successCallback, failureCallback, _ID, "listData", args);
};

_self.challenge = function (idsProvider, challengeType, challengeFlags, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"challengeType": challengeType,
		"challengeFlags": challengeFlags
    };

	exec(successCallback, failureCallback, _ID, "challenge", args);
};

_self.registerNotifier = function (idsProvider, notifierType, notifierFlags, notifierName, successCallback, failureCallback) {
	var args = {
		"provider": idsProvider,
		"notifierType": notifierType,
		"notifierFlags": notifierFlags,
		"notifierName": notifierName
    };

	exec(successCallback, failureCallback, _ID, "registerNotifier", args);
};


module.exports = _self;

