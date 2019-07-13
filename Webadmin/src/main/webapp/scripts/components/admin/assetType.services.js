'use strict';

angular.module('timeSheetApp')
    .factory('AssetTypeComponent', function AssetTypeComponent(AssetType,$http) {
        return {

            create : function(assetType,callback){
                var cb = callback || angular.noop;
                return $http.post('api/assetType',assetType).then(
                    function (response) {
                        //return cb(response);
                    	return (response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            update : function(assetType,callback){
                var cb = callback || angular.noop;
                return $http.put('api/assetType/'+assetType.id,assetType).then(
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

                return  $http.delete('api/assetType/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })
            },
            findAll: function () {
				return $http.get('api/assetType').then(function (response) {
					return response.data;
				});
			},

            findBySiteId: function (siteId) {
                return $http.get('api/assetType/'+siteId).then(function (response) {
                    return response.data;
                });
            },
            findById : function(id){
                return $http.get('api/assetType/'+id).then(function (response) {
                    return response.data;
                });
            },
            search: function() {
                return $http.post('api/assetTypes/search').then(function (response) {
                    return response.data;
                });
            }
        };
    });
