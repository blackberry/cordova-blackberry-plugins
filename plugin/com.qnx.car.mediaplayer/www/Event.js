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
 * @private
 * Event enumeration.
 */
module.exports = {};

Object.defineProperties(module.exports,
{
	'MEDIA_SOURCE_CHANGE':		{ value: 'car.mediaplayer.mediasourcechange',	enumerable: true, writable: false },
	'TRACK_SESSION_CHANGE':		{ value: 'car.mediaplayer.tracksessionchange',	enumerable: true, writable: false },
	'PLAYER_STATE_CHANGE':		{ value: 'car.mediaplayer.playerstatechange',	enumerable: true, writable: false },
	'TRACK_CHANGE':				{ value: 'car.mediaplayer.trackchange',			enumerable: true, writable: false },
	'TRACK_POSITION_CHANGE':	{ value: 'car.mediaplayer.trackpositionchange',	enumerable: true, writable: false },
	'ERROR':					{ value: 'car.mediaplayer.error',				enumerable: true, writable: false }
});