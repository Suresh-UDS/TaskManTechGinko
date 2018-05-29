'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('parameterConfig-list', {
                parent: 'manage',
                url: '/parameterConfig-list',
                controller: 'ParameterConfigController',
                data: {
                    authorities: [],
                    pageTitle: 'ParameterConfig'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/parameterConfig/parameterConfig-list.html',
                        controller: 'ParameterConfigController'
                    }
                },
                resolve: {

                }
            });
    });
