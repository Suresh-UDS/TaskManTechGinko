'use strict';

angular.module('timeSheetApp')
    .factory('Parameter', function ($resource) {
        return $resource('api/parameter/', {}, {
        	
        });
    });
