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
 * Allows access to address book information over Bluetooth PBAP.
 *
 * <h3>Events</h3>
 * <dl><dt><h4>bluetoothpbapstatechange</h4></dt>
 * <dd><p>Fired when the state of a service has changed</p>
 * <h5>Event data</h5>
 * <p>{Object}</p>
 * <h5>Example</h5>
 * <pre><code>{
 *      service: 'SERVICE_BLUETOOTH',
 *      state: 'STATE_CONNECTED'
 * }</code></pre></dd></dl>
 *
 * <dl><dt><h4>bluetoothpbapstatuschange</h4></dt>
 * <dd><p>Fired when the status of the contact service has changed,
 * e.g. the contact store is refreshing or service is ready</p>
 * <h5>Event data</h5>
 * <p>{Object}</p>
 * <h5>Example</h5>
 * <pre><code>{
 *      service: 'SERVICE_BLUETOOTH'
 *      status: 'REFRESHING'
 *}</code></pre></dd></dl>
 * 
 * @module qnx.bluetooth.pbap
 * @static
 * @deprecated
 */
 

var _ID = "com.qnx.bluetooth.pbap",
	_events = ["bluetoothpbapstatechange", "bluetoothpbapstatuschange"];


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
 * @static
 * The <code>qnx.bluetooth.pbap.Contact</code> constructor function. Contact object instances represent contacts
 * stored on the device from which the PBAP contacts were synchronized.
 * @param {Object} [properties] The properties argument can be used to initialize the Contact instance's properties.
 * 
 * @example
 * // The following code demonstrates how to create a new Contact object with its name
 * // defaulted to 'John Doe'
 * var contact = new qnx.bluetooth.pbap.Contact({ firstName: 'John', lastName: 'Doe'});
 * 
 * @property {String} anniversary The anniversary of the Contact in ISO 8601 format.
 * @property {String} birthday The birthday of the Contact in ISO 8601 format.
 * @property {String} categories A comma-separated list of categories to which this Contact belongs.
 * @property {String} company The Contact's company.
 * @property {String} email1 Primary email address.
 * @property {String} email2 Secondary email address.
 * @property {String} email3 Tertiary email address.
 * @property {String} faxPhone The Contact's fax number.
 * @property {String} firstName First name.
 * @property {String} homeAddress1 Primary home address information.
 * @property {String} homeAddress2 Secondary home address inofrmation.
 * @property {String} homeAddressCity Home address city.
 * @property {String} homeAddressCountry Home address country.
 * @property {String} homeAddressStateProvince Home address state or province.
 * @property {String} homeAddressZipPostal Home address zip or postal code.
 * @property {String} homePhone Primary home phone number.
 * @property {String} homePhone2 Secondary home phone number.
 * @property {String} jobTitle The Contact's job title.
 * @property {String} lastName Last name.
 * @property {String} mobilePhone Mobile phone number.
 * @property {String} note Additional contact information.
 * @property {String} otherPhone Other phone number.
 * @property {String} pagerPhone Pager number.
 * @property {String} picture The fully qualified system path to the Contact's photo.
 * @property {String} pin The Contact's device PIN.
 * @property {String} title The Contact's title or titles.
 * @property {String} uid Unique identifier for this Contact.
 * @property {String} user1 User-defined field.
 * @property {String} user2 User-defined field.
 * @property {String} user3 User-defined field.
 * @property {String} user4 User-defined field.
 * @property {String} webpage The Contact's webpage URI.
 * @property {String} workAddress1 Primary work address information.
 * @property {String} workAddress2 Secondary work address information.
 * @property {String} workAddressCity Work address city.
 * @property {String} workAddressCountry Work address country.
 * @property {String} workAddressStateProvince Work address state or province.
 * @property {String} workAddressZipPostal Work address zip or postal code.
 * @property {String} workPhone Primary work phone number.
 * @property {String} workPhone2 Secondary work phone number.
 */
