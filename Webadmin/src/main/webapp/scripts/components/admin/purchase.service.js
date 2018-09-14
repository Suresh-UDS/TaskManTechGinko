'use strict';

angular.module('timeSheetApp')
    .factory('PurchaseComponent', function PurchaseComponent(Purchase,$http) {
        return {

            create : function(Purchase, callback) {
                var cb = callback || angular.noop;
                return $http.post('api/save/purchaseRequest', Purchase).then(
                    function (response) {
                        return response;
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    });
            },

            update : function(Purchase, callback) {
                var cb = callback || angular.noop;
                return $http.put('api/update/purchaseRequest', Purchase).then(
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
                return  $http.delete('api/delete/purchaseRequest/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    });
            },

            findAll: function () {
				return $http.get('api/purchaseRequest/findAll').then(function (response) {
					return response.data;
				});
			},

            findById : function(id) {
                return $http.get('api/purchaseRequest/'+id).then(function (response) {
                    return response.data;
                });
            },

            createTransaction : function(transaction) {
            	return $http.post('api/purchaseRequest/purchaseRequest', transaction).then(function(response) {
            		return response.data;
            	});
            },

            search: function(searchCriteria) {
                return $http.post('api/purchaseRequest/search', searchCriteria).then(function (response) {
                    return response.data;
                });
            },
            
            exportAllData : function(searchObj) {
            	return $http.post('api/purchaseRequest/export', searchObj).then(function(response) { 
            		return response.data;
            	});
            },
            exportStatus: function(fileName) {
            	return $http.get('api/purchaseRequest/export/'+fileName+"/status").then(function (response) {
            		return response.data;
            	});
            },

            getExportFile: function(fileName) {
            	return $http.get('api/purchaseRequest/export/'+fileName).then(function (response) {
            		return response.data;
            	});
            },
            
            getAllStatus : function() {
            	return $http.get('api/purchaseRequest/status').then(function(response) {
            		return response.data;
            	});
            }
        };
    });
