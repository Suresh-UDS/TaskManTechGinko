'use strict';

angular.module('timeSheetApp')
    .factory('UserComponent', function UserComponent(User,$http,UserDelete) {
        return {
        	createUser: function (user, callback) {
                var cb = callback || angular.noop;

                return User.save(user,
                    function () {
                        return cb(user);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/users').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/users/'+id).then(function (response) {
                      return response.data;
                  });
            },
            updateUser: function (user, callback) {
                var cb = callback || angular.noop;

                return User.update(user,
                    function () {
                        return cb(user);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteUser: function (user, callback) {
            	console.log('### deleteuser user component '+user);
                var cb = callback || angular.noop;

                return UserDelete.deleteUser(user,
                    function () {
                        return cb(user);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
            	return $http.post('api/users/search', searchCriteria).then(function (response) {
            		return response.data;
            	});

            },
            getAllUsers: function () {
                return $http.get('api/user/userSearch').then(function (response) {
                    return response.data;
                })
            },
            getUserByCode: function (code) {
                return $http.get('api/users/code/'+code).then(function (response) {
                    return response.data;
                })
            }

        };
    });
