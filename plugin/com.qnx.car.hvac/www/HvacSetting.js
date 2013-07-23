/**
 * @author mlapierre
 * $Id: Event.js 5936 2013-03-25 16:15:21Z lgreenway@qnx.com $
 */

module.exports = {},
/**
 * @static
 * @memberOf module:car_xyz_hvac
 * @name HvacSetting
 *
 * @description  HVAC settings enumeration
 *
 *
 * @property {Number}  FAN_SPEED The fan speed (0 to 6; 0 for off).
 * @property {String}  FAN_DIRECTION The fan direction. Use the values from
 *					   <b>car.hvac.HvacFanDirection</b>.
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
