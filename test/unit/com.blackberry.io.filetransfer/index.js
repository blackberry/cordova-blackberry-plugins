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

var root = __dirname + "/../../../",
    webview = require(root + "lib/webview"),
    mockedPluginResult,
    index;

describe("io.filetransfer index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("0"),
            registerEvents: jasmine.createSpy(),
            invoke: jasmine.createSpy("invoke")
        };

        GLOBAL.window = {
            qnx : {
                webplatform : {
                    getApplication : function () {
                        return {
                            getEnv : function () {
                                return "ROOT";
                            }
                        };
                    }
                }
            }
        };

        mockedPluginResult = {
            ok: jasmine.createSpy("PluginResult.ok"),
            error: jasmine.createSpy("PluginResult.error"),
            noResult: jasmine.createSpy("PluginResult.noResult"),
            callbackOk: jasmine.createSpy("PluginResult.callbackOk")
        };

        spyOn(webview, "windowGroup").andReturn(42);
        index = require(root + "plugin/com.blackberry.io.filetransfer/index");
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        delete require.cache[require.resolve(root + "plugin/com.blackberry.io.filetransfer/index")];
        delete GLOBAL.window;
    });

    it("makes sure JNEXT was not initialized on require", function () {
        expect(JNEXT.require).not.toHaveBeenCalledWith("libfiletransfer");
        expect(JNEXT.createObject).not.toHaveBeenCalledWith("libfiletransfer.FileTransfer");
    });

    describe("filetransfer upload", function () {
        it("should call JNEXT.invoke with custom params", function () {
            var mocked_args = {
                    "callbackId": encodeURIComponent(JSON.stringify("123")),
                    "filePath": encodeURIComponent(JSON.stringify("2")),
                    "server": encodeURIComponent(JSON.stringify("3")),
                    "options": encodeURIComponent(JSON.stringify({
                        "fileKey": "test",
                        "fileName": "test.gif",
                        "mimeType": "image/gif",
                        "params": { "test": "test" },
                        "chunkedMode": false,
                        "chunkSize": 512
                    }))
                },
                expected_args = {
                    "filePath": "2",
                    "server": "3",
                    "options": {
                        "fileKey": "test",
                        "fileName": "test.gif",
                        "mimeType": "image/gif",
                        "params": { "test": "test" },
                        "chunkedMode": false,
                        "chunkSize": 512,
                        "windowGroup" : 42
                    },
                    "callbackId": "123"
                };

            index.upload(mockedPluginResult, mocked_args);

            expect(JNEXT.invoke).toHaveBeenCalledWith("0", "upload " + JSON.stringify(expected_args));
            expect(mockedPluginResult.noResult).toHaveBeenCalled();
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });

        it("should call JNEXT.invoke with default params", function () {
            var mocked_args = {
                    "filePath": encodeURIComponent(JSON.stringify("2")),
                    "server": encodeURIComponent(JSON.stringify("3")),
                    "callbackId": encodeURIComponent(JSON.stringify("1"))
                },
                expected_default_args = {
                    "filePath": "2",
                    "server": "3",
                    "options": {
                        "fileKey": "file",
                        "fileName": "image.jpg",
                        "mimeType": "image/jpeg",
                        "params": {},
                        "chunkedMode": true,
                        "chunkSize": 1024,
                        "windowGroup" : 42
                    },
                    "callbackId": "1"
                };

            index.upload(mockedPluginResult, mocked_args);

            expect(JNEXT.invoke).toHaveBeenCalledWith("0", "upload " + JSON.stringify(expected_default_args));
            expect(mockedPluginResult.noResult).toHaveBeenCalled();
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });

        it("should call failure callback with null parameters", function () {
            var mocked_args = {
                    "filePath": encodeURIComponent(JSON.stringify("")),
                    "server": encodeURIComponent(JSON.stringify("")),
                    "callbackId": encodeURIComponent(JSON.stringify("123"))
                };

            index.upload(mockedPluginResult, mocked_args);

            expect(mockedPluginResult.noResult).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalled();
        });

        it("should fail if chunkSize is not positive", function () {
            var mocked_args = {
                    "filePath": encodeURIComponent(JSON.stringify("2")),
                    "server": encodeURIComponent(JSON.stringify("3")),
                    "callbackId": encodeURIComponent(JSON.stringify("123")),
                    "options": encodeURIComponent(JSON.stringify({
                        "chunkSize": -1
                    }))
                };

            index.upload(mockedPluginResult, mocked_args);

            expect(mockedPluginResult.noResult).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalled();
        });

        it("should translate local path", function () {
            var params,
                mocked_args = {
                    "filePath": encodeURIComponent(JSON.stringify("local:///persistent/test.txt")),
                    "callbackId": encodeURIComponent(JSON.stringify("123")),
                    "server": encodeURIComponent(JSON.stringify("3"))
                };

            JNEXT.invoke = jasmine.createSpy().andCallFake(function () {
                params = JSON.parse(arguments[1].substring(7, arguments[1].length));
            });

            index.upload(mockedPluginResult, mocked_args);

            expect(JNEXT.invoke).toHaveBeenCalled();
            expect(params.filePath).toEqual("/ROOT/../app/native/persistent/test.txt");
            expect(mockedPluginResult.noResult).toHaveBeenCalled();
        });
    });

    describe("filetransfer download", function () {
        it("should call JNEXT.invoke", function () {
            var mocked_args = {
                    "source": encodeURIComponent(JSON.stringify("2")),
                    "target": encodeURIComponent(JSON.stringify("3")),
                    "callbackId": encodeURIComponent(JSON.stringify("123"))
                },
                expected_args = {
                    "source": "2",
                    "target": "3",
                    "callbackId": "123",
                    "windowGroup": 42
                };

            index.download(mockedPluginResult, mocked_args);

            expect(JNEXT.invoke).toHaveBeenCalledWith("0", "download " + JSON.stringify(expected_args));
            expect(mockedPluginResult.noResult).toHaveBeenCalled();
            expect(mockedPluginResult.error).not.toHaveBeenCalled();
        });

        it("should call failure callback with null parameters", function () {
            var mocked_args = {
                    "filePath": encodeURIComponent(JSON.stringify("")),
                    "server": encodeURIComponent(JSON.stringify("")),
                    "callbackId": encodeURIComponent(JSON.stringify("123"))
                };

            index.download(mockedPluginResult,  mocked_args);

            expect(mockedPluginResult.noResult).not.toHaveBeenCalled();
            expect(mockedPluginResult.error).toHaveBeenCalled();
        });

        it("should translate local path", function () {
            var params,
                mocked_args = {
                    "target": encodeURIComponent(JSON.stringify("local:///persistent/test.txt")),
                    "source": encodeURIComponent(JSON.stringify("3")),
                    "callbackId": encodeURIComponent(JSON.stringify("123"))
                };

            JNEXT.invoke = jasmine.createSpy("JNEXT.invoke").andCallFake(function () {
                params = JSON.parse(arguments[1].substring(9, arguments[1].length));
            });

            index.download(mockedPluginResult, mocked_args);

            expect(JNEXT.invoke).toHaveBeenCalled();
            expect(params.target).toEqual("/ROOT/../app/native/persistent/test.txt");
            expect(mockedPluginResult.noResult).toHaveBeenCalled();
        });
    });
});
