"use strict";

var config = require('rsync/config/config');
var dataPath = require('nw.gui').App.dataPath;
var abc = require('rsync/def/abc.js');

config.dbBasePath = dataPath;

var RsyncConfig = require('rsync/rsync-command/rsync-config');
var rsyncCommandFactory = require('rsync/rsync-command/rsync-command-factory');
var rsyncRepository = require('rsync/rsync-command/rsync-repository');

var rsync_ui_app_dependencies = [
    'ui.router',
    'ui.bootstrap',
    'poc-ui'
];

angular.module('rsync-ui-app', rsync_ui_app_dependencies)
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/rsync");

        $stateProvider
            .state('rsync', {
                url: "/rsync",
                templateUrl: "partials/rsync.html",
                controller: 'RsyncCommandController'
            });
    })
    .controller('RsyncCommandController', ['$scope', function ($scope) {

        // Todo: put controller on scope.
        $scope.rsyncConfig = new RsyncConfig();
        $scope.savedRsyncConfigNameToLoad = '';

        $scope.createTerminalCommand = rsyncCommandFactory.createTerminalCommand;

        $scope.savedRsyncConfigs = undefined;
        $scope.rsyncConfigOriginalName = undefined;
        loadSavedRsyncConfigs();

        $scope.saveRsyncConfig = function () {
            rsyncRepository.save($scope.rsyncConfig, function (error, savedRsyncConfig) {
                if (error) {
                    console.error('Saving failed: ' + error);
                } else {
                    loadSavedRsyncConfigs();
                    $scope.$apply(function () {
                        $scope.rsyncConfig = savedRsyncConfig;
                        $scope.rsyncConfigOriginalName = savedRsyncConfig.rsyncConfigName;
                    })
                }
            });
        };

        function loadSavedRsyncConfigs() {
            rsyncRepository.findAll(function (error, rsyncConfigs) {
                if (error) {
                    console.error('Loading failed: ' + error);
                } else {
                    $scope.$apply(function () {
                        $scope.savedRsyncConfigs = rsyncConfigs;
                    });
                }
            })
        }

        $scope.loadSavedRsyncConfig = function () {
            rsyncRepository.getByRsyncConfigName($scope.savedRsyncConfigNameToLoad, function (error, loadedSavedRsyncConfig) {
                if (error) {
                    console.error('Load config failed: ' + error);
                } else {
                    $scope.$apply(function () {
                        $scope.rsyncConfig = loadedSavedRsyncConfig;
                        $scope.rsyncConfigOriginalName = loadedSavedRsyncConfig.rsyncConfigName;
                    });
                }
            });
        };

        $scope.spawnRsyncCommand = function () {
            $scope.rsyncOutput = '';
            var command = createTerminalCommand($scope.rsyncConfig);
            var spawnedCommand = require('child_process').spawn(command.command, command.options);
            spawnedCommand.stdout.on('data', function (data) {
                $scope.$apply(function () {
                    $scope.rsyncOutput += data;
                });
            });
            spawnedCommand.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            spawnedCommand.on('close', function (code) {
                console.log('ended with code: ' + code);
            });
        };

        $scope.createNew = function () {
            $scope.savedRsyncConfigNameToLoad = undefined;
            $scope.rsyncConfig = new RsyncConfig();
        }
    }]);
