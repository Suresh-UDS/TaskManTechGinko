'use strict';

angular.module('timeSheetApp')
    .factory('ParameterConfigComponent', function ParameterConfigComponent(ParameterConfig,$http) {
        return {

            create : function(parameterConfig,callback){
                var cb = callback || angular.noop;
                return $http.post('api/parameterConfig',parameterConfig).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            update : function(parameterConfig,callback){
                var cb = callback || angular.noop;
                return $http.put('api/parameterConfig',parameterConfig).then(
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

                return  $http.delete('api/parameterConfig/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })
            },
            findAll: function () {
				return $http.get('api/parameterConfig').then(function (response) {
					return response.data;
				});
			}, 
            findById : function(id){
                return $http.get('api/parameterConfig/'+id).then(function (response) {
                    return response.data;
                });
            },
            search: function(searchCriteria) {
                return $http.post('api/parameterConfig/search',searchCriteria).then(function (response) {
                    return response.data;
                });
            },
        
            findByAssertType : function(type) { 
            	return $http.get('api/parameterConfig/assetType/'+type).then(function (response) { 
            		return response.data;
            	});
            }
        };
    });
