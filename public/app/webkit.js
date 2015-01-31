"use strict";

var gui = require('nw.gui');
var win = gui.Window.get();
var nativeMenuBar = new gui.Menu({type: "menubar"});
nativeMenuBar.createMacBuiltin("Rsync-ui");
win.menu = nativeMenuBar;
