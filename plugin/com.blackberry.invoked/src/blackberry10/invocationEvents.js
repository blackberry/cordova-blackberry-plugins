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
var _invocation = window.wp.core.invocation,
    _startupMode = window.wp.core.invocation.getStartupMode();

module.exports = {
    addEventListener: function (event, trigger) {
        switch (event) {
        case "invoked":
            if (_startupMode !== wp.core.invocation.LAUNCH) {
                trigger(wp.core.invocation.getRequest());
                _startupMode = wp.core.invocation.LAUNCH;
            }
            _invocation.on("Invoked", trigger);
            break;
        case "oncardresize":
            _invocation.on("cardResize", trigger);
            break;
        case "oncardclosed":
            _invocation.on("cardClosed", trigger);
            break;
        default:
            console.log("Ignore registration for unknown event: " + event);
            break;
        }
    },
    removeEventListener: function (event, trigger) {
        switch (event) {
        case "invoked":
            _invocation.un("Invoked", trigger);
            break;
        case "oncardresize":
            _invocation.un("cardResize", trigger);
            break;
        case "oncardclosed":
            _invocation.un("cardClosed", trigger);
            break;
        default:
            console.log("Ignore un-registration for unknown event: " + event);
            break;
        }
    }
};

