'use strict';

angular.module('timeSheetApp')

.controller('OnBoardingController', function ($rootScope, $scope, $state, $timeout,
		ProjectComponent, SiteComponent, EmployeeComponent,AttendanceComponent, UserComponent,$http,
		$stateParams,$location,$interval,PaginationComponent,$filter,Idle, OnBoardingComponent) {
    Idle.watch();
	$rootScope.loadingStop();
	$rootScope.loginView = false;
	$rootScope.empCode = '';
	$scope.success = null;
	$scope.error = null;
	$scope.errorMessage = null;
	$scope.doNotMatch = null;
	$scope.errorEmployeeExists = null;
	$scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
	$scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
	$scope.selectedDateFromSer=  new Date();
	$scope.selectedDateToSer= new Date();
	$scope.pageSort = 10;
	$scope.pager = {};
	$scope.noData = false;
	$scope.SearchEmployeeId = null;
	$scope.SearchEmployeeName = null;
	$rootScope.exportStatusObj  ={};
    $scope.onBoardingEmployees = [];
	$scope.employeeDesignations = ["MD","Operations Manger","Supervisor"];
    $scope.allUsers = [];
    $rootScope.onBoardingAuthorityDetails = {};
    $scope.showUserDetails = false;
	//$timeout(function (){angular.element('[ng-model="name"]').focus();});

	$scope.pages = { currPage : 1};

	$scope.selectedEmployee = null;

	$scope.selectedEmployeeId = null;

	$scope.selectedEmployeeName = null;

	$scope.selectedProject = null;

	$scope.selectedSite = null;

	$scope.existingEmployee = null;

	$scope.selectedManager = null;

	$scope.selectedAttendance = null;

	$scope.searchCriteriaAttendance = null;

	$scope.searchProject = null;

	$scope.searchSite = null;

	$scope.searchCriteria = {};

	/** Ui-select scopes **/
	$scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
	$scope.client = {};
	$scope.clients = [];
	$scope.allSitesVal = {id:0 , name: '-- ALL SITES --'};
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
    $scope.userDetails = {};
    $scope.showUserDetails = false;

	$scope.now = new Date();

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

	// Init load employees
	$scope.init = function() {
		// $scope.loadAttendances();
        $scope.loadUsers();
	};

	// Load Sites for selectbox //
	$scope.siteDisable = true;
	$scope.uiSite = [];
	$scope.siteFilterDisable = true;
	$scope.getSite = function (search) {
		var newSupes = $scope.uiSite.slice();
		if (search && newSupes.indexOf(search) === -1) {
			newSupes.unshift(search);
		}

		return newSupes;
	};
	//

	// Load Clients for selectbox //
	$scope.siteSpin = false;
	$scope.clientFilterDisable = true;
	$scope.uiClient = [];
	$scope.getClient = function (search) {
		var newSupes = $scope.uiClient.slice();
		if (search && newSupes.indexOf(search) === -1) {
			newSupes.unshift(search);
		}

		return newSupes;
	};

	$scope.loadUsers = function(){
	    console.log("Loading all users");
	    var searchCriteria = {};
	    searchCriteria.findAll = true;
	    UserComponent.search(searchCriteria).then(function (data) {
	        console.log("success");
	        console.log(data);
            $scope.allUsers = data.transactions;
        })
    };

	$scope.loadUserDetails = function(userDetails){
	    console.log("User details");
	    console.log(userDetails);
	    $scope.userDetails = userDetails;
	    $scope.showUserDetails = true;
    };

	$scope.clearUsers = function($event){
        $event.stopPropagation();
        $scope.userDetails = null;
        $scope.showUserDetails = false;

    };

	$scope.attendanceSites = function () {
		SiteComponent.findAll().then(function (data) {
			//console.log("site attendances");
			$scope.allSites = data;
		});
	};

	$scope.loadProjects = function () {
		//console.log("Loading all projects")
		ProjectComponent.findAll().then(function (data) {
			$scope.projects = data;
			/** Ui-select scope **/
			$scope.clients[0] = $scope.allClients;
			/*for(var i=0;i<$scope.projects.length;i++)
                {
                    $scope.uiClient[i] = $scope.projects[i].name;
                }*/
			for(var i=0;i<$scope.projects.length;i++)
			{
				$scope.clients[i+1] = $scope.projects[i];
			}
			$scope.clientDisable = false;
			$scope.clientFilterDisable = false;
		});
	};

	/** Ui-select function **/

	$scope.loadDepSitesList = function (searchProject) {
		$scope.siteSpin = true;
		$scope.searchProject = searchProject;
		if(jQuery.isEmptyObject($scope.searchProject) === true){
			SiteComponent.findAll().then(function (data) {
				$scope.selectedSite = null;
				$scope.sitesList = data;
				$scope.sitesLists = [];
				$scope.sitesListOne.selected = null;
				$scope.sitesLists[0] = $scope.allSitesVal;

				for(var i=0;i<$scope.sitesList.length;i++)
				{
					$scope.sitesLists[i+1] = $scope.sitesList[i];
				}
				$scope.siteFilterDisable = false;
				$scope.siteSpin = false;
			});
		}else{
			if(jQuery.isEmptyObject($scope.selectedProject) === false) {
				var depProj=$scope.selectedProject.id;
				$scope.selectedSite = null;
			}else if(jQuery.isEmptyObject($scope.searchProject) === false){
				var depProj=$scope.searchProject.id;
			}else{
				var depProj=0;
			}

			ProjectComponent.findSites(depProj).then(function (data) {

				$scope.sitesList = data;
				$scope.sitesLists = [];
				$scope.sitesListOne.selected = null;
				$scope.sitesLists[0] = $scope.allSitesVal;

				for(var i=0;i<$scope.sitesList.length;i++)
				{
					$scope.sitesLists[i+1] = $scope.sitesList[i];
				}
				$scope.siteFilterDisable = false;
				$scope.siteSpin = false;
			});
		}

	};

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

	$scope.loadSearchSite = function (searchSite) {
		$scope.searchSite = $scope.sites[$scope.uiSite.indexOf(searchSite)];
		$scope.hideSite = true;
	};
	$scope.employeeSearch = function () {
		if(!$scope.allEmployees) {
			EmployeeComponent.findAll().then(function (data) {
				//console.log(data)
				$scope.allEmployees = data;
			})
		}
	};

	$scope.allSites=[{name:'UDS'},{name:'Zappy'}];

	$scope.refreshPage = function() {
		$scope.loadAttendances();
	};

    $scope.saveDetails = function(){
        var a = HierarchyNodeService.getSelectedItems();
        console.log(a);
        console.log(a.length);
        console.log($scope.userDetails.id);
        OnBoardingComponent.create(a,$scope.userDetails.id,function(response,err){
            if(response){
                console.log("Successfully saved on boarding user config details");
                console.log(response);
            }
            if(err){
                console.log("Error in saving on boarding user config details");
                console.log(err);
            }
        })
    };



    $scope.getUserDetails = function(code){
        UserComponent.getUserByCode(code).then(function (data){
            console.log(data);
            $scope.showUserDetails = true;
            $scope.userDetails = data;
            $rootScope.$emit("GetUserConfigDetailsMethod",{userId:data.id});
            // $scope.getUserConfigDetails(data.id);
        })
    };

	$scope.loadSites = function () {
		$scope.showLoader();
		console.log('selected project - ' + JSON.stringify($scope.selectedProject));
		if($scope.selectedProject) {
			ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
				$scope.sites = data;
				$scope.hideLoader();

			});
		}else {
			SiteComponent.findAll().then(function (data) {
				$scope.sites = data;
				$scope.hideLoader();

			});
		}
	};

	$scope.isActiveAsc = 'id';
	$scope.isActiveDesc = '';

	$scope.columnAscOrder = function(field){
		$scope.selectedColumn = field;
		$scope.isActiveAsc = field;
		$scope.isActiveDesc = '';
		$scope.isAscOrder = true;
		$scope.search();
		//$scope.loadAttendances();
	};

	$scope.columnDescOrder = function(field){
		$scope.selectedColumn = field;
		$scope.isActiveDesc = field;
		$scope.isActiveAsc = '';
		$scope.isAscOrder = false;
		$scope.search();
		//$scope.loadAttendances();
	};


	$scope.searchFilter = function () {
		$('.AdvancedFilterModal.in').modal('hide');
		$scope.setPage(1);
		$scope.search();
	};

	$scope.searchFilter1 = function () {
		$scope.clearField = false;
		$scope.SearchEmployeeId = null;
		$scope.SearchEmployeeName = null;
		$scope.searchCriteria.employeeEmpId =null;
		$scope.searchCriteria.name =null;
		$scope.setPage(1);
		$scope.search();
	};

	$scope.search = function () {
		$scope.noData = false;
		//console.log($scope.datePickerDate);


		var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
		if(!$scope.searchCriteria) {
			var searchCriteria = {
					currPage : currPageVal
			};
			$scope.searchCriteria = searchCriteria;

		}

		$scope.searchCriteria.currPage = currPageVal;

		/* Root scope (search criteria) start*/

		if($rootScope.searchFilterCriteria.isDashboard){
            $rootScope.isDashboard = true;
			if($rootScope.searchFilterCriteria.projectId){
				$scope.searchProject ={id:$rootScope.searchFilterCriteria.projectId,name:$rootScope.searchFilterCriteria.projectName};
				$scope.client.selected =$scope.searchProject;
				$scope.projectFilterFunction($scope.searchProject);
			}else{
				$scope.searchProject = null;
				$scope.client.selected =$scope.searchProject;
			}
			if($rootScope.searchFilterCriteria.regionId){
				$scope.searchRegion = {id:$rootScope.searchFilterCriteria.regionId,name:$rootScope.searchFilterCriteria.region};
				$scope.regionsListOne.selected = $scope.searchRegion;
				$scope.regionFilterFunction($scope.searchProject);
			}else{
				$scope.searchRegion = null;
				$scope.regionsListOne.selected = $scope.searchRegion;
			}
			if($rootScope.searchFilterCriteria.branchId){
				$scope.searchBranch = {id:$rootScope.searchFilterCriteria.branchId,name:$rootScope.searchFilterCriteria.branch};
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
				$scope.selectedDateFrom = $filter('date')($rootScope.searchFilterCriteria.attendFromDate, 'dd/MM/yyyy');
				$scope.selectedDateFromSer = new Date($rootScope.searchFilterCriteria.attendFromDate);
			}/*else{
	        	    $scope.searchCriteria.checkInDateTimeFrom = null;
	        	    $scope.selectedDateFrom = null;
	        	}*/

	        	if($rootScope.searchFilterCriteria.attendToDate) {
	        		$scope.searchCriteria.checkInDateTimeTo = $rootScope.searchFilterCriteria.attendToDate;
	        		$scope.selectedDateTo = $filter('date')($rootScope.searchFilterCriteria.attendToDate, 'dd/MM/yyyy');
	        		$scope.selectedDateToSer = new Date($rootScope.searchFilterCriteria.attendToDate);
	        	}/*else{
	        	    $scope.searchCriteria.checkInDateTimeTo = null;
	        	    $scope.selectedDateTo = null;
	        	}*/

	        	/* Root scope (search criteria) end*/

		}else{

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
			if($scope.selectedDateFrom) {
				$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedDateFromSer;
			}
			if($scope.selectedDateTo) {
				$scope.searchCriteria.checkInDateTimeTo = $scope.selectedDateToSer;
			}

		}

		/* Root scope (search criteria) */
		$rootScope.searchFilterCriteria.isDashboard = false;

		$scope.searchCriteria.findAll = false;
		$scope.searchCriteria.list = false;
		$scope.searchCriteria.report = false;
		$scope.searchCriteria.isReport = false;

		if(!$scope.searchEmployeeId && !$scope.searchEmployeeName && !$scope.searchSite && !$scope.searchProject) {
			$scope.searchCriteria.findAll = true;
		}

		if($scope.searchEmployeeId)
		{
			$scope.searchCriteria.employeeEmpId = $scope.searchEmployeeId;
			console.log('selected emp id ='+ $scope.searchCriteria.employeeEmpId);
		}
		else{
			$scope.searchCriteria.employeeEmpId = "";
		}
		if($scope.searchEmployeeName)
		{
			$scope.searchCriteria.name = $scope.searchEmployeeName;
			console.log('selected emp name ='+ $scope.searchCriteria.name);
		}
		else{
			$scope.searchCriteria.name = "";
		}

		if(jQuery.isEmptyObject($scope.searchProject) == false) {
			//console.log('selected project -' + $scope.searchProject.id);
			$scope.searchCriteria.projectId = $scope.searchProject.id;
			$scope.searchCriteria.projectName = $scope.searchProject.name;
		}else{
			$scope.searchCriteria.projectId = null;
			$scope.searchCriteria.projectName = null;
		}

		if(jQuery.isEmptyObject($scope.searchSite) == false) {
			//console.log('selected site -' + $scope.searchSite.id);
			$scope.searchCriteria.siteId = $scope.searchSite.id;
			$scope.searchCriteria.siteName = $scope.searchSite.name;
		}else{
			$scope.searchCriteria.siteId = null;
			$scope.searchCriteria.siteName = null;
		}

		if($scope.selectedSite) {
			$scope.searchCriteria.siteId = $scope.selectedSite.id;
		}


		if($scope.selectedProject) {
			$scope.searchCriteria.projectId = $scope.selectedProject.id;

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


		console.log('search criterias - ',JSON.stringify($scope.searchCriteria));
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
		$scope.onBoardingEmployees = [];
		$scope.onBoardingEmployeesLoader = false;
		$scope.loadPageTop();
		$scope.searchCriteria.verified= true;
		EmployeeComponent.search($scope.searchCriteria).then(function (data) {
		    console.log("on boarding employee list");
		    console.log(data);
			$scope.onBoardingEmployees = data.transactions;
			$scope.onBoardingEmployeesLoader = true;

			if($scope.onBoardingEmployees != null){
                $scope.onBoardingEmployees = data.transactions;
			}
			//

			/*
			 ** Call pagination  main function **
			 */
			$scope.pager = {};
			$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
			$scope.totalCountPages = data.totalCount;

			//console.log("Pagination",$scope.pager);
			//console.log('Attendance search result list -' + JSON.stringify($scope.onBoardingEmployees));
			if(data.currPage == 0){
				$scope.pages.currPage = 1;
			}else{
				$scope.pages.currPage = data.currPage;
			}

			$scope.pages.totalPages = data.totalPages;


			if($scope.onBoardingEmployees && $scope.onBoardingEmployees.length > 0 ){
				$scope.showCurrPage = data.currPage;
				$scope.pageEntries = $scope.projects.length;
				$scope.totalCountPages = data.totalCount;
				$scope.pageSort = 10;
				$scope.noData = false;

			}else{
				$scope.noData = true;
			}

		}).catch(function(){
            $scope.noData = true;
            $scope.onBoardingEmployeesLoader = true;
            $scope.showNotifications('top','center','danger','Unable to load attendance list..');
        });

	};

	$scope.loadEnrImage = function(enrollId) {

		//Employee Enrolled Image
		EmployeeComponent.findOne(enrollId).then(function (data) {
			//console.log(data);
			var enrollImg = data.enrolled_face;

			var eleId1 = 'photoEnrolled';
			var ele1 = document.getElementById(eleId1);
			ele1.setAttribute('src',enrollImg);
		}).catch(function(){
            $scope.showNotifications('top','center','danger','Unable to load enroll img..');
        });
	};


	$scope.loadImagesNew = function(imageUrl, enrollUrl) {
        if(enrollUrl){
         $scope.enrollImg = enrollUrl;
        }else{
          $scope.enrollImg = "../assets/img/user.png";
        }
        if(imageUrl){
              $scope.attenImg = imageUrl;
        }else{
             $scope.attenImg = "../assets/img/user.png";
        }

	};

	$scope.clearFilter = function() {
		$('input#dateFilterFrom').data('DateTimePicker').clear();
		$('input#dateFilterTo').data('DateTimePicker').clear();
		$scope.noData = false;
		$scope.clearField = true;
		$rootScope.exportStatusObj = {};
		$scope.exportStatusMap = [];
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

		$scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.selectedDateFromSer =  new Date();
		$scope.selectedDateToSer =  new Date();
		$('input#dateFilterFrom').val($scope.selectedDateFrom);
		$('input#dateFilterTo').val($scope.selectedDateTo);
		$scope.selectedEmployee = null;
		$scope.selectedProject = null;
		$scope.selectedSite = null;
		$scope.searchProject = null;
		$scope.searchSite = null;
		$scope.searchEmployeeId = null;
		$scope.searchEmployeeName = null;
		$scope.searchCriteria = {};
		$rootScope.searchCriteriaAttendances   = null;
		// $scope.selectedDateFrom = null;
		// $scope.selectedDateTo = null;
		$scope.filter = true;
		$scope.siteFilterDisable = true;
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


	$scope.exportAllData = function(type){
		$scope.searchCriteria.exportType = type;
		$rootScope.exportStatusObj = {};
		$scope.exportStatusMap = [];
		$scope.downloaded = false;
		$scope.downloader=true;
		$scope.searchCriteria.list = true;
		$scope.searchCriteria.report = true;
		$scope.searchCriteria.isReport = true;
		$scope.searchCriteria.columnName = "createdDate";
		$scope.searchCriteria.sortByAsc = false;
		AttendanceComponent.exportAllData($scope.searchCriteria).then(function(data){
			var result = data.results[0];
			console.log(result);
			console.log(result.file + ', ' + result.status + ',' + result.msg);
			var exportAllStatus = {
					fileName : result.file,
					exportMsg : 'Exporting All...'
			};
			$scope.exportStatusMap[0] = exportAllStatus;
			console.log('exportStatusMap size - ' + $scope.exportStatusMap.length);
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

	$scope.exportStatusMap = [];


	$scope.exportStatus = function() {
		//console.log('empId='+$scope.empId);
		console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
		angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
			if(!exportStatusObj.empId) {
				exportStatusObj.empId = 0;
			}
			AttendanceComponent.exportStatus(exportStatusObj.empId,exportStatusObj.fileName).then(function(data) {
				if(data) {
					exportStatusObj.exportStatus = data.status;
					console.log('exportStatus - '+ exportStatusObj);
					exportStatusObj.exportMsg = data.msg;
					$scope.downloader=false;
					console.log('exportMsg - '+ exportStatusObj.exportMsg);
					if(exportStatusObj.exportStatus == 'COMPLETED'){
						exportStatusObj.exportFile = data.file;
						console.log('exportFile - '+ exportStatusObj.exportFile);
						$scope.stop();
					}else if(exportStatusObj.exportStatus == 'FAILED'){
						$scope.stop();
					}else if(!exportStatusObj.exportStatus){
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
		});

	};

	$scope.exportFile = function(empId) {
		if(empId != 0) {
			var exportFile = '';
			angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
				if(empId == exportStatusObj.empId){
					exportFile = exportStatusObj.exportFile;
					return exportFile;
				}
			});
			return exportFile;
		}else {
			return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportFile : '#');
		}
	};


	$scope.exportMsg = function(empId) {
		if(empId != 0) {
			var exportMsg = '';
			angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
				if(empId == exportStatusObj.empId){
					exportMsg = exportStatusObj.exportMsg;
					return exportMsg;
				}
			});
			return exportMsg;
		}else {
			return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportMsg : '');
		}

	};

	$scope.downloaded = false;

	$scope.clsDownload = function(){
		$scope.downloaded = true;
		$rootScope.exportStatusObj = {};
		$scope.exportStatusMap = [];
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

	$scope.showNotifications= function(position,alignment,color,msg){
		demo.showNotification(position,alignment,color,msg);
	};

	$scope.initCalender();

	//init load
	$scope.initLoad = function(){
		$scope.loadPageTop();
		$scope.init();
		//$scope.setPage(1);

        $scope.search();

    };


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

	$scope.exportStatusMap = [];


	$scope.exportStatus = function() {
		//console.log('empId='+$scope.empId);

		//console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
		angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
			if(!exportStatusObj.empId) {
				exportStatusObj.empId = 0;
			}
			AttendanceComponent.exportStatus(exportStatusObj.empId,exportStatusObj.fileName).then(function(data) {
				if(data) {
					exportStatusObj.exportStatus = data.status;
					//console.log('exportStatus - '+ exportStatusObj);
					exportStatusObj.exportMsg = data.msg;
					$scope.downloader=false;
					//console.log('exportMsg - '+ exportStatusObj.exportMsg);
					if(exportStatusObj.exportStatus == 'COMPLETED'){
						if(exportStatusObj.url) {
							exportStatusObj.exportFile = exportStatusObj.url;
						}else {
							exportStatusObj.exportFile = data.file;
						}
						//console.log('exportFile - '+ exportStatusObj.exportFile);
						$scope.stop();
					}else if(exportStatusObj.exportStatus == 'FAILED'){
						$scope.stop();
					}else if(!exportStatusObj.exportStatus){
						$scope.stop();
					}else {
                        $rootScope.exportStatusObj.exportFile = '#';
					}
				}

			});
		});

	};

	$scope.exportFile = function(empId) {
		if(empId != 0) {
			var exportFile = '';
			angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
				if(empId == exportStatusObj.empId){
					exportFile = exportStatusObj.exportFile;
					return exportFile;
				}
			});
			return exportFile;
		}else {
			return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportFile : '#');
		}
	};


	$scope.exportMsg = function(empId) {
		if(empId != 0) {
			var exportMsg = '';
			angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
				if(empId == exportStatusObj.empId){
					exportMsg = exportStatusObj.exportMsg;
					return exportMsg;
				}
			});
			return exportMsg;
		}else {
			return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportMsg : '');
		}

	};


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
				$scope.sitesLists[0] = $scope.allSitesVal;

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
				$scope.sitesLists[0] = $scope.allSitesVal;

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
		$scope.sitesListOne.selected = undefined;

	};


	/*
	 * Ui select allow-clear modified function end
	 *
	 * */

});
