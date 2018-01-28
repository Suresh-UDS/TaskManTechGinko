'use strict';

angular.module('timeSheetApp')
    .factory('RateCardComponent', function RateCardComponent($http) {
        return {
        	createRateCard: function(rateCard){
        	  return $http.post('api/rateCard',rateCard).then(function (response) {
                  console.log("Create Rate Card response");
        	      console.log(response);
        	      return response;
              })
            },
            findAll: function () {
                return $http.get('api/rateCard').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/rateCard/'+id).then(function (response) {
                      return response.data;
                  });
            },
            updateRateCard: function (rateCard, callback) {
                var cb = callback || angular.noop;

                return RateCard.update(rateCard,
                    function () {
                        return cb(project);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteRateCard: function (rateCard, callback) {

                var cb = callback || angular.noop;

                return RateCardDelete.deleteRateCard(rateCard,
                    function () {
                        return cb(rateCard);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
                return $http.post('api/rateCard/search', searchCriteria).then(function (response) {
                    return response.data;
                });
            },
            
            getRateTypes: function() {
                return $http.get('api/rateCard/types').then(function (response) {
                    return response.data;
                });
            },
            
            getUomTypes: function() {
                return $http.get('api/rateCard/uom').then(function (response) {
                    return response.data;
                });
            }

        };
    });
