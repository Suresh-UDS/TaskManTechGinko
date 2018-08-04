'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('dashboard', {
                parent: 'site',
                url: '/dashboard',
                data: {
                    authorities: [],
                    pageTile: 'Dashboard'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/dashboard/dashboard.html',
                        controller: 'DashboardController'
                    }
                },
                resolve: {

                }
            });
    });
