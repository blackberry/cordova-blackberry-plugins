/*
 * Copyright 2010-2011 Research In Motion Limited.
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
var invocation = window.wp.core.invocation;

module.exports = {
    addEventListener: function (event, trigger) {
        switch (event) {
        case "onchildcardstartpeek":
            invocation.on("cardPeekStarted", trigger);
            break;
        case "onchildcardendpeek":
            invocation.on("cardPeekEnded", trigger);
            break;
        case "onchildcardclosed":
            invocation.on("childCardClosed", trigger);
            break;
        case "invocation.interrupted":
            invocation.interrupter = trigger;
            break;
        default:
            console.log("Ignore registration for unknown event: " + event);
            break;
        }
    },
    removeEventListener: function (event, trigger) {
        switch (event) {
        case "onchildcardstartpeek":
            invocation.un("cardPeekStarted", trigger);
            break;
        case "onchildcardendpeek":
            invocation.un("cardPeekEnded", trigger);
            break;
        case "onchildcardclosed":
            invocation.un("childCardClosed", trigger);
            break;
        case "invocation.interrupted":
            invocation.interrupter = undefined;
            break;
        default:
            console.log("Ignore un-registration for unknown event: " + event);
            break;
        }
    }
};
