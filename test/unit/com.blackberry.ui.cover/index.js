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

var _apiDir = __dirname + "/../../../plugin/com.blackberry.ui.cover/",
    _libDir = __dirname + "/../../../lib/",
    index;

describe("index ui.cover", function () {

    beforeEach(function () {
        index = require(_apiDir + "index");
    });

    describe("10.3+", function () {

        var mockedCoverSizes,
            mockedUpdateCovers;

        beforeEach(function () {
            mockedCoverSizes = '{"fullSize": { "width":334,"height":396}}';
            mockedUpdateCovers = jasmine.createSpy("update cover");
            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        getApplication: function () {
                            return {
                                coverSizes: mockedCoverSizes,
                                updateCovers: mockedUpdateCovers,
                                getEnv: function (path) {
                                    if (path === "HOME")
                                        return "/path/data";
                                }
                            };
                        }
                    }
                }
            };
        });

        afterEach(function () {
            delete GLOBAL.window;
            mockedCoverSizes = null;
            mockedUpdateCovers = null;
        });

        it("gets coverSize", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            index.coverSizes(success, fail);
            expect(success).toHaveBeenCalledWith({fullSize: { width: 334, height: 396}});
            expect(fail).not.toHaveBeenCalled();
        });

        it("resetCover", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                name = "fullSize",
                resetCover = { 
                    fullSize: {
                        cover: "reset"
                    }
                };

            index.resetCover(success, fail, {name: encodeURIComponent(JSON.stringify(name))});
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(mockedUpdateCovers).toHaveBeenCalledWith(resetCover);
        });

        it("updateCovers with snapshot", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                input = [
                    { 
                        name: "fullSize", 
                        type: "snapshot",
                        capture: {
                            x: 0,
                            y: 1,
                            width: 100,
                            height: 200
                        }, 
                        text:  [{"label": "cover label", "size": 5, "wrap": true}]
                    }
                ],
                output = {
                    fullSize: {
                        cover: {
                            type: "snapshot",
                            capture: {
                                x: 0,
                                y: 1,
                                width: 100,
                                height: 200
                            } 
                        },
                        text: [{"label": "cover label", "size": 5, "wrap": true}]
                    }
                };
            index.updateCovers(success, fail, {covers: encodeURIComponent(JSON.stringify(input))}, null);
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(mockedUpdateCovers).toHaveBeenCalledWith(output);
        });

        it("updateCovers with path", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                input = [
                    { 
                        name: "fullSize", 
                        type: "file", 
                        path: "file:///path/to/application/cover.jpg",
                        text:  [{"label": "cover label", "size": 5, "wrap": true}]
                    }
                ],
                output = {
                    fullSize: {
                        cover: {
                            type: "file",
                            path: "/path/to/application/cover.jpg"
                        },
                        text: [{"label": "cover label", "size": 5, "wrap": true}]
                    }
                };
            index.updateCovers(success, fail, {covers: encodeURIComponent(JSON.stringify(input))}, null);
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(mockedUpdateCovers).toHaveBeenCalledWith(output);
         });

        it("updateCovers converts local:/// path", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                input = [
                    { 
                        name: "fullSize", 
                        type: "file", 
                        path: "local:///cover.jpg",
                        text:  [{"label": "cover label", "size": 5, "wrap": true}]
                    }
                ],
                output = {
                    fullSize: {
                        cover: {
                            type: "file",
                            path: "/path/app/native/cover.jpg"
                        },
                        text: [{"label": "cover label", "size": 5, "wrap": true}]
                    }
                };
            index.updateCovers(success, fail, {covers: encodeURIComponent(JSON.stringify(input))}, null);
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(mockedUpdateCovers).toHaveBeenCalledWith(output);
         });

    });

    describe("< 10.3", function () {

        var mockedCoverSize,
            mockedUpdateCover;

        beforeEach(function () {
            mockedCoverSize = '{"width":334,"height":396}';
            mockedUpdateCover = jasmine.createSpy("update cover");
            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        getApplication: function () {
                            return {
                                coverSize: mockedCoverSize,
                                updateCover: mockedUpdateCover,
                                getEnv: function (path) {
                                    if (path === "HOME")
                                        return "/accounts/home";
                                }
                            };
                        }
                    }
                }
            };
        });

        afterEach(function () {
            delete GLOBAL.window;
            mockedCoverSize = null;
            mockedUpdateCover = null;
        });

        it("gets coverSize", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            index.coverSizes(success, fail);
            expect(success).toHaveBeenCalledWith({fullSize: { width: 334, height: 396}});
            expect(fail).not.toHaveBeenCalled();
        });

        it("resetCover", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                name = "fullSize",
                resetCover = { 
                    cover: "reset"
                };

            index.resetCover(success, fail, {name: encodeURIComponent(JSON.stringify(name))});
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(mockedUpdateCover).toHaveBeenCalledWith(resetCover);
        });

        it("updateCovers with snapshot", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                input = [
                    { 
                        name: "fullSize", 
                        type: "snapshot",
                        capture: {
                            x: 0,
                            y: 1,
                            width: 100,
                            height: 200
                        }, 
                        text:  [{"label": "cover label", "size": 5, "wrap": true}]
                    }
                ],
                output = {
                    cover: {
                        type: "snapshot",
                        capture: {
                            x: 0,
                            y: 1,
                            width: 100,
                            height: 200
                        } 
                    },
                    text: [{"label": "cover label", "size": 5, "wrap": true}]
                };

            index.updateCovers(success, fail, {covers: encodeURIComponent(JSON.stringify(input))}, null);
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(mockedUpdateCover).toHaveBeenCalledWith(output);
        });

        it("updateCovers with path", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                input = [
                    { 
                        name: "fullSize", 
                        type: "file", 
                        path: "file:///path/to/application/cover.jpg",
                        text:  [{"label": "cover label", "size": 5, "wrap": true}]
                    }
                ],
                output = {
                    cover: {
                        type: "file",
                        path: "/path/to/application/cover.jpg"
                    },
                    text: [{"label": "cover label", "size": 5, "wrap": true}]
                };
            index.updateCovers(success, fail, {covers: encodeURIComponent(JSON.stringify(input))}, null);
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(mockedUpdateCover).toHaveBeenCalledWith(output);
        });

    });

});
