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

function enableWebDriver() {
    chrome.internal.webDriver.enabled = true;
    window.wp.core.events.emit('automation.init', [], false);
    require('lib/webview').getWebViewObj().once('DocumentLoadFinished', showWebDriverInfo);
};

function showWebDriverInfo () {
    qnx.webplatform.device.getNetworkInterfaces(function (networkInfo) {
        var connectedInterface;
        var messageObj = {};
        var port = chrome.internal.webDriver.port;

        if (networkInfo.ecm0.connected === true) {
            connectedInterface = networkInfo.ecm0;
        }

        messageObj.title = "Web Driver Enabled";
        if (connectedInterface) {
            messageObj.htmlmessage =  "\n ip4:    " + connectedInterface.ipv4Address + ":" + port + "<br/> ip6:    " + connectedInterface.ipv6Address + ":" + port;
        } else {
            messageObj.message = "Connect to the simulator's IP on port: " + port;
        }
        messageObj.dialogType = 'JavaScriptAlert';
        window.wp.ui.dialog.show(messageObj);
    });
};

window.wp.once('ui.init', enableWebDriver);
