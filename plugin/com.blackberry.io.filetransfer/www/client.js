/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

var _self = {},
    exec = cordova.require("cordova/exec"),
    _ID = "com.blackberry.io.filetransfer";

function defineReadOnlyField(obj, field, value) {
    Object.defineProperty(obj, field, {
        "value": value,
        "writable": false
    });
}

_self.upload = function (filePath, server, successCallback, errorCallback, options) {
    var args = {
            "filePath": filePath,
            "server": server,
            "options": options || {}
        },
        success = function (args) {
            var obj = {};

            if (args.result === "success") {
                obj.bytesSent = args.bytesSent;
                obj.responseCode = args.responseCode;
                obj.response = unescape(args.response);
                successCallback(obj);
            } else if (args.result === "error") {
                obj.code = args.code;
                obj.source = args.source;
                obj.target = args.target;
                obj.http_status = args.http_status;

                errorCallback(obj);
            }
        };

    exec(success, errorCallback, _ID, "upload", args);
};

_self.download = function (source, target, successCallback, errorCallback) {
    var args = {
            "source": source,
            "target": target
        },
        success = function (args) {

            var obj = {};

            if (args.result === "success") {
                obj.isFile = args.isFile;
                obj.isDirectory = args.isDirectory;
                obj.name = args.name;
                obj.fullPath = unescape(args.fullPath);
                successCallback(obj);
            } else if (args.result === "error") {
                obj.code = args.code;
                obj.source = args.source;
                obj.target = args.target;
                obj.http_status = args.http_status;
                errorCallback(obj);
            }
        };

    exec(success, errorCallback, _ID, "download", args);
};

defineReadOnlyField(_self, "FILE_NOT_FOUND_ERR", 1);
defineReadOnlyField(_self, "INVALID_URL_ERR", 2);
defineReadOnlyField(_self, "CONNECTION_ERR", 3);
defineReadOnlyField(_self, "PERMISSIONS_ERR", 3);

module.exports = _self;
