'use strict';

angular.module('timeSheetApp')
    .factory('RolePermissionDelete', function ($resource) {
        return $resource('api/userRolePermission/:id', {}, {
        	
        	'deleteRolePermission' : { method:'DELETE' }
        	
        });
    });