'use strict';

angular.module('timeSheetApp')
    .factory('Asset', function ($resource) {
        return $resource('api/asset/', {}, {
        	
        });
    });
