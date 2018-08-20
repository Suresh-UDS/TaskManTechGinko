'use strict';

angular.module('timeSheetApp')
    .factory('InventoryComponent', function InventoryComponent(Inventory,$http) {
        return {

            create : function(inventory,callback){
                var cb = callback || angular.noop;
                return $http.post('api/save/inventory', inventory).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            update : function(inventory,callback){
                var cb = callback || angular.noop;
                return $http.put('api/update/inventory',inventory).then(
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

                return  $http.delete('api//delete/inventory/'+id).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })
            },
            findAll: function () {
				return $http.get('api/findAll').then(function (response) {
					return response.data;
				});
			},            
            findById : function(id){
                return $http.get('api/inventory/'+id).then(function (response) {
                    return response.data;
                });
            },
            search: function(searchCriteria) {
                return $http.post('api/inventory/search',searchCriteria).then(function (response) {
                    return response.data;
                });
            },
            getMaterialUOM : function() { 
            	return $http.get('api/material/uom').then(function(response) {
            		return response.data;
            	});
            },
            createItemGroup : function(itemGroup, callback) {
            	var cb = callback || angular.noop;
                return $http.post('api/materialItemgroup', itemGroup).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },
            loadItemGroup : function() { 
            	return $http.get('api/materialItemgroup').then(function(response) { 
            		return response.data;
            	});
            },
            findByMaterialTrans: function(criteria) { 
            	return $http.post('api/inventory/transactions', criteria).then(function(response) { 
            		return response.data;
            	});
            }
        };
    });
