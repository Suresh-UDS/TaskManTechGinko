'use strict';

angular.module('timeSheetApp')
    .factory('SlaDelete', function ($resource) {
        return $resource('api/sladelete/:id', {}, {

            'deleteSla' : { method:'DELETE' }

        });
    });
