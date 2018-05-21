'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('add-asset', {
                parent: 'manage',
                url: '/add-asset',
                controller: 'AssetController',
                data: {
                    authorities: [],
                    pageTitle: 'Add Asset'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/asset/add-asset.html',
                        controller: 'AssetController'
                    }
                },
                resolve: {

                }
            })
        .state('edit-asset', {
            parent: 'manage',
            url: '/edit-asset:id',
            controller: 'AssetController',
            data: {
                authorities: [],
                pageTitle: 'Edit Asset'
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/asset/edit-asset.html',
                    controller: 'AssetController'
                }
            },
            resolve: {


            }
        }).state('view-asset', {
            parent: 'manage',
            url: '/view-asset:id',
            controller: 'AssetController',
            data: {
                authorities: [],
                pageTitle: 'View Asset'
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/asset/view-asset.html',
                    controller: 'AssetController'
                }
            },
            resolve: {


            }
        })
        .state('assets', {
                parent: 'manage',
                url: '/assets',
                controller: 'AssetController',
                data: {
                    authorities: [],
                    pageTitle: 'Assets'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/asset/asset-list.html',
                        controller: 'AssetController'
                    }
                },
                resolve: {

                }
            })
            .state('schedule-list', {
                parent: 'manage',
                url: '/schedule-list',
                controller: 'AssetController',
                data: {
                    authorities: [],
                    pageTitle: 'Schedule List'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/asset/schedule-list.html',
                        controller: 'AssetController'
                    }
                },
                resolve: {

                }
            })
            .state('asset-config', {
                parent: 'manage',
                url: '/asset-config',
                controller: 'AssetController',
                data: {
                    authorities: [],
                    pageTitle: 'Configuration'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/asset/config.html',
                        controller: 'AssetController'
                    }
                },
                resolve: {

                }
            }).state('view-calendar', {
            parent: 'manage',
            url: '/view-calendar',
            controller: 'AssetController',
            data: {
                authorities: [],
                pageTitle: 'Asset Schedule'
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/asset/view-calendar.html',
                    controller: 'AssetController'
                }
            },
            resolve: {

            }
        });
    });
