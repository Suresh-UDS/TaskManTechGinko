'use strict';

angular.module('timeSheetApp')
    .factory('Attendance', function ($resource) {
        return $resource('api/attendance/', {}, {
        	
        });
    });
