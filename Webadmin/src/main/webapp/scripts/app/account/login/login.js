'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                parent: 'account',
                url: '/',
                data: {
                    authorities: [],
                    pageTitle: 'Sign in'
                },
                views: {
                    'login@': {
                        templateUrl: 'scripts/app/account/login/login.html',
                        controller: 'LoginController'
                    }
                },
                resolve: {

                }
            });
    });
