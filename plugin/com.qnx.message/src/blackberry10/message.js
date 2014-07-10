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
 * The abstraction layer for MAP functionality.
 */

var _pps = qnx.webplatform.pps,
	_qdb = require('../../lib/qdb'),
	_statusPPS,
	_controlPPS,
	_notificationPPS,
	ServiceState = require('./servicestate'),
	ServiceStatus = require('./servicestatus'),
	ServiceNotification = require('./servicenotification'),
	_stateChangedTrigger,
	_findResultTrigger,
	_findFailTrigger,
	_messageResultTrigger,
	_messageFailTrigger,
	_notificationTrigger,
	_statusChangeHandler,
	_db;

/**
 * MAP status PPS object change handler. Responsible for firing
 * the extension events.
 * @param event {Event} The PPS change event
 */
function onStatusEvent(event) {
	// State change
	if (_stateChangedTrigger && event && event.data && event.data.state) {
		_stateChangedTrigger(mapStateToServiceState(event.data.state));
	}

	// Status change
	if (_statusChangeHandler && event && event.data && event.data.status) {
		_statusChangeHandler(mapStatusToServiceStatus(event.data.status));
	}
}

/**
 * Event handler will be invoked during onNewData on PPS object.
 * Handles notifications coming from Bluetooth.
 * Notification can be about new message, deleted message etc.
 * @param event {Object} PPS event object
 * Ex: data:{
 *	 status: 'NEW_MESSAGES'
 *	 message_type: 'EMAIL'
 *	 message_handle: '123456'
 * }
 * */
function onNotificationEvent(event) {
	var result = {};
	if (_notificationTrigger && event && event.data
			&& event.data.status
			&& event.data.hasOwnProperty('account_id') && typeof(event.data.account_id) === 'number' 
			&& event.data.message_type
			&& event.data.message_handle) {
		switch (event.data.status) {
			case "NEW_MESSAGE":
				// select new message by handle provided
				var messages = queryMessages("WHERE handle='" + event.data.message_handle + "' AND account_id=" + event.data.account_id);
				if (messages.length == 1) {
					result = { message:messages[0], accountId: event.data.account_id, type: mapNoitificationTypeToServiceNotificationType(event.data.status) };
					_notificationTrigger(result);
				}
				break;
			case "MESSAGE_DELETED":
				// Construct a message object containing just the handle and type
				result = { 
					message: { handle: event.data.message_handle, type: event.data.message_type },
					type: mapNoitificationTypeToServiceNotificationType(event.data.status)
				};
				_notificationTrigger(result);
				break;
		}
	}
}

/**
 * Private utility to help build and execute query on database, to fetch full message
 * @param whereCaluse {String} is like "WHERE a=1"
 * @param orderBy {String} Field name for Order By
 * @param isAscending {Boolean} Sorting direction
 * @param limit {String} maximum numbers of records in result set
 * @param offset {String} offset from the beginning of the table
 * @returns {Object} Array representing list of Message, lacking full subject and body and all contacts (TO, CC, BCC) only one (first) TO contact present
 * @example [
 * {
 *		 handle: 123456,
 *		 message_type: 'EMAIL',
 *		 folderId: 1,
 *		 sender: 'test@email.com',*
 *		 subject: 'Test email',
 *		 bodyPlainText: 'This is the content of the test email',
 *		 bodyHtml: '<html>...</html>',
 *		 recipients: [{email:'me@email.com', name:'me'}],
 *		 attachments: [{url:'blah.pdf', size:'145678'}]
 *		 ...
 * },{
 *  *	 handle: 123457,
 *		 message_type: 'EMAIL',
 *		 folderId: 1,
 *		 sender: 'test@email.com',*
 *		 subject: 'Test email',
 *		 bodyPlainText: 'This is the content of the test email',
 *		 bodyHtml: '<html>...</html>',
 *		 recipients: [{email:'me@email.com', name:'me'}],
 *		 attachments: [{url:'blah.pdf', size:'145678'}]
 *		 ...
 * }]
 * */
function queryMessages(whereClause, orderBy, isAscending, limit, offset) {
	// Just get messages
	var sql = 'SELECT * FROM messages_view ' + whereClause +
		(typeof(orderBy) === 'string' ? ' ORDER BY ' + orderBy + (typeof(isAscending) === 'boolean' && isAscending ? ' ASC' : ' DESC') : '') +
		' LIMIT ' + (typeof(limit) === 'number' ? limit : -1) +
		' OFFSET ' + (typeof(offset) === 'number' ? offset : 0);

	// Get the array of results
	var result = _qdb.resultToArray(_db.query(sql));
	return normalizeFields(result);
}

