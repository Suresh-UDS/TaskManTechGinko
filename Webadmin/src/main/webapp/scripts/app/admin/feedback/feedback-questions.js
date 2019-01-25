'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('feedback-questions', {
                parent: 'manage',
                url: '/feedback-questions',
                //controller: 'FeedbackQueController',
                data: {
                    authorities: [],
                    pageTitle: 'Feedback Master'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/feedback/feedback-questions.html',
                        controller: 'FeedbackQueController'
                    }
                },
                resolve: {

                }
            })
    });
