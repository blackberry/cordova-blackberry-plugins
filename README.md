#QNX CAR Cordova Plugins
This repo contains plugins for Apache Cordova that expose functionality of QNX CAR.

##Prerequisites
1. Install the [cordova-qnxcar](https://github.com/qnxcar/cordova-qnxcar) project

##Setup 
1. `git clone https://github.com/qnxcar/cordova-qnxcar-plugins.git`

## General Architecture

- client.js – The extension's public API
- index.js – Loaded by cordova and only accessible across the cordova.exec bridge
- manifest.json – metadata for the extension
- native – contains all the native code for the jnext extension.

- test
    - integration – test app spec using jasmine browser tests.
    - unit – unit tests using jasmine. Keeps the same folder structure as the code.

## How to build an extension?

Extensions are all under the plugin/ folder. An extension must at least contain the following -
* manifest.json – metadata for the extension.
* client.js – Front facing API, this is injected into the App's content.
* index.js – Controller loads this part of the API

If your extension requires native C/C++ code, a native JNEXT extension is needed.

For more information, please consult the "Creating Your Own Cordova Plugin" in the HTML5 Developer's Guide that is distributed as part of the QNX SDK for Apps and Media documentation.