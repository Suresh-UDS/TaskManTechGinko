'use strict';

angular.module('timeSheetApp')
    .factory('EmployeeDelete', function ($resource) {
        return $resource('api/employee/:id', {}, {
        	
        	'deleteEmployee' : { method:'DELETE' }
        	
        });
    });