"use strict";

var RsyncConfig = function RsyncConfig() {
    this.rsyncConfigName = '';

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
};

module.exports = RsyncConfig;