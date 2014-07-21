/*
 * Copyright 2013 - 2014.
*  QNX Software Systems Limited. All rights reserved.
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
 * @module qnx.message
 * @static
 * @deprecated
 * @description Allow access to device messages (Email, SMS, MMS).
 * 
 * <br/><h2>Events</h2>
 *     
 * <dl><dt><h4>messageservicestatechange</h4></dt>
 * <dd><p>Fired when a message service state has changed.</p>
 * <h5>Event data</h5>
 * <p>{String}</p>
 * <h5>Example</h5>
 * <pre><code>{
 *      'CONNECTED'
 * }</code></pre></dd></dl>
 *
 * <dl><dt><h3>messageservicefindresult</h3></dt>
 * <dd><p>Fired when a <code>qnx.message.find</code> operation has returned data.</p>
 * <h4>Event data</h4>
 * <p>{Array} Array of <code>qnx.message.Message</code> objects.</p>
 * <h4>Example</h4>
 * <pre><code>[
 *{
 *      handle: 123456,
 *      type: 'EMAIL',
 *      folderId: 1,
 *      sender: 'test@email.com',*
 *      subject: 'Test email',
 *      bodyPlainText: 'This is the content of the test email',
 *      bodyHtml: '&lt;html&gt;...&lt;/html&gt;',
 *      recipients: [{email:'me@email.com', name:'me'}],
 *      attachments: [{url:'blah.pdf', size:'145678'}]
 *      ...
 *},{
 *      handle: 123457,
 *      type: 'EMAIL',
 *      folderId: 1,
 *      sender: 'test@email.com',*
 *      subject: 'Test email',
 *      bodyPlainText: 'This is the content of the test email',
 *      bodyHtml: '&lt;html&gt;...&lt;/html&gt;',
 *      recipients: [{email:'me@email.com', name:'me'}],
 *      attachments: [{url:'blah.pdf', size:'145678'}]
 *      ...
 *}
 *]</code></pre></dd></dl>
 *
 * <dl><dt><h3>messageservicefindresult</h3></dt>
 * <dd><p>Fired when a <code>qnx.message.find</code> operation has failed.</p>
 * <h5>Event data</h5>
 * <p>{String} The error message.</p>
 *
 * <h3>messageservicemessageresult</h3>
 * <p>Fired when a <code>qnx.message.getMessage</code> operation has returned data.</p>
 * <h4>Event data</h4>
 * <p>{qnx.message.Message} The <code>qnx.message.Message</code> object.</p>
 * <h4>Example</h4>
 * <pre><code>{
 *      handle: 123456,
 *      type: 'EMAIL',
 *      folderId: 1,
 *      sender: 'test@email.com',*
 *      subject: 'Test email',
 *      bodyPlainText: 'This is the content of the test email',
 *      bodyHtml: '&lt;html&gt;...&lt;/html&gt;',
 *      recipients: [{email:'me@email.com', name:'me'},{email:'me2@email.com', name:'me2'}],
 *      attachments: [{url:'blah.pdf', size:'145678'}]
 *      ...
 *}</code></pre></dd></dl>
 *
 * <dl><dt><h3>messageservicemessagefail</h3></dt>
 * <dd><p>Fired when a <code>qnx.message.getMessage</code> operation has failed.</p>
 * <h4>Event data</h4>
 * <p>{String} The error message.</p></dd></dl>
 *
 * <dl><dt><h3>messageservicenotification</h3></dt>
 * <dd><p>Fired when a message service notification event has occured.</p>
 * <h4>Event data</h4>
 * <p>{Object}</p>
 * <h4>Example</h4>
 *<pre><code>{
 *      type:	'NOTIFICATION_NEW_MESSAGE',
 *      message:
 *      {
 *              handle: 123456,
 *              type: 'EMAIL',
 *              folderId: 1,
 *              sender: 'test@email.com',
 *              subject: 'Test email',
 *              bodyPlainText: 'This is the content of the test email',
 *              bodyHtml: '&lt;html&gt;...&lt;/html&gt;',
 *              ...
 *      }
 *}</code></pre></dd></dl>
 * 
 */


