/*
 * Copyright 2014 BlackBerry Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/


function getPropertiesSuccess(properties) {
    alert("Get properties returned the following user properties:");

    for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            alert("Property: " + properties[prop].uri + " value: " + properties[prop].value);
        }
    }
}

function getPropertiesFailure(result) {
    alert("Failed to retrieve user properties: " + result.result + " details: " + result.failureInfo);
}

function getBBIDProperties() {
    blackberry.user.identity.registerProvider("ids:rim:bbid");
    blackberry.user.identity.getProperties("ids:rim:bbid", 0, "urn:bbid:firstname,urn:bbid:lastname", getPropertiesSuccess, getPropertiesFailure);
}

