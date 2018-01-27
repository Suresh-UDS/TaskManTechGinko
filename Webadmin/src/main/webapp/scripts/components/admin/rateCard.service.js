'use strict';

angular.module('timeSheetApp')
    .factory('RateCardComponent', function RateCardComponent($http) {
        return {
        	createRateCard: function(rateCard){
        	  return $http.post('http://localhost:8000/api/quotation/create',rateCard,options).then(function (response) {
                  console.log("Create Rate Card response");
        	      console.log(response);
        	      return response;
              })
            },
            findAll: function () {
                return $http.get('api/project').then(function (response) {
                    return response.data;
                });
            },
            findSites: function (projectId) {
                return $http.get('api/project/'+projectId+'/sites').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/project/'+id).then(function (response) {
                      return response.data;
                  });
            },
            updateProject: function (project, callback) {
                var cb = callback || angular.noop;

                return Project.update(project,
                    function () {
                        return cb(project);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteProject: function (project, callback) {

                var cb = callback || angular.noop;

                return ProjectDelete.deleteProject(project,
                    function () {
                        return cb(project);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
                return $http.post('api/project/search', searchCriteria).then(function (response) {
                    return response.data;
                });
            }

        };
    });
