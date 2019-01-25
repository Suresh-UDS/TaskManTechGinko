'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('projects', {
                parent: 'manage',
                url: '/projects',
                //controller: 'ProjectController',
                data: {
                    authorities: [],
                    pageTitle: 'Client'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/project/project-list.html',
                        controller: 'ProjectController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
