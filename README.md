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
2. In the directory `./public` execute:
   1. `bower install` to download the bower dependencies
3. In the directory `./` execute: 
   4. `npm install` to download the node dependencies
   5. `grunt` to build the mac version of the application
   6. `open ./build/releases/rsync-ui/mac/rsync-ui.app` to launch the application or double-click on the application in the Finder.