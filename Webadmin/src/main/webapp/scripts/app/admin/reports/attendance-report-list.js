'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('attendanceReports', {
                parent: 'manage',
                url: '/attendance-reports/:uid',
                //controller: 'AttendanceReportController',
                data: {
                    authorities: [],
                    pageTitle: 'Attendance Report'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/reports/attendance-report-list.html',
                        controller: 'AttendanceReportController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
