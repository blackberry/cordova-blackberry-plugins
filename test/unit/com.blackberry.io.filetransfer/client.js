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

var _ID = "com.blackberry.io.filetransfer",
    _apiDir = __dirname + "/../../../plugin/" + _ID + "/",
    client,
    successCB;

describe("io.filetransfer client", function () {
    beforeEach(function () {
        GLOBAL.cordova = {
            exec: jasmine.createSpy().andCallFake(function (success) {
                successCB = success;
            }),
            require: function () {
                return cordova.exec;
            }
        };
        client = require(_apiDir + "www/client");
    });

    afterEach(function () {
        delete GLOBAL.cordova;
        delete require.cache[require.resolve(_apiDir + "/www/client")];
        client = null;
    });

    describe("io.filetransfer constants", function () {

        it("should return constant", function () {
            expect(client.FILE_NOT_FOUND_ERR).toEqual(1);
            expect(client.INVALID_URL_ERR).toEqual(2);
            expect(client.CONNECTION_ERR).toEqual(3);
        });

    });

    describe("io.filetransfer upload", function () {
        var filePath = "a",
            server = "b",
            options = { "c": "d" },
            callback = function () {};

        it("should call cordova.exec", function () {
            var expected_args = {
                "filePath": filePath,
                "server": server,
                "options": options
            };

            client.upload(filePath, server, callback, callback, options);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "upload", expected_args);
        });

        it("should call success callback on success event", function () {
            var success = jasmine.createSpy(),
                failure = jasmine.createSpy(),
                mocked_args = {
                    "result": "success",
                    "bytesSent": "someBytesSent",
                    "responseCode": "someResponseCode",
                    "response": escape("someResponse!")
                },
                expected_args = {
                    "bytesSent": "someBytesSent",
                    "responseCode": "someResponseCode",
                    "response": "someResponse!"
                };

            client.upload(filePath, server, success, failure, options);
            successCB(mocked_args);

            expect(success).toHaveBeenCalledWith(expected_args);
            expect(failure).not.toHaveBeenCalled();
        });

        it("should call failure callback on error event", function () {
            var success = jasmine.createSpy(),
                failure = jasmine.createSpy(),
                mocked_args = {
                    "result": "error",
                    "code": "someCode",
                    "source": "someSource",
                    "target": "someTarget"
                },
                expected_args = {
                    "code": "someCode",
                    "source": "someSource",
                    "target": "someTarget"
                };

            client.upload(filePath, server, success, failure, options);
            successCB(mocked_args);

            expect(success).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalledWith(expected_args);
        });
    });

    describe("io.filetransfer download", function () {
        var source = "a",
            target = "b",
            callback = function () {};

        it("should call cordova.exec", function () {
            var expected_args = {
                "source": source,
                "target": target
            };

            client.download(source, target, callback, callback);
            expect(cordova.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "download", expected_args);
        });

        it("should call success callback on success event", function () {
            var success = jasmine.createSpy(),
                failure = jasmine.createSpy(),
                mocked_args = {
                    "result": "success",
                    "isFile": true,
                    "isDirectory": false,
                    "name": "someName",
                    "fullPath": escape("someFullPath!")
                },
                expected_args = {
                    "isFile": true,
                    "isDirectory": false,
                    "name": "someName",
                    "fullPath": "someFullPath!"
                };

            client.download(source, target, success, failure);
            successCB(mocked_args);

            expect(success).toHaveBeenCalledWith(expected_args);
            expect(failure).not.toHaveBeenCalled();
        });


        it("should call failure callback on error event", function () {
            var success = jasmine.createSpy(),
                failure = jasmine.createSpy(),
                mocked_args = {
                    "result": "error",
                    "code": "someCode",
                    "source": "someSource",
                    "target": "someTarget"
                },
                expected_args = {
                    "code": "someCode",
                    "source": "someSource",
                    "target": "someTarget"
                };

            client.download(source, target, success, failure);
            successCB(mocked_args);

            expect(success).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalledWith(expected_args);
        });
    });
});
