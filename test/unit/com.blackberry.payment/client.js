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

var _extDir = __dirname + "/../../../plugin",
    _ID = "com.blackberry.payment",
    _apiDir = _extDir + "/" + _ID,
    client;

describe("payment client", function () {
    beforeEach(function () {
        GLOBAL.cordova = {
            require: function () {
                return cordova.exec;
            },
            exec: jasmine.createSpy("exec")
        };
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        delete require.cache[require.resolve(_apiDir + "/www/client")];
    });

    describe("developmentMode", function () {
        it("getting developmentMode should return value from exec", function () {
            cordova.exec.andCallFake(function (success, fail, service, action, args) {
                success(false);
            });
            expect(client.developmentMode).toEqual(false);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "developmentMode");
        });

        it("setting developmentMode should call exec with user-specified value", function () {
            client.developmentMode = true;
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "developmentMode", {
                "developmentMode": true
            });
        });
    });

    describe("purchase", function () {
        it("calling purchase() with invalid params will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.purchase(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Purchase argument is not provided or is not a object."
            });
            expect(cordova.exec).not.toHaveBeenCalled();
        });

        it("calling purchase() with right params should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error"),
                args = {
                    "digitalGoodID": "12345",
                    "digitalGoodSKU": "12345",
                    "digitalGoodName": "Hello World",
                    "metaData": "meta",
                    "purchaseAppName": "test app",
                    "purchaseAppIcon": "icon",
                    "extraParameters": {}
                };

            client.purchase(args, successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "purchase", args, true);
        });
    });

    describe("getExistingPurchases", function () {
        it("calling getExistingPurchases() with non-boolean will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getExistingPurchases(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Refresh argument is not provided or is not a boolean value."
            });
            expect(cordova.exec).not.toHaveBeenCalled();
        });

        it("calling getExistingPurchases() with right params should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getExistingPurchases(true, successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getExistingPurchases", {
                "refresh": true
            }, true);
        });
    });

    describe("cancelSubscription", function () {
        it("calling cancelSubscription with non-string will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.cancelSubscription(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Transaction ID is not provided or not a string value."
            });
            expect(cordova.exec).not.toHaveBeenCalled();
        });

        it("calling cancelSubscription with right params should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.cancelSubscription("abc", successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "cancelSubscription", {
                "transactionID": "abc"
            }, true);
        });
    });

    describe("getPrice", function () {
        it("calling getPrice with non-string will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getPrice(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Either ID or SKU needs to be provided as string."
            });
            expect(cordova.exec).not.toHaveBeenCalled();
        });

        it("calling getPrice with missing sku or id will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                foo: "bar"
            }, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Either ID or SKU needs to be provided as string."
            });
            expect(cordova.exec).not.toHaveBeenCalled();
        });

        it("calling getPrice with sku should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getPrice({
                "sku": "abc"
            }, successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getPrice", {
                "id": "",
                "sku": "abc"
            }, true);
        });

        it("calling getPrice with id should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getPrice({
                "id": "123"
            }, successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getPrice", {
                "sku": "",
                "id": "123"
            }, true);
        });

        it("calling getPrice with both id and sku should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getPrice({
                "sku": "abc",
                "id": "123"
            }, successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getPrice", {
                "sku": "abc",
                "id": "123"
            }, true);
        });
    });

    describe("checkExisting", function () {
        it("calling checkExisting with non-string will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Either ID or SKU needs to be provided as string."
            });
            expect(cordova.exec).not.toHaveBeenCalled();
        });

        it("calling checkExisting with missing sku or id will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                foo: "bar"
            }, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Either ID or SKU needs to be provided as string."
            });
            expect(cordova.exec).not.toHaveBeenCalled();
        });

        it("calling checkExisting with sku should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                "sku": "abc"
            }, successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "checkExisting", {
                "sku": "abc",
                "id": ""
            }, true);
        });

        it("calling checkExisting with id should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                "id": "123"
            }, successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "checkExisting", {
                "sku": "",
                "id": "123"
            }, true);
        });

        it("calling checkExisting with both id and sku should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                "sku": "abc",
                "id": "123"
            }, successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "checkExisting", {
                "sku": "abc",
                "id": "123"
            }, true);
        });
    });

    describe("checkAppSubscription", function () {
        it("calling checkExisting with right params should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkAppSubscription(successCb, errorCb);

            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "checkExisting", {
                "sku": "",
                "id": "-1"
            }, true);
        });
    });
});
