'use strict';

angular.module('timeSheetApp')
    .factory('ManufacturerComponent', function ManufacturerComponent(Manufacturer,$http) {
        return {

            create : function(manufacturer,callback){
                var cb = callback || angular.noop;
                return $http.post('api/manufacturer',manufacturer).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            update : function(manufacturer,callback){
                var cb = callback || angular.noop;
                return $http.put('api/manufacturer',manufacturer).then(
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

                return  $http.delete('api/manufacturer/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })
            },
            findAll: function () {
				return $http.get('api/manufacturer').then(function (response) {
					return response.data;
				});
			},            
            findById : function(id){
                return $http.get('api/manufacturer/'+id).then(function (response) {
                    return response.data;
                });
            },
            search: function(searchCriteria) {
                return $http.post('api/manufacturer/search',searchCriteria).then(function (response) {
                    return response.data;
                });
            }
        };
    });
