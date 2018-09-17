'use strict';

angular.module('timeSheetApp')
    .factory('InventoryTransactionComponent', function InventoryTransactionComponent($http) {
        return {

            create : function(transaction,callback){
                var cb = callback || angular.noop;
                return $http.post('api/saveInventory/transaction', transaction).then(
                    function (response) {
                        return response;
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return err;
                    })

            },
            
            update : function(transaction,callback){
                var cb = callback || angular.noop;
                return $http.put('api/update/inventoryTrans', transaction).then(
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
                return  $http.delete('api/delete/inventoryTrans'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })
            },
            
            findAll: function () {
				return $http.get('api/inventoryTrans/findAll').then(function (response) {
					return response.data;
				});
			},
			
            findById : function(id){
                return $http.get('api/inventoryTrans/'+id).then(function (response) {
                    return response.data;
                });
            },
            
            search: function(searchCriteria) {
                return $http.post('api/inventoryTrans/search',searchCriteria).then(function (response) {
                    return response.data;
                });
            },
            
            findByMaterialTrans: function(criteria) { 
            	return $http.post('api/inventory/transactions', criteria).then(function(response) { 
            		return response.data;
            	});
            },
            
            findByMaterialItem : function(id) { 
            	return $http.get('api/material/itemgroup/'+id).then(function(response) {
            		return response.data;
            	});
            },
            
            getTransactionType : function() { 
            	return $http.get('api/materialTransaction/type').then(function(response) { 
            		return response.data;
            	});
            },
            exportAllData : function(searchObj) {
            	return $http.post('api/inventoryTrans/export', searchObj).then(function(response) { 
            		return response.data;
            	});
            },
            exportStatus: function(fileName) {
            	return $http.get('api/inventoryTrans/export/'+fileName+"/status").then(function (response) {
            		return response.data;
            	});
            },

            getExportFile: function(fileName) {
            	return $http.get('api/inventoryTrans/export/'+fileName).then(function (response) {
            		return response.data;
            	});
            }
            
        };
    });
