'use strict';

angular.module('timeSheetApp')
    .factory('PriceComponent', function PriceComponent(Price,$http) {
        return {

            loadStandardPrices: function () {
                return $http.get('api/standardPricing/search').then(function (response) {
                    return response.data;
                });
            },
            findByTitle : function(title){
                return $http.get('api//standardPricing/getPrice').then(function (response) {
                    return response.data;
                })
            },

        };
    });
