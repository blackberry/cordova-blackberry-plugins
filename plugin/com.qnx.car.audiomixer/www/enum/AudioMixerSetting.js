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
 * @name car.audiomixer.AudioMixerSetting
 * @static
 *
 * Audio mixer settings enumeration.
 *
 * @author mlapierre
 * $Id: Event.js 5936 2013-03-25 16:15:21Z lgreenway@qnx.com $
 */

module.exports = {},

/**  @property VOLUME Represents the volume setting */
/**  @property BASS Represents the bass setting */
/**  @property MID Represents the mid setting */
/**  @property TREBLE Represents the treble setting */
/**  @property BALANCE Represents the balance setting */
/**  @property FADE Represents the fade setting */

Object.defineProperties(module.exports,
{
	'VOLUME':		{ value: 'volume',		enumerable: true, writable: false },
	'BASS':			{ value: 'bass',		enumerable: true, writable: false },
	'MID':			{ value: 'mid',			enumerable: true, writable: false },
	'TREBLE':		{ value: 'treble',		enumerable: true, writable: false },
	'BALANCE':		{ value: 'balance',		enumerable: true, writable: false },
	'FADE':			{ value: 'fade',		enumerable: true, writable: false },
});
