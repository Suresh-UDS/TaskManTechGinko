'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('add-job', {
                parent: 'manage',
                url: '/add-job',
                controller: 'JobController',
                data: {
                    authorities: [],
                    pageTitle: 'Add Job'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/job/add-job.html',
                        controller: 'JobController'
                    }
                },
                resolve: {
                    
                }
            })       
        .state('edit-job', {
            parent: 'manage',
            url: '/edit-job:id',
            controller: 'JobController',
            data: {
                authorities: [],
                pageTitle: 'Edit Job'
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/job/edit-job.html',
                    controller: 'JobController'
                }
            },
            resolve: {
            	 
                
            }
        }).state('view-job', {
            parent: 'manage',
            url: '/view-job:id',
            controller: 'JobController',
            data: {
                authorities: [],
                pageTitle: 'View Job'
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/job/view-job.html',
                    controller: 'JobController'
                }
            },
            resolve: {
            	 
                
            }
        })
        .state('jobs', {
                parent: 'manage',
                url: '/jobs',
                controller: 'JobController',
                data: {
                    authorities: [],
                    pageTitle: 'Jobs'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/job/job-list.html',
                        controller: 'JobController'
                    }
                },
                resolve: {
                    
                }
            });
    });
