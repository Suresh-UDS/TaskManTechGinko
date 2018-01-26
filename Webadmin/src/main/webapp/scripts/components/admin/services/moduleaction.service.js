'use strict';

angular.module('timeSheetApp')
    .factory('ModuleActionDelete', function ($resource) {
        return $resource('api/applicationModule/:id', {}, {
        	
        	'deleteModuleAction' : { method:'DELETE' }
        	
        });
    });