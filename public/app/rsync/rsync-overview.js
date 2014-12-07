"use strict";

var rsyncRepository = require('rsync/rsync-command/rsync-repository');

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

        controller.delete = function (rsyncConfig) {
            rsyncRepository.delete(rsyncConfig, function (error) {
                controller.error = error;
                _loadRsyncConfigs();
            });
        }

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