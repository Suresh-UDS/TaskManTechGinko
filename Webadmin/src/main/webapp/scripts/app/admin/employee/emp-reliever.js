'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('emp-reliever', {
                parent: 'manage',
                url: '/relievers',
                //controller: 'SiteController',
                data: {
                    authorities: [],
                    pageTitle: 'Relievers'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/employee/emp-reliever-list.html',
                        controller: 'EmployeeRelieverController'
                    }
                },
                resolve: {

                }
            });

    });
