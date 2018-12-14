'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('inventory-list', {
                parent: 'manage',
                url: '/inventory-list',
               //controller: 'InventoryController',
                data: {
                    authorities: [],
                    pageTitle: 'inventory List'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/inventory/inventory-list.html',
                        controller: 'InventoryController'
                    }
                },
                resolve: {

                }
            });

    });
