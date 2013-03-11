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

cordova.define("cordova/plugin/blackberry.invoked", function (require, exports, module) {
    var _self = {},
        _ID = "blackberry.invoked";

    _self.cardResizeDone = function () {
        window.webworks.execSync(_ID, "cardResizeDone");
    };

    _self.cardStartPeek = function (peekType) {
        window.webworks.execSync(_ID, "cardStartPeek", {'peekType': peekType});
    };

    _self.cardRequestClosure = function (request) {
        window.webworks.execSync(_ID, "cardRequestClosure", {request: request});
    };

    window.webworks.execSync(_ID, "registerEvents", null);

    module.exports = _self;
});

if (typeof blackberry === "undefined") {
    blackberry = {};
}

blackberry.invoked = cordova.require("cordova/plugin/blackberry.invoked");
