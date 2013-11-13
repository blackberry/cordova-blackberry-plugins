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

describe("email composer card", function () {
    var content,
        onSuccess,
        onError,
        onSuccessFlag,
        onErrorFlag,
        delay = 7500,
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

    it("should show unicode characters", function () {
        content = {
            to : ["ňƎƊstark@winterfell.ca"],
            cc : ["ȐȎƁstark@winterfell.com"],
            subject : "A Stark µ",
            body : "ƙing of the Ņorth",
            attachment : ["/some/path.txt", "local:///other/path.txt"]
        };

        try {
            blackberry.invoke.card.invokeEmailComposer(content, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            confirm = window.confirm("Did unicode characters appear in the fields?");
            expect(confirm).toEqual(true);
        });
    });
});
