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
    command = this.conditionalAppend(this.dryRun, command, '--dry-run', '-n');
    command = this.conditionalAppend(this.delete, command, '--delete');
    command = this.conditionalAppend(this.deleteAfter, command, '--delete-after');
    command = this.conditionalAppend(this.archive, command, '--archive', '-a');
    command = this.conditionalAppend(this.oneFileSystem, command, '--one-file-system', '-x');
    command = this.conditionalAppend(this.itemizeChanges, command, '--itemize-changes', '-i');
    command = this.conditionalAppend(this.verbose, command, '--verbose', '-v');
    command = this.conditionalAppend(this.humanReadable, command, '--human-readable', '-h');
    command = this.conditionalAppend(this.progress, command, '--progress');
    command = this.conditionalAppend(this.stats, command, '--progress');

    command = this.conditionalAppend(this.logFile, command, '--log-file=' + this.logFile);
    command = this.conditionalAppend(this.filterFile, command, '--filter=merge ' + this.filterFile);

    command = command + ' ' + this.src;
    command = command + ' ' + this.dest;
    return command;
};

RsyncConfig.prototype.conditionalAppend = function (condition, base, toAppend_LongCommand, toAppend_ShortCommand) {
    if (this.shortCommand && toAppend_ShortCommand != undefined) {
        return (condition ? base + ' ' + toAppend_ShortCommand : base);
    } else {
        return (condition ? base + ' ' + toAppend_LongCommand : base);
    }
};