'use strict';

angular.module('timeSheetApp')
    .factory('UserGroupDelete', function ($resource) {
        return $resource('api/userGroup/:id', {}, {
        	
        	'deleteUserGroup' : { method:'DELETE' }
        	
        });
    });