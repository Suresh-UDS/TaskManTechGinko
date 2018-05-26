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
            deleteRateCard: function (rateCard) {

                // var cb = callback || angular.noop;
                //
                // return RateCardDelete.deleteRateCard(rateCard,
                //     function () {
                //         return cb(rateCard);
                //     },
                //     function (err) {
                //         this.logout();
                //         return cb(err);
                //     }.bind(this)).$promise;

                return $http.post('api/rateCard/delete',rateCard).then(function (response) {
                    console.log("Deleted response");
                    console.log(response);
                    return response;
                })
            },
            search: function(searchCriteria) {

                return $http.post('api/rateCard/search', searchCriteria).then(function (response) {
                    console.log("Search response");
                    console.log(response);
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
            },

            createQuotation: function(quotation) {
                return $http.post('api/rateCard/quotation', quotation).then(function (response) {
                    console.log("Saving Quotation");
                    console.log(response.data);
                    return response.data;
                })
            },

            findQuotation: function(id) {
                return $http.get('api/rateCard/quotation/id/' + id).then(function (response) {
                    console.log("Retrieving Quotation");
                    console.log(response.data);
                    return response.data;
                })
            },

            findQuotationImages: function(quotationId,imageId){
                return $http.get('api/quotation/image/'+quotationId+'/'+imageId).then(function (response) {
                    console.log("Quotation images response");
                    console.log(response.data);
                    return response.data;
                })
            },


            getAllQuotations: function(criteria){
                return $http.post('api/rateCard/quotation/search', criteria).then(function (response) {
                    console.log("All Quotation");
                    console.log(response.data);
                    return response.data;
                })
            },

            approveQuotation: function(quotation){
                return $http.post('api/rateCard/quotation/approve',quotation).then(function(response){
                    console.log(response.data);
                    return response.data;
                })
            },

            rejectQuotation: function(quotation){
                return $http.post('api/rateCard/quotation/reject',quotation).then(function(response){
                    console.log(response.data);
                    return response.data;
                })
            },
             upload: function(quotationId,quotationImage) {
                console.log(quotationImage);
                 var fileFormData = new FormData();
                 fileFormData.append('quotationFile', quotationImage);
                 fileFormData.append('quotationId', quotationId);
                 return $http.post('api/quotation/image/upload', fileFormData, {
                     transformRequest: angular.identity,
                     headers: {'Content-Type': undefined}

                 }).then(function (response) {
                     return response.data;
                 });

            }



        };
    });
