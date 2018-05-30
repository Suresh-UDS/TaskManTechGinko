'use strict';

angular.module('timeSheetApp')
    .factory('ParameterUOMComponent', function ParameterUOMComponent(ParameterUOM,$http) {
        return {

            create : function(parameter,callback){
                var cb = callback || angular.noop;
                return $http.post('api/parameterUOM',parameter).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            update : function(parameter,callback){
                var cb = callback || angular.noop;
                return $http.put('api/parameterUOM',parameter).then(
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

                return  $http.delete('api/parameterUOM/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })
            },
            findAll: function () {
				return $http.get('api/parameterUOM').then(function (response) {
					return response.data;
				});
			},            
            findById : function(id){
                return $http.get('api/parameterUOM/'+id).then(function (response) {
                    return response.data;
                });
            },
            search: function(searchCriteria) {
                return $http.post('api/parameterUOM/search',searchCriteria).then(function (response) {
                    return response.data;
                });
            }
        };
    });
