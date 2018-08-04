'use strict';

angular.module('timeSheetApp')
    .factory('UserRoleDelete', function ($resource) {
        return $resource('api/userRole/:id', {}, {
        	
        	'deleteUserRole' : { method:'DELETE' }
        	
        });
    });