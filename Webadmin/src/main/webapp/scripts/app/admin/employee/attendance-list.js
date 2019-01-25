'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('attendances', {
                parent: 'manage',
                url: '/attendances',
                //controller: 'AttendanceController',
                data: {
                    authorities: [],
                    pageTitle: 'Attendance'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/employee/attendance-list.html',
                        controller: 'AttendanceController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