/**
 * Private utility to help build and execute query on database, to fetch full messages
 * @param accountId {Number} The ID of the account in which the message exists
 * @param handle {String} Message handle
 * @returns {Object} Object representing single Message
 * @example:
 * {
 *		handle: 123456,
 *		message_type: 'EMAIL',
 *		folderId: 1,
 *		sender: 'test@email.com',*
 *		subject: 'Test email',
 *		bodyPlainText: 'This is the content of the test email',
 *		bodyHtml: '<html>...</html>',
 *		recipients: [{email:'me@email.com', name:'me'},{email:'me2@email.com', name:'me2'}],
 *		attachments: [{url:'blah.pdf', size:'145678'}]
 *		 ...
 * }
 * */
function queryFullMessage(accountId, handle) {
	var sql = "SELECT * FROM full_messages_view" + " WHERE handle='" + handle + "' AND account_id=" + accountId;

	var message = null;
	// Get the array of results
	var result = _qdb.resultToArray(_db.query(sql));

	if (result && result.length > 0) {
		message = normalizeFields(result)[0];

		sql = "SELECT * FROM attachments" + " WHERE message_id=" + message.messageId;
		var attachments = _qdb.resultToArray(_db.query(sql));
		attachments = normalizeFields(attachments);
		message.attachments = attachments;

		sql = "SELECT * FROM contacts_view" + " WHERE message_id=" + message.messageId;
		var contacts = _qdb.resultToArray(_db.query(sql));
		message.recipients = normalizeFields(contacts);
	}

	return message;
}

/**
 * Converts the MAP-specific contacts service state string into a state constant
 * defined in the qnx.message extension.
 * @param mapState {String} The MAP state string.
 * @returns {String} A qnx.message state constant.
 */
function mapStateToServiceState(mapState) {
	var state = null;
	switch (mapState) {
		case 'CONNECTED':
			state = ServiceState.STATE_CONNECTED;
			break;
		case 'DISCONNECTED':
			state = ServiceState.STATE_DISCONNECTED;
			break;
		case 'INITIALIZING':
			state = ServiceState.STATE_DISCONNECTED;
			break;
		case 'CONNECTING':
			state = ServiceState.STATE_CONNECTING;
			break;
	}
	return state;
}

/**
 * Converts the MAP-specific service status string into a status constant
 * defined in the qnx.message extension.
 * @param mapStatus {String} The MAP status string.
 * @returns {String} A qnx.message status constant.
 */
function mapStatusToServiceStatus(mapStatus) {
	var status = null;
	switch (mapStatus) {
		case 'PROCESSING':
			status = ServiceStatus.STATUS_PROCESSING;
			break;
		case 'COMPLETE':
			status = ServiceStatus.STATUS_READY;
			break;
		case 'ERROR_BUSY':
			status = ServiceStatus.STATUS_BUSY;
			break;
		case 'ERROR_COMMAND_NOT_KNOWN':
		case 'ERROR_NOT_CONNECTED':
		case 'FAILED':
			status = ServiceStatus.STATUS_ERROR;
			break;
	}
	return status;
}

/**
 * Converts the MAP-specific message service notification type string into a notification type constant
 * defined in the qnx.message extension.
 * @param mapNotification {String} The MAP notification type string.
 * @returns {String} A qnx.message status constant.
 */
function mapNoitificationTypeToServiceNotificationType(mapNotification) {
	var notificationType = null;
	switch (mapNotification) {
		case 'NEW_MESSAGE':
			notificationType = ServiceNotification.NOTIFICATION_NEW_MESSAGE;
			break;
		case 'MESSAGE_DELETED':
			notificationType = ServiceNotification.NOTIFICATION_MESSAGE_DELETED;
			break;
		case 'MESSAGE_SHIFT':
			notificationType = ServiceNotification.NOTIFICATION_MESSAGE_SHIFT;
			break;
	}
	return notificationType;
}

/**
 * Converts a FilterExpression used for the find operation into a string.
 * Note that this is specific to PBAP, and each contacts service would have
 * to define their own function to suit its needs.
 * @param filterExpression {qnx.pim.contacts.FilterExpression} The FilterExpression object.
 * @return {String} A SQL string for use on the PBAP contacts_view view.
 */
