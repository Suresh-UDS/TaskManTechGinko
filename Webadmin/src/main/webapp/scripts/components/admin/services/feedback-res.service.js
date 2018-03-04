'use strict';

angular.module('timeSheetApp')
    .factory('Feedback', function ($resource) {
        return $resource('api/feedback/', {}, {
            'update': { method:'PUT' }

        });
    });
