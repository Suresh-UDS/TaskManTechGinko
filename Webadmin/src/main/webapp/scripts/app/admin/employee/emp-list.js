'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('employees', {
                parent: 'manage',
                url: '/employees',
                controller: 'EmployeeController',
                data: {
                    authorities: [],
                    pageTitle: 'Employees'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/employee/emp-list.html',
                        controller: 'EmployeeController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
