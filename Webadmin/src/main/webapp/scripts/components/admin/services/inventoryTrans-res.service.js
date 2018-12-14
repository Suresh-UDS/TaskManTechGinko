'use strict';

angular.module('timeSheetApp')
    .factory('InventoryTransaction', function ($resource) {
        return $resource('api/saveInventory/transaction', {}, {
        	
        });
});