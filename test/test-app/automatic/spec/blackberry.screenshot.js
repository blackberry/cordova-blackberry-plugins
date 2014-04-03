/*
 * Copyright 2014 BlackBerry Limited.
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
describe("blackberry.screenshot", function () {
    var onSuccessSpy, onErrorSpy, options;

    beforeEach(function () {
        onSuccessSpy = jasmine.createSpy("onSuccessSpy");
        onErrorSpy = jasmine.createSpy("onErrorSpy");
    });

    it("blackberry.user.screenshot should exist", function () {
        expect(blackberry.screenshot).toBeDefined();
    });

    describe("execute", function () {
        it("should function with no arguments", function () {
            expect(blackberry.screenshot.execute()).toEqual(jasmine.any(String));
        });

        it("should function with arguments", function () {
            options = {
                rect: {
                    x: 0,
                    y: 0,
                    w: 100,
                    h: 100
                },
                dest: "data:",
                mime: "image/png"
            };

            expect(blackberry.screenshot.execute(options)).toEqual(jasmine.any(String));
        });
    });
});

