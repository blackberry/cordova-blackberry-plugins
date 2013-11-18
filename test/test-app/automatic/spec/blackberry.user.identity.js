/*
 * Copyright 2014 BlackBerry Limited.
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
describe("blackberry.user.identity", function () {
    var onSuccessSpy, onErrorSpy, delay, properties;

    beforeEach(function () {
        delay = 5000;
        onSuccessSpy = jasmine.createSpy("onSuccessSpy");
        onErrorSpy = jasmine.createSpy("onErrorSpy");
    });

    it("blackberry.user.identity should exist", function () {
        expect(blackberry.user.identity).toBeDefined();
    });

    it("getVersion should output the version", function () {
        expect(blackberry.user.identity.getVersion()).toEqual(jasmine.any(String));
    });

    it("registerProvider should accept bbid as an identity provider", function () {
        expect(blackberry.user.identity.registerProvider("ids:rim:bbid").result).toEqual(0);
    });

    it("registerProvider should have errorDescription if identity provider is not valid", function () {
        expect(blackberry.user.identity.registerProvider("I am not valid").errno).toEqual("Invalid argument");
    });

    it("setOption should be able to set GUI allowed to true", function () {
        expect(blackberry.user.identity.setOption(0, true).result).toEqual(0);
    });

    it("setOption should error with invalid parameters", function () {
        expect(blackberry.user.identity.setOption(2, "iAmNotValid").errno).toEqual("Invalid argument");
    });

    it("setOption should be able to set Group ID", function () {
        expect(blackberry.user.identity.setOption(1, '5').result).toEqual(0);
    });

    it("setOption should be able to change verbosity", function () {
        expect(blackberry.user.identity.setOption(2, "Silent").result).toEqual(0);
        expect(blackberry.user.identity.setOption(2, "Normal").result).toEqual(0);
        expect(blackberry.user.identity.setOption(2, "Verbose").result).toEqual(0);
    });

    it("createData should create data and delete data", function () {
        blackberry.user.identity.registerProvider("ids:rim:profile");
        //delete any data that potentially exists
        blackberry.user.identity.deleteData("ids:rim:profile", 1, 0, "sampleName", onSuccessSpy, onErrorSpy);
        onSuccessSpy = jasmine.createSpy("onSuccessSpy"); //resetting the callCount
        blackberry.user.identity.createData("ids:rim:profile", 1, 0, "sampleName", "johndoe123", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onSuccessSpy.callCount;
        }, "wait for success callback", delay);
    });

    it("createData should error on duplication creation", function () {
        blackberry.user.identity.createData("ids:rim:profile", 1, 0, "sampleName", "johndoe123", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onErrorSpy.callCount;
        }, "wait for error callback", delay);
    });

    it("registerNotifier should register a notifier on existing data", function () {
        var onChangeSpy = jasmine.createSpy("onChangeSpy"),
            params = {
                name: "sampleName",
                notification: jasmine.any(Number),
                type: 1
            };

        blackberry.user.identity.registerNotifier("ids:rim:profile", 1, 0, "sampleName", onChangeSpy);

        expect(onChangeSpy).toHaveBeenCalledWith(params);
    });

    it("setData should be able to set data", function () {
        blackberry.user.identity.setData("ids:rim:profile", 1, 0, "sampleName", "settingNewData", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onSuccessSpy.callCount;
        }, "wait for success callback", delay);
    });

    it("setData should error if there is no prior data", function () {
        blackberry.user.identity.setData("ids:rim:bbid", 1, 0, "iDontEvenExist", "johndoe123", onSuccessSpy, onErrorSpy);

        waitsFor(function() {
            return onErrorSpy.callCount;
        }, "wait for error callback", delay);
    });

    it("getProperties should be able to get a single blackberry id property", function () {
        properties = {
            propertyCount: 1,
            requestId: jasmine.any(Number),
            userProperties: [
                {uri: "urn:bbid:firstname", value: jasmine.any(String)}
            ]
        }

        blackberry.user.identity.registerProvider("ids:rim:bbid");
        blackberry.user.identity.getProperties("ids:rim:bbid", 0, "urn:bbid:firstname", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onSuccessSpy.callCount;
        }, "wait for success callback", delay);

        runs(function () {
            expect(onSuccessSpy).toHaveBeenCalledWith(properties);
        });
    });

    it("getProperties should be able to get multiple blackberry id properties", function () {
        properties = {
            propertyCount: 2,
            requestId: jasmine.any(Number),
            userProperties: [
                {uri: "urn:bbid:firstname", value: jasmine.any(String)},
                {uri: "urn:bbid:lastname", value: jasmine.any(String)}
            ]
        }

        blackberry.user.identity.registerProvider("ids:rim:bbid");
        blackberry.user.identity.getProperties("ids:rim:bbid", 0, "urn:bbid:firstname,urn:bbid:lastname", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onSuccessSpy.callCount;
        }, "wait for success callback", delay);

        runs(function () {
            expect(onSuccessSpy).toHaveBeenCalledWith(properties);
        });
    });

    it("getProperties should error on invalid property lists", function () {
        blackberry.user.identity.getProperties("ids:rim:bbid", 0, "iDontEvenExist", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onErrorSpy.callCount;
        }, "wait for error callback", delay);
    });

    it("getToken should be able to receive a token", function () {
    // refer to the Test Plan to see how to get this test passing
        properties = {
            paramCount: 1,
            requestId: jasmine.any(Number),
            token: jasmine.any(String),
            tokenParams: [{
                name: "TOKEN_SECRET",
                value: jasmine.any(String)
            }]
        }

        blackberry.user.identity.getToken("ids:rim:bbid", "AppWorld", "urn:bbid:appworld:appworld", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onSuccessSpy.callCount;
        }, "wait for success callback", delay);

        runs(function () {
            expect(onSuccessSpy).toHaveBeenCalledWith(properties);
        });
    });

    it("clearToken should delete a token", function () {
    // refer to the Test Plan to see how to get this test passing
        properties = {
            clear: true,
            requestId: jasmine.any(Number)
        }

        blackberry.user.identity.clearToken("ids:rim:bbid", "AppWorld","urn:bbid:appworld:appworld", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onSuccessSpy.callCount;
        }, "wait for success callback", delay);

        runs(function () {
            expect(onSuccessSpy).toHaveBeenCalledWith(properties);
        });
    });

    it("getToken should error on invalid token and appliesTo", function () {
    // refer to the Test Plan to see how to get this test passing
        blackberry.user.identity.getToken("ids:rim:bbid", "iNotValid", "validity=no", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onErrorSpy.callCount;
        }, "wait for error callback", delay);
    });

    it("clearToken should call success callback with {clear:false} if token has been removed already", function () {
    // refer to the Test Plan to see how to get this test passing
        properties = {
            clear: false,
            requestId: jasmine.any(Number)
        }

        blackberry.user.identity.clearToken("ids:rim:bbid", "AppWorld","urn:bbid:appworld:appworld", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onSuccessSpy.callCount;
        }, "wait for success callback", delay);

        runs(function () {
            expect(onSuccessSpy).toHaveBeenCalledWith(properties);
        });

    });

    it("clearToken should error on invalid parameters", function () {
    // refer to the Test Plan to see how to get this test passing
        blackberry.user.identity.clearToken("ids:rim:bbid", "iNotValid", "validity=no", onSuccessSpy, onErrorSpy);

        waitsFor(function () {
            return onErrorSpy.callCount;
        }, "wait for error callback", delay);
    });
});
