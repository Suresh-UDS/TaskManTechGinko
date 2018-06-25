'use strict';

angular.module('timeSheetApp')
    .factory('AssetComponent', function AssetComponent(Asset,$http) {
        return {

            create : function(asset,callback){
                var cb = callback || angular.noop;
               /* return $http.post('api/asset',asset).then(
                    function (response) {
                        //return cb(response);
                        console.log("Create Asset Service response -- " , response);
                        return response;
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })*/

                    return Asset.save(asset,
                    function () {
                        return cb(asset);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;

            },
            createPPM : function(asset,callback){
                var cb = callback || angular.noop;
                return $http.post('api/assets/ppmschedule',asset).then(
                    function (response) {
                        return cb(response);
                        //return response;
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
            /*search: function() {
                return $http.post('api/assets/search').then(function (response) {
                    return response.data;
                });
            },*/
            search: function(searchCriteria) {
                return $http.post('api/asset/search',searchCriteria).then(function (response) {
                    return response.data;
                });
            },

            findByAssetPPM : function(id) {
                return $http.get('api/assets/'+id+'/ppmschedulelist').then(function(response) {
                    return response.data;
                });
            },

            findPPMSchedule: function(searchCriteria) {
            	return $http.post('api/asset/findppmschedule',searchCriteria).then(function (response) {
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
            	return $http.post('api/assets/config', data).then(function (response) {
            		return response.data;
            	});
            },

            deleteDoc : function(id) {
            	return $http.delete('/assets/'+id+'/document/image').then(function(reaponse){
            		return response.data;
            	});
            },

            createAssetParamConfig : function(assetParam, callback) {

                console.log("asset requsest -- ",assetParam);
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
             createQr : function(qr) {
                return $http.get('api/asset/'+qr.id+'/qrcode/'+qr.code).then(function(response){
                    return response.data;

                });
            },
            genQrCode : function(qr) {

                return $http.get('api/asset/qrcode/'+qr.id).then(function(response){
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
            getPPMScheduleCalendar : function(assetId,searchCriteria) {
                return $http.get('api/assets/'+assetId+'/ppmschedule/calendar').then(function(response){
                    return response.data;
                });
            },

            readFile : function(document) {
            	return $http.get('api/assets/viewFile/'+document.id+'/'+document.fileName, {responseType: 'arraybuffer'}).then(function(response){
            		return response.data;
            	});

            },

            saveAmcSchedule : function(schedule) {
            	return $http.post('api/assets/amcschedule', schedule).then(function(response){
            		return response.data;
            	});
            },

            getAllPrefix : function() {
            	return $http.get('api/assets/amc/frequencyPrefix').then(function(response){
            		return response.data;
            	});
            },

            getAllFrequencies : function() {
            	return $http.get('api/assets/amc/frequency').then(function(response){
            		return response.data;
            	});
            },

            findByAssetAMC : function(id) {
            	return $http.get('api//assets/'+id+'/amcschedule').then(function(response) {
            		return response.data;
            	});
            },

            findByAssetReadings : function(id) {
            	return $http.get('api/assets/'+id+'/viewAssetReadings').then(function(response) {
            		return response.data;
            	});
            },

            findByReadingId : function(id) {
	            	return $http.get('api/assets/'+id+'/viewReadings').then(function(response) {
	            		return response.data;
	            	});
            },

            importAssetFile: function(file) {
	        		var fileFormData = new FormData();
	            fileFormData.append('assetFile', file);
	            	return $http.post('api/assets/import', fileFormData, {
	                    transformRequest: angular.identity,
	                    headers: {'Content-Type': undefined}

	                }).then(function (response) {
	            			return response.data;
	                });

            },
            importAssetStatus: function(fileName) {
	            	return $http.get('api/assets/import/'+fileName+"/status").then(function (response) {
	            		return response.data;
	            	});
            },
            importAssetPPMFile: function(file) {
	        		var fileFormData = new FormData();
	            fileFormData.append('assetPPMFile', file);
	            	return $http.post('api/assets/ppm/import', fileFormData, {
	                    transformRequest: angular.identity,
	                    headers: {'Content-Type': undefined}

	                }).then(function (response) {
	            			return response.data;
	                });

	        },
	        importAssetPPMStatus: function(fileName) {
	            	return $http.get('api/assets/ppm/import/'+fileName+"/status").then(function (response) {
	            		return response.data;
	            	});
	        },
	        importAssetAMCFile: function(file) {
	        		var fileFormData = new FormData();
	            fileFormData.append('assetAMCFile', file);
	            	return $http.post('api/assets/amc/import', fileFormData, {
	                    transformRequest: angular.identity,
	                    headers: {'Content-Type': undefined}

	                }).then(function (response) {
	            			return response.data;
	                });

	        },
	        importAssetAMCStatus: function(fileName) {
	            	return $http.get('api/assets/amc/import/'+fileName+"/status").then(function (response) {
	            		return response.data;
	            	});
	        },
	        exportAsset52WeekSchedule: function(searchCriteria) {
	            	return $http.post('api/assets/52week/export', searchCriteria).then(function (response) {
	            		return response.data;
	            	});
	        },

	        getAllRules : function() {
	        	return $http.get('api/assets/readingRules').then(function (response) {
	        		return response.data;
	        	});
	        },


	        exportAllData: function(searchCriteria) {
	            	return $http.post('api/assets/export', searchCriteria).then(function (response) {
	            		return response.data;
	            	});
	        },
	        exportStatus: function(fileName) {
	            	return $http.get('api/assets/export/'+fileName+"/status").then(function (response) {
	            		return response.data;
	            	});
	        },

	        getExportFile: function(fileName) {
	            	return $http.get('api/assets/export/'+fileName).then(function (response) {
	            		return response.data;
	            	});
	        },

        };
    });
