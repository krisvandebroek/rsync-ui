"use strict";

var rsyncRepository = require('rsync/rsync-command/rsync-repository'),
    RsyncConfig = require('rsync/rsync-command/rsync-config'),
    rsyncCommandFactory = require('rsync/rsync-command/rsync-command-factory');

angular.module('rsync-detail', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rsync-detail', {
                url: "/rsync/:id",
                templateUrl: "app/rsync/rsync-detail.html",
                controller: 'RsyncDetailController as detail'
            });
    })
    .controller('RsyncDetailController', ['$scope', '$stateParams', function ($scope, $stateParams) {
        var controller = this;

        var _init = function () {
            controller.error = undefined;
            controller.rsyncConfig = undefined;
            controller.rsyncConfigOriginalName = undefined;
            controller.createTerminalCommand = rsyncCommandFactory.createTerminalCommand;
            controller.rsyncOutput = '';

            if ($stateParams.id) {
                rsyncRepository.getById($stateParams.id, function (error, rsyncConfig) {
                    $scope.$apply(function () {
                        controller.error = error;
                        controller.rsyncConfig = rsyncConfig;
                        controller.rsyncConfigOriginalName = rsyncConfig.rsyncConfigName;
                    });
                });
            } else {
                controller.rsyncConfig = new RsyncConfig();
            }

        };

        controller.saveRsyncConfig = function () {
            rsyncRepository.save(controller.rsyncConfig, function (error, savedRsyncConfig) {
                if (error) {
                    controller.error = error;
                } else {
                    // TODO: Redirect to edit page
                }
            });
        };

        controller.spawnRsyncCommand = function () {
            var command = rsyncCommandFactory.createTerminalCommand(controller.rsyncConfig);
            var spawnedCommand = require('child_process').spawn(command.command, command.options);
            spawnedCommand.stdout.on('data', function (data) {
                $scope.$apply(function () {
                    controller.rsyncOutput += data;
                });
            });
            // TODO: What to do in code below?
            spawnedCommand.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            spawnedCommand.on('close', function (code) {
                console.log('ended with code: ' + code);
            });
        };

        _init();
    }])

;
