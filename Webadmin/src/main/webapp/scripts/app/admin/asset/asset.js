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
            });
    });
