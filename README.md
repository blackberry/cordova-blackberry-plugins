#BlackBerry 10 Cordova Plugins
This repo contains plugins for Apache Cordova that expose functionality of the **BlackBerry 10** platform.

##Using Cordova BlackBerry Plugins
###Prerequisites
1. Install [WebWorks](https://developer.blackberry.com/html5/download/)

###Adding project plugins
1. `cd `*project*
1. `webworks plugin add `*plugin_name*

###Updating project plugins
To update a plugin, run:

1. `webworks plugin remove `*plugin_name*
1. `webworks plugin add `*plugin_name*

###Using custom built plugins
1. `webworks plugin add` *plugin_name* `--searchpath `*path_to_custom_plugin_directory*

##Maintaining / Creating Plugins
###Build Prerequisites
1. Install [node and npm](http://nodejs.org/download/) and add to path
1. Install [BlackBerry Native SDK](https://developer.blackberry.com/native/downloads/) if you need to build **JNEXT** extensions
1. [*Windows*] Add `git.exe` to `PATH`, i.e. *Git Installation Directory*`\bin`
1. Install [jake] globally (`npm install --global jake`)
1. Install [jshint] globally (`npm install --global jshint`)

###Setup and Build
1. `git clone https://github.com/blackberry/cordova-blackberry-plugins/`
1. `cd cordova-blackberry-plugins`
1. `git fetch origin`
1. `git checkout master`
1. `npm install` to install dependencies
1. **Setup bbndk environment variables:** (must be done within each session, prior to `jake`)
    - [*Mac/Linux*] `source `*BBNDK installation directory*`/bbndk-env.sh`
    - [*Windows*] *BBNDK installation directory*`\bbndk-env.bat`
1. `jake build` - check that there are no errors

###Running Tests
1. `jake test`  - to run js tests using nodejs
1. `jake hint`  - to run jshint on the JavaScript source
1. `jake`   - default is to build, run tests and jshint

*Note: To see a full list of commands available with jake, use `jake -T`.*

###Dependencies
1. `cpplint` is used for linting C++ code. Source code is located under `dependencies/cpplint`
1. **JNEXT** 1.0.8.3 is used to build extensions
[Original source of JNEXT](http://jnext.googlecode.com/files/jnext-src-1.0.8.3.zip)
Modifications are available in source code and located under `dependencies/jnext_1_0_8_3`

## Authors
* [Bryan Higgins](https://github.com/bryanhiggins)
* [Chris Del Col](https://github.com/cdelcol)
* [Daniel Audino](https://github.com/danielaudino)
* [Danyi Lin](https://github.com/dylin)
* [Derek Watson](https://github.com/derek-watson)
* [Edwin Feener](https://github.com/efeener)
* [Eric Li](https://github.com/ericleili)
* [Eric Pearson](https://github.com/pagey)
* [Erik Johnson](https://github.com/erikj54)
* [Gord Tanner](https://github.com/gtanner)
* [Hasan Ahmad](https://github.com/haahmad)
* [Hoyoung Jang](https://github.com/hoyoungjang)
* [Igor Shneur](https://github.com/ishneur)
* [James Keshavarzi](https://github.com/jkeshavarzi)
* [Jeffrey Heifetz](https://github.com/jeffheifetz)
* [Jenny Gee](https://github.com/jengee)
* [Josh Soref](https://github.com/jsoref)
* [Kristoffer Flores](https://github.com/kflores772)
* [Nukul Bhasin](https://github.com/nukulb)
* [Rosa Tse](https://github.com/rwmtse)
* [Rowell Cruz](https://github.com/rcruz)
* [Sergey Golod](https://github.com/tohman)
* [Stephan Leroux](https://github.com/sleroux)
* [Tracy Li](https://github.com/tracyli)

## General Architecture

- client.js – The extension's public API
- index.js – Loaded by **Cordova** and only accessible across the `cordova.exec` bridge
- manifest.json – Metadata for the extension
- native – Contains all the native code for the JNEXT extension
- test
    - integration – test app spec using **Jasmine** browser tests
    - unit – unit tests using jasmine. Keeps the same folder structure as the code

## How to build an extension?

Extensions are all under the `plugin/` folder. An extension must at least contain the following:

 * manifest.json – metadata for the extension
 * client.js – Front facing API, this is injected into the App's content
 * index.js – Controller loads this part of the API

If your extension requires native C/C++ code, a native JNEXT extension is needed. There is a [sample](https://github.com/blackberry/WebWorks-Community-APIs/tree/master/BB10/Template) and there are [detailed docs](https://developer.blackberry.com/html5/documentation/creating_extensions_for_bb10_apps.html).

## Contributing
**To contribute code to this repository you must be [signed up as an official contributor](http://blackberry.github.com/howToContribute.html).**

1. Fork the **cordova-blackberry-plugins** repository
1. Make the changes/additions to your fork
1. Send a pull request from your fork back to the **cordova-blackberry-plugins** repository
1. If you made changes to code which you own, mention a *committer* listed below to have your code merged using `@user` notation.

## Committers
 * [Bryan Higgins](https://github.com/bryanhiggins)
 * [Josh Soref](https://github.com/jsoref)

## Other related Repos
 * [cordova-js](https://github.com/apache/cordova-js)
 * [cordova-blackberry](https://github.com/apache/cordova-blackberry)
