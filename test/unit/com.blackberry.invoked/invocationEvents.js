/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var _apiDir = __dirname + "/../../../plugin/com.blackberry.invoked/",
    _libDir = __dirname + "/../../../lib/",
    invocationEvents,
    startupMode,
    mockedInvocation,
    trigger;

describe("invoked invocationEvents", function () {
    beforeEach(function () {
        mockedInvocation = {
            on: jasmine.createSpy("invocation addEventListener"),
            un: jasmine.createSpy("invocation removeEventListener"),
            getStartupMode: jasmine.createSpy("getStartupMode").andCallFake(function () {
                return startupMode;
            }),
            getRequest: jasmine.createSpy("invocation getRequest"),
            LAUNCH: 0
        };
        GLOBAL.window = {
            wp: {
                core: {
                    invocation: mockedInvocation
                }
            }
        };
        GLOBAL.wp = window.wp;
        startupMode = 1;
        //since multiple tests are requiring invocation events we must unrequire
        var name = require.resolve(_apiDir + "invocationEvents");
        delete require.cache[name];
        invocationEvents = require(_apiDir + "invocationEvents");
        trigger = function () {};
    });

    afterEach(function () {
        mockedInvocation = null;
        delete GLOBAL.wp;
        delete GLOBAL.window.wp;
        delete GLOBAL.window;
    });

    describe("addEventListener", function () {
        var trigger = jasmine.createSpy("trigger");

        it("calls framework setOnInvoked for 'invoked' event", function () {
            invocationEvents.addEventListener("invoked", trigger);
            expect(mockedInvocation.on).toHaveBeenCalledWith("Invoked", trigger);
        });

        it("calls framework setOnInvoked right away when startupMode is Invoke", function () {
            invocationEvents.addEventListener("invoked", trigger);
            expect(mockedInvocation.on).toHaveBeenCalledWith("Invoked", trigger);
            expect(trigger).toHaveBeenCalled();
        });
    });

    describe("removeEventListener", function () {
        it("calls framework setOnInvoked for 'invoked' event", function () {
            invocationEvents.removeEventListener("invoked", trigger);
            expect(mockedInvocation.un).toHaveBeenCalledWith("Invoked", trigger);
        });
    });

    describe("onCardResize", function () {
        it("add proper event to invocation for 'oncardresize'", function () {
            invocationEvents.addEventListener("oncardresize", trigger);
            expect(mockedInvocation.on).toHaveBeenCalledWith("cardResize", trigger);
        });

        it("remove proper event from invocation for 'oncardresize", function () {
            invocationEvents.removeEventListener("oncardresize", trigger);
            expect(mockedInvocation.un).toHaveBeenCalledWith("cardResize", trigger);
        });
    });

    describe("onCardClosed", function () {
        it("add proper event to invocation for 'oncardclosed'", function () {
            invocationEvents.addEventListener("oncardclosed", trigger);
            expect(mockedInvocation.on).toHaveBeenCalledWith("cardClosed", trigger);
        });

        it("remove proper event from invocation for 'oncardclosed", function () {
            invocationEvents.removeEventListener("oncardclosed", trigger);
            expect(mockedInvocation.un).toHaveBeenCalledWith("cardClosed", trigger);
        });
    });
});

