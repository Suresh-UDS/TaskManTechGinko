/**
 * 
 */

'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('checkInOut', {
                parent: 'report',
                url: '/checkInOut',
                controller: 'CheckInOutController',
                data: {
                    authorities: [],
                    pageTitle: 'In-Out'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/in-out/in-out-list.html',
                        controller: 'CheckInOutController'
                    }
                },
                resolve: {
                    
                }
            });
            
            /*.state('view-checkInOut', {
                parent: 'admin',
                url: '/view-checkInOut:id',
                controller: 'CheckInOutController',
                data: {
                    authorities: [],
                    pageTitle: 'View CheckInOut'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/in-out/view-.html',
                        controller: 'CheckInOutController'
                    }
                },
                resolve: {
                	 
                    
                }
            });*/
        
        
       
    });
