'use strict';

angular.module('timeSheetApp')
    .factory('Site', function ($resource) {
        return $resource('api/site/', {}, {
        	'update': { method:'PUT' },
        	'deleteSite' : { method:'DELETE' }
        	
        });
    });
