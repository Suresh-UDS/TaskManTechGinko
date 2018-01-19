'use strict';

angular.module('timeSheetApp')
    .factory('UserGroupComponent', function UserGroupComponent(UserGroup,$http,UserGroupDelete) {
        return {
        	createUserGroup: function (userGroup, callback) {
                var cb = callback || angular.noop;

                return UserGroup.save(userGroup,
                    function () {
                        return cb(userGroup);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/userGroup').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/userGroup/'+id).then(function (response) {
                      return response.data;
                  });
            },
            updateUserGroup: function (userGroup, callback) {
                var cb = callback || angular.noop;

                return UserGroup.update(userGroup,
                    function () {
                        return cb(userGroup);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteUserGroup: function (userGroup, callback) {
            	
                var cb = callback || angular.noop;

                return UserGroupDelete.deleteUserGroup(userGroup,
                    function () {
                        return cb(userGroup);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
            	return $http.post('api/userGroup/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            }
        
        };
    });