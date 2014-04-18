angular.module('rsync-ui', [])
    .controller('RsyncCommandController', ['$scope', function ($scope) {
        rsyncParams = {};

        // Testing with some parameters from the rsync(1) command
        rsyncParams.dryRun = true;
        rsyncParams.delete = true;
        rsyncParams.deleteAfter = true;
        rsyncParams.filterFile = '/opt/testfilter.txt';
        rsyncParams.archive = true;
        rsyncParams.oneFileSystem = true;
        rsyncParams.logFile = '/opt/testlogfile.txt';
        rsyncParams.itemizeChanges = true;
        rsyncParams.verbose = true;
        rsyncParams.humanReadable = true;
        rsyncParams.progress = true;
        rsyncParams.stats = true;

        $scope.rsyncParams = rsyncParams;
    }]);


// dry-run
// delete
// delete-after
// filter-file
// archive
// one-file-system
// log-file
// itemize-changes
// verbose
// human-readable
// progress
// stats
