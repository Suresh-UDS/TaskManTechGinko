'use strict';

angular.module('timeSheetApp')
    .factory('ChecklistDelete', function ($resource) {
        return $resource('api/checklist/:id', {}, {
        	
        	'deleteChecklist' : { method:'DELETE' }
        	
        });
    });