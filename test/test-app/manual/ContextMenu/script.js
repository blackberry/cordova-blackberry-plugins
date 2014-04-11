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

var callback = function (id) {
    alert("Callback triggered with id: " + id);
};

function overridePlatform() {
    var myItem = {actionId: blackberry.ui.contextmenu.ACTION_COPY, label: 'CustomCopy!', icon: 'local:///manual/ContextMenu/icon.png'};
    
    blackberry.ui.contextmenu.overrideItem(function () {
        alert("Wow you succesfully overrode the platform menu item Copy");
    }, function () { alert("error in overriding"); }, myItem, null);
    
    alert("Copy in the context menu has been changed!");
}

function clearCopyOverride() {
    blackberry.ui.contextmenu.clearOverride(blackberry.ui.contextmenu.ACTION_COPY);
    alert("You have removed the copy context menu");
}


function overrideMenuServiceShare() {
    var myItem = {actionId: 'MenuService-1', label: 'CustomMenuOption', icon: 'local:///manual/ContextMenu/icon.png'};
    blackberry.ui.contextmenu.overrideItem(myItem, function () {
        alert("You have successfully created a new menu service action called CustomMenuOption");
    });
}

function clearMSOverride() {
    blackberry.ui.contextmenu.clearOverride('MenuService-1');
    alert("Cleared the custom option menu");
}



function disableContextMenu() {
    blackberry.ui.contextmenu.enabled = false;
    alert("Turned off context menus");
}

function reenableContextMenu() {
    blackberry.ui.contextmenu.enabled = true;
    alert("Context Menus are reenabled.");
}

function addMenuItemContextAll() {
    var myItem = {actionId: '1', label: 'ALL', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_ALL];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
    
    //Added alert
    alert("Added a new menu option called 'ALL'"); 
}

function removeMenuItemContextAll() {
    var myItem = {actionId: '1', label: 'ALL', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_ALL];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
    
    //Added alert
    alert("Removed menu option called 'ALL'");
}

function addMenuItemContextLink() {
    var myItem = {actionId: '2', label: 'LINK', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_LINK];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
    
    //Added alert
    alert("added a new menu option called 'LINK' for only hyperlinked objects on the webpage");
}

function removeMenuItemContextLink() {
    var myItem = {actionId: '2', label: 'LINK', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_LINK];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
    
    //Added alert
    alert("removed menu option called 'LINK'");
}

function addMenuItemContextInput() {
    var myItem = {actionId: '3', label: 'INPUT', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_INPUT];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
    
    //added alert
    alert("added a Context Input option called INPUT");
}

function removeMenuItemContextInput() {
    var myItem = {actionId: '3', label: 'INPUT', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_INPUT];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
    
    //added alert
    alert("removed context input option called INPUT");
}

function addMenuItemContextIText() {
    var myItem = {actionId: '4', label: 'TEXT', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_TEXT];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
    
    alert("added context text option called TEXT in the context menu");
}

function removeMenuItemContextIText() {
    var myItem = {actionId: '4', label: 'TEXT', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_TEXT];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
    
    alert("removed context text option called TEXT in the context menu");
}

function addMenuItemContextImage() {
    var myItem = {actionId: '5', label: 'IMAGE', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_IMAGE];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
    
    alert("added context image option called IMAGE in the context menu");
}

function removeMenuItemContextImage() {
    var myItem = {actionId: '5', label: 'IMAGE', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_IMAGE];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
    
    alert("Removed context image option called IMAGE in the context menu");
}

function addMenuItemContextImageLink() {
    var myItem = {actionId: '6', label: 'IMAGE_LINK', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_IMAGE_LINK];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
    
    alert("Added context image link option called IMAGE_LINK in the context menu");
}

function removeMenuItemContextImageLink() {
    var myItem = {actionId: '6', label: 'IMAGE_LINK', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_IMAGE_LINK];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
    
    alert("Removed context image link option called 'IMAGE_LINK'");
}

function addMenuItemContextCustom() {
    var myItem = {actionId: '7', label: 'CustomContext', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = ["myContext"];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
    
    alert("Added custom context option called 'CustomContext' in the context menu");
}

function removeMenuItemContextCustom() {
    var myItem = {actionId: '7', label: 'CustomContext', icon: 'local:///manual/ContextMenu/icon.png'},
        contexts = ["myContext" ];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
    alert("Removed custom context option called 'CustomContext' in the context menu");
}


//**************************Custom contexts - defineCustomContext()**********************************
function addLinkContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_LINK],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '2'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
    
    alert("Added 'myContext' of type CONTEXT_TEXT to context menu. pinnedItem:2");
}

function addInputContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_INPUT],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '3'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);

    alert("Added 'myContext' of type CONTEXT_INPUT to context menu. pinnedItem:3");
}

function addTextContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_TEXT],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '4'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);

    alert("Added 'myContext' of type CONTEXT_TEXT to context menu. pinnedItem:4");
}

function addImageContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_IMAGE],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '5'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
    
    alert("Added 'myContext' of type CONTEXT_IMAGE to context menu. pinnedItem:5");
}

function addImageLinkContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_IMAGE_LINK],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '6'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);

    alert("Added Context_Image_LINKto the context menu (pinnedItemId :6).");

}

function addMenuServiceToCustom() {
    var options = {
        includeContextItems: [],
        includePlatformItems: false,
        includeMenuServiceItems: true
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
    
    alert("context menu services have been set to true");
}

function addPlatformToCustom() {
    var options = {
        includeContextItems: [],
        includePlatformItems: true,
        includeMenuServiceItems: false
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
    
    alert("context menu platform items have been set to true");
}

function addAllContextAndMenuServiceAndPlatformToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_ALL],
        includePlatformItems: true,
        includeMenuServiceItems: true
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);

    alert("Now you should see everything back to normal");
}

function removeAdditionalContextsFromCustom() {
    var options = {
        includeContextItems: [],
        includePlatformItems: false,
        includeMenuService: false
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
    
    alert("Removed all items from the context menu.");
}

