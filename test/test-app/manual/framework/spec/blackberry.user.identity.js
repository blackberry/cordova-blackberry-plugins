/**
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

describe("user.identity", function () {
    var onSuccess,
        onError,
        onSuccessFlag,
        onErrorFlag,
        delay = 50000,
        provider = "ids:rim:bbid",
        confirm;

    beforeEach(function () {
        onSuccessFlag = false;
        onErrorFlag = false;
        onSuccess = jasmine.createSpy("success callback").andCallFake(
            function () {
                onSuccessFlag = true;
            }
        );
        onError = jasmine.createSpy("fail callback").andCallFake(
            function () {
                onErrorFlag = true;
            }
        );
    });

    afterEach(function () {
        onSuccess = null;
        onError = null;
        onSuccessFlag = false;
        onErrorFlag = false;
    });

    it("challenge login should prompt", function () {
        blackberry.user.identity.registerProvider(provider);
        blackberry.user.identity.setOption(0,true);

        try {
            blackberry.user.identity.challenge(provider, 0, 0, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            expect(onError).not.toHaveBeenCalled();
        });
    });
});
