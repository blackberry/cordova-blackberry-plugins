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
    _ID = "com.blackberry.user.identity.blackberryid";

function defineReadOnlyField(obj, field, value) {
    Object.defineProperty(obj, field, {
        "value": value,
        "writable": false
    });
}


/*
 * Define constants for type constants.
 */

/*
 * The identity provider name for BlackBerry ID.
 */
defineReadOnlyField(_self, "BBID_PROVIDER_NAME", "ids:rim:bbid");
/*
 * BlackBerry ID core property - Username.
 */
defineReadOnlyField(_self, "USERNAME_KEY", "urn:bbid:username");

/*
 * BlackBerry ID core property - Screen name.
 */
defineReadOnlyField(_self, "SCREENNAME_KEY", "urn:bbid:screenname");

/*
 * BlackBerry ID core property - First name.
 */
defineReadOnlyField(_self, "FIRSTNAME_KEY", "urn:bbid:firstname");

/*
 * BlackBerry ID core property - Last name.
 */
defineReadOnlyField(_self, "LASTNAME_KEY", "urn:bbid:lastname");

/*
 * BlackBerry ID core property - Unique ID.
 */
defineReadOnlyField(_self, "UID_KEY", "urn:bbid:uid");

/*
 * BlackBerry ID core property - Confirmed Email.
 */
defineReadOnlyField(_self, "EMAIL_KEY", "urn:bbid:email");

/*
 * BlackBerry ID core property - Date of Birth.
 */
defineReadOnlyField(_self, "DATE_OF_BIRTH_KEY", "urn:bbid:dob");

/*
 * BlackBerry ID core property - Country.
 */
defineReadOnlyField(_self, "COUNTRY_KEY", "urn:bbid:cc");

/*
 * BlackBerry ID core property type.
 */
defineReadOnlyField(_self, "CORE_PROPERTY_TYPE", "0");

/*
 * BlackBerry ID level of assurance when authentication was performed offline.
 */
defineReadOnlyField(_self, "ASSURANCE_OFFLINE_AUTHENTICATED", "0");

/*
 * BlackBerry ID level of assurance when authentication was performed online.
 */
defineReadOnlyField(_self, "ASSURANCE_ONLINE_AUTHENTICATED", "1");

/*
 * Authentication challenge type.
 */
defineReadOnlyField(_self, "BBID_AUTHENTICATE", "0");

/*
 * Confirm Email challenge type.
 */
defineReadOnlyField(_self, "BBID_CONFIRM_EMAIL", "1");

/*
 * Date of Birth challenge type.
 */
defineReadOnlyField(_self, "BBID_DATE_OF_BIRTH_CHALLENGE", "2");

/*
 * Default challenge flag.
 */
defineReadOnlyField(_self, "BBID_CHALLENGE_DEFAULT", "0");

/*
 * The request to receive notifications was successful. Change notifications 
 * will now be sent.
 */
defineReadOnlyField(_self, "NOTIFY_STARTED", "0");

/*
 * The request to stop receiving notifications was successful, or
 * the request to start receiving has failed. Change notifications will
 * NOT be sent.
 */
defineReadOnlyField(_self, "NOTIFY_STOPPED", "1");

/*
 * The provider has detected that the entry has changed and is
 * notifying the application. A change can include the entry being created,
 * deleted, or modified.
 */
defineReadOnlyField(_self, "NOTIFY_CHANGED", "2");

module.exports = _self;

