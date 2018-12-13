'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('feedback-setup', {
                parent: 'manage',
                url: '/feedback-setup',
                //controller: 'FeedbackSetupController',
                data: {
                    authorities: [],
                    pageTitle: 'Feedback Mapping'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/feedback/feedback-setup.html',
                        controller: 'FeedbackSetupController'
                    }
                },
                resolve: {

                }
            })
            .state('add-feedback-setup', {
                parent: 'manage',
                url: '/add-feedback-setup',
                //controller: 'FeedbackSetupController',
                data: {
                    authorities: [],
                    pageTitle: 'Add Feedback Mapping'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/feedback/add-feedback-setup.html',
                        controller: 'FeedbackSetupController'
                    }
                },
                resolve: {

                }
            })
    });
