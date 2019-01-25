'use strict';

angular.module('timeSheetApp')
    .factory('Indent', function ($resource) {
        return $resource('api/save/materialIndent', {}, {
        	
        });
    });
