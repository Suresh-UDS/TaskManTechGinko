'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('expense-list', {
                parent: 'manage',
                url: '/expense-list',
                controller: 'ExpenseController',
                data: {
                    authorities: [],
                    pageTitle: 'Expense Management'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/expense/expense-list.html',
                        controller: 'ExpenseController'
                    }
                },
                resolve: {

                }
            });

    });
