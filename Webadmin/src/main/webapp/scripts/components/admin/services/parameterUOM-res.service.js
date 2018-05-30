'use strict';

angular.module('timeSheetApp')
    .factory('ParameterUOM', function ($resource) {
        return $resource('api/parameterUOM/', {}, {
        	
        });
    });
