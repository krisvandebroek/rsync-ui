//var fs = require('fs');

var rsync_ui_app_dependencies = [
    'ui.router',
    'ui.bootstrap',
    'poc-ui'
];

angular.module('rsync-ui-app', rsync_ui_app_dependencies)
    .controller('RsyncCommandController', ['$scope', function ($scope) {
        var rsyncParams = {};

        rsyncParams.shortCommand = true;

        // Testing with some parameters from the rsync(1) command
        rsyncParams.dryRun = true;
        rsyncParams.delete = true;
        rsyncParams.deleteAfter = true;
        rsyncParams.filterFile = '/opt/testFilter.txt';
        rsyncParams.archive = true;
        rsyncParams.oneFileSystem = true;
        rsyncParams.logFile = '/opt/testLogFile.txt';
        rsyncParams.itemizeChanges = true;
        rsyncParams.verbose = true;
        rsyncParams.humanReadable = true;
        rsyncParams.progress = true;
        rsyncParams.stats = true;

        rsyncParams.src = '/tmp/rsync-test/src';
        rsyncParams.dest = '/tmp/rsync-test/dest';

        $scope.rsyncParams = rsyncParams;

        function conditionalAppend(condition, base, toAppend_LongCommand, toAppend_ShortCommand) {
            if (rsyncParams.shortCommand && toAppend_ShortCommand != undefined) {
                return (condition ? base + ' ' + toAppend_ShortCommand : base);
            } else {
                return (condition ? base + ' ' + toAppend_LongCommand : base);
            }
        }

        $scope.rsyncCommand = function () {
            var command = 'rsync';
            command = conditionalAppend(rsyncParams.dryRun, command, '--dry-run', '-n');
            command = conditionalAppend(rsyncParams.delete, command, '--delete');
            command = conditionalAppend(rsyncParams.deleteAfter, command, '--delete-after');
            command = conditionalAppend(rsyncParams.archive, command, '--archive', '-a');
            command = conditionalAppend(rsyncParams.oneFileSystem, command, '--one-file-system', '-x');
            command = conditionalAppend(rsyncParams.itemizeChanges, command, '--itemize-changes', '-i');
            command = conditionalAppend(rsyncParams.verbose, command, '--verbose', '-v');
            command = conditionalAppend(rsyncParams.humanReadable, command, '--human-readable', '-h');
            command = conditionalAppend(rsyncParams.progress, command, '--progress');
            command = conditionalAppend(rsyncParams.stats, command, '--progress');

            command = conditionalAppend(rsyncParams.logFile, command, '--log-file=' + rsyncParams.logFile);
            command = conditionalAppend(rsyncParams.filterFile, command, '--filter=merge ' + rsyncParams.filterFile);

            command = command + ' ' + rsyncParams.src;
            command = command + ' ' + rsyncParams.dest;
            return command;
        };
    }])
    .config(function ($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/rsync");

        $stateProvider
            .state('rsync', {
                url: "/rsync",
                templateUrl: "partials/rsync.html",
                controller: 'RsyncCommandController'
            });
    });
