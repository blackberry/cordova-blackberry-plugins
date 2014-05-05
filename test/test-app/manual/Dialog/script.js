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

////////// standardAskAsync functions
var dialogCallBack = function (value) {

	if (typeof value.promptText === "undefined") {
		alert("Clicked: " + value.return);
	} else {
		alert("Clicked: " + value.return + " with a text value of: " + value.promptText);
	}
}

function standardAskAsyncD_Save() {
	blackberry.ui.dialog.standardAskAsync("Save?", blackberry.ui.dialog.D_SAVE, dialogCallBack, {title : "Save Dialog"});
}

function standardAskAsyncD_OK() {
	blackberry.ui.dialog.standardAskAsync("OK?", blackberry.ui.dialog.D_OK, dialogCallBack, {title : "OK?"});
}

function standardAskAsyncD_Delete() {
	blackberry.ui.dialog.standardAskAsync("Delete?", blackberry.ui.dialog.D_DELETE, dialogCallBack, {title : "Delete?"});
}

function standardAskAsyncD_YES_NO() {
	blackberry.ui.dialog.standardAskAsync("Click Yes or No?", blackberry.ui.dialog.D_YES_NO, dialogCallBack, {title : "Yes/no?"});
}

function standardAskAsyncD_OK_Cancel() {
	blackberry.ui.dialog.standardAskAsync("Click OK or Cancel?", blackberry.ui.dialog.D_OK_CANCEL, dialogCallBack, {title : "OK/Cancel?"});
}

function standardAskAsyncD_PROMPT() {
	blackberry.ui.dialog.standardAskAsync("Enter in text and it will return that text or Null if cancel is selected", blackberry.ui.dialog.D_PROMPT, dialogCallBack, {title : "A Customized title for prompt dialogue/dialog box :)"});
}

////////// customAskAsync functions
var customDialogCallBack = function (value) {
	alert("Clicked: " + value);
}

function customAskAsyncWith1Button() {
	var message = "Dialog with 1 button. Select",
		buttons = [ "button1" ],
		options = { title: "Title of custom dialog" };

	blackberry.ui.dialog.customAskAsync(message, buttons, customDialogCallBack, options);
}

function customAskAsyncWithNoButton() {
	var message = "Dialog with no button. Select",
		buttons = [  ],
		options = { title: "Title of custom dialog" };

	blackberry.ui.dialog.customAskAsync(message, buttons, customDialogCallBack, options);
}

function customAskAsyncWith3Buttons() {
	var message = "Dialog with 3 buttons. Select 1 and see verify the return value",
		buttons = [ "Button1", "Button2", "Button3" ],
		options = { title: "Title of custom dialog" };

	blackberry.ui.dialog.customAskAsync(message, buttons, customDialogCallBack, options);
}

function customAskAsyncWith15Buttons() {
	var message = "Dialog with 15 buttons. Select 1 and see verify the return value",
		buttons = [ "Button1", "Button2", "Button3", "Button4", "Button5", "Button6", "Button7", "Button8", "Button9", "Button10", "Button11", "Button12", "Button13", "Button14", "Button15" ],
		options = { title: "Customized title of a custom dialog where I've made it really really long" };

	blackberry.ui.dialog.customAskAsync(message, buttons, customDialogCallBack, options);
}

//Test scenarios of providing bad values to options, and Message, and buttons (string instead of array, null, undefined etc.)
