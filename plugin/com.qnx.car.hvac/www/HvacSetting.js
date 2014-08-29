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
 * @memberOf module:car.hvac
 * @name HvacSetting
 * @description The HVAC settings enumeration.
 *
 *
 * @property {Number}  FAN_SPEED The fan speed (0 to 6; 0 for off).
 * @property {String}  FAN_DIRECTION The fan direction. Use the values from
 *					   <code>car.hvac.HvacFanDirection</code>.
 * @property {Boolean} AIR_CONDITIONING The air conditioning (true for on).
 * @property {Boolean} AIR_RECIRCULATION The air recirculation (true for on).
 * @property {Boolean} ZONE_LINK Zone Link. When on, both left and right zones are controlled by
 *					   the left settings (true for on).
 * @property {Number}  TEMPERATURE The temperature (15 to 26 degrees Celsius).
 * @property {Number}  HEATED_SEAT Seat heating level (0 to 3; 0 for off).
 * @property {Boolean} DEFROST Window defrost (true for on).
 */

Object.defineProperties(module.exports,
{
	'FAN_SPEED':			{ value: 'fanSpeed',			enumerable: true, writable: false },
	'FAN_DIRECTION':		{ value: 'fanDirection',		enumerable: true, writable: false },
	'AIR_CONDITIONING':		{ value: 'airConditioning',		enumerable: true, writable: false },
	'AIR_RECIRCULATION':	{ value: 'airRecirculation',	enumerable: true, writable: false },
	'ZONE_LINK':			{ value: 'zoneLink',			enumerable: true, writable: false },
	'TEMPERATURE':			{ value: 'temperature',			enumerable: true, writable: false },
	'HEATED_SEAT':			{ value: 'heatedSeat',			enumerable: true, writable: false },
	'DEFROST':				{ value: 'defrost',				enumerable: true, writable: false }
});
