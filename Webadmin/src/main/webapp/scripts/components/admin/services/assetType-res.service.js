'use strict';

angular.module('timeSheetApp')
    .factory('AssetType', function ($resource) {
        return $resource('api/assetType/', {}, {
        	
        });
    });
