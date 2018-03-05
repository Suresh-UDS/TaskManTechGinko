'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('locations', {
                parent: 'manage',
                url: '/locations',
                controller: 'LocationController',
                data: {
                    authorities: [],
                    pageTitle: 'Location'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/location/location.html',
                        controller: 'LocationController'
                    }
                },
                resolve: {

                }
            })
            .state('add-location', {
                parent: 'manage',
                url: '/add-location',
                controller: 'LocationController',
                data: {
                    authorities: [],
                    pageTitle: 'Add Location'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/location/add-location.html',
                        controller: 'LocationController'
                    }
                },
                resolve: {

                }
            })
    });
