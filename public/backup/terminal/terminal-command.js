"use strict";

function TerminalCommand(command, options) {
    this.command = command;
    this.options = options;
}

TerminalCommand.prototype.asString = function () {
    var result = this.command;
    this.options.forEach(function (option) {
        result = result + ' ' + option;
    });
    return result;
};
