/*
 * Copyright 2014 BlackBerry Limited
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

var _self = {},
    _ID = "com.blackberry.barcodescanner",
    exec = cordova.require("cordova/exec"),
    reading = null,
    canvas,
    latestFrame,
    fsSize = 1024 * 1024,
    codefoundCallback,
    errorfoundCallback,
    readFile,
    errorHandler,
    frameAvailable,
    FileError;

errorHandler = function (e) {
    var msg = '';

    switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
    case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
    case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
    case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
    case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
    default:
        msg = 'Unknown Error';
        break;
    }
};

frameAvailable = function (data) {
    latestFrame = data.frame;
    setTimeout(readFile, 4, latestFrame);
};

readFile = function (filename) {
    var reader,
        ctx,
        img;

    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(
        window.TEMPORARY,
        fsSize,
        function (fs) {
            fs.root.getFile(
                filename,
                {create: false},
                function (fileEntry) {
                    fileEntry.file(
                        function (file) {
                            reader = new FileReader();
                            reader.onloadend = function (e) {
                                ctx = canvas.getContext("2d");
                                img = new Image();
                                img.onload = function () {
                                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                                    window.URL.revokeObjectURL(img.src);
                                    img.src = null;
                                };
                                img.src = e.target.result;
                            };
                            reader.readAsDataURL(file);
                        },
                     errorHandler);
                },
            errorHandler);
        }
    );
};

_self.startRead = function (codeFoundCb, errorFoundCb, args) {
    if (reading) return "Stop Scanning before scanning again";
    blackberry.io.sandbox = false;

    var success,
        failure,
        canvasID = args,
        frameAvailableFn = frameAvailable;

    reading = true;

    success = function (data, response) {
        var arData = data.split(" "),
            frameData,
            codeFoundData,
            errorData,
            receivedEvent = arData[0];

        if (receivedEvent === "community.barcodescanner.frameavailable.native") {
            frameData = JSON.parse(arData[1]);
            frameAvailableFn(frameData);
        } else if (receivedEvent === "community.barcodescanner.started.native") {
            canvas = document.getElementById(canvasID);
            canvas.style.display = "block";
        } else if (receivedEvent === "community.barcodescanner.codefound.native") {
            codeFoundData = JSON.parse(arData[1]);
            codeFoundCb(codeFoundData);
        } else if (receivedEvent === "community.BarcodeScanner.errorfound") {
            errorData = JSON.parse(arData[1]);
            errorFoundCb(errorData);
        }
    };

    failure = function (data, response) {
        errorFoundCb(data);
    };

    exec(success, failure, _ID, "startRead", null);
};

_self.stopRead = function (successCb, failureCb) {
    var success,
        failure;

    canvas.style.display = "none";
    reading = false;

    success = function (data, response) {
        var arData = data.split(" "),
            receivedEvent = arData[0],
            successData;

        if (receivedEvent === "community.barcodescanner.ended.native") {
            successData = JSON.parse(arData[1]);
            successCb(successData);
        }
    };

    failure = function (data, response) {
        failureCb(data);
    };

    exec(success, failure, _ID, "stopRead", null);
};

module.exports = _self;
