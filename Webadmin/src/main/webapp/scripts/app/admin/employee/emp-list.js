'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('employees', {
                parent: 'manage',
                url: '/employees',
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
