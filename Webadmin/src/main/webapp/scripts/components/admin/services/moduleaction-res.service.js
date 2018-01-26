'use strict';

angular.module('timeSheetApp')
    .factory('ModuleAction', function ($resource) {
        return $resource('api/applicationModule/', {}, {
        	'update': { method:'PUT' }
        	
        });
    });
