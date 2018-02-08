'use strict';

angular.module('timeSheetApp')
    .factory('EmployeeComponent', function EmployeeComponent(Employee,$http,EmployeeDelete) {
        return {
        	createEmployee: function (employee, callback) {
                var cb = callback || angular.noop;

                return Employee.save(employee,
                    function () {
                        return cb(employee);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/employee').then(function (response) {
                console.log(response)
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/employee/'+id).then(function (response) {
                      return response.data;
                  });
            },
            findDuplicate: function(id){
          	  return $http.get('api/employee/dupcheck/'+id).then(function (response) {
                    return response.data;
                });
            },
            findHistory: function (id) {
                return $http.get('api/employee/'+id+'/history').then(function (response) {
                    return response.data;
                });
            },
            updateEmployee: function (employee, callback) {
                var cb = callback || angular.noop;

                return Employee.update(employee,
                    function () {
                        return cb(employee);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteEmployee: function (employee, callback) {

                var cb = callback || angular.noop;

                return EmployeeDelete.deleteEmployee(employee,
                    function () {
                        return cb(employee);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
            	return $http.post('api/employee/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            },
            deleteEmployeeSite: function (empId,siteId) {

            	$http({
            	    method: 'DELETE',
            	    url: 'api/employee/'+empId+'/site/'+siteId,
            	    headers: {
            	        'Content-type': 'application/json;charset=utf-8'
            	    }
            	})
            	.then(function(response) {
            	    console.log(response.data);
            	    return response;
            	}, function(rejection) {
            	    console.log(rejection.data);
            	    return response;
            	});


            },
            deleteEmployeeProject: function (empId,projectId) {
            	$http({
            	    method: 'DELETE',
            	    url: 'api/employee/'+empId+'/project/'+projectId,
            	    headers: {
            	        'Content-type': 'application/json;charset=utf-8'
            	    }
            	})
            	.then(function(response) {
            	    console.log(response.data);
            	    return response.data;
            	}, function(rejection) {
            	    console.log(rejection.data);
            	    return response.data;
            	});
            },
            findAllManagers: function (id) {
                return $http.get('api/employee/'+id+'/managers').then(function (response) {
                console.log(response)
                    return response.data;
                });
            },
            checkIn: function(checkInData){
                return $http.post('api/attendance',checkInData).then(function (response) {
                    console.log(response)
                    return response.data;
                })
            },
            checkOut: function(checkOutData){
                return $http.post('api/attendance/save',checkOutData).then(function (response) {
                    console.log(response)
                    return response.data;
                })
            },
            getAttendance:function(id){
                return $http.post('api/attendance/'+id,{employeeId:id}).then(function (response) {
                    console.log(response);
                    return response.data;
                })
            },
            getSites: function(id){
                console.log(id)
                return $http.get('api/site/employee/'+id,{empId:id}).then(function (response) {
                    console.log(response);
                    return response.data;
                })
            },
            approveImage: function(employee){
                return $http.post('api/employee/authorizeImage',employee).then(function(response){
                    console.log(response);
                    return response;
                })
            },

            getAllRelievers: function(){
                return $http.get('api/employee/relievers').then(function (response) {
                    console.log(response);
                    return response;
                })
            },

            exportAllData: function(searchCriteria) {
	            	return $http.post('api/employee/export', searchCriteria).then(function (response) {
	            		return response.data;
	            	});
            },
            exportStatus: function(fileName) {
	            	if(empId == 0) {
	                	return $http.get('api/employee/export/'+fileName+"/status").then(function (response) {
	                		return response.data;
	                	});
	            	}
            },

            getExportFile: function(fileName) {
	            	return $http.get('api/employee/export/'+fileName).then(function (response) {
	            		return response.data;
	            	});
            }




        };
    });
