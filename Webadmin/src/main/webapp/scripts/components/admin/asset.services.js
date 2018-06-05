'use strict';

angular.module('timeSheetApp')
    .factory('AssetComponent', function AssetComponent(Asset,$http) {
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
                
            },
            

            
            loadAssetType : function() { 
            	return $http.get('api/assets/type').then(function (response) { 
            		return response.data;
            	});
            	
            },

            createAssetGroup :function(assetGroup,callback){
                var cb = callback || angular.noop;
                return $http.post('api/assetgroup',assetGroup).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            

            
            loadAssetGroup : function() { 
                return $http.get('api/assetgroup').then(function (response) { 
                    return response.data;
                });
                
            },
            

            findByAssetConfig : function(data) { 
            	var type = data.assetTypeName;
            	var id = data.assetId;
            	return $http.get('api/assets/'+type+'/config/'+id).then(function (response) { 
            		return response.data;
            	});
            },
            
            deleteConfigById : function(id) { 
            	return $http.delete('api/assets/removeConfig/'+id).then(function(reaponse){ 
            		return response.data;
            	});
            },
            
            createAssetParamConfig : function(assetParam, callback) {
            	var cb = callback || angular.noop;
                return $http.post('api/assets/params', assetParam).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    });
            },
            
            uploadAssetFile : function(asset) { 
            	var file = asset.uploadFile;
            	var fileFormData = new FormData();
            	
        	 	fileFormData.append('title', asset.title);
             	fileFormData.append('assetId', asset.assetId);
             	fileFormData.append('uploadFile', file);
             	fileFormData.append('type', asset.type);
               
            	return $http.post('api/assets/uploadFile', fileFormData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).then(function (response) {
            			return response.data;
                });
            },
            
            getAllUploadedFiles : function(obj) { 
            	return $http.get('api/assets/getAllFile/'+obj.type+'/'+obj.assetId).then(function(response){ 
            		return response.data;
            	});
            },
            
            uploadAssetPhoto : function(asset) { 
            	var file = asset.uploadFile;
            	var fileFormData = new FormData();
            	
        	 	fileFormData.append('title', asset.title);
             	fileFormData.append('assetId', asset.assetId);
             	fileFormData.append('uploadFile', file);
             	fileFormData.append('type', asset.type);
               
            	return $http.post('api/assets/uploadAssetPhoto', fileFormData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).then(function (response) {
            			return response.data;
                });
            },
            
            getAllUploadedPhotos : function(obj) { 
            	return $http.get('api/assets/getAllAssetPhoto/'+obj.type+'/'+obj.assetId).then(function(response){ 
            		return response.data;
            	});
            },
            
            readFile : function(document) { 
            	return $http.get('api/assets/viewFile/'+document.id+'/'+document.fileName).then(function(response){ 
            		return response.data;
            	});
            }
            

        };
    });
