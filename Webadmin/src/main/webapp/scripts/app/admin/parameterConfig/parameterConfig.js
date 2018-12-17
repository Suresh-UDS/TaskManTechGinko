'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('parameter-config', {
                parent: 'manage',
                url: '/parameter-config',
                //controller: 'ParameterConfigController',
                data: {
                    authorities: [],
                    pageTitle: 'ParameterConfig'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/parameterConfig/config.html',
                        controller: 'ParameterConfigController'
                    }
                },
                resolve: {

                }
            });
    });
