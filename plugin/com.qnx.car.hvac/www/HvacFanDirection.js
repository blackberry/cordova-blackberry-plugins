/**
 * @name car.hvac.HvacFanDirection
 *
 * @author mlapierre
 * $Id: Event.js 5936 2013-03-25 16:15:21Z lgreenway@qnx.com $
 */

module.exports = {};
/**
 * @static
 * @memberOf module:car_xyz_hvac
 * @name HvacFanDirection
 *
 * @description Fan direction enumeration
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