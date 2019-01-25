'use strict';

angular.module('timeSheetApp')
    .factory('ParameterConfig', function ($resource) {
        return $resource('api/parameterConfig/', {}, {
        	
        });
    });
