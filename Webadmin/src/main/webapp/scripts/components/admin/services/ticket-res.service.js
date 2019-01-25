'use strict';

angular.module('timeSheetApp')
    .factory('Ticket', function ($resource) {
        return $resource('api/ticket/', {}, {
        	'update': { method:'PUT' }
        	
        });
    });
