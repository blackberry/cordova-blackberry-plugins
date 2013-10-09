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
 * The event context for car.mediaplayer.
 */

var _mediaplayer = require("./mediaplayer"),
	Event = require('./Event');

/**
 * Sets or removes the specified event trigger.
 * @param event {String} The event name
 * @param trigger {Function} The trigger function to call when the event is fired. Null if removing the trigger.
 */
function setListener(event, trigger) {
	switch (event) {
		case Event.MEDIA_SOURCE_CHANGE:
			_mediaplayer.setMediaSourceChangeTrigger(trigger);
			break;
		case Event.TRACK_SESSION_CHANGE:
			_mediaplayer.setTrackSessionChangeTrigger(trigger);
			break;
		case Event.PLAYER_STATE_CHANGE:
			_mediaplayer.setPlayerStateChangeTrigger(trigger);
			break;
		case Event.TRACK_CHANGE:
			_mediaplayer.setTrackChangeTrigger(trigger);
			break;
		case Event.TRACK_POSITION_CHANGE:
			_mediaplayer.setTrackPositionChangeTrigger(trigger);
			break;
	}
}

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Method called when the first listener is added for an event
	 * @param event {String} The event name
	 * @param trigger {Function} The trigger function to call when the event is fired
	 */
	addEventListener: function (event, trigger) {
		if (event && trigger) {
			setListener(event, trigger);
		}
	},

	/**
	 * Method called when the last listener is removed for an event
	 * @param event {String} The event name
	 */
	removeEventListener: function (event) {
		if (event) {
			setListener(event, null);
		}
	}
};
