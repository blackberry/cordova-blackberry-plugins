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
    bbId = require(_apiDir + "/www/BlackBerryId");

describe("user.identity.blackberry.blackberryid", function () {
    it("constants should exist", function () {
        expect(bbId.BBID_PROVIDER_NAME).toEqual("ids:rim:bbid");
        expect(bbId.USERNAME_KEY).toEqual("urn:bbid:username");
        expect(bbId.SCREENNAME_KEY).toEqual("urn:bbid:screenname");
        expect(bbId.FIRSTNAME_KEY).toEqual("urn:bbid:firstname");
        expect(bbId.LASTNAME_KEY).toEqual("urn:bbid:lastname");
        expect(bbId.UID_KEY).toEqual("urn:bbid:uid");
        expect(bbId.EMAIL_KEY).toEqual("urn:bbid:email");
        expect(bbId.DATE_OF_BIRTH_KEY).toEqual("urn:bbid:dob");
        expect(bbId.COUNTRY_KEY).toEqual("urn:bbid:cc");
        expect(bbId.CORE_PROPERTY_TYPE).toEqual("0");
        expect(bbId.ASSURANCE_OFFLINE_AUTHENTICATED).toEqual("0");
        expect(bbId.ASSURANCE_ONLINE_AUTHENTICATED).toEqual("1");
        expect(bbId.BBID_AUTHENTICATE).toEqual("0");
        expect(bbId.BBID_CONFIRM_EMAIL).toEqual("1");
        expect(bbId.BBID_DATE_OF_BIRTH_CHALLENGE).toEqual("2");
        expect(bbId.BBID_CHALLENGE_DEFAULT).toEqual("0");
        expect(bbId.NOTIFY_STARTED).toEqual("0");
        expect(bbId.NOTIFY_STOPPED).toEqual("1");
        expect(bbId.NOTIFY_CHANGED).toEqual("2");
    });
});
