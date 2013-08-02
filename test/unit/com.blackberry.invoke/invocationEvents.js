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

var _apiDir = __dirname + "/../../../plugin/com.blackberry.invoke/",
    invocationEvents,
    startupMode,
    mockedInvocation,
    trigger;

describe("invoke invocationEvents", function () {
    beforeEach(function () {
        mockedInvocation = {
            on: jasmine.createSpy("invocation addEventListener"),
            un: jasmine.createSpy("invocation removeEventListener"),
            interrupter: undefined
        };
        GLOBAL.window = {
            wp: {
                core: {
                    invocation: mockedInvocation
                }
            }
        };

        //since multiple tests are requiring invocation events we must unrequire
        var name = require.resolve(_apiDir + "invocationEvents");
        delete require.cache[name];
        invocationEvents = require(_apiDir + "invocationEvents");
        trigger = function () {};
    });

    afterEach(function () {
        mockedInvocation = null;
        GLOBAL.window.qnx = null;
        trigger = null;
    });

    describe("onchildcardstartpeek", function () {
        it("add proper event to invocation for 'onchildcardstartpeek'", function () {
            invocationEvents.addEventListener("onchildcardstartpeek", trigger);
            expect(mockedInvocation.on).toHaveBeenCalledWith("cardPeekStarted", trigger);
        });

        it("remove proper event from invocation for 'onchildcardstartpeek", function () {
            invocationEvents.removeEventListener("onchildcardstartpeek", trigger);
            expect(mockedInvocation.un).toHaveBeenCalledWith("cardPeekStarted", trigger);
        });
    });

    describe("onchildcardendpeek", function () {
        it("add proper event to invocation for 'onchildcardendpeek'", function () {
            invocationEvents.addEventListener("onchildcardendpeek", trigger);
            expect(mockedInvocation.on).toHaveBeenCalledWith("cardPeekEnded", trigger);
        });

        it("remove proper event from invocation for 'onchildcardendpeek", function () {
            invocationEvents.removeEventListener("onchildcardendpeek", trigger);
            expect(mockedInvocation.un).toHaveBeenCalledWith("cardPeekEnded", trigger);
        });
    });

    describe("onchildcardclosed", function () {
        it("add proper event to invocation for 'onchildcardclosed'", function () {
            invocationEvents.addEventListener("onchildcardclosed", trigger);
            expect(mockedInvocation.on).toHaveBeenCalledWith("childCardClosed", trigger);
        });

        it("remove proper event from invocation for 'onchildcardclosed", function () {
            invocationEvents.removeEventListener("onchildcardclosed", trigger);
            expect(mockedInvocation.un).toHaveBeenCalledWith("childCardClosed", trigger);
        });
    });

    describe("invocation.interrupted", function () {
        it("add proper event to invocation for 'invocation.interrupted'", function () {
            invocationEvents.addEventListener("invocation.interrupted", trigger);
            expect(mockedInvocation.interrupter).toEqual(trigger);
        });

        it("remove proper event from invocation for 'invocation.interrupted", function () {
            invocationEvents.removeEventListener("invocation.interrupted", trigger);
            expect(mockedInvocation.interrupter).toEqual(undefined);
        });
    });
});
