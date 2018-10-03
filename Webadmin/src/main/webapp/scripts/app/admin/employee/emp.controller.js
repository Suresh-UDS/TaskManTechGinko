'use strict';

angular.module('timeSheetApp')
    .controller('EmployeeController', function ($rootScope,$window, $scope, $state,
     $timeout, ProjectComponent, SiteComponent, EmployeeComponent,LocationComponent,
      UserRoleComponent, $http,$stateParams,$location,PaginationComponent,$filter,$interval,getLocalStorage) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.errorMessage = null;
        $scope.doNotMatch = null;
        $scope.errorEmployeeExists = null;
        $scope.pager = {};
        $scope.noData = false;
        $scope.projectSitesCnt = 0;
        $scope.btnDisable = false;
        $scope.relieversList = [];

        $scope.markLeftOptions = 'delete';

        // $scope.employeeDesignations=null;

        //$timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.searchCriteria = {};

        $scope.selectedEmployee;

        $scope.selectedEmployeeId;

        $scope.selectedEmployeeName;

        $scope.selectedProject = null;

        $scope.selectedSite = null;

        $scope.existingEmployee;

        $scope.selectedManager;

        $scope.selectedReliever ={};

        $scope.relievedEmployee = {};

        $scope.isReliever;

        $scope.relievers;

        $scope.relieverDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');

        $scope.relieverDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');

        $scope.relieverDateFromSer = new Date();

        $scope.relieverDateToSer = new Date();

        $scope.designation;

        $scope.loading = false;

        $scope.notLoading = true;

        $scope.userRoles;

        $scope.selectedRole;

        $scope.SelectedDesig = {};

        $scope.selectedStartDateTime = null;

        $scope.selectedEndDateTime = null;

        $scope.selectedShiftDateTime = null;

        $scope.searchProject = null;

        $scope.searchSite = null;

        $scope.searchEmployeeId = null;

        $scope.searchEmployeeName = null ;

        $scope.pageSort = 10;

        $scope.selectedDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.selectedDateSer = new Date();

        $scope.modifiedEmpShifts = [];

        $scope.modified = false;

       /* var absUrl = $location.absUrl();
        var array = absUrl.split("/");*/

        $scope.curUrl = $state.current.name;

        $rootScope.exportStatusObj  ={};

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        }

        $scope.initCalender();

         $('#dateFilterFrom').datetimepicker().on('dp.show', function () {
            return $(this).data('DateTimePicker').minDate(new Date());
         });
         $('#dateFilterTo').datetimepicker().on('dp.show', function () {
             return $(this).data('DateTimePicker').minDate(new Date());
          });

        $('#dateFilterFrom').on('dp.change', function(e){
            //console.log(e.date);
            $scope.relieverDateTo = null;
            $scope.relieverDateToSer = null;
            $scope.relieverDateFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.relieverDateFromSer = new Date(e.date._d);
            $('#dateFilterTo').datetimepicker().on('dp.show', function () {
                return $(this).data('DateTimePicker').minDate($scope.relieverDateFromSer);
             });
        });

        $('#dateFilterTo').on('dp.change', function(e){
            //console.log(e.date);
            $scope.relieverDateTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.relieverDateToSer = new Date(e.date._d);
        });

        $('#selectedDate').on('dp.change', function(e){
            //console.log(e.date);
            $scope.selectedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.selectedDateSer = new Date(e.date._d);
        });

        $('#searchDate').on('dp.change', function(e){
            //console.log(e.date);
            $scope.searchDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.searchDateSer = new Date(e.date._d);
        });

        $scope.projectSiteList = [];

        $scope.conform = function(text)
        {
            console.log($scope.selectedProject)
            $rootScope.conformText = text;
            $('#conformationModal').modal();

        }
        $rootScope.back = function (text) {
            if(text == 'cancel' || text == 'back'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.cancelEmployee();
            }else if(text == 'save'){
                $scope.saveEmployee();
            }else if(text == 'update'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updateEmployee()
            }
        };


        // Filter //

        $scope.siteSpin = false;

        //

        $scope.empLocation = false;
        $scope.addProjectSite = function() {

            if($scope.selectedProject && $scope.selectedSite){

                console.log('selected project -' , $scope.selectedProject.name);
                console.log('selected site -' , $scope.selectedSite.name);

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

                function isProject(project) {
                    return project.projectId === projSite.projectId;
                }
                function isSite(site) {
                    return site.siteId === projSite.siteId;
                }

                //console.log('project>>>>', $scope.projectSiteList.find(isProject));
                //console.log('site>>>>', $scope.projectSiteList.find(isSite));

                $scope.dupProject = $scope.projectSiteList.find(isProject);
                $scope.dupSite = $scope.projectSiteList.find(isSite);

                if(($scope.dupProject && $scope.dupSite)){

                   return;
                }

	        	$scope.projectSiteList.push(projSite);
	        	console.log('project site list -' , $scope.projectSiteList);
                if($scope.projectSiteList.length > 0) {
                    $scope.empLocation = false;
                }
            }else{
                return;
            }
        };

        $scope.initAdd = function(){
           $scope.empLocation = true;
        }


        $scope.removeProjectSite = function(ind) {
        		$scope.projectSiteList.splice(ind,1);
                //alert($scope.projectSiteList.length);

        		if($scope.projectSiteList.length == 0) {
        			//document.getElementById("form-button-save").disabled = true;
                    $scope.empLocation = true;

        		}
        };

        $scope.locationList = [];

        $scope.addLocation = function() {
            if($scope.selectedBlock){
	        	console.log('selected block -' + $scope.selectedBlock);
	        	console.log('selected floor -' + $scope.selectedFloor);
	        	console.log('selected zone -' + $scope.selectedZone);
	        	var loc = {
	        		"block" : $scope.selectedBlock,
	        		"floor" : $scope.selectedFloor,
	        		"zone" : $scope.selectedZone
	        	}
	        	if($scope.employee) {
	        		loc.projectId = $scope.selectedProject.id;
	        		loc.siteId = $scope.selectedSite.id;
	        		loc.employeeId = $scope.employee.id
	        		loc.employeeName = $scope.employee.name
	        	}

                function isBlock(block) {
                    return block.block === loc.block;
                }
                function isFloor(floor) {
                    return floor.floor === loc.floor;
                }
                function isZone(zone) {
                    return zone.zone === loc.zone;
                }

                $scope.dupBlock = $scope.locationList.find(isBlock);
                $scope.dupFloor = $scope.locationList.find(isFloor);
                $scope.dupZone = $scope.locationList.find(isZone);

                if(($scope.dupBlock && $scope.dupFloor && $scope.dupZone)){

                   return;
                }

	        	$scope.locationList.push(loc);
	        	console.log('loc list -' + $scope.locationList)
            }else{
                return;
            }
        };

        $scope.removeLocation = function(ind) {
        		$scope.locationList.splice(ind,1);
        };

        $scope.initAddEdit = function() {
        		$scope.loadAllManagers();
        		$scope.loadProjects();
        		$scope.loadDesignations();
        }



        // Load Clients for selectbox //

        $scope.filter = false;
        $scope.clienteDisable = true;
        $scope.clientFilterDisable = true;
        $scope.uiClient = [];
        $scope.getClient = function (search) {
            var newSupes = $scope.uiClient.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }
        //

        // Load Sites for selectbox //
        $scope.siteFilterDisable = true;
        $scope.siteDisable = true;
        $scope.uiSite = [];
        $scope.getSite = function (search) {

            var newSupes = $scope.uiSite.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }

        //

        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
        	    console.log("Loading all projects")
                $scope.projects = data;

                for(var i=0;i<$scope.projects.length;i++)
                {
                    $scope.uiClient[i] = $scope.projects[i].name;
                }
                $scope.clientDisable = false;
                $scope.clientFilterDisable = false;

            });
        };

        $scope.loadDepSites = function (searchProject) {
             if(searchProject){
                $scope.clearField = false;
                $scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]

                $scope.siteSpin = true;
                $scope.hideSite = false;
                $scope.siteFilterDisable = true;
                if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                    var depProj=$scope.selectedProject.id;
                }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
                }else{
                    var depProj=0;
                }
                $scope.uiSite.splice(0,$scope.uiSite.length);
                ProjectComponent.findSites(depProj).then(function (data) {
                    $scope.searchSite = null;
                    $scope.sites = data;
                    console.log("==================");
                    console.log($scope.sites)
                    for(var i=0;i<$scope.sites.length;i++)
                    {
                        $scope.uiSite[i] = $scope.sites[i].name;
                    }
                    $scope.siteDisable = false;
                    $scope.siteSpin = false;
                    $scope.siteFilterDisable = false;
                });

             }

        };

        $scope.loadSearchSite = function (searchSite) {
            if(searchSite){
              $scope.hideSite = true;
              $scope.searchSite = $scope.sites[$scope.uiSite.indexOf(searchSite)]
              console.log($scope.searchSite)
            }
        }

        $scope.loadSelectedProject = function(projectId) {
            ProjectComponent.findOne(projectId).then(function (data) {
                $scope.selectedProject = data;

            });
        };

        $scope.loadBlocks = function () {
	    		console.log('selected project -' + ($scope.selectedProject ? $scope.selectedProject.id : 0) + ', site -' + ($scope.selectedSite ? $scope.selectedSite.id : 0))
                var projectId = jQuery.isEmptyObject($scope.selectedProject) ? 0 : $scope.selectedProject.id;
	    		var siteId = jQuery.isEmptyObject($scope.selectedSite) ? 0 : $scope.selectedSite.id;
	    		LocationComponent.findBlocks(projectId,siteId).then(function (data) {
                    $scope.selectedBlock = null;
                    $scope.selectedFloor = null;
                    $scope.selectedZone = null;
	            $scope.blocks = data;
	        });
	    };


	    $scope.loadFloors = function () {
	    		var projectId = jQuery.isEmptyObject($scope.selectedProject) ? 0 : $scope.selectedProject.id;
                var siteId = jQuery.isEmptyObject($scope.selectedSite) ? 0 : $scope.selectedSite.id;
	    		LocationComponent.findFloors(projectId,siteId,$scope.selectedBlock).then(function (data) {
	    			$scope.selectedFloor = null;
                    $scope.selectedZone = null;
	            $scope.floors = data;
	        });
	    };

	    $scope.loadZones = function () {
	    		console.log('load zones - ' + $scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
	    		var projectId = jQuery.isEmptyObject($scope.selectedProject) ? 0 : $scope.selectedProject.id;
                var siteId = jQuery.isEmptyObject($scope.selectedSite) ? 0 : $scope.selectedSite.id;
	    		LocationComponent.findZones(projectId,siteId,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
	    			$scope.selectedZone = null;
	            $scope.zones = data;
	        });
	    };

        $scope.loadUserRoles = function () {
        		UserRoleComponent.findAll().then(function (data) {
                $scope.userRoles = data;
            });
        };


        $scope.searchProjects = function(value){
            var projectName = {
                name: value
            }
          ProjectComponent.searchProject().then(function (data) {
              $scope.projects = data;
          })
        };

        $scope.showLoader = function(){
            console.log("Show Loader");
            $scope.loading = true;
            $scope.notLoading=false;
        };

        $scope.hideLoader = function(){
            console.log("Show Loader");
            $scope.loading = false;
            $scope.notLoading=true;
        };

        $scope.getSites= function (value) {
            var searchData = {
                name:value
            }
            SiteComponent.getSites(searchData).then(function (data) {
                console.log(data);
                $scope.sites = data;
            })
        }

        $scope.loadDesignations = function () {

            //console.log("Loading all designations")
            EmployeeComponent.findAllDesginations().then(function (data) {
                $scope.designations = data;
                console.log("Loading all Designations" ,$scope.designations);
            })
        }

        $scope.loadSites = function () {
            $scope.showLoader();
        	console.log('selected project - ' + JSON.stringify($scope.selectedProject));
        	if($scope.selectedProject) {
            	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                    $scope.sites = data;
                    $scope.hideLoader();


                });
        	}
            else if($scope.searchProject) {
                ProjectComponent.findSites($scope.searchProject.id).then(function (data) {
                    $scope.sites = data;
                    $scope.hideLoader();


                });
            }
        	else {
            	SiteComponent.findAll().then(function (data) {
                    $scope.sites = data;
                    $scope.hideLoader();

                });
        	}


        };



        $scope.loadAllEmployees = function () {
        	if(!$scope.allEmployees) {
            	EmployeeComponent.findAll().then(function (data) {
            	console.log(data);
            		$scope.allEmployees = data;
            	});
        	}
        };

        $scope.loadAllManagers = function () {
            $scope.showLoader();
        	if(!$scope.allManagers) {
        		if($scope.employee && $scope.employee.id) {
                	EmployeeComponent.findAllManagers($scope.employee.id).then(function (data) {
                	    console.log("Managers");
                    	console.log(data);
                    		$scope.allManagers = data;
                    		$scope.hideLoader();
                    	})
        		}else {
                	EmployeeComponent.findAll().then(function (data) {
                    	console.log(data)
                    	$scope.allManagers = data;
                        $scope.hideLoader();

                    })
        		}
        	}
        };

