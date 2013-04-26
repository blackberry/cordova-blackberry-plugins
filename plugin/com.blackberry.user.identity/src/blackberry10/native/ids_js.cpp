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

#include <errno.h>
#include <sys/pps.h>
#include <sys/netmgr.h>
#include <sys/iomsg.h>
#include <bps/bps.h>
#include <json/reader.h>
#include <json/writer.h>
#include <string>
#include <sstream>

#include "ids_js.hpp"

volatile int eventCHID = 0;

extern "C" {
    void getTokenSuccessCB(ids_request_id_t requestId, const char *token, int paramCount, const ids_token_param_t *params, void *cbData) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;
            resultJSON["token"] = token;

            resultJSON["paramCount"] = paramCount;
            Json::Value tokenParams;
            int i;
            for (i = 0; i < paramCount; i++) {
                tokenParams[i]["name"] = params[i].name;
                tokenParams[i]["value"] = params[i].value;
            }
            resultJSON["tokenParams"] = Json::Value(tokenParams);

            std::string resultStr = writer.write(resultJSON);
            request->NotifyEvent(request->getEventId(), writer.write(resultJSON));
        }
    }

    void clearTokenSuccessCB(ids_request_id_t requestId, bool clear, void* cbData ) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;
            resultJSON["clear"] = clear;

            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }

    void getPropertiesSuccessCB(ids_request_id_t requestId, int propertyCount, const ids_property_t* properties, void* cbData ) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;
            resultJSON["propertyCount"] = propertyCount;
            Json::Value userProperties;

            int i;
            for (i = 0; i < propertyCount; i++) {
                userProperties[i]["uri"] = properties[i].name;
                userProperties[i]["value"] = properties[i].value;
            }

            resultJSON["userProperties"] = Json::Value(userProperties);

            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }

    void getDataSuccessCB(ids_request_id_t requestId, const ids_data_t* data, void* cbData ) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;
            resultJSON["dataName"] = data->name;
            resultJSON["dataLength"] = data->length;

            // Cordova apps are required to store their data as strings
            char *strValue = reinterpret_cast<char *>(calloc(1, data->length + 1));
            if ( strValue ) {
                strncpy(strValue, reinterpret_cast<char *>(data->value), data->length);
                resultJSON["dataValue"] = strValue;
            } else {
                resultJSON["dataValue"] = "";
            }

            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }

    void createDataSuccessCB(ids_request_id_t requestId, void* cbData ) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;

            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }

    void deleteDataSuccessCB(ids_request_id_t requestId, void* cbData ) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;

            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }

    void setDataSuccessCB(ids_request_id_t requestId, void* cbData ) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;

            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }

    void listDataSuccessCB(ids_request_id_t requestId, int listCount, const char **list, void *cbData ) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;
            resultJSON["listCount"] = listCount;
            Json::Value dataList;

            int i;
            for (i = 0; i < listCount; i++) {
                dataList[i] = list[i];
            }

            resultJSON["dataList"] = Json::Value(dataList);

            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }

    void challengeSuccessCB(ids_request_id_t requestId, int level, void *cbData ) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;
            resultJSON["level"] = level;

            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }

    void notifierCB(int type, const char *name, int notification, void *cbData) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["type"] = type;
            resultJSON["name"] = name;
            resultJSON["notification"] = notification;

            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }


    void failureCB(ids_request_id_t requestId, ids_result_t result, const char *failureInfo, void *cbData) {
        if ( cbData ) {
            IDSEXT *request = reinterpret_cast<IDSEXT *>(cbData);

            Json::FastWriter writer;
            Json::Value resultJSON;

            resultJSON["requestId"] = requestId;
            resultJSON["result"] = result;
            resultJSON["failureInfo"] = (failureInfo ? failureInfo : "");
            std::string resultStr = writer.write(resultJSON);

            request->NotifyEvent(request->getEventId(), resultStr.c_str());
        }
    }
}


