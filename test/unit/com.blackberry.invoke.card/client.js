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

var _extDir = __dirname + "/../../../plugin/",
    _ID = "com.blackberry.invoke.card",
    _apiDir = _extDir + _ID,
    client,
    events;

describe("invoke.card client", function () {
    beforeEach(function () {
        events = {};
        GLOBAL.cordova = {
            require: jasmine.createSpy().andCallFake(function () {
                return cordova.exec;
            }),
            exec: jasmine.createSpy("cordova.exec")
        };
        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        client = null;
        events = null;
        delete require.cache[require.resolve(_apiDir + "/www/client")];
    });


    describe("invoke camera ", function () {
        var done,
            cancel,
            invokeCallback;
        beforeEach(function () {
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });
        it("should call exec with correct mode", function () {
            client.invokeCamera("photo");
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCamera", {mode: "photo"});
            client.invokeCamera("video");
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCamera", {mode: "video"});
            client.invokeCamera("full");
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCamera", {mode: "full"});
        });
        it("should define photo|video|full", function () {
            expect(client.CAMERA_MODE_PHOTO).toEqual("photo");
            expect(client.CAMERA_MODE_FULL).toEqual("full");
            expect(client.CAMERA_MODE_VIDEO).toEqual("video");
        });
    });

    describe("invoke File Picker ", function () {
        var details,
            done,
            cancel,
            invokeCallback;
        beforeEach(function () {
            details = {
                mode: "Picker"
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });
        it("should call exec with correct mode", function () {
            details = { mode: "Picker" };
            client.invokeFilePicker(details);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeFilePicker", {options: details});

            details = { mode: "PickerMultiple" };
            client.invokeFilePicker(details);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeFilePicker", {options: details});

            details = { mode: "Saver" };
            client.invokeFilePicker(details);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeFilePicker", {options: details});

            details = { mode: "SaverMultiple" };
            client.invokeFilePicker(details);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeFilePicker", {options: details});
        });
        it("should define all file picker constants", function () {
            expect(client["FILEPICKER_MODE_PICKER"]).toEqual("Picker");
            expect(client["FILEPICKER_MODE_SAVER"]).toEqual("Saver");
            expect(client["FILEPICKER_MODE_PICKER_MULTIPLE"]).toEqual("PickerMultiple");
            expect(client["FILEPICKER_MODE_SAVER_MULTIPLE"]).toEqual("SaverMultiple");

            expect(client["FILEPICKER_VIEWER_MODE_LIST"]).toEqual("ListView");
            expect(client["FILEPICKER_VIEWER_MODE_GRID"]).toEqual("GridView");
            expect(client["FILEPICKER_VIEWER_MODE_DEFAULT"]).toEqual("Default");

            expect(client["FILEPICKER_SORT_BY_NAME"]).toEqual("Name");
            expect(client["FILEPICKER_SORT_BY_DATE"]).toEqual("Date");
            expect(client["FILEPICKER_SORT_BY_SUFFIX"]).toEqual("Suffix");
            expect(client["FILEPICKER_SORT_BY_SIZE"]).toEqual("Size");

            expect(client["FILEPICKER_SORT_ORDER_ASCENDING"]).toEqual("Ascending");
            expect(client["FILEPICKER_SORT_ORDER_DESCENDING"]).toEqual("Descending");

            expect(client["FILEPICKER_TYPE_PICTURE"]).toEqual('picture');
            expect(client["FILEPICKER_TYPE_DOCUMENT"]).toEqual('document');
            expect(client["FILEPICKER_TYPE_MUSIC"]).toEqual('music');
            expect(client["FILEPICKER_TYPE_VIDEO"]).toEqual('video');
            expect(client["FILEPICKER_TYPE_OTHER"]).toEqual('other');
        });
    });

    describe("invoke target picker", function () {

        it("should have an invokeTargerPicker method", function () {
            expect(client.invokeTargetPicker).toBeDefined();
        });
        it("should properly invoke the target picker", function () {
            var request = {
                    uri : "http://testuri.com",
                    action : 'bb.action.SHARE',
                    target_type : ['CARD', 'APPLICATION']
                },
                onSuccess,
                onError,
                title = 'Test';

            client.invokeTargetPicker(request, title, onSuccess, onError);
        });

    });

    describe("invoke calendarPicker", function () {
        var details,
            done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            details = {
                filepath : "/path/to/save/the/file/to.vcs"
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call exec with the correct options", function () {
            client.invokeCalendarPicker(details, done, cancel, invokeCallback);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCalendarPicker", {options: details});
        });
    });

    describe("invoke Media Player", function () {
        var details,
            done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            details = {
                contentTitle: "Test Title",
                contentUri: "file:///accounts/1000/shared/camera/VID_00000001.mp4",
                imageUri: "file:///accounts/1000/shared/camera/AUD_00000001.mp4"
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call exec with correct details passed", function () {
            client.invokeMediaPlayer(details);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeMediaPlayer", {options: details});
        });
    });

    describe("invoke calendarComposer", function () {
        var details,
            done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            details = {
                subject: "Some event",
                body: "something about this event",
                location: "here and there",
                startTime: "Wed Jun 21 11:00:01 3412",
                endTime: "Mon Jun 22 11:00:01 3423",
                attendees: ["a@a.com", "b@b.com"]
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call exec with the correct options", function () {
            client.invokeCalendarComposer(details, done, cancel, invokeCallback);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCalendarComposer", {options: details});
        });
    });

    describe("invoke emailComposer", function () {
        var details,
            done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            details = {
                to: "mission-control@nasa.gov",
                cc: "obama@whitehouse.org",
                subject: "[STATUS] Manned Mission to Mars",
                body: "It worked...",
                attachment : ["/pictures/mission/astronauts-playing-hockey-on-mars.png"]
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call exec with the correct options", function () {
            client.invokeEmailComposer(details, done, cancel, invokeCallback);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeEmailComposer", {options: details});
        });
    });

    describe("invoke ics viewer", function () {
        var done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call exec with uri and accountId", function () {
            client.invokeIcsViewer({uri: "file://path"});
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeIcsViewer", {options: {uri: "file://path"}});
            client.invokeIcsViewer({uri: "file://path", accountId: 1});
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeIcsViewer", {options: {uri: "file://path", accountId: 1}});
        });
    });

});
