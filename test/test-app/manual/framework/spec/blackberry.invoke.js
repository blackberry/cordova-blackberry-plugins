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
var onSuccess,
    onError,
    onSuccessFlag,
    onErrorFlag,
    delay = 750;

describe("blackberry.invoke", function () {
    beforeEach(function () {
        onSuccessFlag = false;
        onErrorFlag = false;
        onSuccess = jasmine.createSpy("success callback").andCallFake(
            function () {
                onSuccessFlag = true;
            });
        onError = jasmine.createSpy("error callback").andCallFake(
            function () {
                onErrorFlag = true;
            });
    });

    afterEach(function () {
        onSuccess = null;
        onError = null;
        request = null;
        onSuccessFlag = false;
        onErrorFlag = false;
    });

    it('invoke should invoke google.com with unbound invocation', function () {
        var request = {
                uri: "http://www.google.com"
            },
            confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            confirm = window.confirm("Did it invoke?");

            expect(confirm).toEqual(true);
            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });
    });

    it('invoke should invoke blackberry.com with bound invocation', function () {
        var request = {
                target: "sys.browser",
                uri: "http://www.blackberry.com"
            },
            confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            confirm = window.confirm("Did it invoke?");

            expect(confirm).toEqual(true);
            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });
    });

    it('invoke should be able to invoke with tel protocol', function () {
        var request = {
            action: "bb.action.OPEN",
            uri: "tel:5555555555"
        },
        confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            confirm = window.confirm("Did it invoke?");

            expect(confirm).toEqual(true);
            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });
    });

    it('invoke should be able to invoke with sms protocol', function () {
        var request = {
            action: "bb.action.OPEN",
            uri: "sms:5555555555"
        },
        confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            confirm = window.confirm("Did it invoke?");

            expect(confirm).toEqual(true);
            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });
    });

    it('invoke should be able to invoke with pin protocol', function () {
        var request = {
            action: "bb.action.OPEN",
            uri: "pin:5555555555"
        },
        confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            confirm = window.confirm("Did it invoke?");

            expect(confirm).toEqual(true);
            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });
    });

    it('invoke should be able to invoke with mailto protocol', function () {
        var request = {
            action: "bb.action.OPEN",
            uri: "mailto:fake@fake.com"
        },
        confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            confirm = window.confirm("Did it invoke?");

            expect(confirm).toEqual(true);
            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });
    });

    it('invoke should be able to invoke with camera protocol', function () {
        var request = {
            action: "bb.action.OPEN",
            uri: "camera:"
        },
        confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            confirm = window.confirm("Did it invoke?");

            expect(confirm).toEqual(true);
            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });
    });

    it('invoke should fail with unknown protocol', function () {
        var request = {
            action: "bb.action.OPEN",
            uri: "unknown://:"
        },
        confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            confirm = window.confirm("Did it fail to invoke?");

            expect(confirm).toEqual(true);
            expect(onSuccess).not.toHaveBeenCalled();
            expect(onError).toHaveBeenCalled();
        });
    });

    describe("Cards", function () {
        var request = {
                target: "com.webworks.test.functional.invoke.card.target",
            },
            onChildCardClosed,
            onChildCardStartPeek,
            onChildCardEndPeek,
            confirm;

        beforeEach(function () {
            onChildCardClosed = jasmine.createSpy("onChildCardClosed event");
            onChildCardStartPeek = jasmine.createSpy("onChildCardStartPeek event");
            onChildCardEndPeek = jasmine.createSpy("onChildCardEndPeek event");
            document.addEventListener("onChildCardClosed", onChildCardClosed);
            document.addEventListener("onChildCardStartPeek", onChildCardStartPeek);
            document.addEventListener("onChildCardEndPeek", onChildCardEndPeek);
        });

        afterEach(function () {
            onChildCardClosed = null;
            onChildCardStartPeek = null;
            onChildCardEndPeek = null;
            document.removeEventListener("onChildCardClosed", onChildCardClosed);
            document.removeEventListener("onChildCardStartPeek", onChildCardStartPeek);
            document.removeEventListener("onChildCardEndPeek", onChildCardEndPeek);
            confirm = null;
        });

        it('invoke should invoke card', function () {
            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }

            waitsFor(function () {
                return onSuccessFlag || onErrorFlag;
            }, "The callback flag should be set to true", delay);

            runs(function () {
                waits(delay);

                runs(function () {
                    blackberry.invoke.closeChildCard();
                    confirm = window.confirm("Did it invoke card and then closed?");
                    expect(confirm).toEqual(true);
                    expect(onSuccess).toHaveBeenCalled();
                    expect(onError).not.toHaveBeenCalled();
                });
            });
        });

        it('invoke should not invoke card whith invalid target name', function () {
            request.target = "net.rim.webworks.invoke.invoke.invalid.card.target";

            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }

            waitsFor(function () {
                return onSuccessFlag || onErrorFlag;
            }, "The callback flag should be set to true", delay);

            runs(function () {
                confirm = window.confirm("Did it NOT invoke card?");
                expect(confirm).toEqual(true);
                expect(onSuccess).not.toHaveBeenCalled();
                expect(onError).toHaveBeenCalled();
            });
        });

        it('invoke should be able to call closeChildCard after successfully invoking a card', function () {
            request.target = "com.webworks.test.functional.invoke.card.target";

            alert("This test will invoke card and close it without user interaction.");

            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }

            waitsFor(function () {
                return onSuccessFlag || onErrorFlag;
            }, "The callback flag should be set to true", delay);

            runs(function () {
                expect(onSuccessFlag).toEqual(true);
                if (onSuccessFlag) {
                    waits(delay);

                    runs(function () {
                        blackberry.invoke.closeChildCard();
                        confirm = window.confirm("Did you see card opened and then closed by ITSELF?");
                        expect(confirm).toEqual(true);
                    });
                }
            });
        });
    });
});
