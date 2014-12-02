rsync-ui
========

## Introduction

Welcome to my rsync-ui github project.
The goal of this project is to create a small desktop app able to generate and execute rsync commands:
Wanted features:
- Rsync configuration page where you can turn on/off options and that generates the corresponding rsync command
- Ability to execture the rsync command
- Ability to store your rsync configurations
- Ability to scan a file system subtree being backed up and comparing it to the filter-file to show what is backed up, ignored, ...

This project is under construction.
Feel free to check it out, give feedback or even contribute so that it will also contain the features you want.

## Installation steps

1. Checkout the code
2. Make sure that you have installed nodejs (http://nodejs.org/). See also [nvm](docs/nvm.md)
3. Make sure that you have installed bower globally: `npm install -g bower`. If you do not have enough permissions, execute: `sudo npm install -g bower` or use [nvm](docs/nvm.md).
4. Make sure that you have installed the grunt commandline interface: `npm install -g grunt-cli`. If you do not have enough permissions, execute: `sudo npm install -g grunt-cli` or use [nvm](docs/nvm.md).
5. Make sure that you have installed mocha globally: `npm install -g mocha`. If you do not have enough permissions, execute: `sudo npm install -g mocha` or use [nvm](docs/nvm.md).
5. In the directory `./`, execute `npm install` to download all needed npm dependencies.
6. In the directory `./public` execute `bower install` to download the bower dependencies
7. In the directory `./` execute:
   1. `grunt` to build the mac version of the application
   2. `open ./build/rsync-ui/osx/rsync-ui.app` to launch the application or double-click on the application in the Finder.

## Executing the tests

1. Execute `mocha public/test -w` from the root directory.

## Extra information
* [bower](docs/bower.md)
* [grunt](docs/grunt.md)
* [npm](docs/npm.md)
* [nvm](docs/nvm.md)

## References
* Icon: http://www.iconarchive.com/show/fs-icons-by-franksouza183/Places-folder-backup-icon.html