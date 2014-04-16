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

var upload_target = "http://ci0000001875214.rim.net/upload.php";

function testConstantValue(field, value) {
    expect(blackberry.io.filetransfer[field]).toBeDefined();
    expect(blackberry.io.filetransfer[field]).toEqual(value);
}

function upload_success(r) {
    alert("Code = " + r.responseCode +
        "\nResponse = " + r.response +
        "\nSent = " + r.bytesSent);
}

function upload_failure(error) {
    alert("An error has occurred: Code = " + error.code +
        "\nupload error source " + error.source +
        "\nupload error target " + error.target);
}

describe("blackberry.io.filetransfer", function () {
    it('blackberry.io.filetransfer should exist', function () {
        expect(blackberry.io.filetransfer).toBeDefined();
    });

    it('blackberry.io.filetransfer.FILE_NOT_FOUND_ERR should be defined', function () {
        testConstantValue("FILE_NOT_FOUND_ERR", 1);
    });

    it('blackberry.io.filetransfer.INVALID_URL_ERR should be defined', function () {
        testConstantValue("INVALID_URL_ERR", 2);
    });

    it('blackberry.io.filetransfer.CONNECTION_ERR should be defined', function () {
        testConstantValue("CONNECTION_ERR", 3);
    });

    it('blackberry.io.filetransfer.PERMISSIONS_ERR should be defined', function () {
        testConstantValue("PERMISSIONS_ERR", 4);
    });

    describe("blackberry.io.filetransfer.download", function () {
        it('blackberry.io.filetransfer.download should exist', function () {
            expect(blackberry.io.filetransfer.download).toBeDefined();
        });

        it('blackberry.io.filetransfer.download can download a file', function () {
            var result,
                failCallback = jasmine.createSpy('failCallback ');

            runs(function () {
                blackberry.io.filetransfer.download(
                    "http://www.w3.org/2011/Talks/0928-webtv-nem-fd/slides.pdf",
                        blackberry.io.sharedFolder + "/downloads/W3html5TV.pdf",
                        function(callbackResult) {
                            result = callbackResult;
                        }, failCallback);
            })

            waitsFor(function() {
                return result;
            }, "Timeout occurred downloading file", 20000);

            runs(function () {
                expect(result).toBeDefined();
                expect(result.name).toEqual("slides.pdf");
                expect(result.fullPath).toBeDefined();
                expect(failCallback.callCount).toEqual(0);
            })
        });
    });

    describe("blackberry.io.filetransfer.upload", function () {
        it('blackberry.io.filetransfer.upload should exist', function () {
            expect(blackberry.io.filetransfer.upload).toBeDefined();
        });

        it('blackberry.io.filetransfer.upload can upload a file', function () {
            var result,
                failCallback = jasmine.createSpy('failCallback ');

            runs(function () {
                blackberry.io.filetransfer.upload(
                    blackberry.io.sharedFolder + "/../app/native/img/blackberry10.jpg",
                    upload_target,
                        function(callbackResult) {
                            result = callbackResult;
                        }, failCallback);
            })

            waitsFor(function() {
                return result;
            }, "Timeout occurred uploading file", 20000);

            runs(function () {
                expect(result).toBeDefined();
                expect(result.response).toEqual("1");
                expect(result.responseCode).toEqual(200);
                expect(result.bytesSent).not.toEqual(0);
                expect(failCallback.callCount).toEqual(0);
            })
        });
    });
});

