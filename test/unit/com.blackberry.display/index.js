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
var _apiDir = __dirname + "/../../../plugin/com.blackberry.display/",
    index,
    mockedWebView,
    mockedQnx,
    mockedPluginResult;

describe("display index", function () {

    beforeEach(function () {
        mockedQnx = {
            webplatform: {
                getWebViews: function () {
                    return [{
                        jsScreenWindowHandle: "280207016",
                        visible: false,
                        zOrder: 1
                    },
                    {
                        jsScreenWindowHandle: "291780136",
                        visible: true,
                        zOrder: 0
                    },
                    {
                        jsScreenWindowHandle: "287637024",
                        visible: true,
                        zOrder: -10
                    }];
                }
            }
        };
        GLOBAL.qnx = mockedQnx;
        mockedPluginResult = {
            ok: jasmine.createSpy("PluginResult.ok"),
            error: jasmine.createSpy("PluginResult.error"),
            noResult: jasmine.createSpy("PluginResult.noResult")
        };
        GLOBAL.PluginResult = jasmine.createSpy("PluginResult").andReturn(mockedPluginResult);
        GLOBAL.JNEXT = {
            require: jasmine.createSpy("JNEXT.require").andCallFake(function () {
                return true;
            }),
            invoke: jasmine.createSpy("JNEXT.invoke").andCallFake(function (id, command) {
                if (command.indexOf("setPreventSleep")) {
                    return "wakelock can be set";
                } else if (command.indexOf("isSleepPrevented")) {
                }
            }),
            createObject: jasmine.createSpy("JNEXT.createObject").andReturn(Math.round(Math.random() * 1000)),
            registerEvents: jasmine.createSpy("JNEXT.registerEvents")
        };
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        index = null;
        delete GLOBAL.window;
        delete GLOBAL.qnx;
        delete GLOBAL.PluginResult;
    });

    describe("setPreventSleep", function () {
        it("should be defined", function () {
            expect(index.setPreventSleep).toBeDefined();
        });

        it("should set screen keeping awake", function () {
            var sucess = jasmine.createSpy(),
                fail = jasmine.createSpy();

            expect(JNEXT.createObject).not.toHaveBeenCalled();
            index.setPreventSleep(sucess, fail, {input: true}, null);
            expect(JNEXT.require).toHaveBeenCalled();
            expect(JNEXT.invoke).toHaveBeenCalled();
            expect(JNEXT.createObject).toHaveBeenCalled();
        });
    });

    describe("isSleepPrevented", function () {
        it("should be defined", function () {
            expect(index.isSleepPrevented).toBeDefined();
        });

        it("should return isSleepPrevented value", function () {
            var sucess = jasmine.createSpy(),
                fail = jasmine.createSpy();

            index.isSleepPrevented(sucess, fail, null, null);
            expect(JNEXT.invoke).toHaveBeenCalled();
        });

    });

});
