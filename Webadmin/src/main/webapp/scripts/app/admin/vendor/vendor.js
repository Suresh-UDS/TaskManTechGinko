'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('vendor-list', {
                parent: 'manage',
                url: '/vendor-list',
                controller: 'VendorController',
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
            });
    });
