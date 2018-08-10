'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('budget-list', {
                parent: 'manage',
                url: '/budget-list',
                controller: 'BudgetMasterController',
                data: {
                    authorities: [],
                    pageTitle: 'Budget Master'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/expense/budget-list.html',
                        controller: 'BudgetMasterController'
                    }
                },
                resolve: {

                }
            });

    });
