/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function startAutoTest() {
    try {
    	$.get('http://169.254.0.2:3000/runAutoTest', function(result) {
        	console.log("xhr response: " + result);
        	window.location = 'automatic/SpecRunner.htm';
    	});
    } catch (e) {
        console.log("No test server found; specs will not be autoloaded.");
    }
}
