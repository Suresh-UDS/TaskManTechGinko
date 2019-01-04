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
            searchAbsent: function(searchCriteria) {
                  return $http.post('api/employee/absent/search', searchCriteria).then(function (response) {
                      return response.data;
                  });
            },
            searchShift: function(searchCriteria) {
                return $http.post('api/employee/shift/search', searchCriteria).then(function (response) {
                    return response.data;
                });
            },

            updateEmployeeShifts: function(empShifts) {
                return $http.put('api/employee/shifts', empShifts).then(function (response) {
                    return response;
                });
            },

            deleteEmployeeShift: function(empShift) {
                return 	$http({
                    method: 'DELETE',
                    url: 'api/employee/shift/' + empShift.id,
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                })
                    .then(function(response) {
                        console.log(response);
                        return response;
                    }, function(rejection) {
                        console.log(rejection);
                        return response;
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
                return $http.get('api/attendance/'+id,{employeeId:id}).then(function (response) {
                    console.log(response);
                    return response.data;
                })
            },
            getEmployeeCurrentAttendance:function(id){
                return $http.get('api/attendance/employee/'+id).then(function (response) {
                    console.log(JSON.stringify(response.data));
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

            getAllRelievers: function(site){
                return $http.get('api/employee/relievers?siteId='+site).then(function (response) {
                    console.log(response);
                    return response.data;
                })
            },

            exportAllData: function(searchCriteria) {
                return $http.post('api/employee/export', searchCriteria).then(function (response) {

                    console.log("Emp - Export------>"+JSON.stringify(response));
                    return response.data;
                });
            },
            exportStatus: function(fileName) {
                return $http.get('api/employee/export/'+fileName+"/status").then(function (response) {
                    return response.data;
                });
            },

            getExportFile: function(fileName) {
                return $http.get('api/employee/export/'+fileName).then(function (response) {
                    return response.data;
                });
            },

            assignReliever: function (relieverDetails) {

                return $http.post('api/employee/assignReliever',relieverDetails).then(function (response) {
                    return response.data;
                })
            },

            getRelievers: function (emp) {
                return $http.post('api/employee/relievers',emp).then(function (response) {
                    return response.data;
                })
            },

            deleteJobsAndTransferEmployee: function(employee, fromDate){
                var data = {
                    employeeId:employee.id,
                    employeeEmpId:employee.empId,
                    relievedFromDate: fromDate
                };

                return $http.post('api/employee/deleteJobsAndTransfer',data).then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            },

            deleteJobsAndMarkEmployeeLeft: function(employee, fromDate){
                var data ={
                    employeeId:employee.id,
                    employeeEmpId:employee.empId,
                    relievedFromDate: fromDate
                };
                return $http.post('api/employee/deleteJobsAndMarkLeft',data).then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            },

            assignJobsAndTransferEmployee: function (employee, reliever,fromDate) {
                var data = {
                    employeeId:employee.id,
                    employeeEmpId:employee.empId,
                    relieverEmpId:reliever.empId,
                    relieverId:reliever.id,
                    relievedFromDate:fromDate,
                }
                return $http.post('api/employee/assignJobsAndTransfer',data).then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            },

            findAllDesginations: function () {
                return $http.get('api/designation').then(function (response) {
                    console.log("Designation");
                    console.log(response);
                    return response.data;
                })
            },

            createDesignation: function (designation) {
                return $http.post('api/designation',designation).then(function (response) {
                    console.log("Added Designation");
                    console.log(response.data);
                })
            },
            importEmployeeFile: function(file) {
                var fileFormData = new FormData();
                fileFormData.append('employeeFile', file);
                return $http.post('api/employee/import', fileFormData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}

                }).then(function (response) {
                    return response.data;
                });

            },
            importEmployeeStatus: function(fileName) {
                return $http.get('api/employee/import/'+fileName+"/status").then(function (response) {
                    return response.data;
                });
            },
            importEmployeeShiftFile: function(file) {
                var fileFormData = new FormData();
                fileFormData.append('employeeShiftFile', file);
                return $http.post('api/employee/shift/import', fileFormData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}

                }).then(function (response) {
                    return response.data;
                });

            },
            importEmployeeShiftStatus: function(fileName) {
                return $http.get('api/employee/shift/importstatus/'+fileName+"/status").then(function (response) {
                    return response.data;
                });
            }

        };
    });
