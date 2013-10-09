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
 * The abstraction layer for theme functionality
 */

var	_pps = qnx.webplatform.pps,
	_themesReaderPPS,
	_profileThemeReaderPPS,
	_profileThemeWriterPPS,
	_triggerUpdate;

/**
 * Exports are the publicly accessible functions
 */
module.exports = {
	/**
	 * Initializes the extension 
	 */
	init: function() {
		_themesReaderPPS = _pps.createObject("/pps/qnxcar/themes", _pps.PPSMode.DELTA);
		_themesReaderPPS.open(_pps.FileMode.RDONLY);

		_profileThemeReaderPPS = _pps.createObject("/pps/qnxcar/profile/theme", _pps.PPSMode.DELTA);
		_profileThemeReaderPPS.onNewData = function(event) {
			if (_triggerUpdate && event && event.data) {
				_triggerUpdate(this.getActive());
			}
		}.bind(this);
		_profileThemeReaderPPS.open(_pps.FileMode.RDONLY);

		_profileThemeWriterPPS = _pps.createObject("/pps/qnxcar/profile/theme", _pps.PPSMode.DELTA);
		_profileThemeWriterPPS.open(_pps.FileMode.WRONLY);
	},

	/**
	 * Sets the trigger function to call when an update event is fired
	 * @param {Function} trigger The trigger function to call when the event is fired
	 */
	setTriggerUpdate: function(trigger) {
		_triggerUpdate = trigger;
	},

	/**
	 * Returns a list of available themes
	 * @returns {Array} A list of available themes
	 */
	getList: function() {
		var list = [];
		var keys = Object.keys(_themesReaderPPS.data.themes)
		for (var i=0; i<keys.length; i++) {
			list.push({ id: keys[i], name: _themesReaderPPS.data.themes[keys[i]].title });
		}
		return list;
	},
	
	/**
	 * Returns the current theme
	 * @returns {Object} The current theme
	 */
	getActive: function() {
		var id = _profileThemeReaderPPS.data.theme.theme;
		var name = _themesReaderPPS.data.themes[id].title;
		return { id: id, name: name };
	},
	
	/**
	 * Sets the current theme
	 * @param {String} themeId The new theme id
	 */
	setActive: function(themeId) {
		if (typeof themeId === "string" && themeId.length > 0) {
			_profileThemeWriterPPS.write({
				theme: themeId
			});
		}
	}
};