function Contact(properties) {
	this.anniversary = null;
	this.birthday = null;
	this.categories = null;
	this.company = null;
	this.email1 = null;
	this.email2 = null;
	this.email3 = null;
	this.faxPhone = null;
	this.firstName = null;
	this.homeAddress1 = null;
	this.homeAddress2 = null;
	this.homeAddressCity = null;
	this.homeAddressCountry = null;
	this.homeAddressStateProvince = null;
	this.homeAddressZipPostal = null;
	this.homePhone = null;
	this.homePhone2 = null;
	this.jobTitle = null;
	this.lastName = null;
	this.mobilePhone = null;
	this.note = null;
	this.otherPhone = null;
	this.pagerPhone = null;
	this.picture = null;
	this.pin = null;
	this.title = null;
	this.uid = null;
	this.user1 = null;
	this.user2 = null;
	this.user3 = null;
	this.user4 = null;
	this.webpage = null;
	this.workAddress1 = null;
	this.workAddress2 = null;
	this.workAddressCity = null;
	this.workAddressCountry = null;
	this.workAddressStateProvince = null;
	this.workAddressZipPostal = null;
	this.workPhone = null;
	this.workPhone2 = null;
	
	// Initialize properties
	for(var prop in properties) {
		if(this.hasOwnProperty(prop)) {
			this[prop] = properties[prop];
		}
	};
	
	/**
	 * qnx.bluetooth.pbap.Contact instance function to create or update the Contact in the device PIM storage.
	 * If creating a new contact, the Contact's uid property will be updated to the new unique identifier for the
	 * created Contact.
	 * @inner
	 * @deprecated Unsupported.
	 */
	this.save = function() {
   		var value = null,
			success = function (data, response) {
				this.uid = data;
			}.bind(this),
			fail = function (data, response) {
				throw data;
			};

		try {
			window.cordova.exec(success, fail, _ID, 'save', { contact: this });
		} catch (e) {
			console.error(e);
		}
	};
	
	/**
	 * qnx.bluetooth.pbap.Contact instance function to remove this Contact from the device PIM storage.
	 * @inner
	 * @deprecated Unsupported.
	 */
	this.remove = function() {
		window.cordova.exec(null, null, _ID, 'remove', { contact: this });
	};
};

/**
 * @static
 * The <code>qnx.bluetooth.pbap.FilterExpression</code> constructor function. <code>FilterExpression</code> objects
 * can be used to filter the results of the <code>qnx.bluetooth.pbap.find()</code> function.
 * @param {String|qnx.bluetooth.pbap.FilterExpression} leftField The field name or FilterExpression.
 * @param {String} operator The filter operator, e.g. '=', '<', '>', '<>', 'LIKE', 'AND', 'OR'.
 * @param {String|qnx.bluetooth.pbap.FilterExpression} rightField The field value or additional FilterExpression.
 * 
 * @example
 * // The following code demonstrates how to create a new FilterExpression and get a
 * // list of contacts filtered by last name = 'Doe'
 * var filter = new qnx.bluetooth.pbap.FilterExpression(qnx.bluetooth.pbap.FIELD_LAST_NAME, '=', 'Doe'),
 *     filteredContacts = qnx.bluetooth.pbap.find(filter);
 * 
 * @example
 * // The leftField and rightField properties can also be FilterExpression objects themselves,
 * // allowing the construction of complex filter expressions. The following code demonstrates
 * // how to find a contact whose home number or mobile number is '555-555-5555'
 * var filter = new qnx.bluetooth.pbap.FilterExpression(
 *         new qnx.bluetooth.pbap.FilterExpression(qnx.bluetooth.pbap.FIELD_HOME_PHONE, '=', '555-555-5555'),
 *         'OR',
 *         new qnx.bluetooth.pbap.FilterExpression(qnx.bluetooth.pbap.FIELD_MOBILE_PHONE, '=', '555-555-5555')),
 *     filteredContacts = qnx.bluetooth.pbap.find(filter);
 * 
 * @property {String|qnx.bluetooth.pbap.FilterExpression} leftField The field name or FilterExpression.
 * @property {String} operator The filter operator, e.g. '=', '<', '>', '<>', 'LIKE', 'AND', 'OR'.
 * @property {String|qnx.bluetooth.pbap.FilterExpression} rightField The field value or additional FilterExpression.
 */
function FilterExpression(leftField, operator, rightField) {
	this.leftField = leftField;
	this.operator = operator;
	this.rightField = rightField;
};

/*
 * Exports are the publicly accessible functions
 */
