'use strict';

angular.module('timeSheetApp')
    .factory('IndentComponent', function IndentComponent(Indent,$http) {
        return {

            create : function(indent, callback) {
                var cb = callback || angular.noop;
                return $http.post('api/save/materialIndent', indent).then(
                    function (response) {
                        return response;
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    });
            },
            
            update : function(indent, callback) {
                var cb = callback || angular.noop;
                return $http.put('api/update/materialIndent', indent).then(
                    function (response) {
                        return response;
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return err;
                    });
            },

            remove: function (id, callback) {
                var cb = callback || angular.noop;
                return  $http.delete('api/delete/materialIndent/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    });
            },
            
            findAll: function () {
				return $http.get('api/materialIndent/findAll').then(function (response) {
					return response.data;
				});
			},  
			
            findById : function(id) {
                return $http.get('api/materialIndent/'+id).then(function (response) {
                    return response.data;
                });
            },
            
            createTransaction : function(transaction) {
            	return $http.post('api/indent/materialTransaction', transaction).then(function(response) {
            		return response.data;
            	});
            },
            
            search: function(searchCriteria) {
                return $http.post('api/materialIndent/search', searchCriteria).then(function (response) {
                    return response.data;
                });
            }
        };
    });
