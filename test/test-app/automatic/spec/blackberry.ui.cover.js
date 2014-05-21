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

describe("blackberry.ui.cover", function () {

    it('getCoverSizes', function () {
        var sizes;
        waitsFor(function () {
            return sizes;
        }, 2000);
        runs(function () {
            expect(sizes.fullSize).toBeDefined();
            expect(sizes.fullSize.width).toBeGreaterThan(0);
            expect(sizes.fullSize.height).toBeGreaterThan(0);
        });
        blackberry.ui.cover.getCoverSizes(function () {
            sizes = arguments[0];
        });
    });

    it('updateCovers', function () {
        var flag = false,
            cover = new blackberry.ui.cover.Cover('fullSize', blackberry.ui.cover.TYPE_SNAPSHOT);
        cover.text.push(new blackberry.ui.cover.Label('Test app cover', 12));
        waitsFor(function () {
            return flag;
        }, 2000);
        runs(function () {
            expect(flag).toBe(true);
        });
        blackberry.ui.cover.updateCovers([cover], function () {
            flag = true;
        });
    });

    it('resetCover', function () {
        var flag = false;
        waitsFor(function () {
            return flag;
        }, 2000);
        runs(function () {
            expect(flag).toBe(true);
        });
        blackberry.ui.cover.resetCover('fullSize', function () {
            flag = true;
        });
    });

});