function filterExpressionToString(filterExpression) {
	// FIXME: There's an opportunity to perform an SQL injection attack here
	var str = '';

	if (typeof(filterExpression) === 'object' &&
		filterExpression.hasOwnProperty('leftField') &&
		filterExpression.hasOwnProperty('operator') &&
		filterExpression.hasOwnProperty('rightField')) {
		str = '(';

		// Add the left field
		if (typeof(filterExpression.leftField) === 'object') {
			str += filterExpressionToString(filterExpression.leftField);
		} else {
			str += filterExpression.leftField;
		}

		// Add the operator
		str += ' ' + filterExpression.operator + ' ';

		// Add the right field
		if (typeof(filterExpression.rightField) === 'object') {
			str += filterExpressionToString(filterExpression.rightField);
		} else if (typeof(filterExpression.rightField) === 'number') {
			str += filterExpression.rightField;
		} else {
			str += '\'' + filterExpression.rightField + '\'';
		}

		str += ')';
	} else {
		console.error('Unrecognized FilterExpression object.', filterExpression);
	}

	return str;
}

/**
 * Function converts fields in provided object with '_' to camel case style fields
 * @param result {Object} Object representing a message
 * @returns {Object} Object representing single Message
 * @example
 * {
 *		 handle: 123456,
 *		 messageType: 'EMAIL',
 *		 folderId: 1,
 *		 sender: 'test@email.com',
 *		 subject: 'Test email',
 *		 bodyPlainText: 'This is the content of the test email',
 *		 bodyHtml: '<html>...</html>',
 *		 recipients: [{email:'me@email.com', name:'me'},{email:'me2@email.com', name:'me2'}],
 *		 attachments: [{url:'blah.pdf', size:'145678'}]
 *		 ...
 * }
 * */
