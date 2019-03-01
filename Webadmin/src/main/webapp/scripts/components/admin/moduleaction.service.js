'use strict';

angular.module('timeSheetApp')
    .factory('ModuleActionComponent', function ModuleActionComponent(ModuleAction,$http,ModuleActionDelete) {
        return {
        	createModuleAction: function (moduleAction, callback) {
                var cb = callback || angular.noop;
                console.log('moduleAction -' + moduleAction.name);
                return ModuleAction.save(moduleAction,
                    function () {
                        return cb(moduleAction);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/applicationModule').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/applicationModule/'+id).then(function (response) {
                      return response.data;
                  });
            },
            updateModuleAction: function (moduleAction, callback) {
                var cb = callback || angular.noop;

                return ModuleAction.update(moduleAction,
                    function () {
                        return cb(moduleAction);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteModuleAction: function (moduleAction, callback) {

                var cb = callback || angular.noop;

                return ModuleActionDelete.deleteModuleAction(moduleAction,
                    function () {
                        return cb(moduleAction);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
            	return $http.post('api/applicationModule/search', searchCriteria).then(function (response) {
            	    //console.log("response of app-module -"+JSON.stringify(response));
            		return response.data;
            	});
            },
            findAllActions: function () {
                return $http.get('api/applicationAction').then(function (response) {
                    return response.data;
                });
            }

        };
    });
