/**
 * Common constants to share between client layer and server layer
 *
 */

module.exports = {};

Object.defineProperties(module.exports,
{
	'BASE_URL':				{ value: 'https://api.box.com/2.0',		enumerable: true, writable: false },
	'FOLDERS':				{ value: '/folders',		enumerable: true, writable: false },
	'FOLDERS_ITEMS':		{ value: '/folders/{id}/items',		enumerable: true, writable: false },
	'FOLDERS_COLLAB':		{ value: '/folders/{id}/collaborations',		enumerable: true, writable: false },
	'FILES':				{ value: '/files',		enumerable: true, writable: false },
	'FILES_CONTENT':		{ value: '/files/{id}/content',		enumerable: true, writable: false },
	'FILES_VERSIONS':		{ value: '/files/{id}/versions',		enumerable: true, writable: false },
	'SHARED_ITEMS':			{ value: '/shared_items',		enumerable: true, writable: false },
	'COMMENTS':				{ value: '/comments',		enumerable: true, writable: false },
	'DISCUSSIONS':			{ value: '/discussions',		enumerable: true, writable: false },
	'COLLABORATIONS':		{ value: '/collaborations',		enumerable: true, writable: false },
	'SEARCH':				{ value: '/search',		enumerable: true, writable: false },
	'EVENTS':				{ value: '/events',		enumerable: true, writable: false },
	'USERS':				{ value: '/users',		enumerable: true, writable: false },
	'TOKENS':				{ value: '/tokens',		enumerable: true, writable: false },
	'AUTH_URL':				{ value: 'https://api.box.com/oauth2/authorize',		enumerable: true, writable: false },
	'TOKEN_URL':			{ value: 'https://api.box.com/oauth2/token',		enumerable: true, writable: false },
	'PROTOCOL':				{ value: 'qnxbox://',		enumerable: true, writable: false }
});