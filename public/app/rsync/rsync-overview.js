"use strict";

var rsyncRepository = require('rsync/rsync-command/rsync-repository');
var RsyncConfig = require('rsync/rsync-command/rsync-config');

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

        function _loadRsyncConfigs() {
            rsyncRepository.findAll(function (error, rsyncConfigs) {
                $scope.$apply(function () {
                    controller.rsyncConfigs = rsyncConfigs;
                })
            })
        }

        _init();
    }])


;