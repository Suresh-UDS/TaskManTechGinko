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

            findTicketConfigByAssetId:function(assetId){
                return $http.get('api/assetTicketFindOne/assetId/'+assetId).then(function (response) {
                    return response.data;
                })
            },
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

            createAssetGroup :function(assetGroup, callback){
                var cb = callback || angular.noop;
                return $http.post('api/assetgroup',assetGroup).then(
                    function (response) {
                        return response;
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

            loadAssetParent : function(siteId) {
                return $http.get('api/assetParentHierarichy/'+siteId).then(function (response) {
                    return response.data;
                });

            },

            findByAssetConfig : function(data) {
            	return $http.post('api/assets/config', data).then(function (response) {
            		return response.data;
            	});
            },

            deleteDoc : function(id,callback) {
            	/*return $http.delete('api/assets/'+id+'/document/image').then(function(response){
            		return response;
            	});*/
                  var cb = callback || angular.noop;

                return  $http.delete('api/assets/'+id+'/document/image').then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
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

            updateAssetParamConfig : function(assetParam, callback) {

                console.log("asset requsest -- ",assetParam);
                var cb = callback || angular.noop;
                return $http.put('api/assets/update/config', assetParam).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    });
            },
            getAssetParamConfig : function(param) {
                return $http.get('api/assets/config/'+param).then(function(response){
                    return response.data;
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
                return $http.post('api/assets/'+assetId+'/ppmschedule/calendar',searchCriteria).then(function(response){
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
            	return $http.get('api/assets/'+id+'/amcschedule').then(function(response) {
            		return response.data;
            	});
            },

            findByAssetReadings : function(searchCriteria) {
            	return $http.post('api/assets/viewAssetReadings', searchCriteria).then(function(response) {
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

            exportAllMeterReading: function(searchCriteria) {
                return $http.post('api/assets/meterReading/export', searchCriteria).then(function (response) {
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
	        deleteConfigById : function(id) {
	        	return $http.delete('api/assets/removeConfig/'+id).then(function (response) {
	        		return response.data;
	        	});
	        },
             createWar : function(ServiceWarnty,callback){
                var cb = callback || angular.noop;
                return $http.post('api/assetwarrantytype',ServiceWarnty).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            getWarList: function () {
                return $http.get('api/assetwarrantytype').then(function (response) {
                    return response.data;
                });
            },

             getStatus: function () {
                return $http.get('api/assets/assetstatus').then(function (response) {
                    return response.data;
                });
            },

            multipleQr: function(MultipleIds) {

                return $http.get('api/list/qrcodes/['+MultipleIds +']').then(function (response) {
                    return response.data;
                });
            },

             printAllQr: function(search) {

                return $http.post('api/list/qrcodes/findAll', search).then(function (response) {
                    return response.data;
                });
            },



            getStatusHistory : function(search) {
            	return $http.post('api/assets/statusHistory', search).then(function(response) {
            		return response.data;
            	});
            },

            getSiteHistory : function(search) {
            	return $http.post('api/assets/siteHistory', search).then(function(response) {
            		return response.data;
            	});
            },

            getTicketHistory : function(search) {
            	return $http.post('api/assets/tickets', search).then(function(response) {
            		return response.data;
            	});
            },

            getAssetMaterial : function(search) {
            	return $http.post('api/assets/jobmaterials', search).then(function(response) {
            		return response.data;
            	});
            },

            getAssetHierarchy : function (criteria) {
                return $http.get('api/siteAssetHierarchy/'+criteria.siteId+'/'+criteria.assetTypeId).then(function(response){
                   return response.data;
                });
            },

            getAssetGrpHierarchy : function (criteria) {
                return $http.get('api/assetSiteGroupHierarichy/'+criteria.siteId).then(function (response) {
                   return response.data;
                });
            },

            getMTTR : function (assetId) {
                return $http.get('api/asset/mttr/'+assetId).then(function (response) {
                    return response.data;
                })
            }


        };
    });
