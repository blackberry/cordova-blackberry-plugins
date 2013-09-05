/*
 * Copyright 2013  QNX Software Systems Limited
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"). You
 * may not reproduce, modify or distribute this software except in
 * compliance with the License. You may obtain a copy of the License
 * at: http://www.apache.org/licenses/LICENSE-2.0.
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OF ANY KIND, either express or implied.
 * This file may contain contributions from others, either as
 * contributors under the License or as licensors under other terms.
 * Please review this entire file for other proprietary rights or license
 * notices, as well as the applicable QNX License Guide at
 * http://www.qnx.com/legal/licensing/document_archive/current_matrix.pdf
 * for other information.
 */

/**
 * The message service notification type constants.
 * Notification type constants must be consistent with those defined in the qnx.message client.js.
 */
module.exports = {
	/** Notification type for new message */
	NOTIFICATION_NEW_MESSAGE:'NOTIFICATION_NEW_MESSAGE',
	/** Notification type for delivery of sent message successful */
	NOTIFICATION_DELIVERY_SUCCESS:'NOTIFICATION_DELIVERY_SUCCESS',
	/** Notification type for sending of message successful */
	NOTIFICATION_SENDING_SUCCESS:'NOTIFICATION_SENDING_SUCCESS',
	/** Notification type for delivery of sent message failed */
	NOTIFICATION_DELIVERY_FAILURE:'NOTIFICATION_DELIVERY_FAILURE',
	/** Notification type for sending of message failed */
	NOTIFICATION_SENDING_FAILURE:'NOTIFICATION_SENDING_FAILURE',
	/** Notification type when phone memory is full */
	NOTIFICATION_MEMORY_FULL:'NOTIFICATION_MEMORY_FULL',
	/** Notification type when phone memory is available */
	NOTIFICATION_MEMORY_AVAILABLE:'NOTIFICATION_MEMORY_AVAILABLE',
	/** Notification type when message is deleted*/
	NOTIFICATION_MESSAGE_DELETED:'NOTIFICATION_MESSAGE_DELETED',
	/** Notification type when message moved */
	NOTIFICATION_MESSAGE_SHIFT:'NOTIFICATION_MESSAGE_SHIFT',
};