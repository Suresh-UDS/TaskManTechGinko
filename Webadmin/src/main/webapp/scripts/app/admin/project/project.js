'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('add-project', {
                parent: 'manage',
                url: '/add-project',
                //controller: 'ProjectController',
                data: {
                    authorities: [],
                    pageTitle: 'Add Client'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/project/add-project.html',
                        controller: 'ProjectController'
                    }
                },
                resolve: {
                    
                }
            })       
        .state('edit-project', {
            parent: 'manage',
            url: '/edit-project/:id',
            //controller: 'ProjectController',
            data: {
                authorities: [],
                pageTitle: 'Edit Client'
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/project/edit-project.html',
                    controller: 'ProjectController'
                }
            },
            resolve: {
            	 
                
            }
        }).state('view-project', {
            parent: 'manage',
            url: '/view-project/:id',
           // controller: 'ProjectController',
            data: {
                authorities: [],
                pageTitle: 'View Client'
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/project/view-project.html',
                    controller: 'ProjectController'
                }
            },
            resolve: {
            	 
                
            }
        });
    });
