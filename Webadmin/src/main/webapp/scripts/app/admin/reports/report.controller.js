'use strict';

angular.module('timeSheetApp')
.controller('ReportController', function ($rootScope, $scope, $state, $timeout,
		ProjectComponent, SiteComponent, EmployeeComponent,
		$http,$stateParams,$location,$interval,PaginationComponent,$filter) {
	$rootScope.loadingStop();
	$rootScope.loginView = false;
	$scope.success = null;
	$scope.error = null;
	$scope.errorMessage = null;
	$scope.doNotMatch = null;
	$scope.errorEmployeeExists = null;
	$scope.searchCriteria = {};
	//$scope.selectedDateFrom = $filter('date')('01/01/2018', 'dd/MM/yyyy');
	$scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
	$scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
	var d = new Date();
	d.setFullYear(2018, 0, 1);
	//$scope.selectedDateFromSer= d;
	$scope.selectedDateFromSer= new Date();
	$scope.selectedDateToSer= new Date();
	$scope.pager = {};
	$scope.noData = false;

	$scope.employeeDesignations = ["MD","Operations Manger","Supervisor"]

	//$timeout(function (){angular.element('[ng-model="name"]').focus();});

	$scope.pages = { currPage : 1};

	$scope.selectedEmployee = null;

	$scope.selectedProject= null;

	$scope.selectedSite= null;

	$scope.existingEmployee;

	$scope.selectedManager;

	$scope.projectSiteList = [];

	$scope.pageSort = 10;
	$scope.searchProject = null;
	$scope.selectedSite = null;

	/** Ui-select scopes **/
	$scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
	$scope.client = {};
	$scope.clients = [];
	$scope.allSites = {id:0 , name: '-- ALL SITES --'};
	$scope.sitesListOne = {};
	$scope.sitesLists = [];
	$scope.sitesListOne.selected =  null;
	$scope.allRegions = {id:0 , name: '-- SELECT REGIONS --'};
	$scope.regionsListOne = {};
	$scope.regionsLists = [];
	$scope.regionsListOne.selected =  null;
	$scope.allBranchs = {id:0 , name: '-- SELECT BRANCHES --'};
	$scope.branchsListOne = {};
	$scope.branchsLists = [];
	$scope.branchsListOne.selected =  null;

	$scope.initCalender = function(){

		demo.initFormExtendedDatetimepickers();

	};

	$('#dateFilterFrom').on('dp.change', function(e){
		$scope.selectedDateFromSer =new Date(e.date._d);
		$scope.selectedDateFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
		$scope.selectedDateFromSer.setHours(0,0,0,0);
		if($scope.selectedDateToSer){
			$scope.selectedDateToSer.setHours(0,0,0,0);
		}


		if($scope.selectedDateFromSer > $scope.selectedDateToSer && $scope.selectedDateFromSer != $scope.selectedDateToSer){
			$scope.fromErrMsg = 'From date cannot be greater than To date';

			alert($scope.fromErrMsg);

			$('input#dateFilterFrom').data('DateTimePicker').clear();
			$('input#dateFilterTo').data('DateTimePicker').clear();
			$scope.selectedDateFromSer = new Date();
			$scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.selectedDateToSer = new Date();
			$scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
			$('input#dateFilterFrom').val($scope.selectedDateFrom);
			$('input#dateFilterTo').val($scope.selectedDateTo);

			return false;
		}

	});
	$('#dateFilterTo').on('dp.change', function(e){
		$scope.selectedDateToSer =new Date(e.date._d);
		$scope.selectedDateTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
		$scope.selectedDateToSer.setHours(0,0,0,0);
		if($scope.selectedDateFromSer){
			$scope.selectedDateFromSer.setHours(0,0,0,0);
		}

		if($scope.selectedDateFromSer > $scope.selectedDateToSer && $scope.selectedDateFromSer != $scope.selectedDateToSer){
			$scope.toErrMsg = 'To date cannot be lesser than From date';

			alert($scope.toErrMsg);

			$('input#dateFilterFrom').data('DateTimePicker').clear();
			$('input#dateFilterTo').data('DateTimePicker').clear();
			$scope.selectedDateFromSer = new Date();
			$scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.selectedDateToSer = new Date();
			$scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
			$('input#dateFilterFrom').val($scope.selectedDateFrom);
			$('input#dateFilterTo').val($scope.selectedDateTo);

			return false;
		}

	});


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
			//console.log("Loading all projects")
			$scope.projects = data;
			/** Ui-select scope **/
			$scope.clients[0] = $scope.allClients;
			//
			/* for(var i=0;i<$scope.projects.length;i++)
                {
                    $scope.uiClient[i] = $scope.projects[i].name;
                }*/
			for(var i=0;i<$scope.projects.length;i++)
			{
				$scope.clients[i+1] = $scope.projects[i];
			}
			$scope.clientFilterDisable = false;
			//
		});
	};

	// Load Clients for selectbox //
	$scope.clientFilterDisable = true;
	$scope.uiClient = [];
	$scope.getClient = function (search) {
		var newSupes = $scope.uiClient.slice();
		if(search){
			if (search && newSupes.indexOf(search) === -1) {
				newSupes.unshift(search);
			}
		}

		return newSupes;
	}
	//

	// Load Sites for selectbox //
	$scope.siteFilterDisable = true;
	$scope.uiSite = [];
	$scope.getSite = function (search) {
		var newSupes = $scope.uiSite.slice();
		if(search){
			if (search && newSupes.indexOf(search) === -1) {
				newSupes.unshift(search);
			}
		}
		return newSupes;
	}

	//

	$scope.loadSites = function () {
		$scope.siteSpin = true;
		if($scope.selectedProject) {
			ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
				$scope.sites = data;
			});
		}else {
			SiteComponent.findAll().then(function (data) {
				$scope.sites = data;
				//
				for(var i=0;i<$scope.sites.length;i++)
				{
					$scope.uiSite[i] = $scope.sites[i].name;
				}
				$scope.siteSpin = false;
				$scope.siteFilterDisable = false;

				//
			});
		}
	};


	//

	$scope.loadSearchProject = function (searchProject) {
		if(searchProject){
			$scope.siteSpin = true;
			$scope.hideSite = false;
			$scope.clearField = false;
			$scope.uiSite.splice(0,$scope.uiSite.length)
			$scope.searchSite = null;
			$scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)];
		}

	}


	$scope.loadSearchSite = function (searchSite) {
		if(searchSite){
			$scope.hideSite = true;
			$scope.searchSite = $scope.sites[$scope.uiSite.indexOf(searchSite)];
		}

	}

	//
	/* $scope.loadDepSites = function () {
          //console.log("=====================")
           //console.log($scope.searchProject)
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }

            ProjectComponent.findSites(depProj).then(function (data) {
                $scope.searchSite = null;
                $scope.sites = data;
                //
                for(var i=0;i<$scope.sites.length;i++)
                {
                    $scope.uiSite[i] = $scope.sites[i].name;
                }
                $scope.siteSpin = false;
                $scope.siteFilterDisable = false;

                //
            });
        };*/

	/** Ui-select function **/

	$scope.loadDepSitesList = function (searchProject) {
		$scope.siteSpin = true;
		$scope.searchProject = searchProject;
		if(jQuery.isEmptyObject($scope.searchProject) == true){
			SiteComponent.findAll().then(function (data) {
				$scope.sitesList = data;
				$scope.sitesLists = [];
				$scope.sitesListOne.selected = null;
				$scope.sitesLists[0] = $scope.allSites;

				for(var i=0;i<$scope.sitesList.length;i++)
				{
					$scope.sitesLists[i+1] = $scope.sitesList[i];
				}
				$scope.siteFilterDisable = false;
				$scope.siteSpin = false;
			});
		}else{
			if(jQuery.isEmptyObject($scope.selectedProject) == false) {
				var depProj=$scope.selectedProject.id;
			}else if(jQuery.isEmptyObject($scope.searchProject) == false){
				var depProj=$scope.searchProject.id;
			}else{
				var depProj=0;
			}

			ProjectComponent.findSites(depProj).then(function (data) {
				$scope.sitesList = data;
				$scope.sitesLists = [];
				$scope.sitesListOne.selected = null;
				$scope.sitesLists[0] = $scope.allSites;

				for(var i=0;i<$scope.sitesList.length;i++)
				{
					$scope.sitesLists[i+1] = $scope.sitesList[i];
				}
				$scope.siteFilterDisable = false;
				$scope.siteSpin = false;
			});
		}


	};

	$scope.regionFilterDisable = true;
	$scope.branchFilterDisable = true;

	/*** UI select (Region List) **/
	$scope.loadRegionsList = function (projectId, callback) {
		$scope.regionSpin = true;
		$scope.branchsLists = [];
		$scope.branchsListOne.selected = null;
		$scope.branchFilterDisable = true;
		SiteComponent.getRegionByProject(projectId).then(function (response) {
			// //console.log(response);
			$scope.regionList = response;
			$scope.regionsLists = [];
			$scope.regionsListOne.selected = null;
			$scope.regionsLists[0] = $scope.allRegions;


			for(var i=0;i<$scope.regionList.length;i++)
			{
				$scope.regionsLists[i+1] = $scope.regionList[i];
			}

			// //console.log('region list : ' + JSON.stringify($scope.regionList));
			$scope.regionSpin = false;
			$scope.regionFilterDisable = false;
			//callback();
		})
	};

	/*** UI select (Branch List) **/
	$scope.loadBranchList = function (projectId, callback) {

		if(projectId){

			if($scope.regionsListOne.selected){
				//console.log($scope.regionsListOne.selected);
				$scope.branchSpin = true;
				SiteComponent.getBranchByProject(projectId,$scope.regionsListOne.selected.id).then(function (response) {
					//console.log(response);
					$scope.branchList = response;
					if($scope.branchList) {
						$scope.branchsLists = [];
						$scope.branchsListOne.selected = null;
						$scope.branchsLists[0] = $scope.allBranchs;

						for(var i=0;i<$scope.branchList.length;i++)
						{
							$scope.branchsLists[i+1] = $scope.branchList[i];
						}
						/* if($scope.branchList) {
                                		for(var i = 0; i < $scope.branchList.length; i++) {
                                			$scope.uiBranch.push($scope.branchList[i].name);
                                		}*/
						$scope.branchSpin = false;
						$scope.branchFilterDisable = false;
					}
					else{
						//console.log('branch list : ' + JSON.stringify($scope.branchList));
						$scope.getSitesBYRegionOrBranch(projectId,$scope.regionsListOne.selected.name,null);
						$scope.branchSpin = false;
						$scope.branchFilterDisable = false;
						//callback();
					}

				})

			}else{
				$scope.showNotifications('top','center','danger','Please Select Region to continue...');

			}

		}else{
			$scope.showNotifications('top','center','danger','Please select Project to continue...');

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
		$scope.clearFilter();
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
		//console.log($scope.selectedManager)
		/*
        	if(!$scope.selectedProject.id){
        		$scope.errorProject = "true";
        	}else if(!$scope.selectedSite.id){
        		$scope.errorSite = "true";
        		$scope.errorProject = null;
        	}else
		 */
//		 if($scope.selectedManager && !$scope.selectedManager.id){
//	$scope.errorManager = "true";
//		$scope.errorSite = null;
//		}else {
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
				//console.log('Error - '+ JSON.stringify(response.data));
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

		$scope.loadEmployees();
	}



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
			//console.log($scope.employee.sites);
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
			//console.log($scope.employee.sites);
			$scope.sites = $scope.employee.sites;
		});
	};

	$scope.getEmployeeByEmpId = function() {
		var empIdEle = document.getElementById('employeeEmpId');
		console.log(empIdEle.value);
		EmployeeComponent.findDuplicate(empIdEle.value).then(function (data) {
			$scope.existingEmployee = data;
			//console.log('Existing employee found ' + JSON.stringify($scope.existingEmployee));
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
			//console.log('Error - '+ response.data);
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
				//console.log('Error - '+ response.data);
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
				//console.log('Error - '+ response.data);
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

	$scope.isActiveAsc = 'empId';
	$scope.isActiveDesc = '';

	$scope.columnAscOrder = function(field){
		$scope.selectedColumn = field;
		$scope.isActiveAsc = field;
		$scope.isActiveDesc = '';
		$scope.isAscOrder = true;
		$scope.search();
		//$scope.loadEmployees();
	}

	$scope.columnDescOrder = function(field){
		$scope.selectedColumn = field;
		$scope.isActiveDesc = field;
		$scope.isActiveAsc = '';
		$scope.isAscOrder = false;
		$scope.search();
		//$scope.loadEmployees();
	}

	$scope.searchFilter = function () {
		$('.AdvancedFilterModal.in').modal('hide');
		$scope.setPage(1);
		$scope.search();
	}



	$scope.search = function () {
		$scope.noData = false;
		var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
		if(!$scope.searchCriteria) {
			var searchCriteria = {
					currPage : currPageVal
			}
			$scope.searchCriteria = searchCriteria;
		}

		$scope.searchCriteria.isReport = false;

		$scope.searchCriteria.currPage = currPageVal;

		if($scope.client.selected && $scope.client.selected.id !=0){
			$scope.searchProject = $scope.client.selected;
		}else{
			$scope.searchProject = null;
		}
		if($scope.regionsListOne.selected && $scope.regionsListOne.selected.id !=0){
			$scope.searchRegion = $scope.regionsListOne.selected;
		}else{
			$scope.searchRegion = null;
		}
		if($scope.branchsListOne.selected && $scope.branchsListOne.selected.id !=0){
			$scope.searchBranch = $scope.branchsListOne.selected;
		}else{
			$scope.searchBranch = null;
		}
		if($scope.sitesListOne.selected && $scope.sitesListOne.selected.id !=0){
			$scope.searchSite = $scope.sitesListOne.selected;
		}else{
			$scope.searchSite = null;
		}

		$scope.searchCriteria.findAll = false;

		//&& !$scope.selectedEmployee

		if( !$scope.searchProject && !$scope.searchSite) {
			$scope.searchCriteria.findAll = true;
		}

		if($scope.selectedDateFrom) {
			$scope.searchCriteria.fromDate = $scope.selectedDateFromSer;
		}
		if($scope.selectedDateTo) {
			$scope.searchCriteria.toDate = $scope.selectedDateToSer;
		}

		if($scope.searchProject) {
			$scope.searchCriteria.projectId = $scope.searchProject.id;
			$scope.searchCriteria.projectName = $scope.searchProject.name;
			//$scope.searchCriteria.projectName = $scope.selectedProject.name;
			//console.log('selected project id ='+ $scope.searchCriteria.projectId);
		}else{
			$scope.searchCriteria.projectId = null;
			$scope.searchCriteria.projectName = null;
		}

		if($scope.searchRegion) {
			$scope.searchCriteria.regionId = $scope.searchRegion.id;
			$scope.searchCriteria.region = $scope.searchRegion.name;

		}else {
			$scope.searchCriteria.regionId = null;
			$scope.searchCriteria.region = null;
		}

		if($scope.searchBranch) {
			$scope.searchCriteria.branchId = $scope.searchBranch.id;
			$scope.searchCriteria.branch = $scope.searchBranch.name;

		}else {
			$scope.searchCriteria.branchId = null;
			$scope.searchCriteria.branch = null;
		}

		if($scope.searchSite) {
			$scope.searchCriteria.siteId = $scope.searchSite.id;
			$scope.searchCriteria.siteName = $scope.searchSite.name;
			// $scope.searchCriteria.siteName = $scope.selectedSite.name;
			//console.log('selected site id ='+ $scope.searchCriteria.siteId);
		}else{
			$scope.searchCriteria.siteId = null;
			$scope.searchCriteria.siteName = null;
		}

		/*if($scope.selectedEmployee)
	        	{
	        		$scope.searchCriteria.employeeEmpId = $scope.selectedEmployee.empId;
		        	$scope.searchCriteria.name = $scope.selectedEmployee.name;
		        	$scope.searchCriteria.fullName = $scope.selectedEmployee.fullName;
		        	$scope.searchCriteria.employeeId = $scope.selectedEmployee.id;
		        	console.log('selected emp id ='+ $scope.searchCriteria.employeeEmpId);
	        	}*/


		//-------
		if($scope.pageSort){
			$scope.searchCriteria.sort = $scope.pageSort;
		}

		if($scope.selectedColumn){

			$scope.searchCriteria.columnName = $scope.selectedColumn;
			$scope.searchCriteria.sortByAsc = $scope.isAscOrder;

		}else{
			$scope.searchCriteria.columnName ="id";
			$scope.searchCriteria.sortByAsc = true;
		}

		$scope.searchCriteras = $scope.searchCriteria;

		//console.log("search criteria",$scope.searchCriteria);
		$scope.employees = '';
		$scope.employeesLoader = false;
		$scope.loadPageTop();

		EmployeeComponent.search($scope.searchCriteria).then(function (data) {
			$scope.employees = data.transactions;
			$scope.employeesLoader = true;

			//console.log("Employee search result list -", $scope.employees);
			$scope.pages.currPage = data.currPage;
			$scope.pages.totalPages = data.totalPages;

			/*
			 ** Call pagination  main function **
			 */
			$scope.pager = {};
			$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
			$scope.totalCountPages = data.totalCount;

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

	$scope.checkIn = function(siteId,employeeEmpId,id){
		EmployeeComponent.getAttendance(id).then(function(data) {
			//console.log("Attendance Data");
			//console.log(data);
			if (data[0]) {
				//console.log("Already checked in");
				$('#noticeModal').modal('hide');
				var msg = 'Attendance already marked ' + data[0].employeeFullName + ' at site ' + data[0].siteName;
				$scope.showNotifications('top', 'center', 'warning', msg);
			} else {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						$scope.$apply(function () {
							//console.log("Location available")
							//console.log(position);
							$scope.position = position;
							var checkInData = {};
							checkInData.siteId = siteId;
							checkInData.employeeEmpId = employeeEmpId;
							checkInData.latitudeIn = position.coords.latitude;
							checkInData.longitudeIn = position.coords.longitude;
							EmployeeComponent.checkIn(checkInData).then(function (data) {
								//console.log("attendance marked");
								//console.log(data)
								var msg = 'Attendance marked for ' + data.employeeFullName + ' at site ' + data.siteName;
								$scope.showNotifications('top', 'center', 'success', msg)
								$location.path('/employees');
							})
						});
					});
				} else {
					//console.log("Location not available")
					var checkInData = {};
					checkInData.siteId = siteId;
					checkInData.employeeEmpId = employeeEmpId
					EmployeeComponent.checkIn(checkInData).then(function (data) {
						//console.log("attendance marked");
					})
				}
			}

		});
		// EmployeeComponent.getSites(employeeId).then(function (data) {
		//   //console.log(data)
		// })
	};

	$rootScope.exportStatusObj = {};

	$scope.exportAllData = function(){
		$scope.downloader = true;
		$scope.downloaded = false;
		$rootScope.exportStatusObj = {};
		$scope.downloader=true;
		$scope.searchCriteria.list = true;
		$scope.searchCriteria.report = true;
		$scope.searchCriteria.isReport = true;
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
			//console.log('error message for export all ')
			//console.log(err);
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
		//console.log('promise -'+promise);
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

	$scope.downloaded = false;

	$scope.clsDownload = function(){
		$scope.downloaded = true;
		$rootScope.exportStatusObj ={};
	}


	$scope.checkOut = function(siteId,employeeEmpId,id){
		EmployeeComponent.getAttendance(id).then(function(data) {
			//console.log("Attendance Data");
			if (data[0]) {
				//console.log("Already checked in");

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						$scope.$apply(function () {
							//console.log("Location available")
							//console.log(position);
							$scope.position = position;
							var checkOutData = {};
							checkOutData.siteId = siteId;
							checkOutData.employeeEmpId = employeeEmpId;
							checkOutData.latitudeOut = position.coords.latitude;
							checkOutData.longitudeOut = position.coords.longitude;
							checkOutData.id = data[0].id;
							EmployeeComponent.checkOut(checkOutData).then(function (data) {
								//console.log("attendance marked");
								//console.log(data)
								var msg = 'Attendance marked for ' + data.employeeFullName + ' at site ' + data.siteName;
								$scope.showNotifications('top', 'center', 'success', msg)
								$location.path('/employees');
							})
						});
					});
				} else {
					//console.log("Location not available")
					var checkOutData = {};
					checkOutData.siteId = siteId;
					checkOutData.employeeEmpId = employeeEmpId;
					checkOutData.attendanceId = data[0].id;
					EmployeeComponent.checkOut(checkOutData).then(function (data) {
						//console.log("attendance marked");
						//console.log(data)
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
			//console.log("Attendance Data");
			if(data[0]){
				//console.log("Already checked in");
			}else{
				//console.log("Not yet checked in ");
				EmployeeComponent.getSites(id).then(function (data) {
					//console.log(data)
					$scope.employeeSites = data;

				})
			}
		})
	};

	$scope.clearFilter = function() {
		$('input#dateFilterFrom').data('DateTimePicker').clear();
		$('input#dateFilterTo').data('DateTimePicker').clear();
		$rootScope.exportStatusObj = {};
		$scope.downloader=false;
		$scope.downloaded = true;
		$scope.siteFilterDisable = true;
		$scope.regionFilterDisable = true;
		$scope.branchFilterDisable = true;
		$scope.sites = null;

		/** Ui-select scopes **/
		$scope.client.selected = null;
		$scope.sitesLists =  [];
		$scope.sitesListOne.selected =  null;
		$scope.regionsLists =  [];
		$scope.regionsListOne.selected =  null;
		$scope.branchsLists =  [];
		$scope.branchsListOne.selected =  null;

		//$scope.selectedDateFrom = $filter('date')('01/01/2018', 'dd/MM/yyyy');
		$scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
		//$scope.selectedDateFromSer = d;
		$scope.selectedDateFromSer = new Date();
		$scope.selectedDateToSer =  new Date();
		$('input#dateFilterFrom').val($scope.selectedDateFrom);
		$('input#dateFilterTo').val($scope.selectedDateTo);
		$scope.selectedSite = null;
		$scope.selectedProject = null;
		$scope.searchProject = null;
		$scope.searchSite = null;
		$scope.clearField = true;
		$scope.searchCriteria = {};
		$rootScope.searchCriteriaSite = null;
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
				//console.log('qrcode response - ' + response.data);
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
				//console.log("Image Approved");
				$scope.showNotifications('top','center','success','Face Id Approved');
			}else{
				$scope.showNotifications('top','center','warning','Failed to approve Face Id');
				//console.log("Failed to approve image");
			}
			$scope.search();
		})
	}


	$scope.initCalender();

	//init load
	$scope.initLoad = function(){
		$scope.loadPageTop();


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
		$scope.search();
	};



	$scope.getSitesBYRegionOrBranch = function (projectId, region, branch) {
		if(branch){
			$scope.siteFilterDisable = true;
			$scope.siteSpin = true;
			SiteComponent.getSitesByBranch(projectId,region,branch).then(function (data) {
				$scope.selectedSite = null;
				$scope.sitesList = data;
				$scope.sitesLists = [];
				$scope.sitesListOne.selected = null;
				$scope.sitesLists[0] = $scope.allSites;

				for(var i=0;i<$scope.sitesList.length;i++)
				{
					$scope.sitesLists[i+1] = $scope.sitesList[i];
				}
				$scope.siteFilterDisable = false;
				$scope.siteSpin = false;
			});

		}else if(region){
			$scope.siteFilterDisable = true;
			$scope.siteSpin = true;

			SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
				$scope.selectedSite = null;
				$scope.sitesList = data;
				$scope.sitesLists = [];
				$scope.sitesListOne.selected = null;
				$scope.sitesLists[0] = $scope.allSites;

				for(var i=0;i<$scope.sitesList.length;i++)
				{
					$scope.sitesLists[i+1] = $scope.sitesList[i];
				}
				$scope.siteFilterDisable = false;
				$scope.siteSpin = false;
			})

		}/*else if(projectId >0){
                $scope.siteFilterDisable = true;
                $scope.siteSpin = true;
                ProjectComponent.findSites(projectId).then(function (data) {
                    $scope.selectedSite = null;
                    $scope.sitesList = data;
                    $scope.sitesLists = [];
                    $scope.sitesListOne.selected = null;
                    $scope.sitesLists[0] = $scope.allSites;

                    for(var i=0;i<$scope.sitesList.length;i++)
                    {
                        $scope.sitesLists[i+1] = $scope.sitesList[i];
                    }
                    $scope.siteFilterDisable = false;
                    $scope.siteSpin = false;
                });
            }else{

            }*/
	};


	/*
	 * Ui select allow-clear modified function start
	 *
	 * */


	$scope.clearProject = function($event) {
		$event.stopPropagation(); 
		$scope.client.selected = undefined;
		$scope.regionsListOne.selected = undefined;
		$scope.branchsListOne.selected = undefined;
		$scope.sitesListOne.selected = undefined;
		$scope.regionFilterDisable = true;
		$scope.branchFilterDisable = true;
		$scope.siteFilterDisable = true;


	};

	$scope.clearRegion = function($event) {
		$event.stopPropagation(); 
		$scope.regionsListOne.selected = undefined;
		$scope.branchsListOne.selected = undefined;
		$scope.sitesListOne.selected = undefined;
		$scope.branchFilterDisable = true;
		$scope.siteFilterDisable = true;


	};

	$scope.clearBranch = function($event) {
		$event.stopPropagation();
		$scope.branchsListOne.selected = undefined;
		$scope.sitesListOne.selected = undefined;
		$scope.siteFilterDisable = true;


	};

	$scope.clearSite = function($event) {
		$event.stopPropagation(); 
		$scope.sitesListOne.selected = null;


	};



	/*
	 * Ui select allow-clear modified function end
	 *
	 * */


});
