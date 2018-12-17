'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('user-roles', {
                parent: 'admin',
                url: '/user-roles',
                //controller: 'UserRolesController',
                data: {
                    authorities: [],
                    pageTitle: 'User Roles'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/user-roles-permission/user-roles-list.html',
                        controller: 'UserRolesController'
                    }
                },
                resolve: {

                }
            });

    });
