'use strict';

angular.module('timeSheetApp')
    .factory('RolePermissionComponent', function RolePermissionComponent(RolePermission,$http,RolePermissionDelete) {
        return {
        	createRolePermission: function (rolePermission, callback) {
                var cb = callback || angular.noop;
                console.log('rolePermission -' + rolePermission.roleId);	
                return RolePermission.save(rolePermission,
                    function () {
                        return cb(rolePermission);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/userRolePermission').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/userRolePermission/'+id).then(function (response) {
                      return response.data;
                  });
            },
            updateRolePermission: function (rolePermission, callback) {
                var cb = callback || angular.noop;

                return RolePermission.update(rolePermission,
                    function () {
                        return cb(rolePermission);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteRolePermission: function (rolePermission, callback) {
            	
                var cb = callback || angular.noop;

                return RolePermissionDelete.deleteRolePermission(rolePermission,
                    function () {
                        return cb(rolePermission);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
            	return $http.post('api/userRolePermission/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            }
        
        };
    });