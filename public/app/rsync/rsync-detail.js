"use strict";

var rsyncRepository = require('rsync/rsync-command/rsync-repository');

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

            rsyncRepository.getById($stateParams.id, function (error, rsyncConfig) {
                $scope.$apply(function () {
                    controller.error = error;
                    controller.rsyncConfig = rsyncConfig;
                });
            });
        };

        _init();
    }])

;
