"use strict";

var rsyncRepository = require('rsync/rsync-command/rsync-repository')
    , RsyncConfig = require('rsync/rsync-command/rsync-config')
    , fsUtils = require('filesystem/fs-utils')
    , async = require('async')
    , documentRepository = require('document/document-repository')
    , filesize = require('filesize');

angular.module('rsync-overview', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rsync-overview', {
                url: "/rsync-overview",
                templateUrl: "app/rsync/rsync-overview.html",
                controller: 'RsyncOverviewController as overview'
            });

    })
    .controller('RsyncOverviewController', ['$scope', function ($scope) {
        var controller = this;

        var _init = function () {
            controller.rsyncConfigs = undefined;
            controller.error = undefined;
            controller.rsyncConfigDriveDetail = new Map();
            controller.rsyncConfigBackupSize = new Map();

            _loadRsyncConfigs();
        };

        controller.remove = function (rsyncConfig) {
            rsyncRepository.remove(rsyncConfig._id, function (error) {
                $scope.$apply(function () {
                    controller.error = error;
                });
                _loadRsyncConfigs();
            });
        };

        controller.clone = function (rsyncConfig) {
            var clone = rsyncConfig.clone();
            clone.rsyncConfigName = clone.rsyncConfigName + " (copy)";
            clone._id = undefined;
            rsyncRepository.save(clone, function (error, savedClone) {
                $scope.$apply(function () {
                    if (error) {
                        controller.error = error;
                    } else {
                        $state.go('rsync-detail', {id: savedClone._id});
                    }
                });
                _loadRsyncConfigs();
            });
        };

        controller.calculateBackupSize = function () {
            _.each(controller.rsyncConfigs, function (rsyncConfig) {
                _loadBackupSize(rsyncConfig);
            });
        };

        function _loadDriveInfoForRsyncConfig(rsyncConfig) {
            async.auto({
                getDriveDetailFromFs: function (callback) {
                    fsUtils.getDriveForPath(rsyncConfig.dest, function (error, driveDetail) {
                        if (driveDetail) {
                            driveDetail.documentType = 'RsyncDestDriveStats';
                            driveDetail.key = rsyncConfig.dest;
                            driveDetail.rsyncDestPath = rsyncConfig.dest;
                            driveDetail.timestamp = Date.now();
                        }
                        callback(null, driveDetail);
                    });
                },
                getDriveDetailFromCache: function (callback) {
                    documentRepository.getByFilter({
                        documentType: 'RsyncDestDriveStats',
                        key: rsyncConfig.dest
                    }, function (error, driveDetail) {
                        if (driveDetail) {
                            driveDetail.fromCache = true;
                        }
                        callback(null, driveDetail);
                    });
                },
                setDriveDetailAndSaveToCache: ['getDriveDetailFromFs', 'getDriveDetailFromCache', function (callback, results) {
                    var driveDetail = results.getDriveDetailFromFs || results.getDriveDetailFromCache;
                    if (driveDetail) {
                        documentRepository.save(driveDetail, function () {
                        });
                    }
                    $scope.$apply(function () {
                        controller.rsyncConfigDriveDetail.set(rsyncConfig.rsyncConfigName, driveDetail);
                    });
                    callback();
                }]
            });
        }

        function _loadBackupSize(rsyncConfig) {
            fsUtils.getSize(rsyncConfig.dest, function (error, size) {
                $scope.$apply(function () {
                    controller.rsyncConfigBackupSize.set(rsyncConfig.rsyncConfigName, filesize(size));
                });
            });
        }

        function _loadRsyncConfigs() {
            rsyncRepository.findAll(function (error, rsyncConfigs) {
                $scope.$apply(function () {
                    controller.rsyncConfigs = rsyncConfigs;
                });
                _.each(rsyncConfigs, function (rsyncConfig) {
                    _loadDriveInfoForRsyncConfig(rsyncConfig);
                });
            });
        }

        _init();
    }])


;