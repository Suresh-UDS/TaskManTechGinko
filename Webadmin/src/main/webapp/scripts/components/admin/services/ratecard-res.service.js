'use strict';

angular.module('timeSheetApp')
    .factory('RateCard', function ($resource) {
        return $resource('api/rateCard/', {}, {
        	'update': { method:'PUT' }
        	
        });
    });
