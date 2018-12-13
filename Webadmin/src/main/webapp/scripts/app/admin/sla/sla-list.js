'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('sla-list', {
                parent: 'manage',
                url: '/sla-list',
                //controller: 'SlaController',
                data: {
                    authorities: [],
                    pageTitle: 'SLA Management'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/sla/sla-list.html',
                        controller: 'SlaController'
                    }
                },
                resolve: {

                }
            });

    });
