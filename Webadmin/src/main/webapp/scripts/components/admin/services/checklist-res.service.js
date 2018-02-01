'use strict';

angular.module('timeSheetApp')
    .factory('Checklist', function ($resource) {
        return $resource('api/checklist/', {}, {
        	'update': { method:'PUT' }
        	
        });
    });
