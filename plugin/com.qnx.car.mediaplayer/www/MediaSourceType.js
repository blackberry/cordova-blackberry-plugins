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

module.exports = {};

/**
 * @memberOf module:car.mediaplayer
 * @name MediaSourceType
 *
 * @description  Media source type enumeration
 *
 * @property HDD The media source is HDD.
 * @property USB The media source is USB.
 * @property IPOD The media source is iPod.
 * @property DLNA The media source is DLNA.
 * @property BLUETOOTH The media source is Bluetooth.
 * @property MTP The media source is MTP. 
 */ 
Object.defineProperties(module.exports,
{
	'HDD':			{ value: 0x00000001, enumerable: true, writable: false },
	'USB':			{ value: 0x00000002, enumerable: true, writable: false },
	'IPOD':			{ value: 0x00000010, enumerable: true, writable: false },
	'DLNA':			{ value: 0x00000100, enumerable: true, writable: false },
	'BLUETOOTH':	{ value: 0x00001000, enumerable: true, writable: false },
	'MTP':			{ value: 0x00010000, enumerable: true, writable: false }
});