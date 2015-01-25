"use strict";

var fileBrowser = require('rsync/file-browser')
    , filterFileParser = require('rsync/rsync-command/filter-file-parser')
    , _ = require('underscore');

angular.module('rsync-tree', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rsync-tree', {
                url: "/rsync-tree",
                templateUrl: "app/rsync/rsync-tree.html",
                controller: 'RsyncTreeController as tree'
            });

    })
    .controller('RsyncTreeController', ['$scope', function ($scope) {
        var controller = this;

        var _init = function () {
            controller.error = undefined;
            controller.rootNode = undefined;
            controller.filterFile = undefined;
            controller.baseDir = '/';

            controller.filterFile = filterFileParser.parseFilterFile('/Users/kris/rsyncFatStorage.txt');

            fileBrowser.getNode('/Users/kris/', function (error, node) {
                $scope.$apply(function () {
                    controller.error = error;
                    controller.rootNode = node;
                    node.underBackup = controller.filterFile.shouldBackup(node, controller.baseDir);
                });
            });
        };

        controller.loadChildren = function (node) {
            if (node.isDirectory) {
                fileBrowser.loadChildren(node, function (error, node) {
                    $scope.$apply(function () {
                        controller.error = error;
                        node.collapsed = false;
                        node.underBackup = controller.filterFile.shouldBackup(node, controller.baseDir);
                        _.forEach(node.children, function (childNode) {
                            childNode.underBackup = controller.filterFile.shouldBackup(childNode, controller.baseDir);
                        });
                    });
                })
            }
        };

        _init();
    }])


;