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
 * @module car.Zone
 * @static
 * @description The zone enumeration.
 * <p>This enumeration provides a list of available zones for convenience. It can be used
 * with the following APIs:
 * <ul>
 * <li><code>car.hvac</code>
 * <li><code>car.audiomixer</code>
 * </ul>
 * </p>
 * <p><b>Note</b>: Not all zones are available in vehicles. In addition, zones
 *                 can be different for each extension.  
 *
 * @property ALL  The entire vehicle.
 * @property FRONT The first row. 
 * @property MIDDLE The middle row. 
 * @property REAR The rear row. 
 * @property FRONT_LEFT The left seat in the first row. 
 * @property FRONT_CENTER The center seat in the first row. 
 * @property FRONT_RIGHT The right seat in the first row. 
 * @property MIDDLE_LEFT The left seat in the middle row. 
 * @property MIDDLE_CENTER The center seat in the middle row. 
 * @property MIDDLE_RIGHT The right seat in the middle row. 
 * @property REAR_LEFT The left seat in the rear row. 
 * @property REAR_CENTER The center seat in the rear row. 
 * @property REAR_RIGHT The right seat in the rear row.
 */ 
Object.defineProperties(module.exports,
{
	'ALL':				{ value: 'all',			enumerable: true, writable: false },
	'FRONT':			{ value: 'front',		enumerable: true, writable: false },
	'MIDDLE':			{ value: 'middle',		enumerable: true, writable: false },
	'REAR':				{ value: 'rear',		enumerable: true, writable: false },
	'FRONT_LEFT':		{ value: 'frontleft',	enumerable: true, writable: false },
	'FRONT_CENTER':		{ value: 'frontcenter',	enumerable: true, writable: false },
	'FRONT_RIGHT':		{ value: 'frontright',	enumerable: true, writable: false },
	'MIDDLE_LEFT':		{ value: 'middleleft',	enumerable: true, writable: false },
	'MIDDLE_CENTER':	{ value: 'middlecenter',enumerable: true, writable: false },
	'MIDDLE_RIGHT':		{ value: 'middleright',	enumerable: true, writable: false },
	'REAR_LEFT':		{ value: 'rearleft',	enumerable: true, writable: false },
	'REAR_CENTER':		{ value: 'rearcenter',	enumerable: true, writable: false },
	'REAR_RIGHT':		{ value: 'rearright',	enumerable: true, writable: false },
});

