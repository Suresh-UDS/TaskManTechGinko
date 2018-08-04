'use strict';

angular.module('timeSheetApp')
    .factory('Employee', function ($resource) {
        return $resource('api/employee/', {}, {
        	'update': { method:'PUT' },
        	'deleteEmployee' : { method:'DELETE' }
        	
        });
    });
