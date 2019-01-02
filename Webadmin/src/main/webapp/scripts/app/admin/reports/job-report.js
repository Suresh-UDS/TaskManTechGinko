'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
        .state('jobReports', {
                parent: 'manage',
                url: '/job-reports/:uid',
                //controller: 'JobReportController',
                data: {
                    authorities: [],
                    pageTitle: 'Job Report'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/reports/job-report-list.html',
                        controller: 'JobReportController'
                    }
                },
                resolve: {
                    
                }
            });
    });
