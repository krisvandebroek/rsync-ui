//var fs = require('fs');

var rsync_ui_app_dependencies = [
    'ui.router',
    'ui.bootstrap',
    'poc-ui'
];

angular.module('rsync-ui-app', rsync_ui_app_dependencies)
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

        function conditionalAppend(condition, base, toAppend) {
            return (condition ? base + ' ' + toAppend : base);
        }

        $scope.rsyncCommand = function () {
            command = 'rsync';
            command = conditionalAppend(rsyncParams.dryRun, command, '--dryRun');
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
