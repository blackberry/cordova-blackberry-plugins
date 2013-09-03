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
 * @module car.Zone
 * @description Provides the zone enumeration
 *
 */
 
/**
 * @static
 * @memberOf module:car.Zone
 * @name Zone
 *
 * @description  <p>Zone enumeration
 * <p>This enumeration provides a list of available zones for convenience. It can be used
 * with the following APIs:
 * <ul>
 * <li><b>car.hvac</b>
 * <li><b>car.audiomixer</b>
 * </ul>
 * 
 * <p>Note that not all zones are present in all vehicles and that
 * zones can be different for each extension.  
 *
 * @property ALL  The entire vehicle.
 * @property ROW1 The first row. 
 * @property ROW2 The second row. 
 * @property ROW3 The third row. 
 * @property ROW1_LEFT The left seat in the first row. 
 * @property ROW1_CENTER The center seat in the first row. 
 * @property ROW1_RIGHT The right seat in the first row. 
 * @property ROW2_LEFT The left seat in the second row. 
 * @property ROW2_CENTER The center seat in the second row. 
 * @property ROW2_RIGHT The right seat in the second row. 
 * @property ROW3_LEFT The left seat in the third row. 
 * @property ROW3_CENTER The center seat in the third row. 
 * @property ROW3_RIGHT The right seat in the third row.
 */ 
Object.defineProperties(module.exports,
{
	'ALL':				{ value: 'all',			enumerable: true, writable: false },
	'ROW1':				{ value: 'row1',		enumerable: true, writable: false },
	'ROW2':				{ value: 'row2',		enumerable: true, writable: false },
	'ROW3':				{ value: 'row3',		enumerable: true, writable: false },
	'ROW1_LEFT':		{ value: 'row1left',	enumerable: true, writable: false },
	'ROW1_CENTER':		{ value: 'row1center',	enumerable: true, writable: false },
	'ROW1_RIGHT':		{ value: 'row1right',	enumerable: true, writable: false },
	'ROW2_LEFT':		{ value: 'row2left',	enumerable: true, writable: false },
	'ROW2_CENTER':		{ value: 'row2center',	enumerable: true, writable: false },
	'ROW2_RIGHT':		{ value: 'row2right',	enumerable: true, writable: false },
	'ROW3_LEFT':		{ value: 'row3left',	enumerable: true, writable: false },
	'ROW3_CENTER':		{ value: 'row3center',	enumerable: true, writable: false },
	'ROW3_RIGHT':		{ value: 'row3right',	enumerable: true, writable: false },
});

