'use strict';

angular.module('timeSheetApp')
    .factory('UserDelete', function ($resource) {
        return $resource('api/users/:id', {}, {
        	
        	
        	'deleteUser' : { method:'DELETE' }
        	
        });
    });