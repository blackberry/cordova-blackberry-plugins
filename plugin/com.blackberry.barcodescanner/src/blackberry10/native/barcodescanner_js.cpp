/*
 * Copyright 2013 Research In Motion Limited.
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

#include <tokenizer.h>
#include <stdio.h>
#include <sys/slog.h>
#include <QDebug>
#include <string>
#include "barcodescanner_js.hpp"
#include "barcodescanner_ndk.hpp"

/**
 * Default constructor.
 */
BarcodeScannerJS::BarcodeScannerJS(const std::string& id) {
        qDebug() << "I enterted the constructor";
        m_id = id;
        qDebug() << "Im about to set the logger";
        m_pLogger = new webworks::Logger("BarcodeScannerJS", this);

        qDebug() << "im about to set the controller";
        m_pBarcodeScannerController = new webworks::BarcodeScannerNDK(this);

        qDebug() << "does this work constructor";
}

/**
 * BarcodeScannerJS destructor.
 */
BarcodeScannerJS::~BarcodeScannerJS() {
        delete m_pBarcodeScannerController;
        delete m_pLogger;
}

/**
 * This method returns the list of objects implemented by this native
 * extension.
 */
char* onGetObjList() {
    static char name[] = "BarcodeScannerJS";
    return name;
}

/**
 * This method is used by JNext to instantiate the BarcodeScannerJS object when
 * an object is created on the JavaScript server side.
 */
JSExt* onCreateObject(const string& className, const string& id) {
    qDebug() << "before returning BarcodeScannerJS";

    if (className == "BarcodeScannerJS") {
        qDebug() << "I entered the if statement";
        return new BarcodeScannerJS(id);
    }

    qDebug() << "does this work onCreateObject";
    return NULL;
}

/**
 * Method used by JNext to determine if the object can be deleted.
 */
bool BarcodeScannerJS::CanDelete() {
    return true;
}

/**
 * It will be called from JNext JavaScript side with passed string.
 * This method implements the interface for the JavaScript to native binding
 * for invoking native code. This method is triggered when JNext.invoke is
 * called on the JavaScript side with this native objects id.
 */
string BarcodeScannerJS::InvokeMethod(const string& command) {
    // command appears with parameters following after a space
    int index = command.find_first_of(" ");
    std::string strCommand = command.substr(0, index);
    std::string args = command.substr(index + 1, command.length());

    qDebug() << "does this work InvokeMethod";

    if (strCommand == "startRead") {
        m_pBarcodeScannerController->startRead(args);
    }
    else if (strCommand == "stopRead") {
        m_pBarcodeScannerController->stopRead(args);
    }

    strCommand.append(";");
    strCommand.append(command);
    return strCommand;
}

// Notifies JavaScript of an event
void BarcodeScannerJS::NotifyEvent(const std::string& event) {
    //(void) event;

    std::string eventString = m_id + " ";
    eventString.append(event);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

webworks::Logger* BarcodeScannerJS::getLog() {
    return m_pLogger;
}
