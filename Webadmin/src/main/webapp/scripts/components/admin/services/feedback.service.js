'use strict';

angular.module('timeSheetApp')
    .factory('FeedbackDelete', function ($resource) {
        return $resource('api/feedback/:id', {}, {

            'deleteFeedback' : { method:'DELETE' }

        });
    });
