'use strict';

angular.module('timeSheetApp')
    .factory('UserRole', function ($resource) {
        return $resource('api/userRole/', {}, {
        	'update': { method:'PUT' }
        	
        });
    });
