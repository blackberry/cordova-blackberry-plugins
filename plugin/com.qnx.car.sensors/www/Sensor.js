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
 * @static
 * @memberOf module:car.sensors
 * @name Sensor
 *
 * @description <p>Sensor type enumeration.
 * <p>NOTE: This is provided as an example only. This API is intended to be a custom
 * implementation for each system to access its specific sensor data.
 *
 *
 *  @property {Number}  FUEL_LEVEL Fuel level (0 to 100%).
 *  @property {Number}  COOLANT_LEVEL Coolant level (0 to 100%).
 *  @property {Number}  COOLANT_TEMPERATURE Coolant temperature.
 *  @property {Number}  ENGINE_OIL_PRESSURE Engine oil pressure (&gt;=0 PSI).
 *  @property {Number}  ENGINE_OIL_LEVEL Engine oil level (0 to 100%).
 *  @property {Number}  ENGINE_OIL_TEMPERATURE Engine oil temperature.
 *  @property {Number}  RPM Engine RPM (&gt;=0).
 *  @property {Number}  SPEED Vehicle speed (&gt;=0).

 *  @property {Number}  BRAKE_FLUID_LEVEL Brake fluid level (0 to 100%). 
 *  @property {Boolean} BRAKE_ABS_ENABLED ABS brakes (true for on; default is true). 
 *  @property {Number}  BRAKE_PAD_WEAR_FRONTLEFT Front left brake pad wear (0 to 100%).
 *  @property {Number}  BRAKE_PAD_WEAR_FRONTRIGHT Front right brake pad wear (0 to 100%). 
 *  @property {Number}  BRAKE_PAD_WEAR_REARLEFT Rear left brake pad wear (0 to 100%).
 *  @property {Number}  BRAKE_PAD_WEAR_REARRIGHT Rear right brake pad wear (0 to 100%). 
 *  @property {Boolean} BRAKE_ABS_FRONTLEFT Front left ABS (true for on; default is true). 
 *  @property {Boolean} BRAKE_ABS_FRONTRIGHT Front right ABS (true for on; default is true).
 *  @property {Boolean} BRAKE_ABS_REARLEFT Rear left ABS (true for on; default is true).
 *  @property {Boolean} BRAKE_ABS_REARRIGHT Rear right ABS (true for on; default is true).

 *  @property {Number}  TIRE_PRESSURE_FRONTLEFT Front left tire pressure (&gt;=0 PSI). 
 *  @property {Number}  TIRE_PRESSURE_FRONTRIGHT Front right tire pressure (&gt;=0 PSI). 
 *  @property {Number}  TIRE_PRESSURE_REARLEFT Rear left tire pressure (&gt;=0 PSI). 
 *  @property {Number}  TIRE_PRESSURE_REARRIGHT Rear right tire pressure (&gt;=0 PSI). 
 *  @property {Number}  TIRE_WEAR_FRONTLEFT Front left tire wear (0 to 100%). 
 *  @property {Number}  TIRE_WEAR_FRONTRIGHT Front right tire wear (0 to 100%). 
 *  @property {Number}  TIRE_WEAR_REARLEFT Rear left tire wear (0 to 100%). 
 *  @property {Number}  TIRE_WEAR_REARRIGHT Rear right tire wear (0 to 100%). 

 *  @property {Boolean} LIGHT_HEADLIGHT_LEFT Left head light (true for on). 
 *  @property {Boolean} LIGHT_HEADLIGHT_RIGHT Right head light (true for on). 
 *  @property {Boolean} LIGHT_TAILLIGHT_LEFT Left tail light (true for on). 
 *  @property {Boolean} LIGHT_TAILLIGHT_RIGHT Right tail light (true for on). 

 *  @property {Number}  TRANSMISSION_FLUID_LEVEL Transmission fluid level (0 to 100%). 
 *  @property {Number}  TRANSMISSION_FLUID_TEMPERATURE Transmission fluid temperature (-273.15 to 1000 degrees Fahrenheit). 
 *  @property {Number}  TRANSMISSION_CLUTCH_WEAR Clutch wear level (0 to 100%). 
 *  @property {String}  TRANSMISSION_GEAR Transmission gear (One of: p,r,n,d,1,2,3,4,5,6,7,8). 
 *  @property {Number}  WASHERFLUID_LEVEL Washer fluid level (0 to 100%).
 */ 
