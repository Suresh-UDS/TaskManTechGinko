'use strict';

angular.module('timeSheetApp')
    .factory('ProjectDelete', function ($resource) {
        return $resource('api/project/:id', {}, {
        	
        	'deleteProject' : { method:'DELETE' }
        	
        });
    });