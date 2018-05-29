'use strict';

angular.module('timeSheetApp')
    .factory('ParameterComponent', function ParameterComponent(Parameter,$http) {
        return {

            create : function(parameter,callback){
                var cb = callback || angular.noop;
                return $http.post('api/parameter',parameter).then(
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
                return $http.put('api/parameter',parameter).then(
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

                return  $http.delete('api/parameter/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })
            },
            findAll: function () {
				return $http.get('api/parameter').then(function (response) {
					return response.data;
				});
			},            
            findById : function(id){
                return $http.get('api/parameter/'+id).then(function (response) {
                    return response.data;
                });
            },
            search: function(searchCriteria) {
                return $http.post('api/parameter/search',searchCriteria).then(function (response) {
                    return response.data;
                });
            }
        };
    });
