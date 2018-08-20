'use strict';

angular.module('timeSheetApp')
    .factory('ChecklistComponent', function ChecklistComponent(Checklist,$http,ChecklistDelete) {
        return {
        	createChecklist: function (checklist, callback) { 
                var cb = callback || angular.noop;
                console.log('checklist -' + checklist.name);	
                return Checklist.save(checklist,
                    function () {
                        return cb(checklist);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/checklist').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/checklist/'+id).then(function (response) {
                      return response.data;
                  });
            },
            updateChecklist: function (checklist, callback) {
                var cb = callback || angular.noop;

                return Checklist.update(checklist,
                    function () {
                        return cb(checklist);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteChecklist: function (checklist, callback) {
            	
                var cb = callback || angular.noop;

                return ChecklistDelete.deleteChecklist(checklist,
                    function () {
                        return cb(checklist);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
            	return $http.post('api/checklist/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            },
            importChecklistFile: function(file){
            	var fileFormData = new FormData();
        		fileFormData.append('checklistFile', file);
            	return $http.post('api/checklist/import', fileFormData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
     
                }).then(function (response) {
            			return response.data;
                });
            	
            },
            importStatus: function(fileName) {
	        	console.log('import checklist service file name : '+fileName);
                	return $http.get('api/site/import/'+fileName+"/status").then(function (response) {
                		return response.data;
                	});
	        }
        };
    });