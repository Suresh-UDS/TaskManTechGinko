'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('imports', {
                parent: 'manage',
                url: '/imports',
                //controller: 'ImportController',
                data: {
                    authorities: [],
                    pageTitle: 'Import'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/import/import.html',
                        controller: 'ImportController'
                    }
                },
                resolve: {
                    
                }
            });       
        
    });
