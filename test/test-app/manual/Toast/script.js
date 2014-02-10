/*
 * Copyright 2014 BlackBerry Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

function showCustomToast() { 
    var message = "This is my toast!", 
        buttonText = "Click Me", 
        toastId, 
        onButtonSelected = function () { 
            console.log('Button was clicked for toast: ' + toastId); 
        }, 
        onToastDismissed = function () { 
            console.log('Toast disappeared: ' + toastId); 
        }, 
        options = { 
            buttonText : buttonText, 
            dismissCallback : onToastDismissed, 
            buttonCallback : onButtonSelected 
        }; 
    
    toastId = blackberry.ui.toast.show(message, options);
    if (toastId != null && toastId !== undefined ) {
        document.getElementById("getToastID1").innerHTML="PASS"
    }
} 

function showCustomToastWithTimeout() { 
    var message = "This is my toast!", 
        buttonText = "Click Me", 
        toastId, 
        onButtonSelected = function () { 
            console.log('Button was clicked for toast: ' + toastId); 
        }, 
        onToastDismissed = function () { 
            console.log('Toast disappeared: ' + toastId); 
        }, 
        options = { 
            buttonText : buttonText, 
            dissmissCallback : onToastDismissed, 
            buttonCallback : onButtonSelected, 
            timeout : 10000 
        }; 

    toastId = blackberry.ui.toast.show(message, options);
    if (toastId != null && toastId !== undefined ) {
        document.getElementById("getToastID2").innerHTML="PASS"
    }
    
}

