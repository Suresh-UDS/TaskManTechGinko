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
                    'content@': {
                        templateUrl: 'scripts/app/account/login/login.html',
                        controller: 'LoginController'
                    }
                },
                resolve: {

                }
            }).state('changePassword',{
                parent:'account',
                url:'/change-password',
                data:{
                    authorities:[],
                    pageTitle:'Change Password'
                },
                views:{
                    'content@':{
                        templateUrl:'scripts/app/account/login/change-password.html',
                        controller:'LoginController'
                    }
                },
                resolve:{

                }
        });
    });
