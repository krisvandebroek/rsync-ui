"use strict";

var rsync_ui_app_dependencies = [
    'ui.router',
    'ui.bootstrap',
    'rsync',
    'rsync-overview',
    'rsync-detail',
    'rsync-tree',
    'poc-ui'
];

angular.module('rsync-ui-app', rsync_ui_app_dependencies)
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/rsync-overview");
    })
;
