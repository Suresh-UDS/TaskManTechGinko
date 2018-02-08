'use strict';

angular.module('timeSheetApp')
    .controller('EmployeeController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent, EmployeeComponent, $http,$stateParams,$location) {
        $scope.success = null;
        $scope.error = null;
        $scope.errorMessage = null;
        $scope.doNotMatch = null;
        $scope.errorEmployeeExists = null;

        $scope.employeeDesignations = ["MD","Operations Manger","Supervisor"]

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedEmployee;

        $scope.selectedProject;

        $scope.selectedSite;

        $scope.existingEmployee;

        $scope.selectedManager;

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };

        $scope.projectSiteList = [];

        $scope.addProjectSite = function() {
	        	console.log('selected project -' + $scope.selectedProject.name);
	        	console.log('selected site -' + $scope.selectedSite.name);
	        	var projSite = {
	        		"projectId" : $scope.selectedProject.id,
	        		"projectName" : $scope.selectedProject.name,
	        		"siteId" : $scope.selectedSite.id,
	        		"siteName" : $scope.selectedSite.name,
	        	}
	        	if($scope.employee) {
	        		projSite.employeeId = $scope.employee.id
	        		projSite.employeeName = $scope.employee.name
	        	}
	        	$scope.projectSiteList.push(projSite);
	        	console.log('project site list -' + $scope.projectSiteList)
        };

        $scope.removeProjectSite = function(ind) {
        		$scope.projectSiteList.splice(ind,1);
        };


        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
        	    console.log("Loading all projects")
                $scope.projects = data;
            });
        };

        $scope.loadSites = function () {
        	if($scope.selectedProject) {
            	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                    $scope.sites = data;
                });
        	}else {
            	SiteComponent.findAll().then(function (data) {
                    $scope.sites = data;
                });
        	}
        };

        $scope.loadAllEmployees = function () {
        	if(!$scope.allEmployees) {
            	EmployeeComponent.findAll().then(function (data) {
            	console.log(data)
            		$scope.allEmployees = data;
            	})
        	}
        };

        $scope.loadAllManagers = function () {
        	if(!$scope.allManagers) {
        		if($scope.employee && $scope.employee.id) {
                	EmployeeComponent.findAllManagers($scope.employee.id).then(function (data) {
                    	console.log(data)
                    		$scope.allManagers = data;
                    	})
        		}else {
                	EmployeeComponent.findAll().then(function (data) {
                    	console.log(data)
                    	$scope.allManagers = data;
                	})
        		}
        	}
        }



        $scope.loadEmployees = function () {
//        	if($rootScope.searchCriteriaEmployees) {
//        		$scope.search();
//        	}else {
//            	EmployeeComponent.findAll().then(function (data) {
//                    $scope.employees = data;
//                });
//        	}
            $scope.search();
        };

        $scope.confirmSave = function() {
        	$scope.saveConfirmed = true;
        	$scope.saveEmployee();
        }

        $scope.saveEmployee = function () {
        	$scope.error = null;
        	$scope.success = null;
        	$scope.errorEmployeeExists = null;
        	$scope.errorProject = null;
        	$scope.errorSite = null;
        	$scope.errorManager = null;
            console.log($scope.selectedManager)
            /*
        	if(!$scope.selectedProject.id){
        		$scope.errorProject = "true";
        	}else if(!$scope.selectedSite.id){
        		$scope.errorSite = "true";
        		$scope.errorProject = null;
        	}else
        	*/
//        	if($scope.selectedManager && !$scope.selectedManager.id){
//                $scope.errorManager = "true";
//                $scope.errorSite = null;
//            }else {
        		var saveEmployee = false;
        		console.log('exployee exists -'+$scope.existingEmployee);
                if($scope.existingEmployee && !$scope.saveConfirmed) {
                	console.log('exployee exists -'+$scope.existingEmployee.active);
                	if($scope.existingEmployee.active == 'N'){
                		//var empActivateConfirm = document.getElementById('activateEmployeeModal');
                		//console.log('empActivateConfirm -'+empActivateConfirm);
                		//empActivateConfirm.show();
                		console.log($('#deleteModal'));
                		angular.element('#deleteModal').modal('show');
                	}else {
                		saveEmployee = true;
                	}
                }else {
                	saveEmployee = true;
                }
                if(saveEmployee) {
                	if($scope.selectedProject) {
                		$scope.employee.projectId = $scope.selectedProject.id;
                	}
                	if($scope.selectedSite) {
                    	$scope.employee.siteId = $scope.selectedSite.id;
                	}
                	if($scope.selectedManager) {
                		$scope.employee.managerId = $scope.selectedManager.id;
                	}
                	if($scope.projectSiteList) {
                		$scope.employee.projectSites = $scope.projectSiteList;
                	}
                	EmployeeComponent.createEmployee($scope.employee).then(function () {
                    	$scope.success = 'OK';
                    	$scope.selectedProject = {};
                    	$scope.selectedSite = {};
                    	$scope.loadEmployees();
                        $scope.showNotifications('top','center','success','Employee Created Successfully');
                    	$location.path('/employees');
                    }).catch(function (response) {
                        $scope.success = null;
                        console.log('Error - '+ JSON.stringify(response.data));
                        if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                            $scope.errorEmployeeExists = true;
                            $scope.errorMessage = response.data.description;
                            $scope.showNotifications('top','center','danger', $scope.errorMessage);
                        } else {
                            $scope.error = 'ERROR';
                        }
                    });
                }

        	//}
        	$scope.saveConfirmed = false;
        };

        $scope.cancelEmployee = function () {
        	$location.path('/employees');
        };

       $scope.refreshPage = function() {
           $scope.clearFilter();
           $scope.loadEmployees();
       };

       $scope.employeeDetails= function(id){
           EmployeeComponent.findOne(id).then(function (data) {
                console.log(data);
                $scope.employee = data;
           })
       };

       $scope.updateEmployeeLeft= function(employee){
           console.log(employee);
           employee.left = true;
          EmployeeComponent.updateEmployee(employee).then(function(data){
              $scope.showNotifications('top','center','success','Employee Successfully Marked Left');
              $scope.search();
          }).catch(function(response){
              console.log(response);
              $scope.showNotifications('top','center','danger','Error in marking Left');
          })
        };



        $scope.loadEmployeeHistory = function () {
        	EmployeeComponent.findHistory($stateParams.id).then(function (data) {
                $scope.employeeHistory = data;
            });
        };


        $scope.loadEmployee = function() {
        	EmployeeComponent.findOne($stateParams.id).then(function (data) {
                $scope.employee = data;
                $scope.projectSiteList = $scope.employee.projectSites;
                $scope.employee.code = pad($scope.employee.code , 4);
                $scope.loadSelectedProject($scope.employee.projectId);
                $scope.loadSelectedSite($scope.employee.siteId);
                $scope.loadSelectedManager($scope.employee.managerId);
                console.log($scope.employee.sites);
                $scope.sites = $scope.employee.sites;
            });

        };

        $scope.getEmployeeDetails = function(id) {
            EmployeeComponent.findOne(id).then(function (data) {
                $scope.employee = data;
                $scope.projectSiteList = $scope.employee.projectSites;
                $scope.employee.code = pad($scope.employee.code , 4);
                $scope.loadSelectedProject($scope.employee.projectId);
                $scope.loadSelectedSite($scope.employee.siteId);
                $scope.loadSelectedManager($scope.employee.managerId);
                console.log($scope.employee.sites);
                $scope.sites = $scope.employee.sites;
            });
        };

        $scope.getEmployeeByEmpId = function() {
        	var empIdEle = document.getElementById('employeeEmpId');
        	console.log(empIdEle.value);
        	EmployeeComponent.findDuplicate(empIdEle.value).then(function (data) {
                $scope.existingEmployee = data;
                console.log('Existing employee found ' + JSON.stringify($scope.existingEmployee));
                if($scope.existingEmployee) {
                	if($scope.existingEmployee.active == 'N'){

                	}
                }
                //$scope.employee.code = pad($scope.employee.code , 4);
                //$scope.loadSelectedProject($scope.employee.projectId);
                //$scope.loadSelectedSite($scope.employee.siteId);
            });
        };

        $scope.loadSelectedProject = function(projectId) {
        	ProjectComponent.findOne(projectId).then(function (data) {
                $scope.selectedProject = data;
            });
        };

        $scope.loadSelectedSite = function(siteId) {
        	SiteComponent.findOne(siteId).then(function (data) {
                $scope.selectedSite = data;
            });

        };

        $scope.loadSelectedManager = function(managerId) {
        	EmployeeComponent.findOne(managerId).then(function (data) {
                $scope.selectedManager = data;
            });
        };


        $scope.deleteSite = function(empId,siteId,projectId) {
        	var employeeSites;
        	EmployeeComponent.deleteEmployeeSite(empId,siteId).then(function(response){
	        	$scope.success = 'OK';
	        	employeeSites = response.data;
	        	console.log('delete employee site repsonse - ' + response.data);
	        	$scope.showNotifications('top','center','success','Employee Successfully deleted');
	        	$location.path('/employees');
        	}).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
                $scope.errorMessage = response.data.description;
                $scope.error = 'ERROR';
                $scope.showNotifications('top','center','danger',$scope.errorMessage);

            });
        	if(!employeeSites && employeeSites.length > 0) {
            	EmployeeComponent.deleteEmployeeProject(empId,projectId).then(function(){
    	        	$scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Employee Successfully deleted');
                    $location.path('/employees');
            	}).catch(function (response) {
                    $scope.success = null;
                    console.log('Error - '+ response.data);
                    $scope.errorMessage = response.data.description;
                    $scope.error = 'ERROR';
                    $scope.showNotifications('top','center','danger',$scope.errorMessage);
                });
        	}
        };



        $scope.updateEmployee = function () {
        	$scope.error = null;
        	$scope.success =null;
        	$scope.errorEmployeeExists = null;
        	$scope.errorProject = null;
        	$scope.errorSite = null;
        	/*
        	if(!$scope.selectedProject.id){
        		$scope.errorProject = "true";
        	}else if(!$scope.selectedSite.id){
        		$scope.errorSite = "true";
        		$scope.errorProject = null;
        	}else
        	*/
        	if(!$scope.selectedManager.id){
                             $scope.errorManager = "true";
                             $scope.errorSite = null;
            }else {
	        	$scope.employee.projectId = $scope.selectedProject.id;
	        	$scope.employee.siteId = $scope.selectedSite.id;
	        	$scope.employee.managerId = $scope.selectedManager.id;
            	if($scope.projectSiteList) {
            		$scope.employee.projectSites = $scope.projectSiteList;
            	}

	        	EmployeeComponent.updateEmployee($scope.employee).then(function(){
		        	$scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Employee Successfully Updated');

                    $location.path('/employees');
	        	}).catch(function (response) {
                    $scope.success = null;
                    console.log('Error - '+ response.data);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.errorEmployeeExists = true;
                        $scope.errorMessage = response.data.description;
                        $scope.showNotifications('top','center','danger',$scope.errorMessage);
                    } else {
                        $scope.error = 'ERROR';
                        $scope.showNotifications('top','center','danger','Unable to Update employee, Please try again later..');
                    }
                });
        	}
        };

        $scope.deleteConfirm = function (employee){
        	$scope.confirmEmployee = employee;
        }

        $scope.deleteEmployee = function (employee) {
        	console.log(employee)
        	$scope.employee = employee;
        	console.log($scope.employee);
        	EmployeeComponent.deleteEmployee($scope.confirmEmployee);
        	$scope.success = 'OK';
        	$state.reload();
        };



        $scope.search = function () {
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        	if(!$scope.searchCriteria) {
            	var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;
        	}
    		console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaEmployees));
    		console.log('criteria in scope -'+JSON.stringify($scope.searchCriteria));

        	console.log('Selected  project -' + $scope.selectedEmployee + ", " + $scope.selectedProject +" , "+ $scope.selectedSite);

        	if(!$scope.selectedEmployee && !$scope.selectedSite && !$scope.selectedProject) {
        		console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaEmployees));
        		if($rootScope.searchCriteriaEmployees) {
            		$scope.searchCriteria = $rootScope.searchCriteriaEmployees;
        		}else{
        		        $scope.searchCriteria.findAll = true;
        		}

        	}else if($scope.selectedEmployee || $scope.selectedSite || $scope.selectedProject) {

        		if($scope.selectedEmployee)
	        	{
	        		$scope.searchCriteria.employeeEmpId = $scope.selectedEmployee.empId;
		        	$scope.searchCriteria.name = $scope.selectedEmployee.name;
		        	$scope.searchCriteria.fullName = $scope.selectedEmployee.fullName;
		        	$scope.searchCriteria.employeeId = $scope.selectedEmployee.id;
		        	console.log('selected emp id ='+ $scope.searchCriteria.employeeEmpId);
	        	}else {
	        		$scope.searchCriteria.employeeEmpId = '';
	        		$scope.searchCriteria.name = '';
	        		$scope.searchCriteria.fullName = '';
	        		$scope.searchCriteria.employeeId = 0;
	        	}

	        	if($scope.selectedSite) {
		        	$scope.searchCriteria.siteId = $scope.selectedSite.id;
		        	$scope.searchCriteria.siteName = $scope.selectedSite.name;
		        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
	        	}else {
	        		$scope.searchCriteria.siteId = 0;
	        	}

	        	if($scope.selectedProject) {
		        	$scope.searchCriteria.projectId = $scope.selectedProject.id;
		        	$scope.searchCriteria.projectName = $scope.selectedProject.name;
		        	console.log('selected project id ='+ $scope.searchCriteria.projectId);
	        	}else {
	        		$scope.searchCriteria.projectId = 0;
	        	}
        	}
        	$scope.searchCriteria.currPage = currPageVal;
        	console.log(JSON.stringify($scope.searchCriteria));


        	EmployeeComponent.search($scope.searchCriteria).then(function (data) {
                $scope.employees = data.transactions;

                console.log('Employee search result list -' + $scope.employees);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.employees == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaEmployees = $scope.searchCriteria;
    		console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaEmployees));
            if($scope.pages.currPage == 1) {
                        	$scope.firstStyle();
                    	}
        };

        $scope.checkIn = function(siteId,employeeEmpId,id){
            EmployeeComponent.getAttendance(id).then(function(data) {
                console.log("Attendance Data");
                console.log(data);
                if (data[0]) {
                    console.log("Already checked in");
                    $('#noticeModal').modal('hide');
                    var msg = 'Attendance already marked ' + data[0].employeeFullName + ' at site ' + data[0].siteName;
                    $scope.showNotifications('top', 'center', 'warning', msg);
                } else {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            $scope.$apply(function () {
                                console.log("Location available")
                                console.log(position);
                                $scope.position = position;
                                var checkInData = {};
                                checkInData.siteId = siteId;
                                checkInData.employeeEmpId = employeeEmpId;
                                checkInData.latitudeIn = position.coords.latitude;
                                checkInData.longitudeIn = position.coords.longitude;
                                EmployeeComponent.checkIn(checkInData).then(function (data) {
                                    console.log("attendance marked");
                                    console.log(data)
                                    var msg = 'Attendance marked for ' + data.employeeFullName + ' at site ' + data.siteName;
                                    $scope.showNotifications('top', 'center', 'success', msg)
                                    $location.path('/employees');
                                })
                            });
                        });
                    } else {
                        console.log("Location not available")
                        var checkInData = {};
                        checkInData.siteId = siteId;
                        checkInData.employeeEmpId = employeeEmpId
                        EmployeeComponent.checkIn(checkInData).then(function (data) {
                            console.log("attendance marked");
                        })
                    }
                }

            });
            // EmployeeComponent.getSites(employeeId).then(function (data) {
            //     console.log(data)
            // })
        };


        $scope.checkOut = function(siteId,employeeEmpId,id){
            EmployeeComponent.getAttendance(id).then(function(data) {
                console.log("Attendance Data");
                if (data[0]) {
                    console.log("Already checked in");

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            $scope.$apply(function () {
                                console.log("Location available")
                                console.log(position);
                                $scope.position = position;
                                var checkOutData = {};
                                checkOutData.siteId = siteId;
                                checkOutData.employeeEmpId = employeeEmpId;
                                checkOutData.latitudeOut = position.coords.latitude;
                                checkOutData.longitudeOut = position.coords.longitude;
                                checkOutData.id = data[0].id;
                                EmployeeComponent.checkOut(checkOutData).then(function (data) {
                                    console.log("attendance marked");
                                    console.log(data)
                                    var msg = 'Attendance marked for ' + data.employeeFullName + ' at site ' + data.siteName;
                                    $scope.showNotifications('top', 'center', 'success', msg)
                                    $location.path('/employees');
                                })
                            });
                        });
                    } else {
                        console.log("Location not available")
                        var checkOutData = {};
                        checkOutData.siteId = siteId;
                        checkOutData.employeeEmpId = employeeEmpId;
                        checkOutData.attendanceId = data[0].id;
                        EmployeeComponent.checkOut(checkOutData).then(function (data) {
                            console.log("attendance marked");
                            console.log(data)
                            var msg = 'Attendance marked for ' + data.employeeFullName + ' at site ' + data.siteName;
                            $scope.showNotifications('top', 'center', 'success', msg)
                            $location.path('/employees');
                        })
                    }
                } else {
                    $('#noticeModal').modal('hide');
                    var msg = 'No Attendance marked ' + data.employeeFullName + ' at site ' + data.siteName;
                    $scope.showNotifications('top', 'center', 'warning', msg)
                }
            });
        };


        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

        $scope.getCheckInDetails = function(id){
            EmployeeComponent.getAttendance(id).then(function(data){
                console.log("Attendance Data");
                if(data[0]){
                    console.log("Already checked in");
                }else{
                    console.log("Not yet checked in ");
                    EmployeeComponent.getSites(id).then(function (data) {
                        console.log(data)
                        $scope.employeeSites = data;

                    })
                }
            })
        };






        $scope.first = function() {
        	if($scope.pages.currPage > 1) {
            	$scope.pages.currPage = 1;
            	$scope.firstStyle();
            	$scope.search();
        	}
        };

        $scope.first = function() {
            if($scope.pages.currPage > 1) {
                $scope.pages.currPage = 1;
                $scope.firstStyle();
                $scope.search();
            }
        };

        $scope.firstStyle = function() {
            var first = document.getElementById('#first');
            var ele = angular.element(first);
            ele.addClass('disabledLink');
            var previous = document.getElementById('#previous');
            ele = angular.element(previous);
            ele.addClass('disabledLink');
            if($scope.pages.totalPages > 1) {
                var nextSitePage = document.getElementById('#next');
                var ele = angular.element(next);
                ele.removeClass('disabledLink');
                var lastSitePage = document.getElementById('#lastSitePage');
                ele = angular.element(lastSitePage);
                ele.removeClass('disabledLink');
            }

        }

        $scope.previous = function() {
            console.log("Calling previous")

            if($scope.pages.currPage > 1) {
                $scope.pages.currPage = $scope.pages.currPage - 1;
                if($scope.pages.currPage == 1) {
                    var first = document.getElementById('#first');
                    var ele = angular.element(first);
                    ele.addClass('disabled');
                    var previous = document.getElementById('#previous');
                    ele = angular.element(previous);
                    ele.addClass('disabled');
                }
                var next = document.getElementById('#next');
                var ele = angular.element(next);
                ele.removeClass('disabled');
                var lastSitePage = document.getElementById('#last');
                ele = angular.element(last);
                ele.removeClass('disabled');
                $scope.search();
            }

        };

        $scope.next = function() {
            console.log("Calling next")

            if($scope.pages.currPage < $scope.pages.totalPages) {
                $scope.pages.currPage = $scope.pages.currPage + 1;
                if($scope.pages.currPage == $scope.pages.totalPages) {
                    var next = document.getElementById('#next');
                    var ele = angular.element(next);
                    ele.addClass('disabled');
                    var last = document.getElementById('#last');
                    ele = angular.element(last);
                    ele.addClass('disabled');
                }
                var first = document.getElementById('#first')
                var ele = angular.element(first);
                ele.removeClass('disabled');
                var previous = document.getElementById('#previous')
                ele = angular.element(previous);
                ele.removeClass('disabled');
                $scope.search();
            }

        };

        $scope.last = function() {
            console.log("Calling last")
            if($scope.pages.currPage < $scope.pages.totalPages) {
                $scope.pages.currPage = $scope.pages.totalPages;
                if($scope.pages.currPage == $scope.pages.totalPages) {
                    var next = document.getElementById('#next');
                    var ele = angular.element(next);
                    ele.addClass('disabled');
                    var last = document.getElementById('#last');
                    ele = angular.element(last);
                    ele.addClass('disabled');
                }
                var first = document.getElementById('#first');
                var ele = angular.element(first);
                ele.removeClass('disabled');
                var previous = document.getElementById('#previous');
                ele = angular.element(previous);
                ele.removeClass('disabled');
                $scope.search();
            }

        };

        $scope.clearFilter = function() {
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaSite = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
        };

        function pad(num, size) {
            var s = num+"";
            while (s.length < size) s = "0" + s;
            return s;
        }

        $scope.loadQRCode = function(empId, qrCodeImage) {
        	if(empId) {
        		console.log("QR Code image - "+ qrCodeImage);
            	var uri = '/api/employee/' + empId +'/qrcode';
            	var eleId = 'qrCodeImage';
            	console.log('image element id -' + eleId);
                $http.get(uri).then(function (response) {
                    var ele = document.getElementById(eleId);
                    console.log('qrcode response - ' + response.data);
                	//ele.setAttribute('src',response.data);
                    $('.modal-body img').attr('src',response.data);
                }, function(response) {
                    var ele = document.getElementById('qrCodeImage');
                	ele.setAttribute('src',"//placehold.it/250x250");
                });
        	}else {
                var ele = document.getElementById('qrCodeImage');
            	ele.setAttribute('src',"//placehold.it/250x250");
        	}
        };

        $scope.loadEnrolledImage = function( image) {
            var eleId = 'enrolledImage';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',image);

        };

        $scope.approveImage = function(employee){
            EmployeeComponent.approveImage(employee).then(function(response){

                if(response.status == 200){
                    console.log("Image Approved");
                    $scope.showNotifications('top','center','success','Face Id Approved');
                }else{
                    $scope.showNotifications('top','center','warning','Failed to approve Face Id');
                    console.log("Failed to approve image");
                }
                $scope.search();
            })
        }

        $scope.initCalender();



    });
