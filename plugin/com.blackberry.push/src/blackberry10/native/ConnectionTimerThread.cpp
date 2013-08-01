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
#include <time.h>

#include <bb/communications/push/PushService.hpp>
#include "ConnectionTimerThread.hpp"
#include "PipeData.hpp"

namespace webworks {

static void* threadFunc(void* param) {
    ConnectionTimerThread* handler = static_cast<ConnectionTimerThread*>(param);
    handler->loop();

    return param;
}

/**
 * Constructs a new ConnectionTimerThread.
 *
 * @param ps An instance of a PushService object which is used to query for a new file descriptor
 * @param pipeWriteFd the pipe file descriptor to write to in order to singal the connection has been re-established
 */
ConnectionTimerThread::ConnectionTimerThread(PushService* ps, int pipeWriteFd)
    : m_pushServicePtr(ps), m_pipeWriteFd(pipeWriteFd), m_isThreadRunning(false), m_thread(INVALID_THREAD_ID)
{
    // Thread mutex
    pthread_mutexattr_init(&m_mutexAttr);       // 1 - init
    pthread_mutex_init(&m_mutex, &m_mutexAttr); // 2 - init

    // Thread condition
    pthread_condattr_init(&m_condAttr);         // 3 - init
    pthread_condattr_setclock(&m_condAttr, CLOCK_MONOTONIC);
    pthread_cond_init(&m_cond, &m_condAttr);    // 4 - init

    init();
}

/**
 * Destructor.
 */
ConnectionTimerThread::~ConnectionTimerThread()
{
    pthread_mutexattr_destroy(&m_mutexAttr);    // 1 - destroy
    pthread_mutex_destroy(&m_mutex);            // 2 - destroy
    pthread_condattr_destroy(&m_condAttr);      // 3 - destroy
    pthread_cond_destroy(&m_cond);              // 4 - destroy

    if (m_thread > 0) {        // not necessary, but it is good practice
        pthread_detach(m_thread);
    }
}

/**
 * Starts the thread.
 */
bool ConnectionTimerThread::start()
{
    // Send a pipe message to wake up the select loop to force removal of invalid fd
    writeDataToPipe(PING_SELECT);

    m_isThreadRunning = true;

    // Start the thread to check the connection/fd
    if (pthread_create(&m_thread, NULL, threadFunc, static_cast<void*>(this)) == 0) {
        pthread_setname_np(m_thread, "webworks_connection_timer");
    } else {
        m_isThreadRunning = false;
        m_thread = INVALID_THREAD_ID;
        fprintf(stderr, "start: Failed to create connection timer pthread.\n");

        return false;
    }

    return true;
}

/**
 * Stops the thread and reinitializes the object state.
 */
void ConnectionTimerThread::stop()
{
    m_isThreadRunning = false;

    if (m_thread > 0) {
        pthread_detach(m_thread);
        m_thread = INVALID_THREAD_ID;
    }

    init();
}

/**
 * Returns a boolean indicating if the thread is running.
 * @return bool if the thread is running
 *
 */
bool ConnectionTimerThread::isRunning() const
{
    return m_isThreadRunning;
}

/**
 * Main run method of the thread when running.
 */
void ConnectionTimerThread::loop()
{
    int retval;
    if ((retval = pthread_mutex_lock(&m_mutex))) {
        fprintf(stderr, "loop: [%s] pthread_mutex_lock failed.\n", std::strerror(retval));
        return;
    }

    int result = 0;

    // We don't use the nanosecond variable in ts, so assign a value of 0.
    struct timespec ts;
    ts.tv_nsec = 0;
    ts.tv_sec = 0;
    int counter = 0;

    while (m_isThreadRunning) {
        counter++;
        clock_gettime(CLOCK_MONOTONIC, &ts);

        /* Convert from timeval to timespec */
        ts.tv_sec += m_retryTime;

        resetRetryTimer();

        result = pthread_cond_timedwait(&m_cond, &m_mutex, &ts);
        if ((result != 0) && (result != ETIMEDOUT)) {
            stop();
            break;
        }

        processRequest();
    }

    pthread_mutex_unlock(&m_mutex);
}

/**
 * Initialize the object state.
 */
void ConnectionTimerThread::init()
{
    m_retryTime = INITIAL_WAIT_TIME_SECONDS;
}

/**
 * Each time the thread wakes up from a retry this function will run to query the PushService file descriptor to see if it's now valid. If it is valid, it will
 * signal the caller through the pipe file descriptor and stop the thread.
 */
void ConnectionTimerThread::processRequest()
{
    int push_fd = m_pushServicePtr->getPushFd();

    if (push_fd != INVALID_PPS_FILE_DESCRIPTOR) {
        // Send a pipe message to wake up the select loop to let it know a valid file descriptor is now avaiable
        writeDataToPipe(CONNECTION_ESTABLISHED);

        stop();
    }
}

/**
 * Resets the retry time to the next exponential value or the maximum value if it is reached.
 */
void ConnectionTimerThread::resetRetryTimer()
{
    if (m_retryTime != MAX_WAIT_TIME) {
        m_retryTime = m_retryTime * 2;
        if (m_retryTime > MAX_WAIT_TIME) {
            m_retryTime = MAX_WAIT_TIME;
        }
    }
}

/**
 * Write data to pipe to wake up the select loop so it can get the new file descriptor to monitor.
 */
void ConnectionTimerThread::writeDataToPipe(char pipeData)
{
    if (write(m_pipeWriteFd, &pipeData, 1) < 0) {
        fprintf(stderr, "writeDataToPipe: Failed to write to pipe.\n");
    }
}

} // namespace webworks
