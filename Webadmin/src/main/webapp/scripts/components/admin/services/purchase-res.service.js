'use strict';

angular.module('timeSheetApp')
    .factory('Purchase', function ($resource) {
        return $resource('api/save/purchaseRequest', {}, {

        });
    });
