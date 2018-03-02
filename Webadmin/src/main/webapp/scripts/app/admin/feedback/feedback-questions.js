'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('feedbackquestions', {
                parent: 'manage',
                url: '/feedback-questions',
                controller: 'FeedbackQueController',
                data: {
                    authorities: [],
                    pageTitle: 'Feedback Questions'
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
