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
 * The message service state constants.
 * State constants must be consistent with those defined in the qnx.message client.js.
 */
module.exports = {
	STATE_CONNECTED:	'STATE_CONNECTED',
	STATE_CONNECTING:	'STATE_CONNECTING',
	STATE_DISCONNECTED:	'STATE_DISCONNECTED',
	STATE_INITIALIZING:	'STATE_INITIALIZING'
};