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
    _ID = "com.blackberry.sensors",
    _apiDir = _extDir + "/" + _ID,
    client,
    mockedWebworks = {
        exec: jasmine.createSpy().andCallFake(function (success, fail, service, action, args) {
            if (action === "supportedSensors") {
                success(["abc"]);
            }
        })
    },
    MockedChannel,
    mockedCordova,
    channelRegistry = {};

describe("sensors", function () {
    beforeEach(function () {

        MockedChannel = function () {
            return {
                onHasSubscribersChange: undefined,
                numHandlers: undefined
            };
        };

        mockedCordova = {
            addWindowEventHandler: jasmine.createSpy("cordova.addWindowEventHandler").andCallFake(function (eventName) {
                channelRegistry[eventName] = new MockedChannel();
                return channelRegistry[eventName];
            }),
            fireWindowEvent: jasmine.createSpy("cordova.fireWindowEvent")
        };

        GLOBAL.window = {
            webworks: mockedWebworks,
            cordova: mockedCordova
        };
        client = require(_apiDir + "/www/client");
        mockedWebworks.exec.reset();
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    it("defines events", function () {
        var events = ["deviceaccelerometer", "devicemagnetometer", "devicegyroscope", "devicecompass",
            "deviceproximity", "devicelight", "devicegravity", "devicerotationmatrix",
            "deviceorientation", "deviceazimuthpitchroll", "deviceholster"];

        events.forEach(function (event) {
            var channel;

            //test channel creation
            expect(mockedCordova.addWindowEventHandler).toHaveBeenCalledWith(event);

            //test Subscriber add
            channel = channelRegistry[event];
            channel.numHandlers = 1;
            channel.onHasSubscribersChange();
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "startEvent", {eventName: event});

            //test Subscriber remove
            channel.numHandlers = 0;
            channel.onHasSubscribersChange();
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "stopEvent", {eventName: event});
        });
    });

    describe("setOptions", function () {
        it("calls exec", function () {
            client.setOptions("devicecompass", { delay : 1000 });
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "setOptions", { options : { delay : 1000, sensor : "devicecompass" } });
        });
    });

    describe("supportedSensors", function () {
        it("calls exec", function () {
            var supportedSensors;

            supportedSensors = client.supportedSensors;
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "supportedSensors");
            // make sure it only gets called once
            supportedSensors = client.supportedSensors;
            expect(mockedWebworks.exec.callCount).toEqual(1);
        });
    });
});
