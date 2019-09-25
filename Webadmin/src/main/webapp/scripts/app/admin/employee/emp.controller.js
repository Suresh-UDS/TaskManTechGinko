'use strict';

angular.module('timeSheetApp')
.controller('EmployeeController', function ($rootScope,$window, $scope, $state,
		$timeout, ProjectComponent, SiteComponent, EmployeeComponent,LocationComponent,
		UserRoleComponent, $http,$stateParams,$location,PaginationComponent,$filter,$interval,getLocalStorage,Idle) {
    Idle.watch();
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
	$scope.clients = [];
	$scope.markLeftOptions = 'delete';
	$scope.SelectClients = [];
	$scope.client = {};
	$scope.sitesListOne = {};
	$scope.sitesLists = [];
	$scope.sitesListOne.selected =  null;
	$scope.empSites = null;
	$scope.empSitesList = null;
	$scope.employee = null;
	$scope.employees = null;
	$scope.isCheckedIn = false;
	$scope.isCheckedOut = false;
	$scope.attendSite  =null;
	$scope.empStatus = null;

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

	$scope.relieversEmp = null;

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

    $scope.selectAssignEmp = null;
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

	}

	$scope.initCalender();

	$('#dateFilterFrom').datetimepicker().on('dp.show', function (e) {
		return $(this).data('DateTimePicker').minDate(e.date);
	});
	$('#dateFilterTo').datetimepicker().on('dp.show', function (e) {
		return $(this).data('DateTimePicker').minDate(e.date);
	});

	$('#dateFilterFrom').on('dp.change', function(e){
		console.log(e.date);
		$scope.relieverDateTo = null;
		$scope.relieverDateToSer = null;
		$scope.relieverDateFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
		$scope.relieverDateFromSer = new Date(e.date._d);
		$('#dateFilterTo').datetimepicker().on('dp.show', function () {
			return $(this).data('DateTimePicker').minDate($scope.relieverDateFromSer);
		});
	});

	$('#dateFilterTo').on('dp.change', function(e){
		console.log(e.date);
		$scope.relieverDateTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
		$scope.relieverDateToSer = new Date(e.date._d);
	});

	$('#selectedDate').on('dp.change', function(e){
		console.log(e.date);
		$scope.selectedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
		$scope.selectedDateSer = new Date(e.date._d);
	});

	$('#searchDate').on('dp.change', function(e){
		console.log(e.date);
		$scope.searchDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
		$scope.searchDateSer = new Date(e.date._d);
	});

	$scope.projectSiteList = [];

	$scope.conform = function(text)
	{


		//console.log($scope.selectedProject)


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

	//Load Regions for selectbox

	$scope.regionDisable = true;
	$scope.uiRegion = [];

	$scope.getRegion = function (search) {
		var newSupes = $scope.uiRegion.slice();
		if (search && newSupes.indexOf(search) === -1) {
			newSupes.unshift(search);
		}

		return newSupes;
	};

	$scope.selectRegion = function (region) {
		$scope.selectedRegion = $scope.regionList[$scope.uiRegion.indexOf(region)];


		//console.log('Region dropdown list:',$scope.searchRegion)


	}

	//

	//Load Branches for selectbox

	$scope.branchDisable = true;
	$scope.uiBranch = [];

	$scope.getBranch = function (search) {
		var newSupes = $scope.uiBranch.slice();
		if (search && newSupes.indexOf(search) === -1) {
			newSupes.unshift(search);
		}

		return newSupes;
	};

	$scope.selectBranch = function (branch) {
		$scope.selectedBranch = $scope.branchList[$scope.uiBranch.indexOf(branch)];

		//console.log('Branch dropdown list:',$scope.searchBranch)


	}

	//

	$scope.loadRegions = function (projectId) {
		SiteComponent.getRegionByProject(projectId).then(function (response) {


			//console.log(response);


			$scope.regionList = response;
			for(var i=0;i<$scope.regionList.length; i++) {
				$scope.uiRegion.push($scope.regionList[i].name);
			}
		})
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
			//console.log(response);
			$scope.regionList = response;
			$scope.regionsLists = [];
			$scope.regionsListOne.selected = null;
			$scope.regionsLists[0] = $scope.allRegions;

			for(var i=0;i<$scope.regionList.length;i++)
			{
				$scope.regionsLists[i+1] = $scope.regionList[i];
			}

			//console.log('region list : ' + JSON.stringify($scope.regionList));
			$scope.regionSpin = false;
			$scope.regionFilterDisable = false;
			//callback();
		})
	};


	$scope.loadBranch = function (projectId) {
		if(projectId){

			if($scope.selectedRegion){


				//console.log($scope.selectedRegion);
				SiteComponent.getBranchByProject(projectId,$scope.selectedRegion.id).then(function (response) {
					//console.log(response);


					$scope.branchList = response;

					$scope.getSitesBYRegionOrBranch(projectId,$scope.selectedRegion.name,null);


				})

			}else{
				$scope.showNotifications('top','center','danger','Please Select Region to continue...');

			}

		}else{
			$scope.showNotifications('top','center','danger','Please select Project to continue...');

		}


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
	}



	// Filter //

	$scope.siteSpin = false;

	//

	$scope.empLocation = false;
	$scope.addProjectSite = function() {

		if(($scope.selectedProject && $scope.selectedProject.id) && ($scope.selectedSite && $scope.selectedSite.id)){


			//console.log('selected project -' , $scope.selectedProject.name);
			//console.log('selected site -' , $scope.selectedSite.name);



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



			console.log('project>>>>', $scope.projectSiteList.find(isProject));
			console.log('site>>>>', $scope.projectSiteList.find(isSite));

			$scope.dupProject = $scope.projectSiteList.find(isProject);
			$scope.dupSite = $scope.projectSiteList.find(isSite);

			if(($scope.dupProject && $scope.dupSite)){
				//$scope.showNotifications('top','center','warning','Client and Site already exist!!!');
                alert('Client and Site are already exist!!!');
				return;
			}

			$scope.projectSiteList.push(projSite);
			//console.log('project site list -' , $scope.projectSiteList);
			if($scope.projectSiteList.length > 0) {
				$scope.empLocation = false;
			}

			//$scope.selectedProject = {};
			//$scope.selectedSite= {};
		}else{

			if(!$scope.selectedProject && !$scope.selectedSite){
				//$scope.showNotifications('top','center','warning','Please select Client & Site !!!');
                alert('Please select Client & Site !!!');

			}else if(!$scope.selectedProject){
				//$scope.showNotifications('top','center','warning','Please select Client!!!');
                alert('Please select Client!!!');

			}else if(!$scope.selectedSite){
				//$scope.showNotifications('top','center','warning','Please select Site!!!');
                alert('Please select Site!!!');

			}
			return;
		}
	};


	$scope.initAdd = function(){
		$scope.empLocation = true;
	}


	$scope.removeProjectSite = function(ind) {

        //Removing project and site values
	    $scope.deleteProjSite = $scope.projectSiteList[ind];

	    //alert(JSON.stringify($scope.deleteProjSite));
		$scope.projectSiteList.splice(ind,1);
		//alert($scope.projectSiteList.length);
         //alert($scope.locationList.length);
        // Location(s) remove based on project and site
         var locationIndex = $scope.locationList.length - 1;
		for (var i = locationIndex; i >= 0; i--){
              //alert($scope.locationList[i].projectId);
		   if ($scope.locationList[i].projectId == $scope.deleteProjSite.projectId
                 && $scope.locationList[i].siteId == $scope.deleteProjSite.siteId) {
                  //alert("Pid:"+ $scope.locationList[i].projectId + "," + $scope.locationList[i].siteId);
                     $scope.locationList.splice(i, 1);
                     //break;
           }
           $scope.selectedProject = null;
           $scope.selectedSite = null;
           $scope.selectedBlock = null;
           $scope.selectedFloor = null;
           $scope.selectedZone = null;
		}


		if($scope.projectSiteList.length == 0) {
			//document.getElementById("form-button-save").disabled = true;
			$scope.empLocation = true;

		}
	};

	$scope.locationList = [];

	$scope.addLocation = function() {
		if($scope.selectedBlock){
			//console.log('selected block -' + $scope.selectedBlock);
			//console.log('selected floor -' + $scope.selectedFloor);
			//console.log('selected zone -' + $scope.selectedZone);


			$scope.checkProj = $scope.projectSiteList.find(isProject);
			$scope.checkSite = $scope.projectSiteList.find(isSite);

			if(!$scope.checkProj && !$scope.checkSite){
             //$scope.showNotifications('top','center','warning','Please add  represent client and site first..!!');
             alert('Please add  represent client and site first..!!');
             return;
			}
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

			$scope.dupBlock = $scope.locationList.find(isBlock);
			$scope.dupFloor = $scope.locationList.find(isFloor);
			$scope.dupZone = $scope.locationList.find(isZone);

			if(($scope.dupBlock && $scope.dupFloor && $scope.dupZone)){
             //$scope.showNotifications('top','center','warning','Location is already exist..!!');
                alert('Location already exist..!!');
             return;
			}

			$scope.locationList.push(loc);
			//console.log('loc list -' + $scope.locationList)
		}else{
            alert('Please select Block , Floor & Zone !!!');
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
		$scope.loadUserRoles();
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

	$scope.loadProjectsList = function () {
		ProjectComponent.findAll().then(function (data) {
			$scope.projectsList = data;
			/** Ui-select scope **/
			$scope.clients[0] = $scope.allClients;
			//$scope.SelectClients[0] = $scope.SelectClientsNull;

			$scope.loadingStop();
			/* for(var i=0;i<$scope.projectsList.length;i++)
                {
                    $scope.uiClient[i] = $scope.projectsList[i].name;

                }*/
			for(var i=0;i<$scope.projectsList.length;i++)
			{
				$scope.SelectClients[i] = $scope.projectsList[i];

			}

			/** Ui-select scope **/
			for(var i=0;i<$scope.projectsList.length;i++)
			{
				$scope.clients[i+1] = $scope.projectsList[i];

			}
			$scope.clientDisable = false;
			$scope.clientFilterDisable = false;
		});
	};

	//

	$scope.loadProjects = function () {
		ProjectComponent.findAll().then(function (data) {


			//console.log("Loading all projects")


			$scope.projects = data;

			for(var i=0;i<$scope.projects.length;i++)
			{
				$scope.uiClient[i] = $scope.projects[i].name;
			}
			$scope.clientDisable = false;
			$scope.clientFilterDisable = false;

		});
	};

	/*$scope.loadDepSites = function (searchProject) {
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


                    //console.log("==================");
                    //console.log($scope.sites)


                    for(var i=0;i<$scope.sites.length;i++)
                    {
                        $scope.uiSite[i] = $scope.sites[i].name;
                    }
                    $scope.siteDisable = false;
                    $scope.siteSpin = false;
                    $scope.siteFilterDisable = false;
                });

             }

        };*/

	/** Ui-select function **/

	$scope.loadDepSitesList = function (searchProject) {
		$scope.siteSpin = true;
		$scope.searchProject = searchProject;
		if(jQuery.isEmptyObject($scope.searchProject) == true){
			SiteComponent.findAll().then(function (data) {
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
			if(jQuery.isEmptyObject($scope.selectedProject) == false) {
				var depProj=$scope.selectedProject.id;
			}else if(jQuery.isEmptyObject($scope.searchProject) == false){
				var depProj=$scope.searchProject.id;
			}else{
				var depProj=0;
			}

			ProjectComponent.findSites(depProj).then(function (data) {
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
		}

	};



	$scope.loadSearchSite = function (searchSite) {
		if(searchSite){
			$scope.hideSite = true;
			$scope.searchSite = $scope.sites[$scope.uiSite.indexOf(searchSite)]

			//console.log($scope.searchSite)


		}
	}

	$scope.loadSelectedProject = function(projectId) {
		ProjectComponent.findOne(projectId).then(function (data) {
			$scope.selectedProject = data;

		});
	};

	$scope.loadBlocks = function () {

		$scope.selectedBlock = null;
		$scope.selectedFloor = null;
		$scope.selectedZone = null;
		$scope.blocks = '';
		$scope.floors ='';
		$scope.zones ='';

		var projectId = jQuery.isEmptyObject($scope.selectedProject) ? 0 : $scope.selectedProject.id;
		var siteId = jQuery.isEmptyObject($scope.selectedSite) ? 0 : $scope.selectedSite.id;
		LocationComponent.findBlocks(projectId,siteId).then(function (data) {
			$scope.blocks = data;
		});
	};


	$scope.loadFloors = function () {
		$scope.selectedFloor = null;
		$scope.selectedZone = null;
		$scope.floors ='';
		$scope.zones ='';
		var projectId = jQuery.isEmptyObject($scope.selectedProject) ? 0 : $scope.selectedProject.id;
		var siteId = jQuery.isEmptyObject($scope.selectedSite) ? 0 : $scope.selectedSite.id;
		LocationComponent.findFloors(projectId,siteId,$scope.selectedBlock).then(function (data) {
			$scope.floors = data;
		});
	};

	$scope.loadZones = function () {

		$scope.selectedZone = null;
		$scope.zones ='';

		var projectId = jQuery.isEmptyObject($scope.selectedProject) ? 0 : $scope.selectedProject.id;
		var siteId = jQuery.isEmptyObject($scope.selectedSite) ? 0 : $scope.selectedSite.id;
		LocationComponent.findZones(projectId,siteId,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
			$scope.zones = data;
		});
	};

	$scope.loadUserRoles = function () {
		UserRoleComponent.excludeAdmin().then(function (data) {
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


		//console.log("Show Loader");


		$scope.loading = true;
		$scope.notLoading=false;
	};

	$scope.hideLoader = function(){

		//console.log("Show Loader");

		$scope.loading = false;
		$scope.notLoading=true;
	};

	$scope.getSites= function (value) {
		var searchData = {
				name:value
		}
		SiteComponent.getSites(searchData).then(function (data) {


			//console.log(data);

			$scope.sites = data;
		})
	}

	$scope.loadDesignations = function () {
        $scope.designations ="";
		console.log("Loading all designations")
		EmployeeComponent.findAllDesginations().then(function (data) {
			$scope.designations = data;
			//console.log("Loading all Designations" ,$scope.designations);

		});
	}

	$scope.loadSites = function () {
		$scope.showLoader();
		//console.log('selected project - ' + JSON.stringify($scope.selectedProject));
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
	    $scope.allEmployees ="";
		if(!$scope.allEmployees) {
			EmployeeComponent.findAll().then(function (data) {
				//console.log(data);
				$scope.allEmployees = data;
			});
		}
	};

    $scope.mangSpin = false;
	$scope.loadAllManagers = function () {
		$scope.showLoader();
		$scope.mangSpin = true;
		if(!$scope.allManagers) {
			if($scope.employee && $scope.employee.id) {
				EmployeeComponent.findAllManagers($scope.employee.id).then(function (data) {

					//console.log("Managers");
					console.log(data);

					$scope.allManagers = data;
					$scope.hideLoader();
					$scope.mangSpin = false;
				});
			}else {
				EmployeeComponent.findAll().then(function (data) {
					//console.log('all manager',data)
					$scope.allManagers = data;
					$scope.hideLoader();
                    $scope.mangSpin = false;
				});
			}
		}
	};

//	$scope.init() {
//	$scope.loadEmployees();
//	$scope.loadProjects();
//	$scope.loadSites();
//	$scope.loadAllEmployees();
//	};

	$scope.siteTransferDetails = function(employee){

		//console.log(employee)

		$scope.transferEmployeeDetails =employee;
		$scope.transferSite;
		$scope.transferEmployeeOptions;
		$scope.transferringEmployee;
		$scope.relievingEmployee;

	};

	$scope.updateNewEmployee = function(employee){


		//console.log("Selected employee");
		//console.log(employee);
	}

	$scope.updateSelectedSite = function(site){
		//console.log(site);
	};

	$scope.transferEmployee= function(employee,reliever){
		//console.log(employee);
		//console.log($scope.transferSite);
		//console.log($scope.transferEmployeeOptions);
		//console.log($scope.transferringEmployee);
		//console.log(reliever);


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

		//console.log('project site list -' );
		//console.log(employee);

		if($scope.transferEmployeeOptions == 'delete'){
			//console.log("Delete jobs and transfer employees");
			EmployeeComponent.deleteJobsAndTransferEmployee(employee,new Date())
		}else if($scope.transferringEmployee!=null){
			EmployeeComponent.assignJobsAndTransferEmployee(employee,$scope.transferringEmployee,new Date())
			//console.log("Assign jobs to another employee and transfer this employee");

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

		//console.log($scope.designation);
		if($scope.designation){
			//console.log("Designation entered");

			var designationDetails ={
					designation:$scope.designation
			};
			EmployeeComponent.createDesignation(designationDetails).then(function (response) {
				//console.log(response);
				$scope.designation= null;
				$scope.showNotifications('top','center','success','Designation Added Successfully');
				$scope.loadDesignations();
			}).catch(function(response){
			    console.log('error msg',response);
			    if (response.status === 400 && response.data.errorMessage != null) {
                    $scope.errorEmployeeExists = true;
                    $scope.errorMessage = response.data.description;
                    $scope.showNotifications('top','center','danger', 'Designation already exists!.. Please add new one');
                } else {
                    $scope.error = 'ERROR';
                    $scope.showNotifications('top','center','danger', 'Designation Not Saved!.. Please try again later.');
                }
			});
		}else{

			//console.log("Desgination not entered");


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

		//console.log($scope.selectedManager)

		var saveEmployee = false;
		//console.log('exployee exists -'+$scope.existingEmployee);
		if($scope.existingEmployee && !$scope.saveConfirmed) {
			//console.log('exployee exists -'+$scope.existingEmployee.active);
			if($scope.existingEmployee.active == 'N'){
				//var empActivateConfirm = document.getElementById('activateEmployeeModal');
				console.log('empActivateConfirm -'+empActivateConfirm);
				//empActivateConfirm.show();
				//console.log($('#deleteModal'));
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
				//console.log('Error - '+ JSON.stringify(response.data));

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
			$('input#selectedDate').data('DateTimePicker').clear();
			$scope.noData = false;
			$scope.siteFilterDisable = true;
			$scope.regionFilterDisable = true;
			$scope.branchFilterDisable = true;
			$scope.sitesList = null;
			$scope.sites = null;

			/** Ui-select scopes **/
			$scope.client.selected = null;
			$scope.sitesLists =  [];
			$scope.sitesListOne.selected =  null;
			$scope.regionsLists =  [];
			$scope.regionsListOne.selected =  null;
			$scope.branchsLists =  [];
			$scope.branchsListOne.selected =  null;

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
		if(id > 0){
		    $scope.employee = "";
            $scope.markLeftEmployeeArray = "";
			EmployeeComponent.findOne(id).then(function (data) {
				//console.log(data);
				$scope.employee = data;
                var empIds = [$scope.employee.projectSites[0].employeeId];
                var siteIds = [$scope.employee.projectSites[0].siteId];
                EmployeeComponent.markLftEmp({empIds:empIds,siteIds:siteIds}).then(function (data) {
                    console.log('Left employee list',data);
                    $scope.markLeftEmployeeArray = data;
                });
			});

		}

	};

	$scope.markLeftEmployee= function(id){
        if(id > 0){
            $scope.markLeftEmployeeArray = "";
            EmployeeComponent.markLftEmp({empIds:[id]}).then(function (data) {
                console.log(data);
                $scope.markLeftEmployeeArray = data;
            });

        }

    };

	$scope.updateEmployeeLeft= function(employee){

		//console.log("Current Employee");
		//console.log(employee);
		//console.log("Transferring employee");
		//console.log($scope.transferringEmployee);
        //employee.left = true;
		//console.log("Employee Left options");
		//console.log($scope.markLeftOptions);


		if($scope.markLeftOptions == 'delete'){
			//console.log("delete and mark left");
            $scope.loadingStart();
            //employee.left = true;
            $('#leftModal').modal('hide');
			EmployeeComponent.updateEmployee(employee).then(function(data){
				EmployeeComponent.deleteJobsAndMarkEmployeeLeft(employee,new Date());
				//console.log("Delete jobs and transfer this employee");
				$scope.showNotifications('top','center','success','Employee Successfully Marked Left');
                $scope.loadingStop();
				$scope.search();
                $scope.retain = 1;
			}).catch(function(response){
				//console.log(response);
				$scope.showNotifications('top','center','danger','Error in marking Left');
                $scope.loadingStop();

			})
		}else if ($scope.markLeftOptions == 'assign'){
            //console.log('emp',$scope.employee.selectAssignEmp);
            $('#leftModal').modal('hide');
            //employee.left = true;
			//console.log("assign and mark left");
            $scope.loadingStart();
			EmployeeComponent.updateEmployee(employee).then(function(data){
			    console.log('reliever emp',$scope.selectAssignEmp);
				EmployeeComponent.assignJobsAndMarkLeft(employee,$scope.employee.selectAssignEmp,new Date());
				//console.log("Assign jobs to another employee and transfer this employee");
				$scope.showNotifications('top','center','success','Employee Successfully Marked Left');
				$scope.search();
				$scope.retain = 1;
                $scope.loadingStop();
			}).catch(function(response){
				//console.log(response);
				$scope.showNotifications('top','center','danger','Error in marking Left');
                $scope.loadingStop();
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
					//$scope.title = $scope.employee.name +' '+ $scope.employee.lastName ? $scope.employee.lastName: '';
					$scope.title = $scope.employee.name;
					$scope.projectSiteList = $scope.employee.projectSites;
					$scope.locationList = $scope.employee.locations;
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


	$scope.getEmployeeSiteDetails = function(id){
		if(id>0){
			$scope.loadingStart();
			$scope.empSitesList = null;
			EmployeeComponent.findOne(id).then(function (data) {
				$scope.empSitesList = data.projectSites;
				$scope.loadingStop();
			});
		}


	}

    $scope.empSpin = false;

	$scope.getEmployeeDetails = function(id) {
		if(id>0){
            $scope.empSpin = true;
			$scope.loadingStart();
			$scope.empSitesList = null;
			EmployeeComponent.findOne(id).then(function (data) {
				$scope.employee = data;
				$scope.projectSiteList = $scope.employee.projectSites;
				$scope.employee.code = pad($scope.employee.code , 4);
				$scope.loadSelectedProject($scope.employee.projectId);
				$scope.loadSelectedSite($scope.employee.siteId);
				$scope.loadSelectedManager($scope.employee.managerId);
				$scope.loadSelectedRole($scope.employee.userRoleId);
				$scope.empSitesList = $scope.employee.projectSites;
				$scope.selectedRole = {id:$scope.employee.userRoleId,name:$scope.employee.userRoleName};
				$scope.empSpin = false;
				$scope.loadingStop();

			});
			EmployeeComponent.getEmployeeCurrentAttendance(id).then(function(data) {

				//console.log("Attendance Data",data);

				$scope.isCheckedIn = false;
				$scope.isCheckedOut = true;
				$scope.attendSite= data.siteId;
				if(data.checkInTime && data.checkOutTime) {
					//console.log("Already checked in");

					$scope.isCheckedIn = true;
					$scope.isCheckedOut = true;
				}else if(data.checkInTime && !data.checkOutTime) {
					//console.log("Already checked in");
					$scope.isCheckedIn = true;
					$scope.isCheckedOut = false;
				}else if (data.checkOutTime && !data.checkInTime) {
					//console.log("Already checked out");
					$scope.isCheckedOut = true;
					$scope.isCheckedIn = false;
				}
				$scope.empSpin = false;
                $scope.loadingStop();

			});


		}

	};
    $scope.empSitesSpin = false;
	$scope.getRelieveEmpDetails = function(id) {

		if(id > 0){
		   $scope.empSitesSpin = true;
			EmployeeComponent.findOne(id).then(function (data) {
				$scope.employee = data;
				/*Employee reliever scope values reset start*/

				$scope.relieverDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');

				$scope.relieverDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');

				$scope.relieverDateFromSer = new Date();

				$scope.relieverDateToSer = new Date();
				$scope.relieverOthName= "";
				$scope.relieverOthMobile= "";
				$scope.selectedReliever= null;
				$scope.relieverSite= null;

				/*Employee reliever scope values reset end*/


				if(($scope.employee.projectSites).length > 0){
					$scope.empSites = $scope.employee.projectSites;
				}else{
					$scope.empSites = null;
				}
                $scope.empSitesSpin = false;
				//console.log('Emp site',$scope.empSites);


			});

		}


	}

	$scope.getEmployeeByEmpId = function() {
		var empIdEle = document.getElementById('employeeEmpId');
		if(empIdEle.value){
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
		}

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
		if(managerId > 0){
			//console.log('manager id - ' + managerId);
			EmployeeComponent.findOne(managerId).then(function (data) {
				$scope.selectedManager = data;
				//console.log('selectedManager - ' , $scope.selectedManager)
			});

		}

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

				//console.log('Error - '+ response.data);

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

					//console.log('Error - '+ response.data);

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
		//console.log("Employee details");
		//console.log($scope.employee);
		/*
        	if(!$scope.selectedProject.id){
        		$scope.errorProject = "true";
        	}else if(!$scope.selectedSite.id){
        		$scope.errorSite = "true";
        		$scope.errorProject = null;
        	}else
		 */
//		if(!$scope.selectedManager.id){
//		$scope.errorManager = "true";
//		$scope.errorSite = null;
//		}else {
        if($scope.selectedProject){
           $scope.employee.projectId = $scope.selectedProject.id;
        }
		if($scope.selectedSite){
		   $scope.employee.siteId = $scope.selectedSite.id;
		}
		$scope.employee.managerId = $scope.selectedManager ? $scope.selectedManager.id : 0;
		if($scope.selectedRole) {
            $scope.employee.userRoleId = $scope.selectedRole.id;
            $scope.employee.userRoleName = $scope.selectedRole.name;
        }
        if($scope.locationList) {
            $scope.employee.locations = $scope.locationList;
        }
		if($scope.projectSiteList && $scope.projectSiteList.length > 0) {
			$scope.employee.projectSites = $scope.projectSiteList;
		}else {
			$scope.showNotifications('top','center','danger','Client and Site are required');
			return;
		}

		if($scope.SelectedDesig) {
			$scope.employee.designation = $scope.SelectedDesig.designation;
		}

		EmployeeComponent.updateEmployee($scope.employee).then(function(){
			$scope.saveLoad = false;
			$scope.success = 'OK';
			$scope.showNotifications('top','center','success','Employee Successfully Updated');

			$location.path('/employees');
		}).catch(function (response) {
			$scope.saveLoad = false;
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
    $scope.relieversEmpSpin = false;
	$scope.getRelievers = function(employee){
		console.log("Getting Relievers");
		$scope.relieversEmp = null;
		$scope.relievedEmployee = employee;
		var relieverSite = $scope.relieverSite;
		if(relieverSite && relieverSite.siteId){
            $scope.relieversEmpSpin = true;
			//console.log('reliever site - ' + JSON.stringify(relieverSite));

			EmployeeComponent.getAllRelievers(relieverSite.siteId).then(function(response){

				if((response).length >0){
					$scope.relieversEmp = response;
				}else{
					$scope.relieversEmp = null;
				}
                $scope.relieversEmpSpin = false;
				console.log("Response from relievers");
				console.log($scope.relieversEmp);

			})
		}

	};
	$scope.noRelData = false;
	$scope.getRelieversDetails = function(employee){
		var searchCriteria = {employeeId:employee};
		$scope.relieversList = "";
		EmployeeComponent.getRelievers(searchCriteria).then(function(response){

			//console.log("Response from relievers List");
			//console.log(response);


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

		$rootScope.loadingStart();

		if(jQuery.isEmptyObject($scope.selectedReliever) == true){
			$scope.selectedReliever = {};
			$scope.selectedReliever.id = null;
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
				relieverEmployeeId:$scope.selectedReliever.id,
				relievedFromDate:$scope.relieverDateFromSer,
				relievedToDate:$scope.relieverDateToSer,
				siteId:$scope.relieverSite.id,
				relieverName:$scope.relieverOthName,
				relieverMobile:$scope.relieverOthMobile,
		}
		EmployeeComponent.assignReliever(relieverDetails).then(function (response) {

			//console.log('Reliever details',response);
			$scope.showNotifications('top','center','success','Reliever  updated successfully ');
			$scope.retain=1;
			$scope.search();
			$scope.cancelReliever();
			$rootScope.loadingStop();
		}).catch(function(response){
			$scope.showNotifications('top','center','danger','Failed to Reliever update');
			$scope.cancelReliever();
			$rootScope.loadingStop();
		});




	};

	$scope.cancelReliever = function(){

		$('.relieverConfirmation.in').modal('hide');

		$scope.relieverDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');

		$scope.relieverDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');

		$scope.relieverDateFromSer = new Date();

		$scope.relieverDateToSer = new Date();
		$scope.relieverOthName= "";
		$scope.relieverOthMobile= "";
		$scope.selectedReliever= {};
		$scope.relieverSite= {};

	}

	$scope.isActiveAsc = '';
	$scope.isActiveDesc = 'id';

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
		$('.AdvancedFilterModal.in').modal('hide');
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
		$('.ViewModal.in').modal('hide');
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


		$scope.searchCriteria.isReport = false;


		$scope.searchCriteria.currPage = currPageVal;
		$scope.searchCriteria.findAll = false;

		/* Root scope (search criteria) start*/

		if($rootScope.searchFilterCriteria.isDashboard){
			$rootScope.isDashboard = true;
			$scope.empStatus = $rootScope.searchFilterCriteria.empStatus;
			if($rootScope.searchFilterCriteria.projectId){
				$scope.searchProject ={id:$rootScope.searchFilterCriteria.projectId,name:$rootScope.searchFilterCriteria.projectName};
				$scope.client.selected =$scope.searchProject;
				$scope.projectFilterFunction($scope.searchProject);
			}else{
				$scope.searchProject = null;
				$scope.client.selected =$scope.searchProject;
			}
			if($rootScope.searchFilterCriteria.regionId){
				$scope.searchRegion = {id:$rootScope.searchFilterCriteria.regionId,name:$rootScope.searchFilterCriteria.region}
				$scope.regionsListOne.selected = $scope.searchRegion;
				$scope.regionFilterFunction($scope.searchProject);
			}else{
				$scope.searchRegion = null;
				$scope.regionsListOne.selected = $scope.searchRegion;
			}
			if($rootScope.searchFilterCriteria.branchId){
				$scope.searchBranch = {id:$rootScope.searchFilterCriteria.branchId,name:$rootScope.searchFilterCriteria.branch}
				$scope.branchsListOne.selected= $scope.searchBranch;
				$scope.branchFilterFunction($scope.searchProject,$scope.searchRegion);
			}else{
				$scope.searchBranch = null;
				$scope.branchsListOne.selected = $scope.searchBranch;
			}
			if($rootScope.searchFilterCriteria.siteId){
				$scope.searchSite = {id:$rootScope.searchFilterCriteria.siteId,name:$rootScope.searchFilterCriteria.siteName};
				$scope.sitesListOne.selected = $scope.searchSite;
				$scope.siteFilterDisable=false;

			}else{
				$scope.searchSite = null;
				$scope.sitesListOne.selected=$scope.searchSite;
			}

			if($rootScope.searchFilterCriteria.attendFromDate) {
				$scope.searchCriteria.checkInDateTimeFrom = $rootScope.searchFilterCriteria.attendFromDate;
			}

			if($rootScope.searchFilterCriteria.attendToDate) {
				$scope.searchCriteria.checkInDateTimeTo = $rootScope.searchFilterCriteria.attendToDate;
			}

            // console.log($rootScope.searchFilterCriteria.empFromDate);
			// console.log($rootScope.searchFilterCriteria.empToDate);
            // if($rootScope.searchFilterCriteria.empFromDate) {
            //     $scope.searchCriteria.checkInDateTimeFrom = $rootScope.searchFilterCriteria.empFromDate;
            // }
            //
            // if($rootScope.searchFilterCriteria.empToDate) {
            //     $scope.searchCriteria.checkInDateTimeFrom = $rootScope.searchFilterCriteria.empToDate;
            // }


            /* Root scope (search criteria) end*/
		} else{
			if($scope.client.selected && $scope.client.selected.id !=0){
				$scope.searchProject = $scope.client.selected;
                $stateParams.project = null;
                $stateParams.site = null;
			}else if($stateParams.project){
                 $scope.searchProject = {id:$stateParams.project.id,name:$stateParams.project.name};
                 $scope.client.selected =$scope.searchProject;
                 $scope.projectFilterFunction($scope.searchProject);
            }else{
				$scope.searchProject = null;
			}
			if($scope.sitesListOne.selected && $scope.sitesListOne.selected.id !=0){
				$scope.searchSite = $scope.sitesListOne.selected;
                $stateParams.site = null;
			}else if($stateParams.site){
                $scope.searchSite = {id:$stateParams.site.id,name:$stateParams.site.name};
                $scope.sitesListOne.selected = $scope.searchSite;
            }else{
				$scope.searchSite = null;
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
		}

		/* Root scope (search criteria) */
		$rootScope.searchFilterCriteria.isDashboard = false;

        if($scope.showInActive){
           $scope.searchCriteria.showInActive = true;
           $scope.searchCriteria.left = true;
        }else{
           $scope.searchCriteria.showInActive = false;
           $scope.searchCriteria.left = false;
        }

		if( !$scope.searchProject && !$scope.searchSite
				&& !$scope.searchEmployeeId && !$scope.searchEmployeeName) {
			$scope.searchCriteria.findAll = true;
		}


		if($scope.searchProject) {
			$scope.searchCriteria.projectId = $scope.searchProject.id;
			$scope.searchCriteria.projectName = $scope.searchProject.name;

		}else{
			$scope.searchCriteria.projectId = null;
			$scope.searchCriteria.projectName = "";
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
		}else{
			$scope.searchCriteria.siteId = null;
			$scope.searchCriteria.siteName = "";
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
			$scope.searchCriteria.sortByAsc = false;
		}


		//console.log("search criteria",$scope.searchCriteria);

		$scope.employees = '';
		$scope.employeesLoader = false;
		$scope.loadPageTop();


		/* Localstorage (Retain old values while edit page to list) start */

		if($rootScope.retain == 1){
			$scope.localStorage = getLocalStorage.getSearch();

			//console.log('Local storage---',$scope.localStorage);


			if($scope.localStorage){
				$scope.filter = true;
				$scope.pages.currPage = $scope.localStorage.currPage;
				if($scope.localStorage.projectId){

					$scope.searchProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
					$scope.client.selected = $scope.searchProject;
					//$scope.loadDepSitesList($scope.client.selected);
					$scope.projectFilterFunction($scope.searchProject);
				}else{
					$scope.searchProject = null;
					$scope.client.selected = $scope.searchProject;
				}
				if($scope.localStorage.regionId){
					$scope.searchRegion = {id:$scope.localStorage.regionId,name:$scope.localStorage.region};
					$scope.regionsListOne.selected = $scope.searchRegion;

					$scope.regionFilterFunction($scope.searchProject);
				}else{
					$scope.searchRegion = null;
					$scope.regionsListOne.selected = $scope.searchRegion;
				}
				if($scope.localStorage.branchId){
					$scope.searchBranch = {id:$scope.localStorage.branchId,name:$scope.localStorage.branch};
					$scope.branchsListOne.selected = $scope.searchBranch;
					$scope.branchFilterFunction($scope.searchProject,$scope.searchRegion);

				}else{
					$scope.searchBranch = null;
					$scope.branchsListOne.selected = $scope.searchBranch;
				}
				if($scope.localStorage.siteId){
					$scope.searchSite = {id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
					$scope.sitesListOne.selected = $scope.searchSite;
					$scope.siteFilterDisable=false;
				}else{
					$scope.searchSite = null;
					$scope.sitesListOne.selected = $scope.searchSite;
				}
                if($scope.localStorage.showInActive){
                    $scope.searchCriteria.showInActive = $scope.localStorage.showInActive;
                    $scope.showInActive = $scope.localStorage.showInActive;
                }

			}

			$rootScope.retain = 0;

			$scope.searchCriteras  = $scope.localStorage;
		}else{

			$scope.searchCriteras  = $scope.searchCriteria;
		}

		/* Localstorage (Retain old values while edit page to list) end */

		$scope.searchCriteras.onBoarded = true;
        var EmpSearch = $scope.empStatus == 'Absent' ? EmployeeComponent.searchAbsent($scope.searchCriteras):EmployeeComponent.search($scope.searchCriteras);
        EmpSearch.then(function (data) {
			$scope.employees = data.transactions;
			$scope.employeesLoader = true;

			/** retaining list search value.**/
			getLocalStorage.updateSearch($scope.searchCriteras);

			/*
			 ** Call pagination  main function **
			 */
			$scope.pager = {};
			$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
			$scope.totalCountPages = data.totalCount;


			//console.log("Pagination",$scope.pager);
			//console.log('Employees list -' + JSON.stringify($scope.employees));
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

		}).catch(function(){
            $scope.noData = true;
            $scope.employeesLoader = true;
            $scope.showNotifications('top','center','danger','Unable to load employee list..');
        });

	};

	$scope.updateStartTime = function(empShift,selectedStartDateTime) {
		//console.log('updateStartTime called - ' + selectedStartDateTime);
		if(selectedStartDateTime) {
			empShift.startTime = selectedStartDateTime.startDateTime;
			$scope.modifiedEmpShifts.push(empShift);
			$scope.modified = true;
		}
	}

	$scope.updateEndTime = function(empShift,selectedEndDateTime) {
		//console.log('updateEndTime called - ' + selectedEndDateTime);
		if(selectedEndDateTime) {
			empShift.endTime = selectedEndDateTime.endDateTime;
			$scope.modifiedEmpShifts.push(empShift);
			$scope.modified = true;
		}
	}

	$scope.updateShiftTime = function(empShift,selectedShiftDateTime) {
		//console.log('updateShiftTime called - ' + selectedShiftDateTime);
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

		//console.log('updateEmpShiftSite called - ' + JSON.stringify(selectedShiftSite));

		if(selectedShiftSite){
			empShift.siteId = selectedShiftSite.id;
			empShift.siteName = selectedShiftSite.name;
			/*empShift.startTime = '';
                    empShift.endTime = ''; */

			$scope.modifiedEmpShifts.push(empShift);
			$scope.modified = true;
			$scope.searchCriteria.siteId = selectedShiftSite.id;
			if($scope.searchCriteria.siteId && $scope.searchCriteria.fromDate){

				SiteComponent.findShifts($scope.searchCriteria.siteId, $filter('date')($scope.searchCriteria.fromDate, 'yyyy-MM-dd')).then(function(data){
					$scope.shifts = data;
					console.log(JSON.stringify($scope.shifts));
				}).catch(function(){
                    $scope.showNotifications('top','center','danger','Unable to load employee shift list..');
                });

			}

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
			//console.log('delete shift data - ' + data)
			if(data) {
				$scope.showNotifications('top','center','success','Employee shift details removed successfully ');
				$scope.searchShift();
			}else {
				$scope.showNotifications('top','center','danger','Failed to remove employee shift details');
			}
		}).catch(function(){
            $scope.showNotifications('top','center','danger','Unable to remove employee shift details..');
        });
		$(".modal").hide();
	}

	$scope.searchShiftFilter = function () {
		$('.AdvancedFilterModal.in').modal('hide');
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
		//console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaEmployeeShifts));
		//console.log('criteria in scope -'+JSON.stringify($scope.searchCriteria));

		//console.log('Selected  project -' + $scope.searchProject +" , "+ $scope.searchSite);

		$scope.searchCriteria.currPage = currPageVal;
		$scope.searchCriteria.findAll = false;

		if($scope.client.selected && $scope.client.selected.id !=0){
			$scope.searchProject = $scope.client.selected;
		}else{
			$scope.searchProject = null;
		}
		if($scope.sitesListOne.selected && $scope.sitesListOne.selected.id !=0){
			$scope.searchSite = $scope.sitesListOne.selected;
		}else{
			$scope.searchSite = null;
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

		if($scope.searchRegion) {
			$scope.searchCriteria.regionId = $scope.searchRegion.id;
			$scope.searchCriteria.region = $scope.searchRegion.name;

		}else {
			$scope.searchCriteria.regionId = 0;
			$scope.searchCriteria.region = null;
		}

		if($scope.searchBranch) {
			$scope.searchCriteria.branchId = $scope.searchBranch.id;
			$scope.searchCriteria.branch = $scope.searchBranch.name;

		}else {
			$scope.searchCriteria.branchId = 0;
			$scope.searchCriteria.branch = null;
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
			$scope.searchCriteria.sortByAsc = false;
		}
		//console.log("search criteria",$scope.searchCriteria);

		$scope.employeeShifts = '';
		$scope.employeesLoader = false;
		$scope.loadPageTop();

		$scope.searchCriteras= $scope.searchCriteria;

		EmployeeComponent.searchShift($scope.searchCriteras).then(function (data) {
			$scope.employeeShifts = data.transactions;
			$scope.employeesLoader = true;

			/*
			 ** Call pagination  main function **
			 */
			$scope.pager = {};
			$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
			$scope.totalCountPages = data.totalCount;

			//console.log("Pagination",$scope.pager);
			//console.log('Employee Shift list -' + JSON.stringify($scope.employeeShifts));


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
			$scope.loadSites();

		}).catch(function(){
            $scope.noData = true;
            $scope.employeesLoader = true;
            $scope.showNotifications('top','center','danger','Unable to load employee shift list..');
        });
		if($scope.searchCriteria.siteId && $scope.searchCriteria.fromDate){

			SiteComponent.findShifts($scope.searchCriteria.siteId,  $filter('date')($scope.searchCriteria.fromDate, 'yyyy-MM-dd')).then(function(data){
				$scope.shifts = data;
				//console.log(JSON.stringify($scope.shifts));
			});

		}


	};

	$scope.checkIn = function(siteId,employeeEmpId,id){


		EmployeeComponent.getAttendance(id).then(function(data) {

			//console.log("Attendance Data",data);
			if (data && data.length > 0) {
				//console.log("Already checked in");
				//$('.ViewModal.in').modal('hide');


				var msg = 'Attendance already marked ' + data[0].employeeFullName + ' at site ' + data[0].siteName;
				$scope.showNotifications('top', 'center', 'warning', msg);
			} else {
				/*if (navigator.geolocation) {
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

                                  //console.log("attendance marked",data);
                                  //$('.ViewModal.in').modal('hide');


                                    var msg = 'Attendance marked for ' + data.employeeFullName + ' at site ' + data.siteName;
                                    $scope.showNotifications('top', 'center', 'success', msg);
                                    //$location.path('/employees');
                                    $scope.getEmployeeDetails(id);
                                })
                            });
                        });

                    } else {*/

				//console.log("Location not available")


				var checkInData = {};
				checkInData.siteId = siteId;
				checkInData.employeeEmpId = employeeEmpId
				EmployeeComponent.checkIn(checkInData).then(function (data) {

					//console.log("attendance marked");
					//$('.ViewModal.in').modal('hide');
					var msg = 'Attendance marked for ' + data.employeeFullName + ' at site ' + data.siteName;
					$scope.showNotifications('top', 'center', 'success', msg);
					$scope.getEmployeeDetails(id);


				}).catch(function(){
                    $scope.showNotifications('top','center','danger','Unable to checkin attendance..');
                });
				/*}*/
			}

		});
		// EmployeeComponent.getSites(employeeId).then(function (data) {

		//     //console.log(data)


		// })
	};


	$scope.checkOut = function(siteId,employeeEmpId,id){


		EmployeeComponent.getEmployeeCurrentAttendance(id).then(function(data) {
			//console.log("Attendance Data" , data);

			if (data) {
				//console.log("Already checked in");


				/*if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            $scope.$apply(function () {

                              console.log("Location available");
                              console.log(position);

                                $scope.position = position;
                                var checkOutData = {};
                                checkOutData.siteId = siteId;
                                checkOutData.employeeEmpId = employeeEmpId;
                                checkOutData.latitudeOut = position.coords.latitude;
                                checkOutData.longitudeOut = position.coords.longitude;
                                checkOutData.id = data.id;
                                // checkOutData.remarks = "Marked from ba"
                                EmployeeComponent.checkOut(checkOutData).then(function (data) {


                                  //console.log("attendance marked" , data);
                                  //$('.ViewModal.in').modal('hide');

                                   var msg = 'Attendance marked for ' + data.employeeFullName + ' at site ' + data.siteName;
                                   $scope.showNotifications('top', 'center', 'success', msg);
                                   // $location.path('/employees');
                                  //$window.location.reload();
                                   $scope.getEmployeeDetails(id);


                                })
                            });
                        });
                    } else {

				 */


				console.log("Location not available")

				var checkOutData = {};
				checkOutData.siteId = siteId;
				checkOutData.employeeEmpId = employeeEmpId;
				checkOutData.id = data.id;
				EmployeeComponent.checkOut(checkOutData).then(function (data) {


					//console.log("attendance marked",data);
					//$('.ViewModal.in').modal('hide');

					var msg = 'Attendance marked for ' + data.employeeFullName + ' at site ' + data.siteName;
					$scope.showNotifications('top', 'center', 'success', msg);
					// $location.path('/employees');
					//$window.location.reload();
					$scope.getEmployeeDetails(id);


				}).catch(function(){
                    $scope.showNotifications('top','center','danger','Unable to checkout attendance..');
                });
				/* }*/
			} else {

				//$('.ViewModal.in').modal('hide');


				var msg = 'No Attendance marked ' + data.employeeFullName + ' at site ' + data.siteName;
				$scope.showNotifications('top', 'center', 'warning', msg);
				$scope.getEmployeeDetails(id);
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
		}).catch(function(){
            $scope.showNotifications('top','center','danger','Unable to get checkout details..');
        });
	};

	$scope.clearFilter = function() {
		$scope.noData = false;
		$rootScope.exportStatusObj = {};
		$scope.downloader=false;
		$scope.downloaded = true;
		$scope.siteFilterDisable = true;
		$scope.regionFilterDisable = true;
		$scope.branchFilterDisable = true;
		$scope.sitesList = null;
		$scope.sites = null;


		/** Ui-select scopes **/
		$scope.client.selected = null;
		$scope.sitesLists =  [];
		$scope.sitesListOne.selected =  null;
		$scope.regionsLists =  [];
		$scope.regionsListOne.selected =  null;
		$scope.branchsLists =  [];
		$scope.branchsListOne.selected =  null;

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
		$scope.empStatus = null;
        $stateParams.project = null;
        $stateParams.site = null;
		$scope.pages = {
				currPage: 1,
				totalPages: 0
		}
		/* Root scope (search criteria) */
		//$rootScope.searchFilterCriteria.isDashboard = false;
		//$scope.search();
	};

	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}

	$scope.loadQRCode = function(empId, qrCodeImage) {
		if(empId) {
			//console.log("QR Code image - "+ qrCodeImage);
			var uri = '/api/employee/' + empId +'/qrcode';
			var eleId = 'qrCodeImage';
			//console.log('image element id -' + eleId);
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

	$scope.loadEnrolledImage = function(imageUrl) {
		var eleId = 'enrolledImage';
		var ele = document.getElementById(eleId);
		ele.setAttribute('src',imageUrl);

	};

	$scope.approveImage = function(employee){
        $scope.saveLoad = true;
		EmployeeComponent.approveImage(employee).then(function(response){
			if(response.status == 200){
				//console.log("Image Approved");
				$scope.showNotifications('top','center','success','Face Id Approved');
			}else{
				$scope.showNotifications('top','center','warning','Failed to approve Face Id');
				//console.log("Failed to approve image");
			}
			$scope.retain=1;
			$scope.search();
            $scope.saveLoad = false;
		}).catch(function () {
            $scope.showNotifications('top','center','warning','Failed to approve Face Id');
            $scope.saveLoad = false;
        });
	}



	//init load
	$scope.initLoad = function(){
		$scope.loadPageTop();
		$scope.initAddEdit();
	}

    //init list load
    $scope.initListLoad = function(){
        $scope.loadPageTop();
        $scope.setPage(1);
    }

	/*

	 ** Pagination init function **
    @Param:integer

	 */

	$scope.setPage = function (page) {
		if (page < 1 || page > $scope.pager.totalPages) {
			return;
		}
		$scope.pages.currPage = page;
		if($scope.curUrl =='employeeShifts'){

			$scope.searchShift();
			return false;

		}else{
			$scope.search();
            return false;
		}

	};

	$rootScope.exportStatusObj = {};

	$scope.exportAllData = function(){

		$rootScope.exportStatusObj = {};
		$scope.downloaded = false;
		$scope.downloader=true;
		$scope.searchCriteria.list = true;
		$scope.searchCriteria.report = true;
		$scope.searchCriteria.columnName = "createdDate";
		$scope.searchCriteria.sortByAsc = false;
		EmployeeComponent.exportAllData($scope.searchCriteria).then(function(data){
			var result = data.results[0];


			//console.log(result);
			//console.log(result.file + ', ' + result.status + ',' + result.msg);


			var exportAllStatus = {
					fileName : result.file,
					exportMsg : 'Exporting All...'
			};
			$rootScope.exportStatusObj = exportAllStatus;
			$scope.start();

		}).catch(function(){
            $scope.downloader=false;
            $scope.stop();
            $scope.showNotifications('top','center','danger','Unable to export file..');
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

		//console.log('exportStatusObj -'+$rootScope.exportStatusObj);
		EmployeeComponent.exportStatus($rootScope.exportStatusObj.fileName).then(function(data) {
			if(data) {
				$rootScope.exportStatusObj.exportStatus = data.status;
				//console.log('exportStatus - '+ $rootScope.exportStatusObj);
				$rootScope.exportStatusObj.exportMsg = data.msg;
				$scope.downloader=false;
				//console.log('exportMsg - '+ $rootScope.exportStatusObj.exportMsg);
				if($rootScope.exportStatusObj.exportStatus == 'COMPLETED'){
					$rootScope.exportStatusObj.exportFile = data.file;
					//console.log('exportFile - '+ $rootScope.exportStatusObj.exportFile);

					$scope.stop();
				}else if($rootScope.exportStatusObj.exportStatus == 'FAILED'){
					$scope.stop();
				}else if(!$rootScope.exportStatusObj.exportStatus){
					$scope.stop();
				}else {
					$rootScope.exportStatusObj.exportFile = '#';
				}
			}

		}).catch(function(){
            $scope.downloader=false;
            $scope.stop();
            $scope.showNotifications('top','center','danger','Unable to export file..');
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
		$rootScope.exportStatusObj = {};
	}

	$scope.cancelEmployeeShiftUpdate = function(){
		$scope.empShift = {};
	}

	// Reliever option types y/n and rating

	$scope.reqEmp = true;
	$scope.reqOth = false;
	$scope.relieverOthName = null;
	$scope.relieverOthMobile = null;
	$scope.selectedReliever = {};
	$scope.selectedReliever.id = null;
	$scope.selectedReliever.empId = null;

	$scope.rType = function(){

		var relieverType1 = $('#relieverEmp:checked').val();
		var relieverType2 = $('#relieverOth:checked').val();

		if(relieverType1 == 'Employee'){

			$("#relieverEmpModal").addClass("in");
			$("#relieverOthModal").removeClass("in", 2000);
			$scope.reqEmp = true;
			$scope.reqOth = false;
			$scope.relieverOthName = null;
			$scope.relieverOthMobile = null;

		}else if(relieverType2 == 'Other'){

			$("#relieverEmpModal").removeClass("in", 2000);
			$("#relieverOthModal").addClass("in");
			$scope.reqEmp = false;
			$scope.reqOth = true;
			$scope.selectedReliever = null;
			/*$scope.selectedReliever.id = null;
			$scope.selectedReliever.empId = null;*/

		}

		//alert($('#answerType2:checked').val());
	}

	$scope.rType();


	//Search Filter Site Load Function

	$scope.projectFilterFunction = function (searchProject){
		$scope.siteSpin = true;
		ProjectComponent.findSites(searchProject.id).then(function (data) {
			$scope.selectedSite = null;
			$scope.sitesList = data;
			$scope.sitesLists = [];
			$scope.sitesLists[0] = $scope.allSites;

			for(var i=0;i<$scope.sitesList.length;i++)
			{
				$scope.sitesLists[i+1] = $scope.sitesList[i];
			}
			$scope.siteFilterDisable = false;
			$scope.siteSpin = false;
		});

	};

	//Search Filter Region Load Function

	$scope.regionFilterFunction = function (searchProject){
		$scope.regionSpin = true;
		SiteComponent.getRegionByProject(searchProject.id).then(function (response) {
			//console.log(response);
			$scope.regionList = response;
			$scope.regionsLists = [];
			//$scope.regionsListOne.selected = null;
			$scope.regionsLists[0] = $scope.allRegions;

			for(var i=0;i<$scope.regionList.length;i++)
			{
				$scope.regionsLists[i+1] = $scope.regionList[i];
			}

			//console.log('region list : ' + JSON.stringify($scope.regionList));
			$scope.regionSpin = false;
			$scope.regionFilterDisable = false;
			//callback();
		});
	};

	//Search Filter Branch Load Function

	$scope.branchFilterFunction = function (searchProject,searchRegion){
		$scope.branchSpin = true;
		SiteComponent.getBranchByProject(searchProject.id,searchRegion.id).then(function (response) {
			// //console.log('branch',response);
			$scope.branchList = response;
			if($scope.branchList) {
				$scope.branchsLists = [];
				// $scope.branchsListOne.selected = null;
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
				$scope.getSitesBYRegionOrBranch($scope.searchProject.id,$scope.searchRegion.name,null);
				$scope.branchSpin = false;
				$scope.branchFilterDisable = false;
				//callback();
			}

		})
	}

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
		$scope.sitesListOne.selected = undefined;

	};



	/*
	 * Ui select allow-clear modified function end
	 *
	 * */

	 $scope.clearFields =function(){
     $scope.selectAssignEmp = null;
	 }

	 $scope.takenEmpConfirm = function (id){

            $scope.takenEmpId= id;

     }

     $scope.takenEmp = function () {
             $scope.loadingStart();
             $('#takenEmpModal').modal('hide');
            EmployeeComponent.unAssignReliever({employeeId:$scope.takenEmpId}).then(function(){
                $scope.success = 'OK';
                $scope.showNotifications('top','center','success','Employee UnRelieved  Successfully..!!');
                 $scope.search();
                 $scope.retain = 1;
                 $scope.loadingStop();
            }).catch(function(){
                $scope.showNotifications('top','center','danger','Unable To UnRelieve Employee.');
                $scope.loadingStop();
            });
     }
     $scope.markLeftOptions = "delete";
     $scope.haveTickets = false;
     $scope.getEmployeeOpenTickets = function (id) {
          $scope.haveTickets = false;
         EmployeeComponent.getEmployeeOpenTickets(id).then(function(response){
             if(response.length > 0){
                $scope.haveTickets = true;
                $scope.markLeftOptions = "assign";
             }
         }).catch(function(){
             $scope.haveTickets = false;
         });
     }

    // Client info and location duplicate checking function
    function isProject(project) {
        return project.projectId === $scope.selectedProject.id;
    }
    function isSite(site) {
        return site.siteId === $scope.selectedSite.id;
    }
    function isBlock(block) {
        return block.block === $scope.selectedBlock;
    }
    function isFloor(floor) {
        return floor.floor === $scope.selectedFloor;
    }
    function isZone(zone) {
        return zone.zone === $scope.selectedZone;
    }


});