IDSEXT::IDSEXT(const std::string& id) : m_id(id)
{
    if ( ids_initialize() != IDS_SUCCESS ) {
        fprintf(stderr, "Unable to initialize IDS library\n");
    }
    providers = NULL;

    connected = true;
    pthread_create(&m_thread, NULL, idsEventThread, this);
}

std::string IDSEXT::getEventId()
{
    return event_id;
}

ids_provider_mapping* IDSEXT::getProviders()
{
    return providers;
}

char* onGetObjList()
{
    // Return list of classes in the object
    static char name[] = "IDSEXT";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    // Make sure we are creating the right class
    if (className != "IDSEXT") {
        return 0;
    }

    return new IDSEXT(id);
}

ids_provider_mapping* IDSEXT::getProvider(const std::string& provider)
{
    ids_provider_mapping *current = providers;

    while ( current != NULL ) {
        if ( provider == current->providerName ) {
            return current;
        } else {
            current = providers->next;
        }
    }

    return NULL;
}

void IDSEXT::clearProviders(void)
{
    ids_provider_mapping *current = providers;
    while ( current != NULL ) {
        providers = current->next;
        if ( current->providerName ) free(const_cast<char *>(current->providerName));
        if ( current->next ) free(reinterpret_cast<void *>(current->next));
        current = providers;
    }
}

void IDSEXT::removeProvider(int providerFd )
{
    ids_provider_mapping *current = providers;
    ids_provider_mapping *previous = NULL;

    while ( current != NULL ) {
        if ( current->providerFd == providerFd ) {
            if ( previous == NULL ) {
                providers = current->next;
            } else {
                previous->next = current->next;
            }
            if ( current->providerName ) free(const_cast<char *>(current->providerName));
            if ( current->next ) free(reinterpret_cast<void *>(current->next));
        }
    }
}

IDSEXT::~IDSEXT()
{
    connected = false;
    ChannelDestroy(eventCHID);
    ids_shutdown();
    clearProviders();
}

std::string IDSEXT::InvokeMethod(const std::string& command)
{
    int index = command.find_first_of(" ");

    string strCommand = command.substr(0, index);
    string strParam = command.substr(index + 1, command.length());

    Json::Reader reader;
    Json::Value obj;
    if (strCommand == "getVersion") {
        return GetVersion();
    } else if (strCommand == "registerProvider") {
        return RegisterProvider(strParam);
    } else if (strCommand == "setOption") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);

        if (!parse) {
            //fprintf(stderr, "%s\n", "error parsing\n");
            return "unable to parse options";
        }
        int option = obj["option"].asInt();
        const std::string value = obj["value"].asString();
        return( SetOption(option, value) );
    } else if (strCommand == "getToken") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);

        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        std::string tokenType = obj["tokenType"].asString();
        const std::string appliesTo = obj["appliesTo"].asString();

        GetToken(provider, tokenType, appliesTo);
    } else if (strCommand == "clearToken") {
            // parse the JSON
        bool parse = reader.parse(strParam, obj);

        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        std::string tokenType = obj["tokenType"].asString();
        const std::string appliesTo = obj["appliesTo"].asString();

        ClearToken(provider, tokenType, appliesTo);
    } else if (strCommand == "getProperties") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);
        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        int propertyType = obj["propertyType"].asInt();
        int numProps = obj["numProps"].asInt();
        const std::string userProps = obj["userProperties"].asString();
        GetProperties(provider, propertyType, numProps, userProps);
    } else if (strCommand == "getData") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);
        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        int dataType = obj["dataType"].asInt();
        int dataFlags = obj["dataFlags"].asInt();
        const std::string dataName = obj["dataName"].asString();
        GetData(provider, dataType, dataFlags, dataName);
    } else if (strCommand == "createData") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);
        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        int dataType = obj["dataType"].asInt();
        int dataFlags = obj["dataFlags"].asInt();
        const std::string dataName = obj["dataName"].asString();
        const std::string dataValue = obj["dataValue"].asString();
        CreateData(provider, dataType, dataFlags, dataName, dataValue);
    } else if (strCommand == "deleteData") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);
        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        int dataType = obj["dataType"].asInt();
        int dataFlags = obj["dataFlags"].asInt();
        const std::string dataName = obj["dataName"].asString();
        DeleteData(provider, dataType, dataFlags, dataName);
    } else if (strCommand == "setData") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);
        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        int dataType = obj["dataType"].asInt();
        int dataFlags = obj["dataFlags"].asInt();
        const std::string dataName = obj["dataName"].asString();
        const std::string dataValue = obj["dataValue"].asString();
        SetData(provider, dataType, dataFlags, dataName, dataValue);
    } else if (strCommand == "listData") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);
        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        int dataType = obj["dataType"].asInt();
        int dataFlags = obj["dataFlags"].asInt();
        ListData(provider, dataType, dataFlags);
    } else if (strCommand == "challenge") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);
        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        int challengeType = obj["challengeType"].asInt();
        int challengeFlags = obj["challengeFlags"].asInt();
        Challenge(provider, challengeType, challengeFlags);
    } else if (strCommand == "registerNotifier") {
        // parse the JSON
        bool parse = reader.parse(strParam, obj);
        if (!parse) {
            //fprintf(stderr, "%s", "error parsing\n");
            return "unable to parse options";
        }
        event_id = obj["_eventId"].asString();
        std::string provider = obj["provider"].asString();
        int notifierType = obj["notifierType"].asInt();
        int notifierFlags = obj["notifierFlags"].asInt();
        std::string notifierName = obj["notifierName"].asString();
        RegisterNotifier(provider, notifierType, notifierFlags, notifierName);
    }

    return "";
}