function normalizeFields(result) {
	if (result.length > 0) {
		// Must return objects which client can convert into Message instances.

		// Typically this 'translation' process would be unique to each contacts service. In the
		// case of MAP, we already know that this particular database view contains the right fields,
		// but we need to convert the property names to camel cased rather than underscore-delimited.

		// Build an array of property names that need to be renamed. We should only have
		// to do this once, since all of the property names will be the same for each
		// record.
		var propsToRename = [];
		for (var prop in result[0]) {
			if (prop.indexOf('_') >= 0) {
				propsToRename.push(prop);
			}
		}

		// Now we can iterate through each of the records in the result and rename the properties
		for (var i = 0; i < result.length; i++) {
			for (var j = 0; j < propsToRename.length; j++) {
				// Add the renamed property to the record
				result[i][propsToRename[j].replace(/_([a-zA-Z])/g,
					function (match, letter) {
						return letter.toUpperCase();
					}).replace('_', '')] = result[i][propsToRename[j]];

				// Remove the old underscore property from the record
				delete result[i][propsToRename[j]];
			}

			// work specifically on sender* or recipient* fields
			// TODO Uncomment if needed, commented for now
			/*
			 var temp = result[i];
			 if(temp.senderEmail && temp.senderNumber && temp.senderLastName && temp.senderFirstName) {
			 var sender = {email:temp.senderEmail, number:temp.senderNumber, lastName: temp.senderLastName,firstName:temp.senderFirstName}
			 temp.sender = sender;
			 delete temp.senderEmail; delete temp.senderNumber; delete temp.senderLastName; delete temp.senderFirstName;
			 }
			 if(temp.recipientEmail && temp.recipientNumber && temp.recipientLastName && temp.recipientFirstName) {
			 var recipient = {email:temp.recipientEmail, number:temp.recipientNumber, lastName: temp.recipientLastName,firstName:temp.recipientFirstName}
			 temp.recipient = recipient;
			 delete temp.recipientEmail; delete temp.recipientNumber; delete temp.recipientLastName; delete temp.recipientFirstName;
			 }
			 */
		}
	}
	return result;
}

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension.
	 */
	init:function () {
		try {
			//_statusPPS
			_statusPPS = _pps.create("/pps/services/bluetooth/messages/status", _pps.PPSMode.DELTA);
			_statusPPS.onNewData = onStatusEvent;
			_statusPPS.open(_pps.FileMode.RDONLY);
		} catch (ex) {
			var err = 'qnx.message::init [message.js] Error opening /pps/services/bluetooth/messages/status';
			console.error(err);
			throw new Error(err);
		}

		try {
			//writing pps commands
			_controlPPS = _pps.create("/pps/services/bluetooth/messages/control", _pps.PPSMode.DELTA);
			_controlPPS.open(_pps.FileMode.WRONLY);
		} catch (ex) {
			var err = 'qnx.message::init [message.js] Error opening /pps/services/bluetooth/messages/control';
			console.error(err);
			throw new Error(err);
		}

		try {
			//receiving notifications
			_notificationPPS = _pps.create("/pps/services/bluetooth/messages/notification", _pps.PPSMode.DELTA);
			_notificationPPS.onNewData = onNotificationEvent;
			_notificationPPS.open(_pps.FileMode.RDONLY);
		} catch (ex) {
			var err = 'qnx.message::init [message.js] Error opening /pps/services/bluetooth/messages/notification';
			console.error(err);
			throw new Error(err);
		}

		// Create database object
		_db = _qdb.createObject();
		if (!_db || !_db.open('/dev/qdb/messages')) {
			var err = 'qnx.message::init [message.js] Error opening db; path=/dev/qdb/messages';
			console.error(err);
			throw new Error(err);
		}
	},

	/**
	 * Sets the trigger function to call when an event is fired
	 * @param trigger {Function} The trigger function to call when an event is fired
	 */
	setStateChangedTrigger:function (trigger) {
		_stateChangedTrigger = trigger;
	},
	
	/**
	 * Sets the trigger function to call when an event is fired
	 * @param trigger {Function} The trigger function to call when an event is fired
	 */
	setFindResultTrigger:function (trigger) {
		_findResultTrigger = trigger;
	},
	
	/**
	 * Sets the trigger function to call when an event is fired
	 * @param trigger {Function} The trigger function to call when an event is fired
	 */
	setFindFailTrigger:function (trigger) {
		_findFailTrigger = trigger;
	},
	
	/**
	 * Sets the trigger function to call when an event is fired
	 * @param trigger {Function} The trigger function to call when an event is fired
	 */
	setMessageResultTrigger:function (trigger) {
		_messageResultTrigger = trigger;
	},
	
	/**
	 * Sets the trigger function to call when an event is fired
	 * @param trigger {Function} The trigger function to call when an event is fired
	 */
	setMessageFailTrigger:function (trigger) {
		_messageFailTrigger = trigger;
	},
	
	/**
	 * Sets the trigger function to call when an event is fired
	 * @param trigger {Function} The trigger function to call when an event is fired
	 */
	setNotificationTrigger:function (trigger) {
		_notificationTrigger = trigger;
	},

	/**
	 * Returns a list of message accounts.
	 * @param messageType {String} (optional) Filter returned accounts by supported message type.
	 * @return {Array} The list of message accounts.
	 * @example
	 * [
	 * 	{
	 * 		id: 0,
	 * 		name: 'Desktop_1',
	 * 		messageTypes: ['EMAIL']
	 * 	},
	 * 	{
	 * 		id: 1,
	 * 		name: 'SMSMMS_0',
	 * 		messageTypes: ['SMS_GSM', 'MMS']
	 * 	}
	 * ]
	 */
	getAccounts: function(messageType) {
		// Build the where clause, if needed
		var whereClause = '';
		if(messageType && typeof(messageType) === 'string') {
			whereClause = 'WHERE accounts.account_id IN (SELECT accounts_message_types_rel.account_id ' +
							'FROM accounts_message_types_rel LEFT JOIN message_types ON accounts_message_types_rel.message_type_id = message_types.message_type_id ' +
							'WHERE message_types.type = \'' + messageType + '\') ';
		}
		
		// Build the SQL statement
		var sql = 'SELECT ' +
					'accounts.account_id AS id, ' +
					'accounts.name, ' +
					'GROUP_CONCAT(message_types.type) AS messageTypes ' +
					'FROM accounts ' +
					'LEFT JOIN accounts_message_types_rel ON accounts.account_id = accounts_message_types_rel.account_id ' +
					'LEFT JOIN message_types ON accounts_message_types_rel.message_type_id = message_types.message_type_id ' +
					whereClause +
					'GROUP BY id, name';

		// Get the results
		var results = _qdb.resultToArray(_db.query(sql));
		
		// Split the message types into an array
		for(var i = 0; i < results.length; i++) {
			if(typeof(results[i].messageTypes) === 'string') {
				results[i].messageTypes = results[i].messageTypes.split(','); 
			} else {
				results[i].messageTypes = [];
			}
		}

		// Return the results
		return results;
	},

	/**
	 * Returns an array of zero or more messages.
	 * @param filter {qnxcar.phonebook.filterExpression} (optional) The
	 * {@link qnxcar.phonebook.filterExpression filter expression} to apply against
	 * the phone book database.
	 * @param orderBy {String} (optional) The field name to order by. The default order is descending,
	 * however this can be overridden by specifying the isAscending parameter as 'true'. Defaults to
	 * 'last_name'.
	 * @param isAscending {Boolean} (optional) If an orderBy parameter is supplied, changes the order
	 * direction to ascending if true, descending if false. Defaults to false.
	 * @param limit {Number} (optional) The maximum number of Contacts to return. Defaults to -1 (no limit).
	 * @param offset {Number} (optional) Specifies the record offset. Defaults to 0 (no offset).
	 */
	find:function (filterExpression, orderBy, isAscending, limit, offset) {
		/* TODO check amount of messages in the table, if less the limit, ask PPS to get more
		 if more then limit - just proceed reading database and emitting event with data
		 * */
		var whereClause = typeof(filterExpression) === 'object' && filterExpression ? ' WHERE ' + filterExpressionToString(filterExpression) : ''

		return queryMessages(whereClause, orderBy, isAscending, limit, offset);
	},

	/**
	 * Saves a message to the device MAP storage.
	 * @param message {qnx.message.Message} Message to save
	 * @return {Number} The existing or new unique identifier for the contact.
	 */
	save:function (message) {
		var err = 'qnx.messages::save [message.js] is not supported';
		console.error(err);
		throw Error(err);
	},

	/**
	 * Removes a message from the device MAP storage.
	 * @param message {qnx.message.Message} The message to remove.
	 */
	remove:function (message) {
		var err = 'qnx.messages::remove [message.js] is not supported';
		console.error(err);
		throw Error(err);
	},

	/**
	 * Moves this message to different folder
	 * @param message {qnx.message.Message} The message to move.
	 * @param message {String} Destination folder
	 */
	move:function (message, folder) {
		var err = 'qnx.messages::move [message.js] is not supported';
		console.error(err);
		throw Error(err);
	},

	/**
	 * Sends provided message.
	 * @param message {qnx.message.Message} The message to remove.
	 */
	send:function (message) {
		var err = 'qnx.messages::send [message.js] is not supported';
		console.error(err);
		throw Error(err);
	},

	/**
	 * Method retrieves message from the database, check first if message exist in database and return is, if not initiated
	 * PPS request to fetch message by provided message handle.
	 * The message is returned asynchronously, and can be retrieved by listening to the messageservicemessageresult
	 * event. Returns a fully populated message, including full subject, contents, recipient list, and attachments.
	 * @param accountId {Number} The ID of the account for which the message exists
	 * @param handle {String} Unique identifier of the message of certain type
	 *
	 * TODO: This function assumes we have single client doing single operation at the same time
	 * */
	getMessage:function (accountId, handle) {
		// first check DB if full message already exists
		var message = queryFullMessage(accountId, handle);
		// message available - just fire up
		if (message) {
			// fire client event
			if(_messageResultTrigger) {
				_messageResultTrigger(message);
			}
		} else {
			if (_statusPPS.data.status.state != ServiceStatus.STATUS_PROCESSING) {
				// redefine trigger
				_statusChangeHandler = function (event) {
					switch (event) {
						case ServiceStatus.STATUS_READY:
							var message = queryFullMessage(accountId, handle);

							if(message && _messageResultTrigger) {
								_messageResultTrigger(message);
							} else if (!message && _messageFailTrigger) {
								_messageFailTrigger('Message does not exist in database.');
							}
							
							_statusChangeHandler = null;
							break;
						case ServiceStatus.STATUS_BUSY:
						case ServiceStatus.STATUS_ERROR:
							if(_messageFailTrigger) {
								// fire client event
								_messageFailTrigger(event === ServiceStatus.STATUS_BUSY ? 'Service busy.' : 'MAP error.');
							}
							_statusChangeHandler = null;
							break;
					}
				};
				
				// send PPS command to fetch Message
				_controlPPS.write(
					{
						command:"GET_MESSAGE",
						account_id:accountId,
						message_handle:handle,
						message_folder: ''
					}
				);
			} else {
				_messageFailTrigger("Service busy.");
			}
		}
	},

	/**
	 * Returns current state of the MAP
	 * @return {String} Value which will indicate current state of the service, <code>STATE_CONNECTED</code>, <code>STATE_DISCONNECTED</code>, <code>STATE_INITIALIZING</code>
	 */
	getState:function () {
		var state = null;
		if (_statusPPS.data && _statusPPS.data.status && _statusPPS.data.status.state) {
			state = mapStateToServiceState(_statusPPS.data.status.state);
		} else {
			console.warn('/pps/services/bluetooth/messages/status state attribute does not exist.');
		}
		return state;
	},

	/**
	 * Forces the contacts in the MAP storage to refresh.
	 */
	refresh:function () {
		try {
			_controlPPS.write({'[n]command':this.COMMAND_REFRESH});
		} catch (ex) {
			var err = 'qnx.messages::refresh [message.js] Failed to write refresh command to /pps/services/bluetooth/messages/control.';
			console.error(err);
			throw new Error(err);
		}
	}
};