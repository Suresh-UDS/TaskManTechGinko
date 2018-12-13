'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('userGroups', {
                parent: 'admin',
                url: '/userGroups',
                //controller: 'UserGroupController',
                data: {
                    authorities: [],
                    pageTitle: 'UserGroups'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/usergroup/usergroup-list.html',
                        controller: 'UserGroupController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
