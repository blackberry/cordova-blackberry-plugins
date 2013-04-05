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

#ifndef CONNECTIONTIMERTHREAD_H_
#define CONNECTIONTIMERTHREAD_H_

#include <time.h>

extern "C" {
#include <pthread.h>
}

#include <bb/communications/push/PushService.hpp>

#include <string>

#define INITIAL_WAIT_TIME_SECONDS   2       // seconds
#define MAX_WAIT_TIME               36000   // 10 hours
#define INVALID_THREAD_ID           -1      // invalid thread id

namespace webworks {

typedef bb::communications::push::PushService PushService;

/**
 * The ConnectionTimerThread is used to spawn a thread to try and re-establish the connection to the underlying Push Service 
 * using an expontential backoff timer with a maximum retry time.
 */
class ConnectionTimerThread {
public:
    ConnectionTimerThread(PushService* ps, int pipeWriteFd);
    virtual ~ConnectionTimerThread();

    bool start();
    void stop();
    void loop();
    bool isRunning() const;

private:
    void init();
    void processRequest();
    void resetRetryTimer();
    void writeDataToPipe(char pipeData);

    PushService* m_pushServicePtr;
    int m_retryTime;
    int m_pipeWriteFd;
    bool m_isThreadRunning;
    pthread_t m_thread;
    pthread_cond_t m_cond;
    pthread_mutex_t m_mutex;
    pthread_mutexattr_t m_mutexAttr;        // mutex attribute
    pthread_condattr_t m_condAttr;          // thread condition
};

} // namespace webworks

#endif /* CONNECTIONTIMERTHREAD_H_ */
