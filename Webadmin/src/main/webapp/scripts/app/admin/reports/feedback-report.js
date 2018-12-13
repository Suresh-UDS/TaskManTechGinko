'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('feedbackReports', {
                parent: 'manage',
                url: '/feedback-reports',
                //controller: 'FeedbackReportController',
                data: {
                    authorities: [],
                    pageTitle: 'Feedback Report'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/reports/feedback-report.html',
                        controller: 'FeedbackReportController'
                    }
                },
                resolve: {

                }
            });

    });
