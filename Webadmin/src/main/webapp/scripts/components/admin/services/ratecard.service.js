'use strict';

angular.module('timeSheetApp')
    .factory('RateCardDelete', function ($resource) {
        return $resource('api/rateCard/:id', {}, {
        	
        	'deleteRateCard' : { method:'DELETE' }
        	
        });
    });