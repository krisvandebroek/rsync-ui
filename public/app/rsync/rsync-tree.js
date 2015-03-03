"use strict";

var fileBrowser = require('rsync/file-browser')
    , rsyncRepository = require('rsync/rsync-command/rsync-repository')
    , filterFileParser = require('rsync/rsync-command/filter-file-parser')
    , _ = require('underscore')
    , fsUtils = require('filesystem/fs-utils')
    , filesize = require('filesize');

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
            controller.filterOnlyDirectory = false;
            controller.filterUnderBackup = false;
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
                                    controller.nodeLoaded(node);
                                }
                            });
                        });
                    }
                });
            });
        };

        controller.nodeLoaded = function (node) {
            controller.loadCachedSizes(node);
            if (node.parent != undefined) {
                node.underBackup = node.parent.underBackup && controller.filterFile.shouldBackup(node, controller.baseDir);
            } else {
                node.underBackup = controller.filterFile.shouldBackup(node, controller.baseDir);
            }
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
                        controller.nodeLoaded(parentNode);
                        _.forEach(parentNode.children, function (childNode) {
                            controller.nodeLoaded(childNode);
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

        controller.isVisible = function (node) {
            return (!controller.filterOnlyDirectory || node.isDirectory)
                && (!controller.filterUnderBackup || node.underBackup);
        };

        controller.calculate = function (node) {
            fsUtils.getSize(node.path, function (error, size) {
                $scope.$apply(function () {
                    controller.error = error;
                    node.size = filesize(size);
                    controller.loadCachedSizes(controller.rootNode);
                });
            });
        };

        controller.loadCachedSizes = function (node) {
            var cachedSize = fsUtils.getCachedSize(node.path);
            node.size = cachedSize && filesize(cachedSize);
            _.each(node.children, controller.loadCachedSizes);
        };

        _init();
    }])


;
