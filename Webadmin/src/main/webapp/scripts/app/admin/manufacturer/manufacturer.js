'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('manufacturer-list', {
                parent: 'manage',
                url: '/manufacturer-list',
                //controller: 'ManufacturerController',
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
            }).state('add-manufacturer', {
                parent: 'manage',
                url: '/add-manufacturer',
                //controller: 'ManufacturerController',
                data: {
                    authorities: [],
                    pageTitle: 'Add Manufacturer'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/manufacturer/add-manufacturer.html',
                        controller: 'ManufacturerController'
                    }
                },
                resolve: {

                }
            }).state('edit-manufacturer', {
                parent : 'manage',
                url : '/edit-manufacturer/:id',
                //controller : 'ManufacturerController',
                data : {
                    authorities : [],
                    pageTitle : 'Update Manufacturer'
                },
                views : {
                    'content@' : {
                        templateUrl : 'scripts/app/admin/manufacturer/edit-manufacturer.html',
                        controller : 'ManufacturerController'
                    }
                },
                resolve : {

                }
            });
    });
