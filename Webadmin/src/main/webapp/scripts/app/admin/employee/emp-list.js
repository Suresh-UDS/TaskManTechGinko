'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('employees', {
                parent: 'manage',
                url: '/employees?{project:json}{site:json}',
                //controller: 'EmployeeController',
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

                },
                 params:{
                  project:null,
                  site:null
                 }
            }).state('employeeShifts', {
                parent: 'manage',
                url: '/employeeShifts',
                //controller: 'EmployeeController',
                data: {
                    authorities: [],
                    pageTitle: 'Employee Shift'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/employee/emp-shift-list.html',
                        controller: 'EmployeeController'
                    }
                },
                resolve: {

                }
            });

    });
