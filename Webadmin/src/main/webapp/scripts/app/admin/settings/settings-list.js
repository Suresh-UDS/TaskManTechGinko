'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('settings-list', {
                parent: 'admin',
                url: '/setting',
                controller: 'SettingsController',
                data: {
                    authorities: [],
                    pageTitle: 'settings'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/settings/settings.html',
                        controller: 'SettingsController'
                    }
                },
                resolve: {

                }
            });

    });