module.exports = {
	/* State constants */
	/** PBAP service in process of connecting*/
	STATE_CONNECTING:	'STATE_CONNECTING',
	/** PBAP service connected state */
	STATE_CONNECTED:	'STATE_CONNECTED',
	/** PBAP service disconnected state */
	STATE_DISCONNECTED:	'STATE_DISCONNECTED',
	
	/* Status constants */
	/** PBAP service ready status */
	STATUS_READY:		'STATUS_READY',
	/** PBAP service refreshing status */
	STATUS_REFRESHING:	'STATUS_REFRESHING',
	/** PBAP service error status */
	STATUS_ERROR:		'STATUS_ERROR',

	/* Filter constants */
	/** <code>homePhone</code> field name for use in FilterExpression */
	FIELD_HOME_PHONE:'home_phone',
	/** <code>homePhone2</code> field name for use in FilterExpression */
	FIELD_HOME_PHONE_2:'home_phone_2',
	/** <code>workPhone</code> field name for use in FilterExpression */
	FIELD_WORK_PHONE:'work_phone',
	/** <code>workPhone2</code> field name for use in FilterExpression */
	FIELD_WORK_PHONE_2:'work_phone_2',
	/** <code>mobilePhone</code> field name for use in FilterExpression */
	FIELD_MOBILE_PHONE:'mobile_phone',
	/** <code>otherPhone</code> field name for use in FilterExpression */
	FIELD_OTHER_PHONE:'other_phone',
	/** <code>firstName</code> field name for use in FilterExpression */
	FIELD_FIRST_NAME:'first_name',
	/** <code>lastName</code> field name for use in FilterExpression */
	FIELD_LAST_NAME:'last_name',
	/** <code>email1</code> field name for use in FilterExpression */
	FIELD_EMAIL_1:'email_1',
	/** <code>email2</code> field name for use in FilterExpression */
	FIELD_EMAIL_2:'email_2',
	/** <code>email3</code> field name for use in FilterExpression */
	FIELD_EMAIL_3:'email_3',

	Contact: Contact,
	
	FilterExpression: FilterExpression,
	
	/**
	 * Returns an array of zero or more {@link qnx.bluetooth.pbap.Contact} instances.
	 * @param {qnx.bluetooth.pbap.FilterExpression} [filter] The
	 * <code>qnx.bluetooth.pbap.FilterExpression</code> to apply against the phone book database.
	 * @param {String} [orderBy] The field name to order by. If this parameter is
	 * not specified, the results will be sorted first by last name ascending, then first name ascending.
	 * @param {Boolean} [isAscending] If an <code>orderBy</code> parameter is supplied, changes the order
	 * direction to ascending if true, descending if false. If an <code>orderBy</code> parameter
	 * is not specified, <code>isAscending</code> has no effect. Defaults to false.
	 * @param {Number} [limit] The maximum number of Contact instances to return. Defaults to -1 (no limit).
	 * @param {Number} [offset] Specifies the record offset. Defaults to 0 (no offset).
	 */
	find: function(filter, orderBy, isAscending, limit, offset) {
		var args = {};
		
		if (filter instanceof FilterExpression)	{ args['filter'] = filter; }
		if (typeof(orderBy) === 'string')		{ args['orderBy'] = orderBy; }
		if (typeof(isAscending) === 'boolean')	{ args['isAscending'] = isAscending; }
		if (typeof(limit) === 'number')			{ args['limit'] = limit; }
		if (typeof(offset) === 'number')		{ args['offset'] = offset; }
		
   		var value = null,
			success = function (data, response) {
				var contacts = [];
				for(var result in data) {
					contacts.push(new Contact(data[result]));
				}
				value = contacts;
			},
			fail = function (data, response) {
				throw data;
			};

		try {
			window.cordova.exec(success, fail, _ID, 'find', args);
		} catch (e) {
			console.error(e);
		}

		return value;
	},
	
	/**
	 * Get the current state of the PBAP service
	 * @returns {String} The contact service state. Possible values are
	 * qnx.bluetooth.pbap state constants, or null if the service state is not available
	 */
	getState: function() {
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
	},

	/**
	 * Get the current status of the PBAP service
	 * @returns {String} The contact service status. Possible values are
	 * qnx.bluetooth.pbap status constants, or null if the service status is not available
	 */
	getStatus: function() {
   		var value = null,
			success = function (data, response) {
				value = data;
			},
			fail = function (data, response) {
				throw data;
			};

		try {
			window.cordova.exec(success, fail, _ID, 'getStatus', null);
		} catch (e) {
			console.error(e);
		}

		return value;
	},

	/**
	 * Force the PBAP phone book data to be refreshed from the device
	 */
	refresh: function() {
		window.cordova.exec(null, null, _ID, 'refresh');
	}
};