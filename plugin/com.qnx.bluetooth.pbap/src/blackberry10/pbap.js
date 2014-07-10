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
 * The abstraction layer for Bluetooth PBAP functionality.
 * Note that this currently only supports contacts sychnronized via Bluetooth PBAP.
 */

var	_pps = qnx.webplatform.pps,
	_qdb = require('../../lib/qdb'),
	_statusPPS,
	_commandPPS,
	ServiceState = require('./servicestate'),
	ServiceStatus = require('./servicestatus'),
	_stateChangedTrigger,
	_statusChangedTrigger,
	_db;

// PBAP status PPS object constants
var PBAP_STATE_CONNECTING = 'CONNECTING',
	PBAP_STATE_CONNECTED = 'CONNECTED',
	PBAP_STATE_DISCONNECTED = 'DISCONNECTED',
	PBAP_STATUS_COMPLETE = 'COMPLETE',
	PBAP_STATUS_PROCESSING = 'PROCESSING',
	PBAP_STATUS_FAIL = 'FAILED';

/**
 * PBAP status PPS object change handler. Responsible for firing
 * the extension events.
 * @param event {Event} The PPS change event
 */
function onStatusEvent(event) {
	// State change
	if(_stateChangedTrigger && event && event.data && event.data.state) {
		_stateChangedTrigger(pbapStateToServiceState(event.data.state));
	}

	// Status change
	if(event && event.data && event.data.status) {
		if(_statusChangedTrigger && event && event.data && event.data.status) {
			_statusChangedTrigger(pbapStatusToServiceStatus(event.data.status));
		}
	}
}

/**
 * Converts the PBAP-specific contacts service state string into a state constant
 * defined in the qnx.bluetooth.pbap extension.
 * @param pbapState {String} The PBAP state string.
 * @returns {String} A qnx.bluetooth.pbap state constant.
 */
function pbapStateToServiceState(pbapState) {
	var state = null;
	switch(pbapState) {
		case PBAP_STATE_CONNECTED:		state = ServiceState.STATE_CONNECTED;		break;
		case PBAP_STATE_DISCONNECTED:	state = ServiceState.STATE_DISCONNECTED;	break;
		case PBAP_STATE_CONNECTING:		state = ServiceState.STATE_CONNECTING;		break;
	}
	return state;
}

/**
 * Converts the PBAP-specific contacts service status string into a status constant
 * defined in the qnx.bluetooth.pbap extension. Note that the only action we can execute
 * on the PBAP control object is to refresh, and so the only status reported (ready, processing, fail)
 * is strictly related to the refresh action.
 * @param pbapStatus {String} The PBAP status string.
 * @returns {String} A qnx.bluetooth.pbap status constant.
 */
function pbapStatusToServiceStatus(pbapStatus) {
	var status = null;
	switch(pbapStatus) {
		case PBAP_STATUS_COMPLETE:		status = ServiceStatus.STATUS_READY;		break;
		case PBAP_STATUS_PROCESSING:	status = ServiceStatus.STATUS_REFRESHING;	break;
		case PBAP_STATUS_FAIL:			status = ServiceStatus.STATUS_ERROR;		break;
	}
	return status;
}

/** 
 * Converts a FilterExpression used for the find operation into a string.
 * Note that this is specific to PBAP, and each contacts service would have
 * to define their own function to suit its needs.
 * @param filterExpression {qnx.bluetooth.pbap.FilterExpression} The FilterExpression object.
 * @return {String} A SQL string for use on the PBAP contacts_view view.
 */
