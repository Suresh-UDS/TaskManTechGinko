'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('purchase-requisition-list', {
                parent: 'manage',
                url: '/purchase-requisition-list',
                controller: 'PurchaseRequisitionController',
                data: {
                    authorities: [],
                    pageTitle: 'Purchase Requisition Master'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/purchase-requisition/purchase-requisition-list.html',
                        controller: 'PurchaseRequisitionController'
                    }
                },
                resolve: {

                }
            });

    });
