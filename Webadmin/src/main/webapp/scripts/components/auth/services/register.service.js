'use strict';

angular.module('timeSheetApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


