"use strict";

var config = require('db/config.js');
var dataPath = require('nw.gui').App.dataPath;

config.dbBasePath = dataPath;

var RsyncConfig = require('rsync/rsync-command/rsync-config');
var rsyncCommandFactory = require('rsync/rsync-command/rsync-command-factory');
var rsyncRepository = require('rsync/rsync-command/rsync-repository');

angular.module('rsync', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rsync2', {
                url: "/rsync2",
                templateUrl: "app/rsync/rsync.html",
                controller: 'RsyncCommandController as detail'
            });
    })
    .controller('RsyncCommandController', ['$scope', function ($scope) {
        var controller = this;
        controller.rsyncConfig = new RsyncConfig();
        controller.savedRsyncConfigNameToLoad = '';

        controller.createTerminalCommand = rsyncCommandFactory.createTerminalCommand;

        controller.savedRsyncConfigs = undefined;
        controller.rsyncConfigOriginalName = undefined;
        loadSavedRsyncConfigs();

        controller.saveRsyncConfig = function () {
            rsyncRepository.save(controller.rsyncConfig, function (error, savedRsyncConfig) {
                if (error) {
                    console.error('Saving failed: ' + error);
                } else {
                    loadSavedRsyncConfigs();
                    $scope.$apply(function () {
                        controller.rsyncConfig = savedRsyncConfig;
                        controller.rsyncConfigOriginalName = savedRsyncConfig.rsyncConfigName;
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
                        controller.savedRsyncConfigs = rsyncConfigs;
                    });
                }
            })
        }

        controller.loadSavedRsyncConfig = function () {
            rsyncRepository.getByRsyncConfigName(controller.savedRsyncConfigNameToLoad, function (error, loadedSavedRsyncConfig) {
                if (error) {
                    console.error('Load config failed: ' + error);
                } else {
                    $scope.$apply(function () {
                        controller.rsyncConfig = loadedSavedRsyncConfig;
                        controller.rsyncConfigOriginalName = loadedSavedRsyncConfig.rsyncConfigName;
                    });
                }
            });
        };

        controller.spawnRsyncCommand = function () {
            controller.rsyncOutput = '';
            var command = rsyncCommandFactory.createTerminalCommand(controller.rsyncConfig);
            var spawnedCommand = require('child_process').spawn(command.command, command.options);
            spawnedCommand.stdout.on('data', function (data) {
                $scope.$apply(function () {
                    controller.rsyncOutput += data;
                });
            });
            spawnedCommand.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            spawnedCommand.on('close', function (code) {
                console.log('ended with code: ' + code);
            });
        };

        controller.createNew = function () {
            controller.savedRsyncConfigNameToLoad = undefined;
            controller.rsyncConfig = new RsyncConfig();
        }
    }]);
