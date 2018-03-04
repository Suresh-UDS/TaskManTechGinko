'use strict';

angular.module('timeSheetApp')
    .factory('FeedbackQuestions', function ($resource) {
        return $resource('api/feedbackquestions/', {}, {
            'update': { method:'PUT' }

        });
    });
