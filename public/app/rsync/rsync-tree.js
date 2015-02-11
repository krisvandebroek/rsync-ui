"use strict";

var fileBrowser = require('rsync/file-browser')
    , rsyncRepository = require('rsync/rsync-command/rsync-repository')
    , filterFileParser = require('rsync/rsync-command/filter-file-parser')
    , _ = require('underscore');

angular.module('rsync-tree', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rsync-tree', {
                url: "/rsync/:id/rsync-tree",
                templateUrl: "app/rsync/rsync-tree.html",
                controller: 'RsyncTreeController as tree'
            });

    })
    .controller('RsyncTreeController', ['$scope', '$stateParams', function ($scope, $stateParams) {
        var controller = this;

        var _init = function () {
            controller.error = undefined;
            controller.rootNode = undefined;
            controller.filterFile = undefined;
            controller.onlyDirectories = false;
            controller.baseDir = undefined;
            controller.rsyncConfig = undefined;

            controller.filterFile = undefined;

            rsyncRepository.getById($stateParams.id, function (error, rsyncConfig) {
                $scope.$apply(function () {
                    if (error) {
                        controller.error = error;
                    } else {
                        controller.rsyncConfig = rsyncConfig;
                        controller.baseDir = rsyncConfig.src;
                        fileBrowser.getRootNode(rsyncConfig.src, function (error, node) {
                            $scope.$apply(function () {
                                if (error) {
                                    controller.error = error;
                                } else {
                                    controller.rootNode = node;
                                    controller.filterFile = filterFileParser.parseFilterFile(rsyncConfig.filterFile);
                                    node.underBackup = controller.filterFile.shouldBackup(node, controller.baseDir);
                                }
                            });
                        });
                    }
                });
            });
        };

        controller.toggle = function (node) {
            if (node.isDirectory) {
                if (node.collapsed) {
                    controller.loadChildren(node);
                } else {
                    controller.collapse(node);
                }
            }
        };

        /**
         * @param parentNode {RsyncNode}
         */
        controller.loadChildren = function (parentNode) {
            if (parentNode.isDirectory) {
                fileBrowser.loadChildren(parentNode, function (error, parentNode) {
                    $scope.$apply(function () {
                        controller.error = error;
                        parentNode.collapsed = false;
                        if (parentNode.parent != undefined) {
                            parentNode.underBackup = parentNode.parent.underBackup && controller.filterFile.shouldBackup(parentNode, controller.baseDir);
                        } else {
                            parentNode.underBackup = controller.filterFile.shouldBackup(parentNode, controller.baseDir);
                        }
                        _.forEach(parentNode.children, function (childNode) {
                            childNode.underBackup = parentNode.underBackup && controller.filterFile.shouldBackup(childNode, controller.baseDir);
                        });
                    });
                })
            }
        };

        controller.collapse = function (node) {
            if (node.isDirectory) {
                node.collapsed = true;
            }
        };

        _init();
    }])


;
