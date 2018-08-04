'use strict';

angular.module('timeSheetApp')
    .factory('UserGroup', function ($resource) {
        return $resource('api/userGroup/', {}, {
        	'update': { method:'PUT' }
        	
        });
    });
