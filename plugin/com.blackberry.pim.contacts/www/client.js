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
    _ID = "com.blackberry.pim.contacts",
    contactConsts = require("./contactConsts"),
    Contact = require("./Contact"),
    ContactName = require("./ContactName"),
    ContactOrganization = require("./ContactOrganization"),
    ContactAddress = require("./ContactAddress"),
    ContactField = require("./ContactField"),
    ContactPhoto = require("./ContactPhoto"),
    ContactError = require("./ContactError"),
    ContactFindOptions = require("./ContactFindOptions"),
    ContactNews = require("./ContactNews"),
    ContactActivity = require("./ContactActivity"),
    ContactPickerOptions = require("./ContactPickerOptions"),
    ContactAccount = require("./ContactAccount"),
    contactUtils = require("./contactUtils"),
    _contactInvokeEventId = "invokeContactPicker.invokeEventId",
    _contactPickerEventId = "invokeContactPicker.eventId";

function invokeCallback(callback, args) {
    if (callback && typeof callback === "function") {
        callback(args);
    }
}

_self.find = function (contactFields, findOptions, onFindSuccess, onFindError) {
    var callback,
        tempContact,
        eventId;

    if (!contactFields || !contactFields.length || !onFindSuccess || typeof onFindSuccess !== "function") {
        contactUtils.invokeErrorCallback(onFindError, ContactError.INVALID_ARGUMENT_ERROR);
        return;
    } else {
        tempContact = new Contact();

        contactFields.forEach(function (field) {
            if (!tempContact.hasOwnProperty(field)) {
                contactUtils.invokeErrorCallback(onFindError, ContactError.INVALID_ARGUMENT_ERROR);
            }
        });
    }
    if (!contactUtils.validateFindArguments(findOptions)) {
        contactUtils.invokeErrorCallback(onFindError, ContactError.INVALID_ARGUMENT_ERROR);
        return;
    }

    callback = function (args) {
        var result = JSON.parse(unescape(args.result)),
            contacts = result.contacts,
            realContacts = [];

        if (result._success) {
            if (contacts) {
                contacts.forEach(function (contact) {
                    contact.id = contact.id.toString();
                    contactUtils.populateContact(contact);
                    realContacts.push(new Contact(contact));
                });
            }
            onFindSuccess(realContacts);
        } else {
            invokeCallback(onFindError, new ContactError(result.code));
        }
    };

    eventId = contactUtils.guid();

    window.webworks.event.once(_ID, eventId, callback);

    window.webworks.exec(function () {}, function () {}, _ID, "find", {
        "_eventId": eventId,
        "fields": contactFields,
        "options": findOptions
    });
};

_self.getContact = function (contactId) {
    if (!contactId || typeof contactId !== "string") {
        return null;
    } 

    var obj,
        success = function (data, response) {
            obj = data;
        },
        fail = function (data, response) {
            throw data;
        };

    window.webworks.exec(success, fail, _ID, "getContact", {
        "contactId": contactId
    });

    if (obj) {
        contactUtils.populateContact(obj);
        return new Contact(obj);
    } else {
        return null;
    }
};

_self.create = function (properties) {
    var args = {},
        key;

    for (key in properties) {
        if (properties.hasOwnProperty(key)) {
            args[key] = properties[key];
        }
    }

    args.id = null;

    return new Contact(args);
};

_self.invokeContactPicker = function (options, onDone, onCancel, onInvoke) {
   /*
    * options = {
    *     mode: Single or Multiple or Attribute, // if mode=Attribute, then must specify kind filters
    *     title: "some string",
    *     confirmButtonLabel: "some string",
    *     fields: ["phoneNumbers", "emails", "urls"]
    * }
    */
    var doneCancelCallback = function (data, reason) {
            switch (reason) {
            case "cancel":
                if (onCancel && typeof(onCancel) === "function") {
                    onCancel();
                }

                break;
            case "done":
                if (onDone && typeof(onDone) === "function") {
                    onDone(data);
                }

                break;
            }
        },
        invokeCallback = function (args) {
            var result = JSON.parse(unescape(args.result)),
                error;

            if (!result._success) {
                error = new ContactError(result.code);
                window.webworks.event.remove(_ID, _contactPickerEventId, doneCancelCallback);
            }

            if (onInvoke && typeof(onInvoke) === "function") {
                onInvoke(error);
            }
        };

    if (!options) {
        options = new ContactPickerOptions();
    } else {
        if (!contactUtils.validateContactsPickerOptions(options)) {
            if (onInvoke && typeof(onInvoke) === "function") {
                onInvoke(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            }
            return;
        }
    }

    if (!window.webworks.event.isOn(_contactPickerEventId)) {
        window.webworks.event.once(_ID, _contactPickerEventId, doneCancelCallback);
    }

    if (!window.webworks.event.isOn(_contactInvokeEventId)) {
        window.webworks.event.once(_ID, _contactInvokeEventId, invokeCallback);
    }

    window.webworks.exec(function () {}, function () {}, _ID, "invokeContactPicker", {options: options || ""});
};

_self.getContactAccounts = function () {
    var obj,
        success = function (data, response) {
            obj = data;
        },
        fail = function (data, response) {
            throw data;
        },
        accounts = [];

    window.webworks.exec(success, fail, _ID, "getContactAccounts");

    obj.forEach(function (account) {
        accounts.push(new ContactAccount(account));
    });

    return accounts;
};

_self.Contact = Contact;
_self.ContactField = ContactField;
_self.ContactAddress = ContactAddress;
_self.ContactName = ContactName;
_self.ContactOrganization = ContactOrganization;
_self.ContactPhoto = ContactPhoto;
_self.ContactError = ContactError;
_self.ContactFindOptions = ContactFindOptions;
_self.ContactNews = ContactNews;
_self.ContactActivity = ContactActivity;
_self.ContactPickerOptions = ContactPickerOptions;
_self.ContactAccount = ContactAccount;

module.exports = _self;
