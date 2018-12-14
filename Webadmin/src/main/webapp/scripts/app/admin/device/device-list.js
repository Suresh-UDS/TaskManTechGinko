'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('devices', {
                parent: 'admin',
                url: '/devices',
                //controller: 'DeviceController',
                data: {
                    authorities: [],
                    pageTitle: 'Devices'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/device/device-list.html',
                        controller: 'DeviceController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
