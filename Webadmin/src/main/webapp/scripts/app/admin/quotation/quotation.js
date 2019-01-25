'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('add-quotation', {
                parent: 'manage',
                url: '/add-quotation/:ticketId',
                //controller: 'QuotationController',
                data: {
                    authorities: [],
                    pageTitle: 'Add Quotation'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/quotation/add-quotation.html',
                        controller: 'QuotationController'
                    }
                },
                resolve: {

                }
            })
            .state('edit-quotation', {
                parent: 'manage',
                url: '/edit-quotation/:id',
                //controller: 'QuotationController',
                data: {
                    authorities: [],
                    pageTitle: 'Edit Quotation'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/quotation/edit-quotation.html',
                        controller: 'QuotationController'
                    }
                },
                resolve: {


                }
            }).state('view-quotation', {
            parent: 'manage',
            url: '/view-quotation/:id',
            //controller: 'QuotationController',
            data: {
                authorities: [],
                pageTitle: 'View Quotation'
            },
            params: {
                viewOnly: true
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/quotation/view-quotation.html',
                    controller: 'QuotationController'
                }
            },
            resolve: {


            }
        }).state('quotation-list', {
	          parent: 'manage',
	          url: '/quotation-list',
	          //controller: 'QuotationController',
	          data: {
	              authorities: [],
	              pageTitle: 'Quotation'
	          },
	          views: {
	              'content@': {
	                  templateUrl: 'scripts/app/admin/quotation/quotation-list.html',
	                  controller: 'QuotationController'
	              }
	          },
	          resolve: {
	
	
	          }
	      });
    });
