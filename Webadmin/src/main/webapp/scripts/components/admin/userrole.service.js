'use strict';

angular.module('timeSheetApp')
    .factory('UserRoleComponent', function UserRoleComponent(UserRole,$http,UserRoleDelete) {
        return {
        	createUserRole: function (userRole, callback) {
                var cb = callback || angular.noop;
                console.log('userRole -' + userRole.name);
                return UserRole.save(userRole,
                    function () {
                        return cb(userRole);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/userRole').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/userRole/'+id).then(function (response) {
                      return response.data;
                  });
            },
            excludeAdmin:function(){
                return $http.get('api/userRole/exclude').then(function (response) {
                    return response.data;
                })
            },
            updateUserRole: function (userRole, callback) {
                var cb = callback || angular.noop;

                return UserRole.update(userRole,
                    function () {
                        return cb(userRole);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteUserRole: function (userRole, callback) {

                var cb = callback || angular.noop;

                return UserRoleDelete.deleteUserRole(userRole,
                    function () {
                        return cb(userRole);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
            	return $http.post('api/userRole/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            }

        };
    });
