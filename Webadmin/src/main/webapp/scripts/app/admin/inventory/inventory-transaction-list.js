'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('inventory-transaction-list', {
                parent: 'manage',
                url: '/inventory-transaction-list',
                //controller: 'InventoryTransactionController',
                data: {
                    authorities: [],
                    pageTitle: 'Inventory Transaction List'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/inventory/inventory-transaction-list.html',
                        controller: 'InventoryTransactionController'
                    }
                },
                resolve: {

                }
            });

    });
