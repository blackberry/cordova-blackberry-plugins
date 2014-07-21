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

module.exports = {},

/**
 * @static
 * @memberOf module:car.audiomixer
 * @name AudioMixerSetting
 *
 * @description Audio mixer settings enumeration.
 * <p>All values indicate a level within a range from 0 to 100%.</p>
 *
 * @property {Number} VOLUME The volume setting. 
 * @property {String} BASS The bass setting.
 * @property {String} MID The midrange setting. 
 * @property {String} TREBLE The treble setting. 
 * @property {Number} BALANCE The balance setting. 
 * @property {String} FADE The fade setting. 
 */
Object.defineProperties(module.exports,
{
	'VOLUME':		{ value: 'volume',		enumerable: true, writable: false },
	'BASS':			{ value: 'bass',		enumerable: true, writable: false },
	'MID':			{ value: 'mid',			enumerable: true, writable: false },
	'TREBLE':		{ value: 'treble',		enumerable: true, writable: false },
	'BALANCE':		{ value: 'balance',		enumerable: true, writable: false },
	'FADE':			{ value: 'fade',		enumerable: true, writable: false },
});
