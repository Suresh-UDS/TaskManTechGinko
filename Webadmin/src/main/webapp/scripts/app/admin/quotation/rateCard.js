'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('add-rateCard', {
                parent: 'manage',
                url: '/add-rateCard',
                //controller: 'RateCardController',
                data: {
                    authorities: [],
                    pageTitle: 'Add RateCard'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/quotation/add-rateCard.html',
                        controller: 'RateCardController'
                    }
                },
                resolve: {

                }
            })
            .state('edit-rateCard', {
                parent: 'manage',
                url: '/edit-rateCard:id',
                //controller: 'RateCardController',
                data: {
                    authorities: [],
                    pageTitle: 'Edit RateCard'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/quotation/edit-rateCard.html',
                        controller: 'RateCardController'
                    }
                },
                resolve: {


                }
            }).state('rateCardList', {
                              parent: 'manage',
                              url: '/rateCardList',
                              //controller: 'RateCardController',
                              data: {
                                  authorities: [],
                                  pageTitle: 'RateCard List'
                              },
                              views: {
                                  'content@': {
                                      templateUrl: 'scripts/app/admin/quotation/rateCard-list.html',
                                      controller: 'RateCardController'
                                  }
                              },
                              resolve: {


                              }
             }).state('view-rateCard', {
            parent: 'manage',
            url: '/view-rateCard',
            //controller: 'RateCardController',
            data: {
                authorities: [],
                pageTitle: 'View RateCard'
            },
            views: {
                'content@': {
                    templateUrl: 'scripts/app/admin/quotation/view-rateCard.html',
                    controller: 'RateCardController'
                }
            },
            resolve: {


            }
        });
    });
