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


var ids;

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.IDS = function ()
{
    var self = this,
    hasInstance = false;

    self.idsGetVersion = function (trigger) {
        return JNEXT.invoke(self.m_id, "getVersion");
    };

	self.idsRegisterProvider = function (args) {
		return JNEXT.invoke(self.m_id, "registerProvider " + args);
	};

	self.idsSetOption = function (args) {
        var setOptionsOpts = { "option" : JSON.parse(decodeURIComponent(args.option)),
                            "value" : JSON.parse(decodeURIComponent(args.value)) };

        // Make sure option is an int to pass to C
		if (typeof(setOptionsOpts.option) === "string") {
			setOptionsOpts.option = parseInt(setOptionsOpts.option, 10);
			if (isNaN(setOptionsOpts.option)) {
				setOptionsOpts.option = -1;
			}
		} else if (typeof(setOptionsOpts.option) !== "number") {
			setOptionsOpts.option = -1;
		}

        // Make sure value is a string/number/boolean to pass to C as a string
		if ((typeof(setOptionsOpts.value) !== "string") &&
				(typeof(setOptionsOpts.value) !== "number") &&
				(typeof(setOptionsOpts.value) !== "boolean")) {
			setOptionsOpts.value = "";
		}
		return JNEXT.invoke(self.m_id, "setOption " + JSON.stringify(setOptionsOpts));
	};

	self.idsResponseHandler = function (args, pluginResult) {
		var resultJSON = JSON.parse(args);

		if (resultJSON.result) {
			pluginResult.error(resultJSON, true);
		} else {
			pluginResult.ok(resultJSON, true);
		}
	};

	self.idsGetToken = function (args, pluginResult, onSuccess, onFail) {
		var getTokenArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
							"provider" : JSON.parse(decodeURIComponent(args.provider)),
							"tokenType" : JSON.parse(decodeURIComponent(args.tokenType)),
							"appliesTo" : JSON.parse(decodeURIComponent(args.appliesTo)) };

		self.eventHandlers[getTokenArgs._eventId] = {
                "result" : pluginResult,
                "action" : "getToken",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };
		// Make sure provider is a string to pass to C
		if (typeof(getTokenArgs.provider) !== "string") {
			getTokenArgs.provider = "";
		}
        // Make sure token type is a string to pass to C
		if (typeof(getTokenArgs.tokenType) !== "string") {
			getTokenArgs.tokenType = "";
		}
        // Make sure applies to is a string to pass to C
		if (typeof(getTokenArgs.appliesTo) !== "string") {
			getTokenArgs.appliesTo = "";
		}
		JNEXT.invoke(self.m_id, "getToken " + JSON.stringify(getTokenArgs));
		return "";
	};


	self.idsClearToken = function (args, pluginResult, onSuccess, onFail) {
        var clearTokenArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
							"provider" : JSON.parse(decodeURIComponent(args.provider)),
							"tokenType" : JSON.parse(decodeURIComponent(args.tokenType)),
							"appliesTo" : JSON.parse(decodeURIComponent(args.appliesTo)) };

		self.eventHandlers[clearTokenArgs._eventId] = {
                "result" : pluginResult,
                "action" : "clearToken",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };

        
        // Make sure provider is a string to pass to C
		if (typeof(clearTokenArgs.provider) !== "string") {
			clearTokenArgs.provider = "";
		}
        // Make sure token type is a string to pass to C
		if (typeof(clearTokenArgs.tokenType) !== "string") {
			clearTokenArgs.tokenType = "";
		}
        // Make sure applies to is a string to pass to C
		if (typeof(clearTokenArgs.appliesTo) !== "string") {
			clearTokenArgs.appliesTo = "";
		}

		JNEXT.invoke(self.m_id, "clearToken " + JSON.stringify(clearTokenArgs));
		return "";
	};

	
	self.idsGetProperties = function (args, pluginResult, onSuccess, onFail) {
        var getPropertiesArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
								"provider" : JSON.parse(decodeURIComponent(args.provider)),
								"propertyType" : JSON.parse(decodeURIComponent(args.propertyType)),
								"numProps" : 0,
								"userProperties" : JSON.parse(decodeURIComponent(args.userProperties)) },
			properties = getPropertiesArgs.userProperties;

		self.eventHandlers[getPropertiesArgs._eventId] = {
                "result" : pluginResult,
                "action" : "getProperties",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };
        
        // Make sure provider is a string to pass to C
		if (typeof(getPropertiesArgs.provider) !== "string") {
			getPropertiesArgs.provider = "";
		}

        // Make sure property type is an int to pass to C
		if (typeof(getPropertiesArgs.propertyType) === "string") {
			getPropertiesArgs.propertyType = parseInt(getPropertiesArgs.propertyType, 10);
			if (isNaN(getPropertiesArgs.propertyType)) {
				getPropertiesArgs.propertyType = -1;
			}
		} else if (typeof(getPropertiesArgs.propertyType) !== "number") {
			getPropertiesArgs.propertyType = -1;
		}

		if (typeof(properties) === "string") {
			properties = properties.split(",");
			getPropertiesArgs.numProps = properties.length;
		} else {
			properties = "";
			getPropertiesArgs.userProperties = "";
			getPropertiesArgs.numProps = 0;
		}
		JNEXT.invoke(self.m_id, "getProperties " + JSON.stringify(getPropertiesArgs));
		return "";
	};

	self.idsGetData = function (args, pluginResult, onSuccess, onFail) {
        var getDataArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
								"provider" : JSON.parse(decodeURIComponent(args.provider)),
								"dataType" : JSON.parse(decodeURIComponent(args.dataType)),
								"dataFlags" : JSON.parse(decodeURIComponent(args.dataFlags)),
								"dataName" : JSON.parse(decodeURIComponent(args.dataName)) };

		self.eventHandlers[getDataArgs._eventId] = {
                "result" : pluginResult,
                "action" : "getData",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };

        // Make sure provider is a string to pass to C
		if (typeof(getDataArgs.provider) !== "string") {
			getDataArgs.provider = "";
		}

		// Make sure type is an int to pass to C
        if (typeof(getDataArgs.dataType) === "string") {
			getDataArgs.dataType = parseInt(getDataArgs.dataType, 10);
			if (isNaN(getDataArgs.dataType)) {
				getDataArgs.dataType = -1;
			}
        } else if (typeof(getDataArgs.dataType) !== "number") {
			getDataArgs.dataType = -1;
		}

        // Make sure flags is an int to pass to C
        if (typeof(getDataArgs.dataFlags) === "string") {
			getDataArgs.dataFlags = parseInt(getDataArgs.dataFlags, 10);
			if (isNaN(getDataArgs.dataFlags)) {
				getDataArgs.dataFlags = -1;
			}
        } else if (typeof(getDataArgs.dataFlags) !== "number") {
			getDataArgs.dataFlags = -1;
		}

        // Make sure data name is a string to pass to C
        if (typeof(getDataArgs.dataName) !== "string") {
			getDataArgs.dataName = "";
		}

		JNEXT.invoke(self.m_id, "getData " + JSON.stringify(getDataArgs));
		return "";
	};

	self.idsCreateData = function (args, pluginResult, onSuccess, onFail) {
        var createDataArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
								"provider" : JSON.parse(decodeURIComponent(args.provider)),
								"dataType" : JSON.parse(decodeURIComponent(args.dataType)),
								"dataFlags" : JSON.parse(decodeURIComponent(args.dataFlags)),
								"dataName" : JSON.parse(decodeURIComponent(args.dataName)),
								"dataValue" : JSON.parse(decodeURIComponent(args.dataValue)) };

		self.eventHandlers[createDataArgs._eventId] = {
                "result" : pluginResult,
                "action" : "createData",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };

        // Make sure provider is a string to pass to C
		if (typeof(createDataArgs.provider) !== "string") {
			createDataArgs.provider = "";
		}

        // Make sure type is an int to pass to C
        if (typeof(createDataArgs.dataType) === "string") {
			createDataArgs.dataType = parseInt(createDataArgs.dataType, 10);
			if (isNaN(createDataArgs.dataType)) {
				createDataArgs.dataType = -1;
			}
        } else if (typeof(createDataArgs.dataType) !== "number") {
			createDataArgs.dataType = -1;
		}

        // Make sure flags is an int to pass to C
        if (typeof(createDataArgs.dataFlags) === "string") {
			createDataArgs.dataFlags = parseInt(createDataArgs.dataFlags, 10);
			if (isNaN(createDataArgs.dataFlags)) {
				createDataArgs.dataFlags = -1;
			}
        } else if (typeof(createDataArgs.dataFlags) !== "number") {
			createDataArgs.dataFlags = -1;
		}

        // Make sure name is a string to pass to C
		if (typeof(createDataArgs.dataName) !== "string") {
			createDataArgs.dataName = "";
		}

        // Make sure value is a string to pass to C
		if (typeof(createDataArgs.dataValue) !== "string") {
			createDataArgs.dataValue = "";
		}

		JNEXT.invoke(self.m_id, "createData " + JSON.stringify(createDataArgs));
		return "";
	};

	self.idsDeleteData = function (args, pluginResult, onSuccess, onFail) {
        var deleteDataArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
								"provider" : JSON.parse(decodeURIComponent(args.provider)),
								"dataType" : JSON.parse(decodeURIComponent(args.dataType)),
								"dataFlags" : JSON.parse(decodeURIComponent(args.dataFlags)),
								"dataName" : JSON.parse(decodeURIComponent(args.dataName)) };

		self.eventHandlers[deleteDataArgs._eventId] = {
                "result" : pluginResult,
                "action" : "deleteData",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };

        // Make sure provider is a string to pass to C
		if (typeof(deleteDataArgs.provider) !== "string") {
			deleteDataArgs.provider = "";
		}

        // Make sure type is an int to pass to C
        if (typeof(deleteDataArgs.dataType) === "string") {
			deleteDataArgs.dataType = parseInt(deleteDataArgs.dataType, 10);
			if (isNaN(deleteDataArgs.dataType)) {
				deleteDataArgs.dataType = -1;
			}
        } else if (typeof(deleteDataArgs.dataType) !== "number") {
			deleteDataArgs.dataType = -1;
		}

        // Make sure flags is an int to pass to C
        if (typeof(deleteDataArgs.dataFlags) === "string") {
			deleteDataArgs.dataFlags = parseInt(deleteDataArgs.dataFlags, 10);
			if (isNaN(deleteDataArgs.dataFlags)) {
				deleteDataArgs.dataFlags = -1;
			}
        } else if (typeof(deleteDataArgs.dataFlags) !== "number") {
			deleteDataArgs.dataFlags = -1;
		}

        // Make sure name is a string to pass to C
		if (typeof(deleteDataArgs.dataName) !== "string") {
			deleteDataArgs.dataName = "";
		}

		JNEXT.invoke(self.m_id, "deleteData " + JSON.stringify(deleteDataArgs));
		return "";
	};

	self.idsSetData = function (args, pluginResult, onSuccess, onFail) {
        var setDataArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
								"provider" : JSON.parse(decodeURIComponent(args.provider)),
								"dataType" : JSON.parse(decodeURIComponent(args.dataType)),
								"dataFlags" : JSON.parse(decodeURIComponent(args.dataFlags)),
								"dataName" : JSON.parse(decodeURIComponent(args.dataName)),
								"dataValue" : JSON.parse(decodeURIComponent(args.dataValue)) };

		self.eventHandlers[setDataArgs._eventId] = {
                "result" : pluginResult,
                "action" : "setData",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };

        // Make sure provider is a string to pass to C
		if (typeof(setDataArgs.provider) !== "string") {
			setDataArgs.provider = "";
		}

        // Make sure type is an int to pass to C
        if (typeof(setDataArgs.dataType) === "string") {
			setDataArgs.dataType = parseInt(setDataArgs.dataType, 10);
			if (isNaN(setDataArgs.dataType)) {
				setDataArgs.dataType = -1;
			}
        } else if (typeof(setDataArgs.dataType) !== "number") {
			setDataArgs.dataType = -1;
		}

        // Make sure flags is an int to pass to C
        if (typeof(setDataArgs.dataFlags) === "string") {
			setDataArgs.dataFlags = parseInt(setDataArgs.dataFlags, 10);
			if (isNaN(setDataArgs.dataFlags)) {
				setDataArgs.dataFlags = -1;
			}
        } else if (typeof(setDataArgs.dataFlags) !== "number") {
			setDataArgs.dataFlags = -1;
		}

        // Make sure name is a string to pass to C
		if (typeof(setDataArgs.dataName) !== "string") {
			setDataArgs.dataName = "";
		}

        // Make sure value is a string to pass to C
		if (typeof(setDataArgs.dataValue) !== "string") {
			setDataArgs.dataValue = "";
		}

		JNEXT.invoke(self.m_id, "setData " + JSON.stringify(setDataArgs));
		return "";
	};

	self.idsListData = function (args, pluginResult, onSuccess, onFail) {
        var listDataArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
								"provider" : JSON.parse(decodeURIComponent(args.provider)),
								"dataType" : JSON.parse(decodeURIComponent(args.dataType)),
								"dataFlags" : JSON.parse(decodeURIComponent(args.dataFlags)) };

		self.eventHandlers[listDataArgs._eventId] = {
                "result" : pluginResult,
                "action" : "listData",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };

        // Make sure provider is a string to pass to C
		if (typeof(listDataArgs.provider) !== "string") {
			listDataArgs.provider = "";
		}

		// Make sure type is an int to pass to C
        if (typeof(listDataArgs.dataType) === "string") {
			listDataArgs.dataType = parseInt(listDataArgs.dataType, 10);
			if (isNaN(listDataArgs.dataType)) {
				listDataArgs.dataType = -1;
			}
        } else if (typeof(listDataArgs.dataType) !== "number") {
			listDataArgs.dataType = -1;
		}

		// Make sure flags is an int to pass to C
        if (typeof(listDataArgs.dataFlags) === "string") {
			listDataArgs.dataFlags = parseInt(listDataArgs.dataFlags, 10);
			if (isNaN(listDataArgs.dataFlags)) {
				listDataArgs.dataFlags = -1;
			}
        } else if (typeof(listDataArgs.dataFlags) !== "number") {
			listDataArgs.dataFlags = -1;
		}

		JNEXT.invoke(self.m_id, "listData " + JSON.stringify(listDataArgs));
		return "";
	};

	self.idsChallenge = function (args, pluginResult, onSuccess, onFail) {
        var challengeArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
								"provider" : JSON.parse(decodeURIComponent(args.provider)),
								"challengeType" : JSON.parse(decodeURIComponent(args.challengeType)),
								"challengeFlags" : JSON.parse(decodeURIComponent(args.challengeFlags)) };

		self.eventHandlers[challengeArgs._eventId] = {
                "result" : pluginResult,
                "action" : "challenge",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };

        // Make sure provider is a string to pass to C
		if (typeof(challengeArgs.provider) !== "string") {
			challengeArgs.provider = "";
		}

		// Make sure type is an int to pass to C
        if (typeof(challengeArgs.challengeType) === "string") {
			challengeArgs.challengeType = parseInt(challengeArgs.challengeType, 10);
			if (isNaN(challengeArgs.challengeType)) {
				challengeArgs.challengeType = -1;
			}
        } else if (typeof(challengeArgs.challengeType) !== "number") {
			challengeArgs.challengeType = -1;
		}

		// Make sure flags is an int to pass to C
        if (typeof(challengeArgs.challengeFlags) === "string") {
			challengeArgs.challengeFlags = parseInt(challengeArgs.challengeFlags, 10);
			if (isNaN(challengeArgs.challengeFlags)) {
				challengeArgs.challengeFlags = -1;
			}
        } else if (typeof(challengeArgs.challengeFlags) !== "number") {
			challengeArgs.challengeFlags = -1;
		}

		JNEXT.invoke(self.m_id, "challenge " + JSON.stringify(challengeArgs));
		return "";
	};

	self.idsRegisterNotifier = function (args, pluginResult, onSuccess, onFail) {
        var notifierArgs = { "_eventId" : JSON.parse(decodeURIComponent(args.callbackId)),
								"provider" : JSON.parse(decodeURIComponent(args.provider)),
								"notifierType" : JSON.parse(decodeURIComponent(args.notifierType)),
								"notifierFlags" : JSON.parse(decodeURIComponent(args.notifierFlags)),
								"notifierName" : JSON.parse(decodeURIComponent(args.notifierName)) };

		self.eventHandlers[notifierArgs._eventId] = {
                "result" : pluginResult,
                "action" : "registerNotifier",
                "handler" : self.idsResponseHandler,
                "success" : onSuccess,
                "failure" : onFail,
                "error" : true
            };

        // Make sure provider is a string to pass to C
		if (typeof(notifierArgs.provider) !== "string") {
			notifierArgs.provider = "";
		}

		// Make sure type is an int to pass to C
        if (typeof(notifierArgs.notifierType) === "string") {
			notifierArgs.notifierType = parseInt(notifierArgs.notifierType, 10);
			if (isNaN(notifierArgs.notifierType)) {
				notifierArgs.notifierType = -1;
			}
        } else if (typeof(notifierArgs.notifierType) !== "number") {
			notifierArgs.notifierType = -1;
		}

		// Make sure flags is an int to pass to C
        if (typeof(notifierArgs.notifierFlags) === "string") {
			notifierArgs.notifierFlags = parseInt(notifierArgs.notifierFlags, 10);
			if (isNaN(notifierArgs.notifierFlags)) {
				notifierArgs.notifierFlags = -1;
			}
        } else if (typeof(notifierArgs.notifierFlags) !== "number") {
			notifierArgs.notifierFlags = -1;
		}

        // Make sure name is a string to pass to C
		if (typeof(notifierArgs.notifierName) !== "string") {
			notifierArgs.notifierName = "";
		}

		JNEXT.invoke(self.m_id, "registerNotifier " + JSON.stringify(notifierArgs));
		return "";
	};

    self.getId = function () {
        return self.m_id;
    };
    
	self.onEvent = function (strData) {
		var delim = strData.indexOf(" "),
			strEventDesc = strData.substring(0, delim),
			strEventData = strData.substring(delim + 1, strData.length),
			resultJSON;
		strEventDesc = strEventDesc.replace(/["']{1}/gi, "");

		resultJSON = JSON.parse(strEventData);
		self.eventHandlers[strEventDesc].handler(strEventData, self.eventHandlers[strEventDesc].result);
	};
	
	self.init = function () {
        if (!JNEXT.require("libidsext")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libidsext.IDSEXT");

        if (self.m_id === "") {
			return false;
        }

        JNEXT.registerEvents(self);
    };
	
    self.m_id = "";
    self.eventHandlers = {};

    self.getInstance = function () {
        if (!hasInstance) {
            self.init();
            hasInstance = true;
        }
        return self;
    };
};

ids = new JNEXT.IDS();

module.exports = {
	ids: ids
};