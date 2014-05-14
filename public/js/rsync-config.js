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
}

function RsyncConfig() {
    this.name = '';

    this.shortCommand = true;

    this.dryRun = true;
    this.delete = true;
    this.deleteAfter = true;
    this.filterFile = '';
    this.archive = true;
    this.oneFileSystem = true;
    this.logFile = '';
    this.itemizeChanges = true;
    this.verbose = true;
    this.humanReadable = true;
    this.progress = true;
    this.stats = true;

    this.src = '/tmp/rsync-test/src';
    this.dest = '/tmp/rsync-test/dest';
}

RsyncConfig.prototype.generateRsyncCommand = function () {
    var command = 'rsync';
    var options = [];
    this.conditionalAddOption(this.dryRun, options, '--dry-run', '-n');
    this.conditionalAddOption(this.delete, options, '--delete');
    this.conditionalAddOption(this.deleteAfter, options, '--delete-after');
    this.conditionalAddOption(this.archive, options, '--archive', '-a');
    this.conditionalAddOption(this.oneFileSystem, options, '--one-file-system', '-x');
    this.conditionalAddOption(this.itemizeChanges, options, '--itemize-changes', '-i');
    this.conditionalAddOption(this.verbose, options, '--verbose', '-v');
    this.conditionalAddOption(this.humanReadable, options, '--human-readable', '-h');
    this.conditionalAddOption(this.progress, options, '--progress');
    this.conditionalAddOption(this.stats, options, '--stats');

    this.conditionalAddOption(this.logFile, options, '--log-file=' + this.logFile);
    this.conditionalAddOption(this.filterFile, options, '--filter=merge ' + this.filterFile);

    options.push(this.src);
    options.push(this.dest);
    return new TerminalCommand(command, options);
};

RsyncConfig.prototype.conditionalAddOption = function (condition, options, toAppend_LongCommand, toAppend_ShortCommand) {
    if (condition) {
        if (this.shortCommand && toAppend_ShortCommand != undefined) {
            options.push(toAppend_ShortCommand);
        } else {
            options.push(toAppend_LongCommand);
        }
    }
};