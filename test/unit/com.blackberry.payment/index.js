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
var _apiDir = __dirname + "/../../../plugin/com.blackberry.payment/",
    _libDir = __dirname + "/../../../lib/",
    index,
    mockJnextObjId = 123,
    mockWindowGroup = "bar1234",
    mockedPluginResult = {
        ok: jasmine.createSpy("PluginResult.ok"),
        error: jasmine.createSpy("PluginResult.error"),
        noResult: jasmine.createSpy("PluginResult.noResult"),
        callbackOk: jasmine.createSpy("PluginResult.callbackOk")
    },
    bpsSuccess,
    mockSuccessResult = {
        successState: {
            state: "SUCCESS"
        }
    },
    mockErrorResult;

function getMockErrorObj(msg) {
    return {
        successState: {
            state: "BPS_FAILURE"
        },
        errorObject: {
            errorID: "-1",
            errorText: msg
        }
    };
}

function testPurchase(mockSuccess) {
    var args = {
            digitalGoodID: encodeURIComponent(JSON.stringify("12345")),
            digitalGoodSKU: encodeURIComponent(JSON.stringify("abcde")),
            digitalGoodName: encodeURIComponent(JSON.stringify("foo")),
            metaData: encodeURIComponent(JSON.stringify("xyz")),
            purchaseAppName: encodeURIComponent(JSON.stringify("app name")),
            purchaseAppIcon: encodeURIComponent(JSON.stringify("app icon")),
            extraParameters: encodeURIComponent(JSON.stringify(""))
        },
        jNextArgs = {
        };

    bpsSuccess = mockSuccess;

    index.purchase(mockedPluginResult, args);

    Object.getOwnPropertyNames(args).forEach(function (key) {
        jNextArgs[key] = JSON.parse(decodeURIComponent(args[key]));
    });

    jNextArgs.windowGroup = mockWindowGroup;

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "purchase " + JSON.stringify(jNextArgs));
    expect(mockedPluginResult.ok).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("Purchase Failed. Payment Service Error."));
    expect(mockedPluginResult.error).not.toHaveBeenCalled();
}

function testCancelSubscription(mockSuccess) {
    var transactionID = "12345",
        args = {
            transactionID: encodeURIComponent(JSON.stringify(transactionID))
        },
        jNextArgs = {
            transactionID: transactionID,
            windowGroup: mockWindowGroup
        };

    bpsSuccess = mockSuccess;

    index.cancelSubscription(mockedPluginResult, args);

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "cancelSubscription " + JSON.stringify(jNextArgs));
    expect(mockedPluginResult.ok).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("cancelSubscription Failed. Payment Service Error."));
    expect(mockedPluginResult.error).not.toHaveBeenCalled();
}

function testGetPrice(mockSuccess) {
    var args = {
            id: encodeURIComponent(JSON.stringify("123")),
            sku: encodeURIComponent(JSON.stringify("abc"))
        },
        jNextArgs = {
            id: "123",
            sku: "abc",
            windowGroup: mockWindowGroup
        };

    bpsSuccess = mockSuccess;

    index.getPrice(mockedPluginResult, args);

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getPrice " + JSON.stringify(jNextArgs));
    expect(mockedPluginResult.ok).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("getPrice Failed. Payment Service Error."));
    expect(mockedPluginResult.error).not.toHaveBeenCalled();
}

function testGetExistingPurchases(mockSuccess) {
    var refresh = true,
        args = {
            refresh: encodeURIComponent(JSON.stringify(refresh))
        },
        jNextArgs = {
            refresh: refresh,
            windowGroup: mockWindowGroup
        };

    bpsSuccess = mockSuccess;

    index.getExistingPurchases(mockedPluginResult, args);

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getExistingPurchases " + JSON.stringify(jNextArgs));
    expect(mockedPluginResult.ok).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("getExistingPurchases Failed. Payment Service Error."));
    expect(mockedPluginResult.error).not.toHaveBeenCalled();
}

function testCheckExisting(mockSuccess) {
    var args = {
            id: encodeURIComponent(JSON.stringify("123")),
            sku: encodeURIComponent(JSON.stringify("abc"))
        },
        jNextArgs = {
            id: "123",
            sku: "abc",
            windowGroup: mockWindowGroup
        };

    bpsSuccess = mockSuccess;

    index.checkExisting(mockedPluginResult, args);

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "checkExisting " + JSON.stringify(jNextArgs));
    expect(mockedPluginResult.ok).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("checkExisting Failed. Payment Service Error."));
    expect(mockedPluginResult.error).not.toHaveBeenCalled();
}

describe("payment index", function () {
    beforeEach(function () {
        GLOBAL.window = {
            qnx: {
                webplatform: {
                    getController: function () {
                        return {
                            windowGroup: mockWindowGroup
                        };
                    }
                }
            }
        };

        GLOBAL.JNEXT = {
            require: jasmine.createSpy("JNEXT.require").andCallFake(function () {
                return true;
            }),
            createObject: jasmine.createSpy("JNEXT.createObject").andCallFake(function () {
                return mockJnextObjId;
            }),
            invoke: jasmine.createSpy("JNEXT.invoke").andCallFake(function () {
                if (bpsSuccess) {
                    return JSON.stringify(mockSuccessResult);
                } else {
                    return "-1";
                }
            }),
            registerEvents: jasmine.createSpy("JNEXT.registerEvent")
        };

        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.JNEXT;
        delete require.cache[require.resolve(_apiDir + "index")];
    });

    describe("developmentMode", function () {
        it("calling it with arg invoke jnext setDevelopmentMode", function () {
            var args = {
                developmentMode: encodeURIComponent(JSON.stringify(true))
            };

            index.developmentMode(mockedPluginResult, args);

            Object.getOwnPropertyNames(args).forEach(function (key) {
                args[key] = JSON.parse(decodeURIComponent(args[key]));
            });

            expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "setDevelopmentMode " + JSON.stringify(args));
            expect(mockedPluginResult.ok).toHaveBeenCalled();
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });

        it("calling it without arg invoke jnext getDevelopmentMode", function () {
            index.developmentMode(mockedPluginResult);

            expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getDevelopmentMode");
            expect(mockedPluginResult.ok).toHaveBeenCalled();
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });
    });

    describe("purchase", function () {
        it("invoke jnext purchase, invoke callback with success", function () {
            testPurchase(true);
        });

        it("invoke jnext purchase, invoke callback with error", function () {
            testPurchase(false);
        });
    });

    describe("cancelSubscription", function () {
        it("invoke jnext cancelSubscription, invoke callback with success", function () {
            testCancelSubscription(true);
        });

        it("invoke jnext cancelSubscription, invoke callback with error", function () {
            testCancelSubscription(false);
        });
    });

    describe("getPrice", function () {
        it("invoke jnext getPrice, invoke callback with success", function () {
            testGetPrice(true);
        });

        it("invoke jnext getPrice, invoke callback with error", function () {
            testGetPrice(false);
        });
    });

    describe("getExistingPurchases", function () {
        it("invoke jnext getExistingPurchases, invoke callback with success", function () {
            testGetExistingPurchases(true);
        });

        it("invoke jnext getExistingPurchases, invoke callback with error", function () {
            testGetExistingPurchases(false);
        });
    });

    describe("checkExisting", function () {
        it("invoke jnext checkExisting, invoke callback with success", function () {
            testCheckExisting(true);
        });

        it("invoke jnext checkExisting, invoke callback with error", function () {
            testCheckExisting(false);
        });
    });
});
