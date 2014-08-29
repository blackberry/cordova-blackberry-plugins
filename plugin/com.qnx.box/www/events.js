/**
 * Common event constants to share between client layer and server layer
 *
 */
module.exports = {};

Object.defineProperties(module.exports,
{
	'EVENT_ACCESS_TOKEN_READY':				{ value: 'accesstokenready',		enumerable: true, writable: false },
	'EVENT_ACCESS_TOKEN_ERROR':				{ value: 'accesstokenerror',		enumerable: true, writable: false },
	'EVENT_INSTALLATION_PROGRESS':			{ value: 'installstatus',		enumerable: true, writable: false },
	'EVENT_UNINSTALLATION_PROGRESS':		{ value: 'uninstallstatus',		enumerable: true, writable: false },
	'EVENT_ERROR':							{ value: 'generalerror',		enumerable: true, writable: false }
});