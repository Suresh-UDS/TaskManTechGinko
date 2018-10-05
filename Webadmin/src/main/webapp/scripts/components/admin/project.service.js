'use strict';

angular.module('timeSheetApp')
    .factory('ProjectComponent', function ProjectComponent(Project,$http,ProjectDelete) {
        return {
        	createProject: function (project, callback) {
                var cb = callback || angular.noop;

                return Project.save(project,
                    function () {
                        return cb(project);
                    },
                    function (err) {
                    	console.log('Error in ProjectComp -' + JSON.stringify(err));
                        return cb(err);
                    }.bind(this)).$promise;
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
            },
	        
	        importFile: function(file) {
	        		var fileFormData = new FormData();
	            fileFormData.append('clientFile', file);
	            	return $http.post('api/clients/import', fileFormData, {
	                    transformRequest: angular.identity,
	                    headers: {'Content-Type': undefined}
	     
	                }).then(function (response) {
	            			return response.data;
	                });
	        		
	        },
	        
	        importStatus: function(fileName) {
                	return $http.get('api/clients/import/'+fileName+"/status").then(function (response) {
                		return response.data;
                	});
	        },
	        
	        createClientGroup :function(clientGroup, callback){
                var cb = callback || angular.noop;
                return $http.post('api/clientgroup', clientGroup).then(
                    function (response) {
                        return response;
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

            },

            loadClientGroup : function() {
                return $http.get('api/clientgroup/findAll').then(function (response) {
                    return response.data;
                });

            }

        };
    });
