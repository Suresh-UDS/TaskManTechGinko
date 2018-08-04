'use strict';

angular.module('timeSheetApp')
    .factory('Project', function ($resource) {
        return $resource('api/project/', {}, {
        	'update': { method:'PUT' },
        	'deleteProject' : { method:'DELETE' }
        	
        });
    });
