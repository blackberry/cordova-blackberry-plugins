/*
 * https://github.com/jonwebb/webworks-bb10-screenshot
 *
 * Author: Jon Webb, jon@jonwebb.net
 *
 * Portions Copyright 2013 Innovatology.
 * Portions Copyright 2014 BlackBerry Limited.
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

#ifndef SCREENSHOT_JS_HPP_
#define SCREENSHOT_JS_HPP_

#define VERSION "1.0" // extension version number
#define TRACE 0 // send trace events back to JS?

#include <string>
#include <plugin.h>
#include <json/reader.h>
#include "screenshot_ndk.hpp"
#include "Logger.hpp"

class ScreenshotJS: public JSExt {

public:
    explicit ScreenshotJS(const std::string& id);
    virtual ~ScreenshotJS();

    void NotifyEvent(const std::string& event);
    // Interfaces of JSExt
    virtual bool CanDelete();
    virtual std::string InvokeMethod(const std::string& command);

private:
    std::string m_id;
    void NotifyTrace(const std::string& output);
    webworks::ScreenshotNDK* m_pTemplateController;
    webworks::Logger* m_pLogger;
};

#endif /* SCREENSHOT_JS_HPP_ */
