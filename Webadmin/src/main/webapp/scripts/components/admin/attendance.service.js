'use strict';

angular.module('timeSheetApp')
    .factory('AttendanceComponent', function AttendanceComponent(Attendance,$http) {
        return {

            findAll: function () {
                return $http.get('api/attendance').then(function (response) {
                console.log(response)
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/attendance/'+id).then(function (response) {
                      return response.data;
                  });
            },
            search: function(searchCriteria) {
            	return $http.post('api/attendance/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            },
            exportAllData: function(searchCriteria) {
            	return $http.post('api/attendance/export', searchCriteria).then(function (response) {
            		return response.data;
            	});
            },
            exportStatus: function(empId,fileName) {
            	console.log('emp id in exportStatus - ' + empId);	
            	if(empId == 0) {
                	return $http.get('api/attendance/export/'+fileName+"/status").then(function (response) {
                		return response.data;
                	});
            	}
            },
            
            getExportFile: function(empId,fileName) {
            	return $http.get('api/attendance/export/'+fileName).then(function (response) {
            		return response.data;
            	});
            }            


        };
    });