var _ID = "com.qnx.message",
	_events = ["messageservicestatechange", "messageservicefindresult", "messageservicefindfail", 
	"messageservicemessageresult", "messageservicemessagefail", "messageservicenotification"];


_events.map(function (eventName) {
	var channel = cordova.addDocumentEventHandler(eventName),
		success = function (data) {
			channel.fire(data);
		},
		fail = function (error) {
			console.log("Error initializing " + eventName + " listener: ", error);
		};

	channel.onHasSubscribersChange = function () {
		if (this.numHandlers === 1) {
			window.cordova.exec(success, fail, _ID, "startEvent", {eventName: eventName});
		} else if (this.numHandlers === 0) {
			window.cordova.exec(null, null, _ID, "stopEvent", {eventName: eventName});
		}
	};
});


/**
 * @description The <code>Message</code> object constructor.
 * @param {Object} properties The properties argument can be used to initialize the Messages's properties.
 */
function Message(properties) {
	this.accountId = null;
	this.accountName = null;
	this.handle = null;
	this.type = null;
	this.folderId = null;
	this.folderName = null;
	this.folderPath = null;
	this.senderEmail = null;
	this.senderNumber = null;
	this.senderFirstName = null;
	this.senderLastName = null;
	this.replyToEmail = null;
	this.replyToNumber = null;
	this.replyToFirstName = null;
	this.replyToLastName = null;
	this.recipients = []; // list of recipients, array of contact object
	this.subject = null;
	this.bodyPlainText = null;
	this.bodyHtml = null;
	this.datetime = null;
	this.read = false;
	this.sent = false;
	this.protected = false;
	this.priority = false;
	this.attachments = [];	// { filename: 'att.zip', size: 1024 }

	// Initialize properties
	for (var prop in properties) {
		if (this.hasOwnProperty(prop)) {
			this[prop] = properties[prop];
		}
	};

	/**
	 * @description Save this message to the device MAP storage.
	 */
	this.save = function () {
   		var args = {
   				contact: this
   			},
			success = function (data, response) {
				this.uid = data;
			},
			fail = function (data, response) {
				throw data;
			};
		try {
			window.cordova.exec(success, fail, _ID, 'save', args);
		} catch (e) {
			console.error(e);
		}
	};


	/**
	 *  @description Remove this message from the device MAP storage.
	 */
	this.remove = function () {
		window.cordova.exec(null, null, _ID, 'remove', { contact:this });
	};

	/**
	 * @description Move this message to different folder.
	 * @param {Number} folder The folder ID to which the message will be moved.
	 */
	this.move = function (folder) {
		window.cordova.exec(null, null, _ID, 'move', { contact:this, folder:folder });
	};

	/**
	 *  @description Send this message.
	 */
	this.send = function () {
		window.cordova.exec(null, null, _ID, 'send', { contact:this });
	};
};

function FilterExpression(leftField, operator, rightField) {
	// Filter on:
	// - Message types (SMS, Email, etc.)
	// - Sender email
	// - Subject (partial matching)
	// - Date range?
	this.leftField = leftField;
	this.operator = operator;
	this.rightField = rightField;
};

/*
 * Exports are the publicly accessible functions.
 */
