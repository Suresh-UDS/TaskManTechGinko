'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('add-job', {
                parent: 'manage',
                url: '/add-job/:ticketId',
                //controller: 'JobController',
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

                },
                permission:'Job:Create'
            })
        .state('edit-job', {
            parent: 'manage',
            url: '/edit-job/:id',
            //controller: 'JobController',
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


            },
            permission:'Job:Edit'
        }).state('view-job', {
            parent: 'manage',
            url: '/view-job/:id',
            //controller: 'JobController',
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


            },
            permission:'Job:View'
        })
        .state('jobs', {
                parent: 'manage',
                url: '/jobs?{project:json}{site:json}',
               // controller: 'JobController',
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

                },
                  params:{
                   project:null,
                   site:null
                  },
                 permission:'Job:List'
            });
    });
