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
    events,
    mockedWebworks;

describe("invoke.card client", function () {
    beforeEach(function () {
        events = {};
        mockedWebworks = {
            exec: jasmine.createSpy("webworks.exec"),
            defineReadOnlyField: jasmine.createSpy()
        };

        GLOBAL.window = {
            webworks: mockedWebworks
        };

        client = require(_apiDir + "/www/client");
    });

    afterEach(function () {
        mockedWebworks = undefined;
        delete GLOBAL.window;
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
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCamera", {mode: "photo"});
            client.invokeCamera("video");
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCamera", {mode: "video"});
            client.invokeCamera("full");
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCamera", {mode: "full"});
        });
        it("should define photo|video|full", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "CAMERA_MODE_PHOTO", "photo");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "CAMERA_MODE_VIDEO", "video");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "CAMERA_MODE_FULL", "full");
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
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeFilePicker", {options: details});

            details = { mode: "PickerMultiple" };
            client.invokeFilePicker(details);
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeFilePicker", {options: details});

            details = { mode: "Saver" };
            client.invokeFilePicker(details);
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeFilePicker", {options: details});

            details = { mode: "SaverMultiple" };
            client.invokeFilePicker(details);
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeFilePicker", {options: details});
        });
        it("should define all file picker constants", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_MODE_PICKER", "Picker");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_MODE_SAVER", "Saver");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_MODE_PICKER_MULTIPLE", "PickerMultiple");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_MODE_SAVER_MULTIPLE", "SaverMultiple");

            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_VIEWER_MODE_LIST", "ListView");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_VIEWER_MODE_GRID", "GridView");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_VIEWER_MODE_DEFAULT", "Default");

            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_BY_NAME", "Name");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_BY_DATE", "Date");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_BY_SUFFIX", "Suffix");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_BY_SIZE", "Size");

            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_ORDER_ASCENDING", "Ascending");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_ORDER_DESCENDING", "Descending");

            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_PICTURE", 'picture');
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_DOCUMENT", 'document');
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_MUSIC", 'music');
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_VIDEO", 'video');
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_OTHER", 'other');
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
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCalendarPicker", {options: details});
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
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeMediaPlayer", {options: details});
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
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeCalendarComposer", {options: details});
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
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeEmailComposer", {options: details});
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
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeIcsViewer", {options: {uri: "file://path"}});
            client.invokeIcsViewer({uri: "file://path", accountId: 1});
            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "invokeIcsViewer", {options: {uri: "file://path", accountId: 1}});
        });
    });

});