//        $scope.init() {
//        		$scope.loadEmployees();
//        		$scope.loadProjects();
//        		$scope.loadSites();
//        		$scope.loadAllEmployees();
//        };

        $scope.siteTransferDetails = function(employee){
            console.log(employee)
            $scope.transferEmployeeDetails =employee;
            $scope.transferSite;
            $scope.transferEmployeeOptions;
            $scope.transferringEmployee;
            $scope.relievingEmployee;

        };

        $scope.updateNewEmployee = function(employee){
            console.log("Selected employee");
            console.log(employee);
        }

        $scope.updateSelectedSite = function(site){
          console.log(site);
        };

        $scope.transferEmployee= function(employee,reliever){
            console.log(employee);
            console.log($scope.transferSite);
            console.log($scope.transferEmployeeOptions);
            console.log($scope.transferringEmployee);
            console.log(reliever);
            var projSite = {
                "projectId" : $scope.transferSite.projectId,
                "projectName" : $scope.transferSite.projectName,
                "siteId" : $scope.transferSite.id,
                "siteName" : $scope.transferSite.name,
            };
                projSite.employeeId = employee.id;
                projSite.employeeName = employee.name;
            employee.projectSites.length=0;
            employee.projectSites.push(projSite);
            console.log('project site list -' );
            console.log(employee);

            if($scope.transferEmployeeOptions == 'delete'){
                console.log("Delete jobs and transfer employees");
                EmployeeComponent.deleteJobsAndTransferEmployee(employee,new Date())
            }else if($scope.transferringEmployee!=null){
                EmployeeComponent.assignJobsAndTransferEmployee(employee,$scope.transferringEmployee,new Date())
                console.log("Assign jobs to another employee and transfer this employee");
            }else{
                $window.alert("Please select and employee while assigning jobs to another employee");
            }
        };

        $scope.deleteAndTransfer= function(employee){

        };

        $scope.loadEmployees = function () {
            $scope.clearFilter();
            $scope.search();
        };

        $scope.loadEmployeesShift = function () {
            $scope.refreshPage();
            $scope.searchShiftFilter();
        };

        $scope.confirmSave = function() {
        	$scope.saveConfirmed = true;
        	$scope.saveEmployee();
        }

        $scope.addDesignation = function () {
            console.log($scope.designation);
            if($scope.designation){
                console.log("Designation entered");
                var designationDetails ={
                    designation:$scope.designation
                };
                EmployeeComponent.createDesignation(designationDetails).then(function (response) {
                    console.log(response);
                    $scope.designation= null;
                    $scope.showNotifications('top','center','success','Designation Added Successfully');
                    $scope.loadDesignations();

                })
            }else{
                console.log("Desgination not entered");
            }


        };
        $scope.saveEmployee = function () {
            $scope.saveLoad = true;
	        	$scope.error = null;
	        	$scope.success = null;
	        	$scope.errorEmployeeExists = null;
	        	$scope.errorProject = null;
	        	$scope.errorSite = null;
	        	$scope.errorManager = null;
	        	$scope.btnDisable = true;
            console.log($scope.selectedManager)

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
                	if($scope.selectedRole) {
                		$scope.employee.createUser = true;
                		$scope.employee.userRoleId = $scope.selectedRole.id;
                	}
                	if($scope.projectSiteList && $scope.projectSiteList.length > 0) {
                		$scope.employee.projectSites = $scope.projectSiteList;
                	}else {
                		$scope.showNotifications('top','center','danger','Client and Site are required');
                		return;
                	}
                	if($scope.locationList) {
                		$scope.employee.locations = $scope.locationList;
                	}
                	EmployeeComponent.createEmployee($scope.employee).then(function () {
                            $scope.saveLoad = false;
	                    	$scope.success = 'OK';
	                    	$scope.selectedProject = {};
	                    	$scope.selectedSite = {};
	                    	//$scope.loadEmployees();
	                        $scope.showNotifications('top','center','success','Employee Created Successfully');
	                    	$location.path('/employees');
                    }).catch(function (response) {
                        $scope.saveLoad = false;
                        $scope.success = null;
                        console.log('Error - '+ JSON.stringify(response.data));
                        if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                            $scope.errorEmployeeExists = true;
                            $scope.errorMessage = response.data.description;
                            $scope.showNotifications('top','center','danger', 'Employee already exists!.. Please choose another one');
                        } else {
                            $scope.error = 'ERROR';
                            $scope.showNotifications('top','center','danger', 'Employee Not Saved!.. Please try again later.');
                        }
                         $scope.btnDisable = false;
                    });
                }

        	//}
        	$scope.saveConfirmed = false;
        };

        $scope.cancelEmployee = function () {
        	$location.path('/employees');
        };

       $scope.refreshPage = function() {
        if($scope.curUrl =='employeeShifts'){
            $scope.noData = false;
            $scope.siteFilterDisable = true;
            $scope.sitesList = null;
            $scope.sites = null;
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.searchProject = null;
            $scope.searchSite = null;
            $scope.searchCriteria = {};
            $scope.clearField = true;
            $scope.selectedDate = null;
            $scope.selectedDateSer = null;
            $scope.searchCriteria = {};
            $scope.localStorage = null;
            $scope.clearField = true;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
                $scope.searchShift();

            }else{
                $scope.loadEmployees();
            }


       };

       $scope.employeeDetails= function(id){
           EmployeeComponent.findOne(id).then(function (data) {
                console.log(data);
                $scope.employee = data;
           })
       };

       $scope.updateEmployeeLeft= function(employee){
           console.log("Current Employee");
           console.log(employee);
           console.log("Transferring employee");
           console.log($scope.transferringEmployee);
           employee.left = true;

           console.log("Employee Left options");
           console.log($scope.markLeftOptions);

           if($scope.markLeftOptions == 'delete'){
               console.log("delete and mark left");
               EmployeeComponent.updateEmployee(employee).then(function(data){
                   EmployeeComponent.deleteJobsAndMarkEmployeeLeft(employee,new Date());
                   console.log("Delete jobs and transfer this employee");
                   $scope.showNotifications('top','center','success','Employee Successfully Marked Left');
                   $scope.search();
               }).catch(function(response){
                   console.log(response);
                   $scope.showNotifications('top','center','danger','Error in marking Left');
               })
           }else if ($scope.markLeftOptions == 'assign'){
               console.log("assign and mark left");
               EmployeeComponent.updateEmployee(employee).then(function(data){
                   EmployeeComponent.assignJobsAndTransferEmployee(employee,$scope.transferringEmployee,new Date())
                   console.log("Assign jobs to another employee and transfer this employee");
                   $scope.showNotifications('top','center','success','Employee Successfully Marked Left');
                   $scope.search();
               }).catch(function(response){
                   console.log(response);
                   $scope.showNotifications('top','center','danger','Error in marking Left');
               })
           }


        };



        $scope.loadEmployeeHistory = function () {
            var empId = parseInt($stateParams.id);
        	EmployeeComponent.findHistory(empId).then(function (data) {
                $scope.employeeHistory = data;
            });

        };


        $scope.loadEmployee = function() {
            if(parseInt($stateParams.id)>0){
                var empId = parseInt($stateParams.id);
                EmployeeComponent.findOne(empId).then(function (data) {
                        console.log('employee data -');
                        console.log(data);
                    $scope.employee = data;
                    if($scope.employee){
                         $scope.projectSiteList = $scope.employee.projectSites;
                         $scope.employee.code = pad($scope.employee.code , 4);
                         $scope.SelectedDesig = {designation:$scope.employee.designation};
                         $scope.loadSelectedProject($scope.employee.projectId);
                         $scope.loadSelectedSite($scope.employee.siteId);
                         $scope.loadSelectedManager($scope.employee.managerId);
                         $scope.loadSelectedRole($scope.employee.userRoleId);
                         $scope.sites = $scope.employee.sites;
                         $scope.projectSitesCnt = ($scope.employee.projectSites).length;
                         if($scope.projectSitesCnt == 0) {
                              $scope.empLocation = true;
                         }
                    }else{
                         $location.path('/employees');
                    }
                    $scope.loadingStop();

                }).catch(function(){
                    $location.path('/employees');
                });
            }else{
               $location.path('/employees');
            }

        };

        $scope.empSites = null;

        $scope.getEmployeeDetails = function(id) {
            EmployeeComponent.findOne(id).then(function (data) {
                $scope.employee = data;
                $scope.projectSiteList = $scope.employee.projectSites;
                $scope.employee.code = pad($scope.employee.code , 4);
                $scope.loadSelectedProject($scope.employee.projectId);
                $scope.loadSelectedSite($scope.employee.siteId);
                $scope.loadSelectedManager($scope.employee.managerId);
                $scope.loadSelectedRole($scope.employee.userRoleId);
                $scope.Sites = $scope.employee.projectSites;
                $scope.empSites = $scope.employee.projectSites;

            });
            EmployeeComponent.getEmployeeCurrentAttendance(id).then(function(data) {
                console.log("Attendance Data");
                if (data) {
                    console.log("Already checked in");
                    $scope.isCheckedIn = true;
                }
            })
        };

        $scope.getEmployeeByEmpId = function() {
        	var empIdEle = document.getElementById('employeeEmpId');
        	EmployeeComponent.findDuplicate(empIdEle.value).then(function (data) {
                $scope.existingEmployee = data;
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

        $scope.loadSelectedRole = function(roleId) {
        		UserRoleComponent.findOne(roleId).then(function (data) {
                $scope.selectedRole = data;
            });

        };

        $scope.loadSelectedManager = function(managerId) {
        		console.log('manager id - ' + managerId);
        	EmployeeComponent.findOne(managerId).then(function (data) {
                $scope.selectedManager = data;
        		console.log('selectedManager - ' + $scope.selectedManager)
            });
        };


        $scope.deleteSite = function(empId,siteId,projectId) {
        	var employeeSites;
        	if(empId && siteId){

                EmployeeComponent.deleteEmployeeSite(empId,siteId).then(function(response){
                    $scope.success = 'OK';
                    employeeSites = response.data;
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
            if(empId && projectId){
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
        	}
        };



        $scope.updateEmployee = function () {
            $scope.saveLoad = true;
        	$scope.error = null;
        	$scope.success =null;
        	$scope.errorEmployeeExists = null;
        	$scope.errorProject = null;
        	$scope.errorSite = null;
        	$scope.btnDisable = true;
        	console.log("Employee details");
        	console.log($scope.employee);
        	/*
        	if(!$scope.selectedProject.id){
        		$scope.errorProject = "true";
        	}else if(!$scope.selectedSite.id){
        		$scope.errorSite = "true";
        		$scope.errorProject = null;
        	}else
        	*/
//        	if(!$scope.selectedManager.id){
//                             $scope.errorManager = "true";
//                             $scope.errorSite = null;
//            }else {
	        	$scope.employee.projectId = $scope.selectedProject.id;
	        	$scope.employee.siteId = $scope.selectedSite.id;
	        	$scope.employee.managerId = $scope.selectedManager ? $scope.selectedManager.id : 0;
            	if($scope.projectSiteList && $scope.projectSiteList.length > 0) {
            		$scope.employee.projectSites = $scope.projectSiteList;
            	}else {
            		$scope.showNotifications('top','center','danger','Client and Site are required');
            		return;
            	}

	        	EmployeeComponent.updateEmployee($scope.employee).then(function(){
                    $scope.saveLoad = false;
		        	$scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Employee Successfully Updated');

                    $location.path('/employees');
	        	}).catch(function (response) {
                    $scope.saveLoad = false;
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
                    $scope.btnDisable = false;
                });
        	//}
        };

        $scope.deleteConfirm = function (employee){
        	$scope.confirmEmployee = employee;
        }

        $scope.deleteEmployee = function (employee) {
        	$scope.employee = employee;
        	EmployeeComponent.deleteEmployee($scope.confirmEmployee);
        	$scope.success = 'OK';
        	$state.reload();
        };

        $scope.getRelievers = function(employee){
          console.log("Getting Relievers");
          $scope.relievedEmployee = employee;
          EmployeeComponent.getAllRelievers().then(function(response){
              console.log("Response from relievers");
              console.log(response.data);
              $scope.relievers = response.data;
          })
        };
        $scope.noRelData = false;
        $scope.getRelieversDetails = function(employee){
        var searchCriteria = {employeeId:employee};
          EmployeeComponent.getRelievers(searchCriteria).then(function(response){
              console.log("Response from relievers List");
              console.log(response);
              $scope.relieversList = response;
              if($scope.relieversList.length == 0 ){
                  $scope.noRelData = true;
              }else{
               $scope.noRelData = false;
              }

          })
        };

        $scope.assignReliever= function(){
            $('.relieverConfirmation.in').modal('hide');
            if(!$scope.selectedReliever.id){
              $scope.selectedReliever.id = null;
            }
            if(!$scope.selectedReliever.empId){
               $scope.selectedReliever.empId = null;
            }
            if($scope.relieverOthName ==""){
                $scope.relieverOthName = null;
            }
            if($scope.relieverOthMobile ==""){
                $scope.relieverOthMobile = null;
            }
            var relieverDetails = {
                fromDate : $scope.relieverDateFromSer,
                toDate: $scope.relieverDateToSer,
                employeeId:$scope.relievedEmployee.id,
                employeeEmpId:$scope.relievedEmployee.empId,
                relieverEmpId:$scope.selectedReliever.empId,
                relieverId:$scope.selectedReliever.id,
                relievedFromDate:$scope.relieverDateFromSer,
                relievedToDate:$scope.relieverDateToSer,
                siteId:$scope.relieverSite.id,
                relieverName:$scope.relieverOthName,
                relieverMobile:$scope.relieverOthMobile,
            }
            EmployeeComponent.assignReliever(relieverDetails).then(function (response) {
                console.log('Reliever details',response);
                $rootScope.retain=1;
                $scope.search();
                $scope.showNotifications('top','center','success','Reliever  updated successfully ');
            }).catch(function(response){
                $scope.showNotifications('top','center','danger','Failed to Reliever update');
            })


        };

        $scope.cancelReliever = function(){

          $('.relieverConfirmation.in').modal('hide');

          $scope.relieverDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');

          $scope.relieverDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');

          $scope.relieverDateFromSer = new Date();

          $scope.relieverDateToSer = new Date();

        }

        $scope.isActiveAsc = 'empId';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            //$scope.search();
            $scope.loadEmployees();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadEmployees();
        }

         $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

         $scope.searchFilter1 = function () {
            // $scope.searchEmployeeId = null;
            // $scope.searchEmployeeName = null;
            // $scope.searchCriteria.employeeEmpId =null;
            // $scope.searchCriteria.name =null;
            $scope.setPage(1);
            $scope.search();
         }
        $scope.closeModal = function () {
            $('#ViewModal').modal('hide');
        }
        $scope.search = function () {
                $scope.noData = false;
	        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
	        	if(!$scope.searchCriteria) {
	            	var searchCriteria = {
	            			currPage : currPageVal
	            	};
	            	$scope.searchCriteria = searchCriteria;
	        	}

                $scope.searchCriteria.isReport = true;

	    		console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaEmployees));
	    		console.log('criteria in scope -'+JSON.stringify($scope.searchCriteria));

	        	console.log('Selected  project -' + $scope.searchEmployeeName + ", " + $scope.searchProject +" , "+ $scope.searchSite);

	            $scope.searchCriteria.currPage = currPageVal;
	            $scope.searchCriteria.findAll = false;

	             if( !$scope.searchProject && !$scope.searchSite
	                && !$scope.searchEmployeeId && !$scope.searchEmployeeName) {
	                $scope.searchCriteria.findAll = true;
	            }


	            if($scope.searchProject && $scope.searchProject.searchStatus != '0') {
	                    $scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.projectName = $scope.searchProject.name;

	            }else{
                        $scope.searchCriteria.projectId = null;
                }


	            if($scope.searchSite && $scope.searchSite.searchStatus != '0') {
	                    $scope.searchCriteria.siteId = $scope.searchSite.id;
                        $scope.searchCriteria.siteName = $scope.searchSite.name;
	            }else{
                        $scope.searchCriteria.siteId = null;
                }


	            if($scope.searchEmployeeId){
	                   $scope.searchCriteria.employeeEmpId = $scope.searchEmployeeId;
	            }else{
                       $scope.searchCriteria.employeeEmpId = null;
                }



	            if($scope.searchEmployeeName){
	                   $scope.searchCriteria.name = $scope.searchEmployeeName;
	            }else{
                       $scope.searchCriteria.name = null;
                }

	            //-------
	            if($scope.pageSort){
	                $scope.searchCriteria.sort = $scope.pageSort;
	            }

	            if($scope.selectedColumn){

	                $scope.searchCriteria.columnName = $scope.selectedColumn;
	                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

	            }
	            else{
	                $scope.searchCriteria.columnName ="id";
	                $scope.searchCriteria.sortByAsc = true;
	            }

	            console.log("search criteria",$scope.searchCriteria);
	             $scope.employees = '';
	             $scope.employeesLoader = false;
	             $scope.loadPageTop();


            /* Localstorage (Retain old values while edit page to list) start */

            if($rootScope.retain == 1){
                $scope.localStorage = getLocalStorage.getSearch();
                console.log('Local storage---',$scope.localStorage);

                if($scope.localStorage){
                    $scope.filter = true;
                    $scope.pages.currPage = $scope.localStorage.currPage;
                    $scope.searchProject = {searchStatus:'0',id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                    $scope.searchSite = {searchStatus:'0',id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};

                }

                $rootScope.retain = 0;

                var searchCriteras  = $scope.localStorage;
            }else{

                var searchCriteras  = $scope.searchCriteria;
            }

            /* Localstorage (Retain old values while edit page to list) end */


	             EmployeeComponent.search(searchCriteras).then(function (data) {
	                $scope.employees = data.transactions;
	                $scope.employeesLoader = true;

                     /** retaining list search value.**/
                     getLocalStorage.updateSearch(searchCriteras);

	                /*
	                    ** Call pagination  main function **
	                */
	                 $scope.pager = {};
	                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
	                 $scope.totalCountPages = data.totalCount;

	                console.log("Pagination",$scope.pager);
	                console.log('Employees list -' + JSON.stringify($scope.employees));
	                $scope.pages.currPage = data.currPage;
	                $scope.pages.totalPages = data.totalPages;

	                if($scope.employees && $scope.employees.length > 0 ){
	                    $scope.showCurrPage = data.currPage;
	                    $scope.pageEntries = $scope.employees.length;
	                    $scope.totalCountPages = data.totalCount;
	                    $scope.pageSort = 10;
    	                $scope.noData = false;

                    }else{
                         $scope.noData = true;
                    }

	            });

        };

        $scope.updateStartTime = function(empShift,selectedStartDateTime) {
        		console.log('updateStartTime called - ' + selectedStartDateTime);
        	 	if(selectedStartDateTime) {
        	 		empShift.startTime = selectedStartDateTime.startDateTime;
        	 		$scope.modifiedEmpShifts.push(empShift);
        	 		$scope.modified = true;
        	 	}
        }

        $scope.updateEndTime = function(empShift,selectedEndDateTime) {
        		console.log('updateEndTime called - ' + selectedEndDateTime);
	    	 	if(selectedEndDateTime) {
	    	 		empShift.endTime = selectedEndDateTime.endDateTime;
	    	 		$scope.modifiedEmpShifts.push(empShift);
	    	 		$scope.modified = true;
	    	 	}
	    }

        $scope.updateShiftTime = function(empShift,selectedShiftDateTime) {
	    		console.log('updateShiftTime called - ' + selectedShiftDateTime);
	    	 	if(selectedShiftDateTime) {

                     empShift.startTime = selectedShiftDateTime.startDateTime;
                     empShift.endTime = selectedShiftDateTime.endDateTime;

	    	 		$scope.modifiedEmpShifts.push(empShift);
	    	 		$scope.modified = true;
	    	 	}/*else{
                     empShift.startTime = '';
                     empShift.endTime = '';
                }*/
	    }


        $scope.updateEmpShiftSite = function(empShift,selectedShiftSite) {
                console.log('updateEmpShiftSite called - ' + JSON.stringify(selectedShiftSite));
                if(selectedShiftSite){
                    empShift.siteId = selectedShiftSite.id;
                    empShift.siteName = selectedShiftSite.name;
                    /*empShift.startTime = '';
                    empShift.endTime = ''; */

        	 		$scope.modifiedEmpShifts.push(empShift);
                    $scope.modified = true;
        	 		$scope.searchCriteria.siteId = selectedShiftSite.id;

                     SiteComponent.findShifts($scope.searchCriteria.siteId, $scope.searchCriteria.fromDate).then(function(data){
                            $scope.shifts = data;
                            console.log(JSON.stringify($scope.shifts));
                    });
                }else{
                    empShift.siteId = null;
                    empShift.siteName = null;
                }

    	 		//$scope.searchShift();
	    };


        $scope.updateEmployeeShifts = function() {

        		if($scope.modifiedEmpShifts && $scope.modifiedEmpShifts.length > 0) {

	    	        	EmployeeComponent.updateEmployeeShifts($scope.modifiedEmpShifts).then(function (data) {
	    	        		if(data) {
	    	        			$scope.showNotifications('top','center','success','Employee shift details updated successfully ');
	    	        			$scope.searchShift();
	    	        		}else {
	    	        			$scope.showNotifications('top','center','danger','Failed to save employee shift details');
	    	        		}
	    	        	})
        		}else {
        			$scope.showNotifications('top','center','danger','No change to employee shift details');
        		}
        }

        $scope.deleteConfirm = function (empShift){
	    		$scope.confirmDeleteEmpShift = empShift;
	    }


        $scope.deleteShift = function() {
        		EmployeeComponent.deleteEmployeeShift($scope.confirmDeleteEmpShift).then(function(data){
        			console.log('delete shift data - ' + data)
        			if(data) {
    	        			$scope.showNotifications('top','center','success','Employee shift details removed successfully ');
    	        			$scope.searchShift();
    	        		}else {
    	        			$scope.showNotifications('top','center','danger','Failed to remove employee shift details');
    	        		}
        		})
        		$(".modal").hide();
        }

        $scope.searchShiftFilter = function () {
            $scope.setPage(1);
            $scope.searchShift();
         }

        $scope.searchShift = function () {
                $scope.noData = false;
	        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
	        	if(!$scope.searchCriteria) {
	            	var searchCriteria = {
	            			currPage : currPageVal
	            	};
	            	$scope.searchCriteria = searchCriteria;
	        	}
	    		console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaEmployeeShifts));
	    		console.log('criteria in scope -'+JSON.stringify($scope.searchCriteria));

	        	console.log('Selected  project -' + $scope.searchProject +" , "+ $scope.searchSite);

	            $scope.searchCriteria.currPage = currPageVal;
	            $scope.searchCriteria.findAll = false;

                if(!$scope.searchProject && !$scope.searchSite){
                    $scope.searchCriteria.findAll = true;
                }

	            if($scope.searchProject) {
	                    $scope.searchCriteria.projectId = $scope.searchProject.id;
	                    $scope.searchCriteria.projectName = $scope.searchProject.name;
	            }else{
                    $scope.searchCriteria.projectId = null;
                    $scope.searchCriteria.projectName = null;
                }

	            if($scope.searchSite) {
	                    $scope.searchCriteria.siteId = $scope.searchSite.id;
	                    $scope.searchCriteria.siteName = $scope.searchSite.name;
	            }else{
                       $scope.searchCriteria.siteId = null;
                       $scope.searchCriteria.siteName = null;
                }

                if($scope.selectedDateSer){
                      $scope.searchCriteria.fromDate = $scope.selectedDateSer;
                }

	            //-------
	            if($scope.pageSort){
	                $scope.searchCriteria.sort = $scope.pageSort;
	            }

	            if($scope.selectedColumn){

	                $scope.searchCriteria.columnName = $scope.selectedColumn;
	                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

	            }
	            else{
	                $scope.searchCriteria.columnName ="id";
	                $scope.searchCriteria.sortByAsc = true;
	            }

	            console.log("search criteria",$scope.searchCriteria);
	             $scope.employeeShifts = '';
	             $scope.employeesLoader = false;
	             $scope.loadPageTop();

	             EmployeeComponent.searchShift($scope.searchCriteria).then(function (data) {
	                $scope.employeeShifts = data.transactions;
	                $scope.employeesLoader = true;

	                /*
	                    ** Call pagination  main function **
	                */
	                 $scope.pager = {};
	                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
	                 $scope.totalCountPages = data.totalCount;

	                console.log("Pagination",$scope.pager);
	                console.log('Employee Shift list -' + JSON.stringify($scope.employeeShifts));
                    if(data.currPage == 0){
                       $scope.pages.currPage = 1;
                    }else{
                        $scope.pages.currPage = data.currPage;
                    }

	                $scope.pages.totalPages = data.totalPages;

	                if($scope.employeeShifts && $scope.employeeShifts.length > 0 ){
	                    $scope.showCurrPage = data.currPage;
	                    $scope.pageEntries = $scope.employeeShifts.length;
	                    $scope.totalCountPages = data.totalCount;
	                    $scope.pageSort = 10;
                        $scope.noData = false;

                    }else{
                         $scope.noData = true;
                    }

	            });

	            SiteComponent.findShifts($scope.searchCriteria.siteId, $scope.searchCriteria.fromDate).then(function(data){
	            		$scope.shifts = data;
	            		console.log(JSON.stringify($scope.shifts));
	            });



	    };

        $scope.checkIn = function(siteId,employeeEmpId,id){
            EmployeeComponent.getAttendance(id).then(function(data) {
                console.log("Attendance Data");
                console.log(data);
                if (data && data[0]) {
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
            EmployeeComponent.getEmployeeCurrentAttendance(id).then(function(data) {
                console.log("Attendance Data");
                if (data) {
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
                                checkOutData.id = data.id;
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

        $scope.clearFilter = function() {
            $scope.noData = false;
            $rootScope.exportStatusObj.exportMsg = '';
            $scope.downloader=false;
            $scope.siteFilterDisable = true;
            $scope.sitesList = null;
            $scope.sites = null;
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.selectedEmployeeName = null;
            $scope.selectedEmployeeId = null;
            $scope.searchProject = null;
            $scope.searchSite = null;
            $scope.searchEmployeeId = null;
            $scope.searchEmployeeName = null ;
            $scope.searchCriteria = {};
            $scope.localStorage = null;
            $scope.clearField = true;
            $rootScope.searchCriteriaEmployees = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
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

        $scope.loadEnrolledImage = function(imageUrl) {
            var eleId = 'enrolledImage';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',imageUrl);

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



       //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.initAddEdit();
         }

    /*

    ** Pagination init function **
    @Param:integer

    */

        $scope.setPage = function (page) {

            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
            //alert(page);
            $scope.pages.currPage = page;
            if($scope.curUrl =='employeeShifts'){

                $scope.searchShift();

            }else{

                 $scope.search();
            }

        };

        $rootScope.exportStatusObj = {};

        $scope.exportAllData = function(){

                 $rootScope.exportStatusObj.exportMsg = '';
                  $scope.downloader=true;
                  $scope.searchCriteria.list = true;
                  $scope.searchCriteria.report = true;
                EmployeeComponent.exportAllData($scope.searchCriteria).then(function(data){
                    var result = data.results[0];
                    console.log(result);
                    console.log(result.file + ', ' + result.status + ',' + result.msg);
                    var exportAllStatus = {
                            fileName : result.file,
                            exportMsg : 'Exporting All...'
                    };
                    $rootScope.exportStatusObj = exportAllStatus;
                    $scope.start();

                  },function(err){
                      console.log('error message for export all ')
                      console.log(err);
                  });
        };

        // store the interval promise in this variable
        var promise;

     // starts the interval
        $scope.start = function() {
          // stops any running interval to avoid two intervals running at the same time
          $scope.stop();

          // store the interval promise
          promise = $interval($scope.exportStatus, 5000);
          console.log('promise -'+promise);
        };

        // stops the interval
        $scope.stop = function() {
          $interval.cancel(promise);
        };



        $scope.exportStatus = function() {
                console.log('exportStatusObj -'+$rootScope.exportStatusObj);
                    EmployeeComponent.exportStatus($rootScope.exportStatusObj.fileName).then(function(data) {
                        if(data) {
                            $rootScope.exportStatusObj.exportStatus = data.status;
                            console.log('exportStatus - '+ $rootScope.exportStatusObj);
                            $rootScope.exportStatusObj.exportMsg = data.msg;
                            $scope.downloader=false;
                            console.log('exportMsg - '+ $rootScope.exportStatusObj.exportMsg);
                            if($rootScope.exportStatusObj.exportStatus == 'COMPLETED'){
                                $rootScope.exportStatusObj.exportFile = data.file;
                                console.log('exportFile - '+ $rootScope.exportStatusObj.exportFile);
                                $scope.stop();
                            }else if($rootScope.exportStatusObj.exportStatus == 'FAILED'){
                                $scope.stop();
                            }else if(!$rootScope.exportStatusObj.exportStatus){
                                $scope.stop();
                            }else {
                                $rootScope.exportStatusObj.exportFile = '#';
                            }
                        }

                    });

        }

        $scope.exportFile = function() {
            return ($rootScope.exportStatusObj ? $rootScope.exportStatusObj.exportFile : '#');
        }


        $scope.exportMsg = function() {
            return ($rootScope.exportStatusObj ? $rootScope.exportStatusObj.exportMsg : '');
        };

        $scope.cancelEmployeeShiftUpdate = function(){
            $scope.empShift = {};
        }

        // Reliever option types y/n and rating

        $scope.reqEmp = false;
        $scope.reqOth = false;

        $scope.rType = function(){

            var relieverType1 = $('#relieverEmp:checked').val();
            var relieverType2 = $('#relieverOth:checked').val();

            if(relieverType1 == 'Employee'){

                $("#relieverEmpModal").addClass("in");
                $("#relieverOthModal").removeClass("in", 2000);
                $scope.reqEmp = true;
                $scope.reqOth = false;

            }else if(relieverType2 == 'Other'){

                $("#relieverEmpModal").removeClass("in", 2000);
                $("#relieverOthModal").addClass("in");
                $scope.reqEmp = false;
                $scope.reqOth = true;

            }

            //alert($('#answerType2:checked').val());
        }

        $scope.rType();



    });
