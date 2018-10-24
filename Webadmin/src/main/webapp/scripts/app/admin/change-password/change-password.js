'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('changePassword',{
                parent:'account',
                url:'/change-password',
                data:{
                    authorities:[],
                    pageTitle:'Change Password'
                },
                views:{
                    'content@':{
                        templateUrl:'scripts/app/admin/change-password/change-password.html',
                        controller:'ChangePwdController'
                    }
                },
                resolve:{

                }
        });
    });