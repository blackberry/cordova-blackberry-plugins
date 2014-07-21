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
 * @static
 * @memberOf module:car.hvac
 * @name HvacFanDirection
 *
 * @description Fan direction enumeration.
 *
 * @property DEFROST The fan is set to defrost the front window.
 * @property DEFROST_AND_FEET The fan is directed to the front window and the feet.
 * @property FACE The fan is directed to the face.
 * @property FACE_AND_FEET The fan is directed to the face and feet.
 * @property FEET The fan is directed to the feet.
 */

Object.defineProperties(module.exports,
{
	'DEFROST':			{ value: 'defrost',			enumerable: true, writable: false },
	'DEFROST_AND_FEET':	{ value: 'defrostAndFeet',	enumerable: true, writable: false },
	'FACE':				{ value: 'face',			enumerable: true, writable: false },
	'FACE_AND_FEET':	{ value: 'faceAndFeet',		enumerable: true, writable: false },
	'FEET':				{ value: 'feet',			enumerable: true, writable: false },
});