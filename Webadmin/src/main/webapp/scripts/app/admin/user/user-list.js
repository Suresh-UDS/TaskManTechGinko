'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('users', {
                parent: 'admin',
                url: '/users',
                //controller: 'UserController',
                data: {
                    authorities: [],
                    pageTitle: 'Users'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/user/user-list.html',
                        controller: 'UserController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
