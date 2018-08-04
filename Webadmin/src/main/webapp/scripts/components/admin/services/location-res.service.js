'use strict';

angular.module('timeSheetApp')
    .factory('Location', function ($resource) {
        return $resource('api/location/', {}, {
            'update': { method:'PUT' }

        });
    });
