'use strict';

angular.module('timeSheetApp')
    .factory('AssetComponent', function AssetComponent($http) {
        return {

            create : function(asset,callback){
                var cb = callback || angular.noop;
                return $http.post('api/asset',asset).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            update : function(asset,callback){
                var cb = callback || angular.noop;
                return $http.put('api/asset/'+asset.id,asset).then(
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

                return  $http.delete('api/asset/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })
            },
            findById : function(id){
                return $http.get('api/asset/'+id).then(function (response) {
                    return response.data;
                });
            },
            search: function() {
                return $http.post('api/assets/search').then(function (response) {
                    return response.data;
                });
            },

             createAssetType : function() { 
                return $http.post('api/assets/type').then(function (response) { 
                    return response.data;
                });
                
            }
            
            
        };
    });
