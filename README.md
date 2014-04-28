#BlackBerry 10 Cordova Plugins
This repo contains plugins for Apache Cordova that expose functionality of the BlackBerry 10 platform.

##Prerequisites
1. Install [node and npm](http://nodejs.org/download/) and add to path.
2. Install [BlackBerry Native SDK](https://bdsc.webapps.blackberry.com/native/).
3. [*Windows*] Add git bin to PATH. i.e. `*Installation Directory*\bin`
4. Install [jake] globally (npm install --global jake).
5. Install [jshint] globall (npm install --global jshint).

##Setup and Build
1. `git clone http://github.rim.net/webworks/BB10-WebWorks-Cordova.git`
2. `cd BB10-WebWorks-Cordova`
3. `npm install` to install dependencies
4. `git checkout master`
5. **Setup bbndk environment variables:** (must be done within each session, prior to jake)
    - [*Mac/Linux*] `source *BBNDK installation directory*/bbndk-env.sh`
    - [*Windows*] `*BBNDK installation directory*\bbndk-env.bat`
6. Run `jake build` from the command prompt and check that there are no errors.

##Running Tests
1. `jake test`  - to run js tests using nodejs
2. `jake hint`  - to run jshint on the JavaScript source
3. `jake`   - default is to build, run tests and jshint

*Note: To see a full list of commands available with jake, use `jake -T`.*

##Dependencies
1. cpplint is used for linting Cpp code. Source code is located under dependencies/cpplint
2. JNEXT 1.0.8.3 is used to build extensions.
Original source of JNEXT was downloaded from here - http://jnext.googlecode.com/files/jnext-src-1.0.8.3.zip
Modifications are available in source code and located under dependencies/jnext_1_0_8_3

## Authors
* [Bryan Higgins](http://github.com/bryanhiggins)
* [Chris Del Col](http://github.com/cdelcol)
* [Daniel Audino](http://github.com/danielaudino)
* [Danyi Lin](http://github.com/dylin)
* [Derek Watson](http://github.com/derek-watson)
* [Eric Li](http://github.com/ericleili)
* [Eric Pearson](http://github.com/pagey)
* [Erik Johnson](http://github.com/erikj54)
* [Gord Tanner](http://github.com/gtanner)
* [Hasan Ahmad](http://github.com/haahmad)
* [Hoyoung Jang](http://github.com/hoyoungjang)
* [Igor Shneur](http://github.com/ishneur)
* [James Keshavarzi](http://github.com/jkeshavarzi)
* [Jeffrey Heifetz](http://github.com/jeffheifetz)
* [Nukul Bhasin](http://github.com/nukulb)
* [Rosa Tse](http://github.com/rwmtse)
* [Rowell Cruz](http://github.com/rcruz)
* [Sergey Golod](http://github.com/tohman)
* [Stephan Leroux](http://github.com/sleroux)
* [Tracy Li](http://github.com/tracyli)

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

There is sample:  https://github.com/blackberry/WebWorks-Community-APIs/tree/master/BB10/Template.

For detailed docs please visit
https://developer.blackberry.com/html5/documentation/creating_extensions_for_bb10_apps.html

## Contributing
**To contribute code to this repository you must be [signed up as an official contributor](http://blackberry.github.com/howToContribute.html).**

1. Fork the **BB10-WebWorks-Cordova** repository
2. Make the changes/additions to your fork
3. Send a pull request from your fork back to the **BB10-WebWorks-Cordova** repository
4. If you made changes to code which you own, send a message via github messages to one of the Committers listed below to have your code merged.

## Committers
* [Bryan Higgins](http://github.com/bryanhiggins)
* [Chris Del Col](http://github.com/cdelcol)
* [Jeffrey Heifetz](http://github.com/jeffheifetz)
* [Nukul Bhasin](http://github.com/nukulb)

## Other related Repos
 * [cordova-js](https://github.com/apache/cordova-js)
 * [cordova-blackberry10](https://github.com/apache/cordova-blackberry10)
