'use strict';

angular.module('timeSheetApp')
    .factory('SiteDelete', function ($resource) {
        return $resource('api/site/:id', {}, {
        	
        	'deleteSite' : { method:'DELETE' }
        	
        });
    });