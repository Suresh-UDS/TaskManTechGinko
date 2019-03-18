'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('feedbacks', {
                parent: 'manage',
                url: '/feedbacks',
                //controller: 'FeedbackController',
                data: {
                    authorities: [],
                    pageTitle: 'Feedbacks   '
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/feedback/feedback-list.html',
                        controller: 'FeedbackController'
                        //controllerAs:'vm'
                    }
                },
                resolve: {

                },

            }).state('feedbacksList', {
                parent: 'manage',
                url: '/feedbacksList/:pid/:pName/:sid/:sName/:block/:floor/:zone/:date',
                //controller: 'FeedbackController',
                data: {
                    authorities: [],
                    pageTitle: 'Feedbacks   '
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/feedback/feedback-list.html',
                        controller: 'FeedbackController'
                        //controllerAs:'vm'
                    }
                },
                resolve: {

                }
            });

    });
