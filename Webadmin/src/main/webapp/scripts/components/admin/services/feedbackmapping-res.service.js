'use strict';

angular.module('timeSheetApp')
    .factory('FeedbackMapping', function ($resource) {
        return $resource('api/feedbackmapping/', {}, {
            'update': { method:'PUT' }

        });
    });
