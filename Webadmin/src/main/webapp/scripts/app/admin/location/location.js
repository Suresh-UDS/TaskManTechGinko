'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('locations', {
                parent: 'manage',
                url: '/locations?{project:json}{site:json}',
                //controller: 'LocationController',
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

                },
                 params:{
                  project:null,
                  site:null
                 }
            })
            .state('add-location', {
                parent: 'manage',
                url: '/add-location',
                //controller: 'LocationController',
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
            }).state('location-qr-print', {
            parent: 'manage',
            url: '/location-qr-print/:location',
            //controller: 'LocationController',
            data: {
                authorities: [],
                pageTitle: 'Print QrCode'
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/location/location-qr-print.html',
                    controller: 'LocationController'
                }
            },
            resolve: {


            }
        })
    });
