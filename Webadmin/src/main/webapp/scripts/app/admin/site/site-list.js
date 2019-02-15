'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('sites', {
                parent: 'manage',
                url: '/sites?{project:json}',
                //controller: 'SiteController',
                data: {
                    authorities: [],
                    pageTitle: 'Sites'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/site/site-list.html',
                        controller: 'SiteController'
                    }
                },
                resolve: {

                },
                params:{
                 project:null
                }
            });

    });
