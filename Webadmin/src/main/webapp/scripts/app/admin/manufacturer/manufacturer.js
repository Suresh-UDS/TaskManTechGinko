'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('manufacturer-list', {
                parent: 'manage',
                url: '/manufacturer-list',
                controller: 'ManufacturerController',
                data: {
                    authorities: [],
                    pageTitle: 'Manufacturer'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/manufacturer/manufacturer-list.html',
                        controller: 'ManufacturerController'
                    }
                },
                resolve: {

                }
            });
    });