function filterExpressionToString(filterExpression) {
	// FIXME: There's an opportunity to perform an SQL injection attack here
	var str = '';
	
	if(typeof(filterExpression) === 'object' &&
			filterExpression.hasOwnProperty('leftField') &&
			filterExpression.hasOwnProperty('operator') &&
			filterExpression.hasOwnProperty('rightField')) {
		str = '(';
		
		// Add the left field
		if(typeof(filterExpression.leftField) === 'object') {
			str += filterExpressionToString(filterExpression.leftField);
		} else {
			str += filterExpression.leftField;
		}
		
		// Add the operator
		str += ' ' + filterExpression.operator + ' ';
		
		// Add the right field
		if(typeof(filterExpression.rightField) === 'object') {
			str += filterExpressionToString(filterExpression.rightField);
		} else if(typeof(filterExpression.rightField) === 'number') {
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
 * Exports are the publicly accessible functions
 */
module.exports = {
	/** Constants **/
	COMMAND_REFRESH: 'SYNC_START',
	
	/**
	 * Initializes the extension.
	 */
	init: function() {
		try {
			//_statusPPS
			_statusPPS = _pps.create("/pps/services/bluetooth/phonebook/status", _pps.PPSMode.DELTA);
			_statusPPS.onNewData = onStatusEvent;
			_statusPPS.open(_pps.FileMode.RDONLY);
		} catch(ex) {
			var err = 'qnx.phonebook::init [pbap.js] Error opening /pps/services/bluetooth/phonebook/status';
			console.error(err);
			throw new Error(err);
		}
		
		try {
			//writing pps commands
			_commandPPS = _pps.create("/pps/services/bluetooth/phonebook/control", _pps.PPSMode.DELTA);
			_commandPPS.open(_pps.FileMode.WRONLY);
		} catch(ex) {
			var err = 'qnx.phonebook::init [pbap.js] Error opening /pps/services/bluetooth/phonebook/control';
			console.error(err);
			throw new Error(err);
		}
		
		// Create database object
		_db = _qdb.createObject();
		if (!_db || !_db.open('/dev/qdb/phonebook')) {
			var err = 'qnx.phonebook::init [pbap.js] Error opening db; path=/dev/qdb/phonebook';
			console.error(err);
			throw new Error(err);
		}
	},
	
	/**
	 * Sets the trigger function to call when an event is fired
	 * @param trigger {Function} The trigger function to call when an event is fired
	 */
	setStateChangedTrigger: function(trigger) {
		_stateChangedTrigger = trigger;
	},
	
	/**
	 * Sets the trigger function to call when an event is fired
	 * @param trigger {Function} The trigger function to call when an event is fired
	 */
	setStatusChangedTrigger: function(trigger) {
		_statusChangedTrigger = trigger;
	},
	
	/**
	 * Returns an array of zero or more contacts.
	 * @param filterExpression {qnx.bluetooth.pbap.FilterExpression} (Optional) The FilterExpression to apply.
	 * @param orderBy {String} (Optional) The field used to order the results.
	 * @param isAscending {Boolean} (Optional) If orderBy is specified, changes the direction of the sort to ascending
	 * if true, descending if false. Defaults to false.
	 * @param limit {Number} (Optional) The maximum number of results to return.
	 * @param offset {Number} (Optional) The offset for the results.
	 * @returns
	 */
	find: function(filterExpression, orderBy, isAscending, limit, offset) {
		var sql = 'SELECT * FROM contacts_view' +
					(typeof(filterExpression) === 'object' && filterExpression ? ' WHERE ' + filterExpressionToString(filterExpression) : '') +
					(typeof(orderBy) === 'string' ? ' ORDER BY ' + orderBy + (typeof(isAscending) === 'boolean' && isAscending ? ' ASC' : ' DESC') : '') +
					' LIMIT ' + (typeof(limit) === 'number' ? limit : -1) +
					' OFFSET ' + (typeof(offset) === 'number' ? offset : 0);
		
		// Get the array of results
		var result = _qdb.resultToArray(_db.query(sql));
		
		if(result.length > 0) {
			// Must return objects which client can convert into Contact instances. 

			// In the case of PBAP, we already know that this particular database view contains the right fields,
			// but we need to convert the property names to camel cased rather than underscore-delimited.
			
			// Build an array of property names that need to be renamed. We should only have
			// to do this once, since all of the property names will be the same for each
			// record.
			var propsToRename = [];
			for(var prop in result[0]) {
				if(prop.indexOf('_') >= 0) {
					propsToRename.push(prop);
				}
			}
			
			// Now we can iterate through each of the records in the result and rename the properties
			for(var i=0; i < result.length; i++) {
				for(var j=0; j < propsToRename.length; j++) {
					// Add the renamed property to the record
					result[i][propsToRename[j].replace(/_([a-zA-Z])/g, function(match, letter) { return letter.toUpperCase(); }).replace('_', '')] = result[i][propsToRename[j]];
					
					// Remove the old underscore property from the record
					delete result[i][propsToRename[j]];					
				}
			}
		}
		
		return result;
	},
	
	/**
	 * Saves a contact to the device PIM storage.
	 * @param contact {qnx.bluetooth.pbap.Contact} The contact to create or update.
	 * @return {Number} The existing or new unique identifier for the contact.
	 */
	save: function(contact) {
		var err = 'qnx.bluetooth.pbap::save [pbap.js] is not supported';
		console.error(err);
		throw Error(err);
	},
	
	/**
	 * Removes a contact from the device PIM storage.
	 * @param contact {qnx.bluetooth.pbap.Contact} The contact to remove.
	 */
	remove: function(contact) {
		var err = 'qnx.bluetooth.pbap::remove [pbap.js] is not supported';
		console.error(err);
		throw Error(err);
	},
	
	/**
	 * Gets the current state of the contact service.
	 * @param service {String} The contact service.
	 * @returns {String} The contact service state. A null value is returned if the state is not available.
	 */
	getState: function() {
		var state = null;
		if(_statusPPS.data.status && _statusPPS.data.status.state) {
			state = pbapStateToServiceState(_statusPPS.data.status.state);
		} else {
			console.warn('/pps/services/bluetooth/phonebook/status state attribute does not exist.');
		}
		return state;
	},
	
	/**
	 * Gets the current status of the contact service.
	 * @param service {String} The contact service.
	 * @returns {String} The phone book service status. A null value is returned if the status is not available.
	 */
	getStatus: function() {
		var state = null;
		if(_statusPPS.data.status && _statusPPS.data.status.status) {
			state = pbapStatusToServiceStatus(_statusPPS.data.status.status);
		} else {
			console.warn('/pps/services/bluetooth/phonebook/status status attribute does not exist.');
		}
		return state;
	},
	
	/**
	 * Forces the contacts in the PIM storage to refresh.
	 * @param service {String} The contact service.
	 */
	refresh: function() {
		try {
			_commandPPS.write({'[n]command': this.COMMAND_REFRESH});
		} catch(ex) {
			var err = 'qnx.bluetooth.pbap::refresh [pbap.js] Failed to write refresh command to /pps/services/bluetooth/phonebook/control.';
			console.error(err);
			throw new Error(err);
		}
	}
};
