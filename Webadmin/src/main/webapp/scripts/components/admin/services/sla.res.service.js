'use strict';

angular.module('timeSheetApp')
    .factory('SlaUpdate', function ($resource) {
        return $resource('api/sla/', {}, {
            'update': { method:'POST' }

        });
    });