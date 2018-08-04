'use strict';

angular.module('timeSheetApp')
    .factory('Device', function ($resource) {
        return $resource('api/device/', {}, {
        	'update': { method:'PUT' },
        	'deleteDevice' : { method:'DELETE' }
        	
        });
    });
