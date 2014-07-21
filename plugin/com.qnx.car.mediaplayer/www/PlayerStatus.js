/*
 * Copyright 2013 - 2014.
 * QNX Software Systems Limited. All rights reserved.
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


module.exports = {};

/**
 * @memberOf module:car.mediaplayer
 * @name PlayerStatus
 *
 * @description The media player status enumeration.
 *
 * @property DESTROYED The media player instance was destroyed.
 * @property IDLE The media player is idle.
 * @property PLAYING The media player is playing.
 * @property PAUSED The media player is paused.
 * @property STOPPED The media player is stopped.
 */ 
Object.defineProperties(module.exports,
{
	'DESTROYED':{ value: 0,	enumerable: true, writable: false },
	'IDLE':		{ value: 1,	enumerable: true, writable: false },
	'PLAYING':	{ value: 2,	enumerable: true, writable: false },
	'PAUSED':	{ value: 3,	enumerable: true, writable: false },
	'STOPPED':	{ value: 4,	enumerable: true, writable: false }
});