bool IDSEXT::CanDelete()
{
    return true;
}

// Notifies JavaScript of an event
void IDSEXT::NotifyEvent(const std::string& eventId, const std::string& event)
{
    std::string eventString = m_id + " ";
    eventString.append(eventId);
    eventString.append(" ");
    eventString.append(event);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

std::string IDSEXT::GetVersion()
{
    ostringstream ver;
    ver << ids_get_version();
    return( ver.str() );
}

std::string IDSEXT::RegisterProvider(const std::string& providerName)
{
    Json::FastWriter writer;
    Json::Value resultJSON;

    ids_provider_mapping *registeredItem = reinterpret_cast<ids_provider_mapping *>(malloc(sizeof(ids_provider_mapping)));
    if (!registeredItem) {
        fprintf(stderr, "Unable to register IDS provider - malloc error\n");
        return "";
    }

    registeredItem->providerName = strdup(providerName.c_str());
    resultJSON["result"] = ids_register_provider(registeredItem->providerName, &registeredItem->provider, &registeredItem->providerFd);
    if ( (ids_result_t) resultJSON["result"].asInt() == IDS_SUCCESS ) {
        registeredItem->next = providers;
        providers = registeredItem;

        registeredItem->sigEvent = new sigevent;
        registeredItem->sigEvent->sigev_notify = SIGEV_PULSE;
        registeredItem->sigEvent->sigev_coid = ConnectAttach(ND_LOCAL_NODE, 0, eventCHID, _NTO_SIDE_CHANNEL, 0);
        registeredItem->sigEvent->sigev_priority = getprio(0);
        registeredItem->sigEvent->sigev_code = registeredItem->providerFd;
        registeredItem->sigEvent->sigev_value.sival_int = registeredItem->providerFd;

        if (ionotify(registeredItem->providerFd, _NOTIFY_ACTION_POLLARM, _NOTIFY_COND_INPUT, registeredItem->sigEvent) & _NOTIFY_COND_INPUT) {
            MsgDeliverEvent(0, registeredItem->sigEvent);
        }
    } else {
        resultJSON["errno"] = strerror(errno);
    }

    std::string resultStr = writer.write(resultJSON);
    return( resultStr.c_str() );
}

std::string IDSEXT::SetOption(int option, const std::string& value)
{
    Json::FastWriter writer;
    Json::Value resultJSON;

    resultJSON["result"] = ids_set_option((ids_option_t) option, value.c_str());
    if ( (ids_result_t) resultJSON["result"].asInt() != IDS_SUCCESS ) {
        resultJSON["errno"] = strerror(errno);
    }

    std::string resultStr = writer.write(resultJSON);

    return ( resultStr.c_str());
}

void* IDSEXT::idsEventThread(void *args)
{
    IDSEXT *idsExt = reinterpret_cast<IDSEXT *>(args);

    struct _pulse msg;

    eventCHID = ChannelCreate(_NTO_CHF_COID_DISCONNECT);

    while ( idsExt->connected ) {
        if (MsgReceive(eventCHID, &msg, sizeof(msg), NULL) == 0) {
            // Find provider - process msg
            ids_provider_mapping* current = idsExt->providers;

            while ( current != NULL ) {
                if ( msg.code == current->providerFd ) {
                    // Re-arm ionotify
                    if (ids_process_msg(current->providerFd) != IDS_SUCCESS) {
                        fprintf(stderr, "Failed to process IDS message\n");
                        idsExt->removeProvider(current->providerFd);
                    } else {
                        if (ionotify(current->providerFd, _NOTIFY_ACTION_POLLARM, _NOTIFY_COND_INPUT, current->sigEvent) & _NOTIFY_COND_INPUT) {
                            MsgDeliverEvent(0, current->sigEvent);
                        }
                    }
                }
                current = current->next;
            }
        }
    }

    pthread_detach(pthread_self());
    return NULL;
}

std::string IDSEXT::GetToken(const std::string& provider, const std::string& tokenType, const std::string& appliesTo)
{
    ids_request_id_t *getTokenRequestId = NULL;
    ids_provider_mapping *requestProvider = getProvider(provider);

    ids_result_t getTokenResult;
    getTokenResult = ids_get_token((requestProvider ? requestProvider->provider : NULL),
                                    tokenType.c_str(),
                                    appliesTo.c_str(),
                                    getTokenSuccessCB,
                                    failureCB,
                                    this,
                                    getTokenRequestId);

    if ( getTokenResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}


std::string IDSEXT::GetProperties(const std::string& provider, int propertyType, int numProps, const std::string& properties)
{
    const char *propList[numProps];
    char *delimited = strdup(properties.c_str());
    char *token;

    int i = 0;
    while ((token = strsep(&delimited, ","))) {
         propList[i] = strdup(token);
         i++;
    }
    ids_request_id_t *getPropertiesRequestId = NULL;
    ids_provider_mapping *requestProvider = getProvider(provider);
    ids_result_t getPropertiesResult;

    getPropertiesResult = ids_get_properties((requestProvider ? requestProvider->provider : NULL),
                                                propertyType,
                                                numProps,
                                                propList,
                                                getPropertiesSuccessCB,
                                                failureCB,
                                                this,
                                                getPropertiesRequestId);

    if ( getPropertiesResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}


std::string IDSEXT::ClearToken(const std::string& provider, const std::string& tokenType, const std::string& appliesTo)
{
    ids_request_id_t *clearTokenRequestId = NULL;
    ids_provider_mapping *requestProvider = getProvider(provider);

    ids_result_t clearTokenResult;
    clearTokenResult = ids_clear_token((requestProvider ? requestProvider->provider : NULL),
                                        tokenType.c_str(),
                                        appliesTo.c_str(),
                                        clearTokenSuccessCB,
                                        failureCB,
                                        this,
                                        clearTokenRequestId);

    if ( clearTokenResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}

std::string IDSEXT::GetData(const std::string& provider, int dataType, int dataFlags, const std::string& dataName)
{
    ids_request_id_t *getDataRequestId = NULL;
    ids_provider_mapping *requestProvider = getProvider(provider);
    ids_result_t getDataResult;

    getDataResult = ids_get_data((requestProvider ? requestProvider->provider : NULL),
                                    dataType,
                                    dataFlags,
                                    dataName.c_str(),
                                    getDataSuccessCB,
                                    failureCB,
                                    this,
                                    getDataRequestId);

    if ( getDataResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}

std::string IDSEXT::CreateData(const std::string& provider, int dataType, int dataFlags, const std::string& dataName, const std::string& dataValue)
{
    ids_request_id_t *createDataRequestId = NULL;
    ids_provider_mapping *requestProvider = getProvider(provider);
    ids_result_t createDataResult;
    ids_data_t userData;
    userData.name = strdup(dataName.c_str());
    userData.value = strdup(dataValue.c_str());
    userData.length = dataValue.length();

    createDataResult = ids_create_data((requestProvider ? requestProvider->provider : NULL),
                                            dataType,
                                            dataFlags,
                                            &userData,
                                            createDataSuccessCB,
                                            failureCB,
                                            this,
                                            createDataRequestId);

    if ( createDataResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}

std::string IDSEXT::DeleteData(const std::string& provider, int dataType, int dataFlags, const std::string& dataName)
{
    ids_request_id_t *deleteDataRequestId = NULL;
    ids_provider_mapping *requestProvider = getProvider(provider);
    ids_result_t deleteDataResult;

    deleteDataResult = ids_delete_data((requestProvider ? requestProvider->provider : NULL),
                                            dataType,
                                            dataFlags,
                                            dataName.c_str(),
                                            deleteDataSuccessCB,
                                            failureCB,
                                            this,
                                            deleteDataRequestId);

    if ( deleteDataResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}

std::string IDSEXT::SetData(const std::string& provider, int dataType, int dataFlags, const std::string& dataName, const std::string& dataValue)
{
    ids_request_id_t *setDataRequestId = NULL;
    ids_provider_mapping *requestProvider = getProvider(provider);
    ids_result_t setDataResult;
    ids_data_t userData;
    userData.name = strdup(dataName.c_str());
    userData.value = strdup(dataValue.c_str());
    userData.length = dataValue.length();

    setDataResult = ids_set_data((requestProvider ? requestProvider->provider : NULL),
                                    dataType,
                                    dataFlags,
                                    &userData,
                                    setDataSuccessCB,
                                    failureCB,
                                    this,
                                    setDataRequestId);

    if ( setDataResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}

std::string IDSEXT::ListData(const std::string& provider, int dataType, int dataFlags)
{
    ids_request_id_t *listDataRequestId = NULL;
    ids_provider_mapping *requestProvider = getProvider(provider);
    ids_result_t listDataResult;

    listDataResult = ids_list_data((requestProvider ? requestProvider->provider : NULL),
                                        dataType,
                                        dataFlags,
                                        listDataSuccessCB,
                                        failureCB,
                                        this,
                                        listDataRequestId);

    if ( listDataResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}

std::string IDSEXT::Challenge(const std::string& provider, int challengeType, int challengeFlags)
{
    ids_request_id_t *challengeRequestId = NULL;
    ids_provider_mapping *requestProvider = getProvider(provider);
    ids_result_t challengeResult;

    challengeResult = ids_challenge((requestProvider ? requestProvider->provider : NULL),
                                        challengeType,
                                        challengeFlags,
                                        challengeSuccessCB,
                                        failureCB,
                                        this,
                                        challengeRequestId);

    if ( challengeResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}

std::string IDSEXT::RegisterNotifier(const std::string& provider, int notifierType, int notifierFlags, const std::string& notifierName)
{
    ids_provider_mapping *requestProvider = getProvider(provider);
    ids_result_t registerNotifierResult;

    registerNotifierResult = ids_register_notifier((requestProvider ? requestProvider->provider : NULL),
                                                        notifierType,
                                                        notifierFlags,
                                                        notifierName.c_str(),
                                                        notifierCB,
                                                        this);

    if ( registerNotifierResult != IDS_SUCCESS ) {
        failureCB((ids_request_id_t)0, IDS_FAILURE, strerror(errno), this);
    }

    return "";
}
