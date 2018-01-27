'use strict';

angular.module('timeSheetApp')
    .factory('RolePermission', function ($resource) {
        return $resource('api/userRolePermission/', {}, {
        	'update': { method:'PUT' }
        	
        });
    });
