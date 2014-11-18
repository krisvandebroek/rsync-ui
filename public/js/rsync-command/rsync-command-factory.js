function createTerminalCommand(rsyncConfig) {
    var command = 'rsync';
    var options = [];
    conditionalAddOption(rsyncConfig, rsyncConfig.dryRun, options, '--dry-run', '-n');
    conditionalAddOption(rsyncConfig, rsyncConfig.delete, options, '--delete');
    conditionalAddOption(rsyncConfig, rsyncConfig.deleteAfter, options, '--delete-after');
    conditionalAddOption(rsyncConfig, rsyncConfig.archive, options, '--archive', '-a');
    conditionalAddOption(rsyncConfig, rsyncConfig.oneFileSystem, options, '--one-file-system', '-x');
    conditionalAddOption(rsyncConfig, rsyncConfig.itemizeChanges, options, '--itemize-changes', '-i');
    conditionalAddOption(rsyncConfig, rsyncConfig.verbose, options, '--verbose', '-v');
    conditionalAddOption(rsyncConfig, rsyncConfig.humanReadable, options, '--human-readable', '-h');
    conditionalAddOption(rsyncConfig, rsyncConfig.progress, options, '--progress');
    conditionalAddOption(rsyncConfig, rsyncConfig.stats, options, '--stats');

    conditionalAddOption(rsyncConfig, rsyncConfig.logFile, options, '--log-file=' + rsyncConfig.logFile);
    conditionalAddOption(rsyncConfig, rsyncConfig.filterFile, options, '--filter=merge ' + rsyncConfig.filterFile);

    options.push(rsyncConfig.src);
    options.push(rsyncConfig.dest);
    return new TerminalCommand(command, options);
}

function conditionalAddOption(rsyncConfig, condition, options, toAppend_LongCommand, toAppend_ShortCommand) {
    if (condition) {
        if (rsyncConfig.shortCommand && toAppend_ShortCommand != undefined) {
            options.push(toAppend_ShortCommand);
        } else {
            options.push(toAppend_LongCommand);
        }
    }
}