'use strict';

angular.module('timeSheetApp')
    .factory('VendorComponent', function VendorComponent(Vendor,$http) {
        return {

            create : function(vendor,callback){
                var cb = callback || angular.noop;
                return $http.post('api/vendor',vendor).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            update : function(vendor,callback){
                var cb = callback || angular.noop;
                return $http.put('api/vendor',vendor).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },

            remove: function (id, callback) {

                var cb = callback || angular.noop;

                return  $http.delete('api/vendor/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })
            },
            findAll: function () {
				return $http.get('api/vendor').then(function (response) {
					return response.data;
				});
			},            
            findById : function(id){
                return $http.get('api/vendor/'+id).then(function (response) {
                    return response.data;
                });
            },
            search: function(searchCriteria) {
                return $http.post('api/vendor/search',searchCriteria).then(function (response) {
                    return response.data;
                });
            }
        };
    });
