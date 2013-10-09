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
var _extDir = __dirname + "/../../../plugin",
    _apiDir = _extDir + "/com.blackberry.pim.contacts",
    _ID = "com.blackberry.pim.contacts",
    Contact,
    ContactError,
    mockedExec = jasmine.createSpy("exec");

describe("pim.contacts Contact", function () {
    beforeEach(function () {
        GLOBAL.cordova = {
            require: jasmine.createSpy().andReturn(mockedExec)
        };
        GLOBAL.window = {
            parseInt: jasmine.createSpy().andCallFake(function (obj) {
                return Number(obj);
            }),
            isNaN: jasmine.createSpy().andCallFake(function (obj) {
                return obj === "abc";
            })
        };
        Contact = require(_apiDir + "/www/Contact");
        ContactError = require(_apiDir + "/ContactError");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        delete GLOBAL.window;
    });

    describe("constructor", function () {
        it("can set the default values", function () {
            var contact = new Contact(),
                field;

            for (field in contact) {
                if (contact.hasOwnProperty(field)) {
                    if (field === "favorite") {
                        expect(contact[field]).toBe(false);
                    } else {
                        expect(contact[field]).toBe(null);
                    }
                }
            }
        });

        it("can populate the object based on the properties parameter", function () {
            var contact = new Contact({"displayName": "John Smith"}),
                field;

            for (field in contact) {
                if (contact.hasOwnProperty(field)) {
                    if (field === "displayName") {
                        expect(contact[field]).toBe("John Smith");
                    } else if (field === "favorite") {
                        expect(contact[field]).toBe(false);
                    } else {
                        expect(contact[field]).toBe(null);
                    }
                }
            }
        });

        it("populates the id and makes it read-only", function () {
            var contact = new Contact({"id": "0"});

            expect(contact.id).toBe("0");
            contact.id = "12345";
            expect(contact.id).toBe("0");
        });
    });

    describe("save", function () {
        it("calls exec", function () {
            var contact = new Contact(),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError");

            contact.save(onSaveSuccess, onSaveError);

            expect(mockedExec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "save", jasmine.any(Object));
        });

        it("calls the error callback when onSaveSuccess is omitted", function () {
            var contact = new Contact(),
                onSaveError = jasmine.createSpy("onSaveError");

            contact.save(null, onSaveError);

            expect(onSaveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR, message : 'onSuccess should be a function'});
        });

        it("calls the error callback when arguments are incorrect", function () {
            var contact = new Contact({"phoneNumbers": [{"value": "1234567890"}]}),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError");

            contact.save(onSaveSuccess, onSaveError);

            expect(onSaveSuccess).not.toHaveBeenCalled();
            expect(onSaveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR, message: "phoneNumbers.type at index 0 should be a string"});
        });

        it("calls the error callback when the id is incorrect", function () {
            var contact = new Contact({"id": "abc"}),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError");

            contact.save(onSaveSuccess, onSaveError);

            expect(onSaveSuccess).not.toHaveBeenCalled();
            expect(onSaveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR, message : 'id is required and must be a number'});
        });

        it("converts Date objects to strings", function () {
            var contact = new Contact({
                    "birthday": new Date("January 1, 1970"),
                    "anniversary": new Date("July 1, 1990")
                }),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError"),
                result;

            contact.save(onSaveSuccess, onSaveError);

            expect(mockedExec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "save", jasmine.any(Object));

            result = mockedExec.mostRecentCall.args[4];
            expect(result.birthday).toBe("Thu Jan 01 1970");
            expect(result.anniversary).toBe("Sun Jul 01 1990");
        });
    });

    describe("clone", function () {
        it("returns a Contact with a null id", function () {
            var contact = new Contact({"id": "0"}),
                clonedContact;

            clonedContact = contact.clone();

            expect(clonedContact.id).toBe(null);
            expect(contact.id).toBe("0");
        });

        it("copies all properties to the new Contact", function () {
            var contact = new Contact({
                    id: "0",
                    name: { "givenName": "John", "familyName": "Smith", "middleName": "H" },
                    displayName: "John",
                    nickname: "Johnny",
                    emails: [],
                    birthday: new Date("January 1, 1970")
                }),
                clonedContact,
                field;

            clonedContact = contact.clone();

            for (field in contact) {
                if (contact.hasOwnProperty(field)) {
                    if (field !== "id") {
                        expect(clonedContact[field]).toEqual(contact[field]);

                        if (contact[field] !== null &&
                            contact[field] !== undefined &&
                            typeof contact[field] === "object") {
                            expect(clonedContact[field]).not.toBe(contact[field], field + " was not deeply cloned");
                        }
                    }
                }
            }
        });
    });

    describe("remove", function () {
        it("calls the success callback", function () {
            var contact = new Contact({"id": "1"}),
                onRemoveSuccess = jasmine.createSpy("onRemoveSuccess"),
                onRemoveError = jasmine.createSpy("onRemoveError");

            contact.remove(onRemoveSuccess, onRemoveError);

            expect(mockedExec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "remove", jasmine.any(Object));
        });

        it("calls the error callback when the id is incorrect", function () {
            var contact = new Contact({"id": null}),
                onRemoveSuccess = jasmine.createSpy("onRemoveSuccess"),
                onRemoveError = jasmine.createSpy("onRemoveError");

            contact.remove(onRemoveSuccess, onRemoveError);
            expect(onRemoveSuccess).not.toHaveBeenCalled();
            expect(onRemoveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR});
        });

        it("calls the error callback when onRemoveSuccess is omitted", function () {
            var contact = new Contact({"id": null}),
                onRemoveError = jasmine.createSpy("onRemoveError");

            contact.remove(null, onRemoveError);

            expect(onRemoveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR});
        });
    });

    describe("remove", function () {
        it("has property sourceAccounts", function () {
            var contact = new Contact();
            expect(contact.sourceAccounts).toBeDefined();
        });
    });
});

