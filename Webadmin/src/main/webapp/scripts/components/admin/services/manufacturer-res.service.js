'use strict';

angular.module('timeSheetApp')
    .factory('Manufacturer', function ($resource) {
        return $resource('api/manufacturer/', {}, {
        	
        });
    });
