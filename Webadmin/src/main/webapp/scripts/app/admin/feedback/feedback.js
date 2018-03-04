'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('feedback', {
                parent: 'manage',
                url: '/feedback',
                controller: 'FeedbackController',
                data: {
                    authorities: [],
                    pageTitle: 'Feedback'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/feedback/feedback-list.html',
                        controller: 'FeedbackController'
                    }
                },
                resolve: {

                }
            });

    });
