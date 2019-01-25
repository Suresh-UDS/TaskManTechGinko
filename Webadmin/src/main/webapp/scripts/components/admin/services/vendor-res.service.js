'use strict';

angular.module('timeSheetApp')
    .factory('Vendor', function ($resource) {
        return $resource('api/vendor/', {}, {
        	
        });
    });
