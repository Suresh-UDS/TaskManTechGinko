'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('assetReports', {
                parent: 'manage',
                url: '/asset-report/:uid',
                //controller: 'AssetReportController',
                data: {
                    authorities: [],
                    pageTitle: 'Asset Report'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/reports/asset-report-list.html',
                        controller: 'AssetReportController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
