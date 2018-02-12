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
                        this.logout();
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
            }        
        };
    });