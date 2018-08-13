'use strict';

angular.module('timeSheetApp')
    .factory('Inventory', function ($resource) {
        return $resource('api/save/inventory', {}, {
        	
        });
    });
