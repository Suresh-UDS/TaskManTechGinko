'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('indent-list', {
                parent: 'manage',
                url: '/indent-list',
                controller: 'IndentController',
                data: {
                    authorities: [],
                    pageTitle: 'Indent Master'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/indent/indent-list.html',
                        controller: 'IndentController'
                    }
                },
                resolve: {

                }
            });

    });
