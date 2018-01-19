'use strict';

angular.module('timeSheetApp')
    .factory('DeviceDelete', function ($resource) {
        return $resource('api/device/:id', {}, {
        	'deleteDevice' : { method:'DELETE' }
        });
    });