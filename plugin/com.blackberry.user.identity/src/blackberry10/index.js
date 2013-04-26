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

var ids = require("./IDSJNEXT").ids;

module.exports = {
    getVersion: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		result.ok(ids.getInstance().idsGetVersion(), true);
	},

    registerProvider: function (success, fail, args, env) {
		var key,
		result = new PluginResult(args, env);
        for (key in args) {
			if (key === "provider") {
				result.ok(ids.getInstance().idsRegisterProvider(JSON.parse(decodeURIComponent(args[key]))), true);
			}
        }
    },
    
    setOption: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		result.ok(ids.getInstance().idsSetOption(args));
    },
	getToken: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsGetToken(args, result, success, fail);
	},
	clearToken: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsClearToken(args, result, success, fail);
	},
	getProperties: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsGetProperties(args, result, success, fail);
	},
	getData: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsGetData(args, result, success, fail);
	},
	createData: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsCreateData(args, result, success, fail);
	},
	deleteData: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsDeleteData(args, result, success, fail);
	},
	setData: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsSetData(args, result, success, fail);
	},
	listData: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsListData(args, result, success, fail);
	},
	challenge: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsChallenge(args, result, success, fail);
	},
	registerNotifier: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		ids.getInstance().idsRegisterNotifier(args, result, success, fail);
	}
};