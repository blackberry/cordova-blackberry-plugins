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

var _extDir = __dirname + "/../../../plugin/",
    _ID = "com.blackberry.user.identity",
    _apiDir = _extDir + _ID,
    bbProfile = require(_apiDir + "/www/BlackBerryProfile");

describe("user.identity.blackberry.profile", function () {
    it("constants should exist", function () {
        expect(bbProfile.BBPROFILE_PROVIDER_NAME).toEqual("ids:rim:profile");
        expect(bbProfile.PROFILE_TYPE_APP).toEqual("1");
        expect(bbProfile.PROFILE_TYPE_VENDOR).toEqual("2");
        expect(bbProfile.CREATE_DATA_DEFAULT).toEqual("0");
        expect(bbProfile.CREATE_DATA_ENCRYPT_D2D).toEqual("1");
        expect(bbProfile.CREATE_DATA_CACHED).toEqual("10");
        expect(bbProfile.GET_DATA_DEFAULT).toEqual("0");
        expect(bbProfile.GET_DATA_CACHED).toEqual("1");
        expect(bbProfile.SET_DATA_DEFAULT).toEqual("0");
        expect(bbProfile.SET_DATA_CACHED).toEqual("1");
        expect(bbProfile.DELETE_DATA_DEFAULT).toEqual("0");
        expect(bbProfile.DELETE_DATA_CACHE_ONLY).toEqual("1");
        expect(bbProfile.DELETE_DATA_CACHE_ALL).toEqual("2");
        expect(bbProfile.LIST_DATA_DEFAULT).toEqual("0");
        expect(bbProfile.NOTIFY_STARTED).toEqual("0");
        expect(bbProfile.NOTIFY_STOPPED).toEqual("1");
        expect(bbProfile.NOTIFY_CHANGED).toEqual("2");
    });
});