Object.defineProperties(module.exports,
{
	'FUEL_LEVEL':						{ value: 'fuelLevel',						enumerable: true, writable: false },
	'COOLANT_LEVEL':					{ value: 'coolantLevel',					enumerable: true, writable: false },
	'COOLANT_TEMPERATURE':				{ value: 'coolantTemperature',				enumerable: true, writable: false },
	'ENGINE_OIL_PRESSURE':				{ value: 'engineOilPressure',				enumerable: true, writable: false },
	'ENGINE_OIL_LEVEL':					{ value: 'engineOilLevel',					enumerable: true, writable: false },
	'ENGINE_OIL_TEMPERATURE':			{ value: 'engineOilTemperature',			enumerable: true, writable: false },
	'RPM':								{ value: 'rpm',								enumerable: true, writable: false },
	'SPEED':							{ value: 'speed',							enumerable: true, writable: false },

	'BRAKE_FLUID_LEVEL':				{ value: 'brakeFluidLevel',					enumerable: true, writable: false },
	'BRAKE_ABS_ENABLED':				{ value: 'brakeAbsEnabled',					enumerable: true, writable: false },
	'BRAKE_PAD_WEAR_FRONTLEFT':			{ value: 'brakePadWearFrontLeft',			enumerable: true, writable: false },
	'BRAKE_PAD_WEAR_FRONTRIGHT':		{ value: 'brakePadWearFrontRight',			enumerable: true, writable: false },
	'BRAKE_PAD_WEAR_REARLEFT':			{ value: 'brakePadWearRearLeft',			enumerable: true, writable: false },
	'BRAKE_PAD_WEAR_REARRIGHT':			{ value: 'brakePadWearRearRight',			enumerable: true, writable: false },
	'BRAKE_ABS_FRONTLEFT':				{ value: 'brakeAbsFrontLeft',				enumerable: true, writable: false },
	'BRAKE_ABS_FRONTRIGHT':				{ value: 'brakeAbsFrontRight',				enumerable: true, writable: false },
	'BRAKE_ABS_REARLEFT':				{ value: 'brakeAbsRearLeft',				enumerable: true, writable: false },
	'BRAKE_ABS_REARRIGHT':				{ value: 'brakeAbsRearRight',				enumerable: true, writable: false },

	'TIRE_PRESSURE_FRONTLEFT':			{ value: 'tirePressureFrontLeft',			enumerable: true, writable: false },
	'TIRE_PRESSURE_FRONTRIGHT':			{ value: 'tirePressureFrontRight',			enumerable: true, writable: false },
	'TIRE_PRESSURE_REARLEFT':			{ value: 'tirePressureRearLeft',			enumerable: true, writable: false },
	'TIRE_PRESSURE_REARRIGHT':			{ value: 'tirePressureRearRight',			enumerable: true, writable: false },
	'TIRE_WEAR_FRONTLEFT':				{ value: 'tireWearFrontLeft',				enumerable: true, writable: false },
	'TIRE_WEAR_FRONTRIGHT':				{ value: 'tireWearFrontRight',				enumerable: true, writable: false },
	'TIRE_WEAR_REARLEFT':				{ value: 'tireWearRearLeft',				enumerable: true, writable: false },
	'TIRE_WEAR_REARRIGHT':				{ value: 'tireWearRearRight',				enumerable: true, writable: false },

	'LIGHT_HEADLIGHT_LEFT':				{ value: 'lightHeadLeft',					enumerable: true, writable: false },
	'LIGHT_HEADLIGHT_RIGHT':			{ value: 'lightHeadRight',					enumerable: true, writable: false },
	'LIGHT_TAILLIGHT_LEFT':				{ value: 'lightTailLeft',					enumerable: true, writable: false },
	'LIGHT_TAILLIGHT_RIGHT':			{ value: 'lightTailRight',					enumerable: true, writable: false },

	'TRANSMISSION_FLUID_LEVEL':			{ value: 'transmissionFluidLevel',			enumerable: true, writable: false },
	'TRANSMISSION_FLUID_TEMPERATURE':	{ value: 'transmissionFluidTemperature',	enumerable: true, writable: false },
	'TRANSMISSION_CLUTCH_WEAR':			{ value: 'transmissionClutchWear',			enumerable: true, writable: false },
	'TRANSMISSION_GEAR':				{ value: 'transmissionGear',				enumerable: true, writable: false },

	'WASHERFLUID_LEVEL':				{ value: 'washerFluidLevel',				enumerable: true, writable: false }
});

