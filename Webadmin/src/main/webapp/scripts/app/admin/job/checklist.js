'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('checklists', {
                parent: 'manage',
                url: '/checklists',
                //controller: 'ChecklistController',
                data: {
                    authorities: [],
                    pageTitle: 'Checklist'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/job/checklist.html',
                        controller: 'ChecklistController'
                    }
                },
                resolve: {
                    
                }
            })
    });
