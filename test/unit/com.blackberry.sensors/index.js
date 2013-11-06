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
var _apiDir = __dirname + "/../../../plugin/com.blackberry.sensors/",
    _libDir = __dirname + "/../../../lib/",
    events = require(_libDir + "event"),
    index;

describe("sensors index", function () {

    var mockedPluginResult;

    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("1"),
            invoke: jasmine.createSpy().andReturn(2),
            registerEvents: jasmine.createSpy().andReturn(true)
        };
        mockedPluginResult = {
            ok: jasmine.createSpy("PluginResult.ok"),
            error: jasmine.createSpy("PluginResult.error"),
            noResult: jasmine.createSpy("PluginResult.noResult")
        };
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        delete require.cache[require.resolve(_apiDir + "index")];
    });

    describe("Events", function () {
        var context;

        beforeEach(function () {
            context = require(_apiDir + "sensorsEvents");
        });
        afterEach(function () {
            delete require.cache[require.resolve(_apiDir + "sensorsEvents")];
        });

        it("startEvent", function () {
            var eventName = "deviceaccelerometer",
                systemEventName = "deviceaccelerometer",
                env = {webview: {id: 22 }};

            spyOn(context, "addEventListener");

            index.startEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(context.addEventListener).toHaveBeenCalledWith(systemEventName, jasmine.any(Function));
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(true);

            //Will not start it twice
            context.addEventListener.reset();
            index.startEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(context.addEventListener).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalledWith("Underlying listener for " + eventName + " already already running for webview " + env.webview.id);
        });

        it("stopEvent", function () {
            var eventName = "deviceaccelerometer",
                systemEventName = "deviceaccelerometer",
                env = {
                    webview: {
                        id: 22
                    }
                };

            spyOn(context, "addEventListener");
            spyOn(context, "removeEventListener");

            index.startEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);

            index.stopEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(context.removeEventListener).toHaveBeenCalledWith(systemEventName, jasmine.any(Function));
            expect(mockedPluginResult.noResult).toHaveBeenCalledWith(false);

            //Will not stop an unstarted event
            context.removeEventListener.reset();
            index.stopEvent(mockedPluginResult, {eventName: encodeURIComponent(JSON.stringify(eventName))}, env);
            expect(context.removeEventListener).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalledWith("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        });

    });

    describe("sensors", function () {
        describe("setOptions", function () {

            it("can call success", function () {
                var options = { "sensor" : "devicecompass", "delay" : 10000 },
                    args = { "options" : JSON.stringify(options) };

                index.setOptions(mockedPluginResult, args);
                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "setOptions " + JSON.stringify(options));
                expect(mockedPluginResult.ok).toHaveBeenCalled();
            });

            it("can call with invalid parameters", function () {
                var options = { "sensor" : "devicecompass", "delay" : "10000", background : 0 },
                    args = { options : JSON.stringify(options) };

                index.setOptions(mockedPluginResult, args);
                expect(mockedPluginResult.error).toHaveBeenCalled();
            });
        });

        describe("supportedSensors", function () {

            it("can get a list of supported sensors", function () {
                index.supportedSensors(mockedPluginResult);
                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "supportedSensors");
                expect(mockedPluginResult.ok).toHaveBeenCalled();
            });
        });

    });
});
