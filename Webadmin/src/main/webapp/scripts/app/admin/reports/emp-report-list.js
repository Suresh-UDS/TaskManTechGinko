'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('employeeReports', {
                parent: 'reports',
                url: '/employee-reports',
                //controller: 'ReportController',
                data: {
                    authorities: [],
                    pageTitle: 'Employee Reports'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/reports/emp-report-list.html',
                        controller: 'ReportController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
