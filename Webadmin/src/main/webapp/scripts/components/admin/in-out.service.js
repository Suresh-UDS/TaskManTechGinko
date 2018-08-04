'use strict';

angular.module('timeSheetApp')
    .factory('CheckInOutComponent', function CheckInOutComponent($http) {
        return {
        	/*createProject: function (project, callback) {
                var cb = callback || angular.noop;

                return Project.save(project,
                    function () {
                        return cb(project);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },*/

            findAllByEmployeeId : function(employeeId,pageNo){
                return $http.get('api/employee/'+employeeId+'/checkInOut?findAll=false&currPage='+pageNo).then(function (response) {
                    return response.data;
                });
            },
            findAll: function (searchCriteria) {
                return $http.post('api/employee/checkInOut', searchCriteria).then(function (response) {
                    return response.data;
                });
            },

            search: function(searchCriteria) {
            	return $http.post('api/employee/checkInOut/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            },

            exportAllData: function(searchCriteria) {
            	return $http.post('api/employee/checkInOut/export/email', searchCriteria).then(function (response) {
            		return response.data;
            	});
            },

            exportData: function(empId,searchCriteria) {
            	return $http.post('api/employee/'+empId+'/checkInOut/export', searchCriteria).then(function (response) {
            		return response.data;
            	});
            },

            exportStatus: function(empId,fileName) {
            	console.log('emp id in exportStatus - ' + empId);
            	if(empId == 0) {
                	return $http.get('api/employee/checkInOut/export/'+fileName+"/status").then(function (response) {
                		return response.data;
                	});
            	}else {
                	return $http.get('api/employee/'+empId+'/checkInOut/export/'+fileName+"/status").then(function (response) {
                		return response.data;
                	});
            	}
            },

            getExportFile: function(empId,fileName) {
            	return $http.get('api/employee/'+empId+'/checkInOut/export/'+fileName).then(function (response) {
            		return response.data;
            	});
            }

        };
    });
