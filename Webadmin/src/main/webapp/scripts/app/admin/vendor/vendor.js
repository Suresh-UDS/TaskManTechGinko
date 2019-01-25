'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('vendor-list', {
                parent: 'manage',
                url: '/vendor-list',
                //controller: 'VendorController',
                data: {
                    authorities: [],
                    pageTitle: 'Vendor'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/vendor/vendor-list.html',
                        controller: 'VendorController'
                    }
                },
                resolve: {

                }
            }).state('add-vendor', {
                parent: 'manage',
                url: '/add-vendor',
                //controller: 'VendorController',
                data: {
                    authorities: [],
                    pageTitle: 'Add Vendor'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/vendor/add-vendor.html',
                        controller: 'VendorController'
                    }
                },
                resolve: {

                }
            }).state('edit-vendor', {
                parent: 'manage',
                url: '/edit-vendor/:id',
                //controller: 'VendorController',
                data: {
                    authorities: [],
                    pageTitle: 'Update Vendor'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/vendor/edit-vendor.html',
                        controller: 'VendorController'
                    }
                },
                resolve: {

                }
            });
    });