module.exports = {
	/* Service states */
	
	/** The service is connected and ready to accept commands. */
	STATE_CONNECTED:'STATE_CONNECTED',
	/** The service is disconnected. */
	STATE_DISCONNECTED:'STATE_DISCONNECTED',
	/** The service in process of connecting. */
	STATE_CONNECTING:'STATE_CONNECTING',
	/** The service is in the process of initializing. */
	STATE_INITIALIZING:'STATE_INITIALIZING',

	/* Message types */
	/** Message type of email. */
	MESSAGE_TYPE_EMAIL:'EMAIL',
	/** Message type of short message service(SMS) message sent over GSM. */
	MESSAGE_TYPE_SMS_GSM:'SMS_GSM',
	/** Message type of SMS message sent over CDMA. */
	MESSAGE_TYPE_SMS_CDMA:'SMS_CDMA',
	/** Message type of multimedia messaging service(MMS) message. */
	MESSAGE_TYPE_MMS:'MMS',

	/* Message folders */
	/** The root <i>inbox</i> folder. */
	FOLDER_INBOX:'inbox/',
	/** The root <i>drafts</i> folder. */
	FOLDER_DRAFTS:'drafts/',
	/** The root <i>outbox</i> folder. */
	FOLDER_OUTBOX:'outbox/',
	/** The root <i>sent</i> folder. */
	FOLDER_SENT:'sent/',

	/* Notification types */
	/** Notification type for new messages. */
	NOTIFICATION_NEW_MESSAGE:'NOTIFICATION_NEW_MESSAGE',
	/** Notification type for delivery of sent message successful. */
	NOTIFICATION_DELIVERY_SUCCESS:'NOTIFICATION_DELIVERY_SUCCESS',
	/** Notification type for sending of message successful. */
	NOTIFICATION_SENDING_SUCCESS:'NOTIFICATION_SENDING_SUCCESS',
	/** Notification type for delivery of sent message failed. */
	NOTIFICATION_DELIVERY_FAILURE:'NOTIFICATION_DELIVERY_FAILURE',
	/** Notification type for sending of message failed. */
	NOTIFICATION_SENDING_FAILURE:'NOTIFICATION_SENDING_FAILURE',
	/** Notification type when phone memory is full. */
	NOTIFICATION_MEMORY_FULL:'NOTIFICATION_MEMORY_FULL',
	/** Notification type when phone memory is available. */
	NOTIFICATION_MEMORY_AVAILABLE:'NOTIFICATION_MEMORY_AVAILABLE',
	/** Notification type when message is deleted. */
	NOTIFICATION_MESSAGE_DELETED:'NOTIFICATION_MESSAGE_DELETED',
	/** Notification type when message moved. */
	NOTIFICATION_MESSAGE_SHIFT:'NOTIFICATION_MESSAGE_SHIFT',

	/* Filter constants */
	/** Constant that identifies the Message Type field for filtering. */
	FIELD_MESSAGE_TYPE:'type',
	/** Constant that identifies the Folder Path field for filtering. */
	FIELD_FOLDER_PATH:'folder_path',
	/** Constant that identifies Message Handle field for filtering */
	FIELD_HANDLE:'handle',
	/** Constant that identifies Sender's Email field for filtering */
	FIELD_SENDER_EMAIL:'sender_email',
	/** Constant that identifies Sender's Number field for filtering */
	FIELD_SENDER_NUMBER:'sender_number',

	/**
	 * @description The <code>qnx.messages.FilterExpression</code> constructor function. <code>FilterExpression</code> objects
	 * can be used to filter the results of the <code>qnx.messages.find()</code> function.
	 * @return {qnx.messages.FilterExpression} The <code>FilterExpression</code> constructor function.
	 */
	FilterExpression:FilterExpression,

	/**
	 * @description The <code>message.Message</code> constructor function.
	 */
	Message:Message,

	/**
	 * @description Return a list of message accounts.
	 * @param  {String} [messageType]  Filter returned accounts by supported message type.
	 * @return {Array} The list of message accounts.
	 * @example
	 * [
	 *      {
	 *           id: 0,
	 *           name: 'Desktop_1',
	 *           messageTypes: ['EMAIL']
	 *      },
	 *      {
	 *           id: 1,
	 *           name: 'SMSMMS_0',
	 *           messageTypes: ['SMS_GSM', 'MMS']
	 *      }
	 * ]
	 */
	getAccounts: function(messageType) {		
   		var value = null,
   			args = {},
			success = function (data, response) {
				value = data;
			},
			fail = function (data, response) {
				throw data;
			};

		if (typeof(messageType) === 'string') {
			args['messageType'] = messageType;
		}

		try {
			window.cordova.exec(success, fail, _ID, 'getAccounts', args);
		} catch (e) {
			console.error(e);
		}

		return value;
	},
	
	/**
	 * @description Return an array of zero or more messages.
	 * @param {qnxcar.phonebook.filterExpression} [filter] The
	 *        {@link qnxcar.phonebook.filterExpression filter expression} to apply against
	 *        the phone book database.
	 * @param {String} [orderBy] The field name to order by. The default order is descending,
	 *        however this can be overridden by specifying the <code>isAscending</code> parameter as <code>true</code>.
	 *        Defaults to <code>last_name</code>.
	 * @param {Boolean} [isAscending] If the <code>orderBy</code> parameter is supplied, this parameter changes the order
	 *        to ascending when <code>true</code>, descending when <code>false</code>. Defaults to <code>false</code>.
	 * @param {Number} [limit] The maximum number of Contacts to return. Defaults to -1 (no limit).
	 * @param {Number} [offset] The record offset. Defaults to 0 (no offset).
	 */
	find:function (filter, orderBy, isAscending, limit, offset) {
   		var value = null,
   			args = {},
			success = function (data, response) {
				var messages = [];

				// Build Contact instances for each result
				for (var result in data) {
					messages.push(new Message(data[result]));
				}

				value = messages;
			},
			fail = function (data, response) {
				throw data;
			};

		if (filter instanceof FilterExpression) {
			args['filter'] = filter;
		}
		if (typeof(orderBy) === 'string') {
			args['orderBy'] = orderBy;
		}
		if (typeof(isAscending) === 'boolean') {
			args['isAscending'] = isAscending;
		}
		if (typeof(limit) === 'number') {
			args['limit'] = limit;
		}
		if (typeof(offset) === 'number') {
			args['offset'] = offset;
		}

		try {
			window.cordova.exec(success, fail, _ID, 'find', args);
		} catch (e) {
			console.error(e);
		}
		
		return value;
	},

	/**
	 * @description Get a list of folders by type.
	 * @param {Number} accountId The message account ID.
	 * @param {Number} [parentFolderId] The parent folder ID. If not specified, the entire folder tree is returned.
	 */
	getFolders:function (accountId, parentFolderId) {
		// TODO Implement
	},

	/**
	 * @description Retrieve message from the database.
	 *              <p> First, determine if the message exists in database and then return it. If the message
	 *              doesn't exist, initiate a PPS request to fetch the message using the provided message handle.
	 *              The message is returned asynchronously, and can be retrieved by listening to the
	 *              <code>messageservicemessageresult</code> event.
	 * @param {Number} accountId The ID of the account for which the message exists.
	 * @param {String} handle Unique identifier of the message of certain type.
	 * @return  A fully populated message that includes the full subject, contents, recipient list, and attachments.
	 * */
	getMessage:function (accountId, handle) {
		window.cordova.exec(null, null, _ID, 'getMessage', { accountId: accountId, handle:handle });
	},

	/**
	 * @description Return current state of the MAP.
	 * @return {String} A value which that indicates the current state of the service, 
	           <code>STATE_CONNECTED</code>, <code>STATE_DISCONNECTED</code>, <code>STATE_INITIALIZING</code>.
	 */
	getState:function () {
   		var value = null,
			success = function (data, response) {
				value = data;
			},
			fail = function (data, response) {
				throw data;
			};
			
		try {
			window.cordova.exec(success, fail, _ID, 'getState', null);
		} catch (e) {
			console.error(e);
		}

		return value;
	}
};
