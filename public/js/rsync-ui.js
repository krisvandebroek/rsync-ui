//var fs = require('fs');

var rsync_ui_app_dependencies = [
    'ui.router',
    'ui.bootstrap',
    'poc-ui'
];

angular.module('rsync-ui-app', rsync_ui_app_dependencies)
    .controller('RsyncCommandController', ['$scope', function ($scope) {

        function RsyncConfig() {
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
        }

        $scope.rsyncConfig = new RsyncConfig();
        $scope.rsyncConfigName = '';

        $scope.saveRsyncConfig = function () {
            var Store = require("jfs");
            var db = new Store("/tmp/scratch");

            db.saveSync($scope.rsyncConfigName, $scope.rsyncConfig);

            var index = $scope.savedRsyncConfigs();
            index.files.push($scope.rsyncConfigName);
            db.saveSync('index', index);
        }

        $scope.savedRsyncConfigs = function () {
            var Store = require("jfs");
            var db = new Store("/tmp/scratch");

            index = db.allSync().index;
            if (index === undefined) index = {files: [] };

            return index;
        }

        $scope.spawnRsyncCommand = function () {
            $scope.rsyncOutput = '';
//            var spawnedLs = require('child_process').spawn('ls', ['-R', '/usr']);
            var spawnedLs = require('child_process').spawn('ls', ['-R /usr']);
            spawnedLs.stdout.on('data', function (data) {
                $scope.rsyncOutput += data;
                // TODO Find out correct way to do this. I should pass the function to the $apply method.
                $scope.$apply();
            });
            spawnedLs.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            spawnedLs.on('close', function (code) {
                console.log('ended with code: ' + code);
            });
        }
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
