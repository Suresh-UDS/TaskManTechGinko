'use strict';

angular.module('timeSheetApp')
    .factory('AppSettings', function ($resource) {
        return $resource('api/settings/', {}, {
        	'update': { method:'PUT' }
        	
        });
    });
