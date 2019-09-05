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
    $scope.showUserBranchesList = false;
    $scope.userBranchList = [];
    $scope.addressProofImage;
	//$timeout(function (){angular.element('[ng-model="name"]').focus();});
	$scope.sapBusinessCategoriesList = {};
    $scope.enableApproval= false;
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
	$scope.selctedSapBusinessCategoriesList = [];
	$scope.selectedBranch = "";

    $scope.allBranches = {id:0, element:' -- All Branches --'};
    $scope.branch={};
    $scope.branches = [];

    $scope.allProjects = {id:0, element:' -- All Projects --'};
    $scope.project={};
    $scope.projects=[];

    $scope.allWBS = {id:0, element:' -- All WBS --'};
    $scope.wbs = {};
    $scope.wbsList = [];

    $scope.selectedBranchCode = null;
    $scope.selectedProjectCode = null;
    $scope.selectedWBSCode = null;
    $scope.selectedBranchDetails={};
    $scope.selectedWBSDetails={};
    $scope.selectedProjectDetails={};

    $scope.showCategoriesLoader = false;
	$scope.now = new Date();

    $scope.totalStates = [
        { name: 'Assam', key: 'assam' },
        { name: 'Andhra Pradesh', key: 'andhrapradesh' },
        { name: 'Odisha', key: 'odisha' },
        { name: 'Punjab', key: 'punjab' },
        { name: 'Delhi', key: 'delhi' },
        { name: 'Gujarat', key: 'gujarat' },
        { name: 'Karnataka', key: 'karnataka' },
        { name: 'Haryana', key: 'haryana' },
        { name: 'Rajasthan', key: 'rajasthan' },
        { name: 'Himachal Pradesh', key: 'himachalpradesh' },
        { name: 'Jharkand', key: 'jharkand' },
        { name: 'Chhattisgarh', key: 'chhattisgarh' },
        { name: 'Kerala', key: 'kerala' },
        { name: 'Tamil Nadu', key: 'tamilnadu' },
        { name: 'Madhya Pradesh', key: 'madhyapradesh' },
        { name: 'Bihar', key: 'bihar' },
        { name: 'Maharashtra', key: 'maharashtra' },
        { name: 'Chandigarh', key: 'chandigarh' },
        { name: 'Telangana', key: 'telangana' },
        { name: 'Jammu and Kashmir', key: 'jammu and kashmir' },
        { name: 'Tripura', key: 'tripura' },
        { name: 'Meghalaya', key: 'meghalaya' },
        { name: 'Goa', key: 'goa' },
        { name: 'Arunachal Pradesh', key: 'arunachalpradesh' },
        { name: 'Manipur', key: 'manipur' },
        { name: 'Mizoram', key: 'mizoram' },
        { name: 'Sikkim', key: 'sikkim' },
        { name: 'Puduchery', key: 'puduchery' },
        { name: 'Nagaland', key: 'nagaland' },
        { name: 'Andaman and Nicobhar', key: 'andaman and nicobhar' },
        { name: 'Dadra and Nagar Haveli', key: 'dasra and nagarhaveli' },
        { name: 'Daman and Diu', key: 'daman and diu' },
        { name: 'Lakshadweep', key: 'lakshadweep' },
        { name: 'Uttarakhand', key: 'uttarakhand' },
        { name: 'Uttar Pradesh', key: 'uttar pradesh' },
        { name: 'West Bengal', key: 'west bengal' },
    ];

	$scope.initCalender = function(){

		demo.initFormExtendedDatetimepickers();

	};

	var mappingValidation = function(){

		if( _.find( $scope.userDetails.userRole.rolePermissions,{actionName:'Restiction'}) ){

			if($("wbsListCheckBox:checked").length > 4){
 
				$scope.showNotifications('top','center','danger','We can choose only one WBS for this type of users');
				return false;

			}
			
		}

		return true;

	}

	$scope.setSelectedBranch = function(){
 
		$scope.selctedSapBusinessCategoriesList = [];
		$scope.selctedSapBusinessCategoriesList.push(_.find($scope.sapBusinessCategoriesList.rootElements,{elementCode:$scope.selectedBranch}));

		//console.log(console.log($scope.selctedSapBusinessCategoriesList));

		OnBoardingComponent.getElementsByUser($scope.userDetails.id,$scope.selectedBranch).then(function (data) {

			$scope.mappedData = data; 
			
			for(var i in $scope.mappedData){

				console.log(".ip_"+$scope.mappedData[i].elementCode+"_"+$scope.mappedData[i].elementType);

				$(".ip_"+$scope.mappedData[i].elementCode+"_"+$scope.mappedData[i].elementType).prop("checked",true);

			}
 
			 
		});

	}

	$scope.loadgetSapBusinessCategories = function(){
	    $scope.showCategoriesLoader = true;

		OnBoardingComponent.getSapBusinessCategories().then(function(data){

			$scope.sapBusinessCategoriesList.rootElements = JSON.parse(data.elementsJson);
			$scope.sapBusinessCategoriesList.userConfElements = $scope.mappedData;

            $scope.showCategoriesLoader = false;

			//  $scope.sapBranches = _.map($scope.sapBusinessCategoriesList,_.partialRight(_.pick,['elemetType','elementName']));
  
			//  console.log($scope.sapBranches);

		})
		
	}

	 $('#dateOfBirth').on('dp.change', function(e){
		 //alert("inside");
         $.notifyClose();
         $scope.employee.dob= $filter('date')(e.date._d, 'yyyy-MM-dd');
     });
	 
	 $('#dateOfJoining').on('dp.change', function(e){
		 //alert("inside");
         $.notifyClose();
         $scope.employee.doj= $filter('date')(e.date._d, 'yyyy-MM-dd');
     });
	
	
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


	$scope.initRootScope = function(){

		if(!$rootScope.onBoardingFilter){ 

			$rootScope.onBoardingFilter = {branches:{list:[],selected:{}},projects:{list:[],selected:{}},wbs:{list:[],selected:{}},employee:{name:null,empId:null,page:1,type:1}};

		}

	}

	$scope.newEmployee = false;
	$scope.existingEmployee = false;

	$scope.setListType = function(type){

		$rootScope.onBoardingFilter.employee.type = type;
		
		$scope.newEmployee = type;
		$scope.existingEmployee = !type; 

	}

	$scope.LoadEmpListByType = function(type){

		$scope.setPage(1);
		$scope.onBoardingEmployees = [];
		$scope.setListType(type);
		$scope.search();

	}

	// Init load employees
	$scope.init = function() {
		// $scope.loadAttendances();

		$scope.initRootScope();

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

	$scope.loadUserBranchList = function(userDetails){
		console.log("Load userBranch list");
		$scope.userBranchList = [];
        OnBoardingComponent.getBranchList($scope.userDetails.id).then(function (data) {
            $scope.showUserBranchesList = true;
            $scope.userBranchList = data;
        })
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
        OnBoardingComponent.getBranchList().then(function (data) {
            console.log("Getting branch list ");
            console.log(data);
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

	$scope.initFilters = function(){



		if($rootScope.onBoardingFilter.branches.list.length > 0){

			$scope.branchSpin = $scope.clientFilterDisable = $scope.regionSpin = false;

			$scope.branchList = $rootScope.onBoardingFilter.branches.list;
			$scope.projectList = $rootScope.onBoardingFilter.projects.list;
			$scope.wbsList = $rootScope.onBoardingFilter.wbs.list;

			$scope.client.selected = $rootScope.onBoardingFilter.branches.selected ;
			$scope.regionsListOne.selected = $rootScope.onBoardingFilter.projects.selected ;
			$scope.branchsListOne.selected = $rootScope.onBoardingFilter.wbs.selected ;

            $scope.selectedBranchDetails = $scope.client.selected;
            $scope.selectedProjectDetails = $scope.regionsListOne.selected;
            $scope.selectedWBSDetails = $scope.branchsListOne.selected;
			$scope.searchEmployeeId = $scope.onBoardingFilter.employee.empId ;
			$scope.searchEmployeeName = $scope.onBoardingFilter.employee.name ;


			$scope.pages.currPage = $scope.onBoardingFilter.employee.page;

			$scope.setListType($rootScope.onBoardingFilter.employee.type);

			$scope.doSearchFilter();

		}
		else{
			$rootScope.onBoardingFilter.employee.type = 1;
		    $scope.clearFilterKeys();
            $scope.getBranchList();
			$scope.search();

		}
 
	};

	$scope.enableTags = function(enable){
 
	    return !!(enable && enable.element);
    }

	$scope.clearFilterKeys = function(){
		console.log("clear filter keys");
		$scope.setListType($rootScope.onBoardingFilter.employee.type);

		$scope.client.selected = null;
		$scope.regionsListOne.selected =  null ;
		$scope.branchsListOne.selected =  null;
		
        $scope.selectedBranchDetails=null;
        $scope.selectedWBSDetails=null;
        $scope.selectedProjectDetails=null;
        $scope.searchEmployeeId=null;
        $scope.searchEmployeeName=null;
    }

    $scope.getBranchList = function(){
        OnBoardingComponent.getBranchList(0).then(function (branchList) {
            $scope.branchList = branchList;
			$rootScope.onBoardingFilter.branches.list = branchList;
            $scope.branches= branchList;
            $scope.clientDisable=false;
            $scope.clientFilterDisable = false;
            console.log("Getting branch list ");
            console.log(branchList);
        })
    };

    $scope.getProjectListByBranch = function(branchCode){

		$rootScope.onBoardingFilter.branches.selected = $scope.client.selected;

        $scope.selectedBranchCode = branchCode.elementCode;
        $scope.selectedBranchDetails = branchCode;
        $scope.siteSpin = true;
        console.log(branchCode.elementCode);
        OnBoardingComponent.getProjectListByBranchCode(branchCode.elementCode).then(function (projectList) {
            console.log("Getting project list by branch code");
            console.log(projectList);
			$scope.projectList = projectList;
			$rootScope.onBoardingFilter.projects.list = projectList;
            $scope.siteFilterDisable = false;
            $scope.siteSpin = false;
        })
    };

    $scope.getWBSListByProject = function(projectCode){

		$rootScope.onBoardingFilter.projects.selected = $scope.regionsListOne.selected;

        $scope.selectedProjectCode = projectCode.elementCode;
        $scope.selectedProjectDetails = projectCode;
        console.log(projectCode.elementCode);
        $scope.branchSpin = true;
        OnBoardingComponent.getWBSListByProjectCode(projectCode.elementCode).then(function (wbsList) {
            console.log("Getting wbs id by project code");
            console.log(wbsList);
			$scope.wbsList = wbsList;
			$rootScope.onBoardingFilter.wbs.list = wbsList;
            $scope.branchSpin = false;
            $scope.branchFilterDisable = false;
        })
    };

    $scope.selectWBS = function(wbsCode){
		$rootScope.onBoardingFilter.wbs.selected = $scope.branchsListOne.selected;
        console.log(wbsCode);
        $scope.selectedWBSCode = wbsCode.elementCode;
        $scope.selectedWBSDetails = wbsCode;
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

	$scope.postMapping = [];

	function designInput(elements,elementParentCode){

		for(var i in elements){
 
			if( $(".ip_"+elements[i].elementCode+"_"+elements[i].elemetType).is(":checked") ){
			//if(elements.checked){
				$scope.postMapping.push( { 
											elementParent: elementParentCode,
											element : elements[i].elementName,
											elementType : elements[i].elemetType,
											elementCode : elements[i].elementCode,
											onBoardingUserId : $scope.userDetails.id,
											branch : $scope.selectedBranch,
											userId : null,
											childElements : []
										} ); 

				designInput(elements[i].childElements,elements[i].elementCode);

			}

		}

	}

	function initDesignInput(){

		$scope.postMapping = [];

		designInput($scope.selctedSapBusinessCategoriesList,null);

		console.log($scope.postMapping);
	}

	$scope.saveMappingLoader = false;

    $scope.saveDetails = function(){

		if(mappingValidation()){ 
			// var a = HierarchyNodeService.getSelectedItems();
			// console.log(a);
			// console.log(a.length);
			// console.log($scope.userDetails.id);

			$scope.saveMappingLoader = true;
			
			initDesignInput();


			OnBoardingComponent.create($scope.postMapping,$scope.userDetails.id,$scope.selectedBranch,function(response,err){
				if(response){
					$scope.saveMappingLoader = false;
					$scope.showNotifications('top', 'center', 'success', "Buisiness Area are mapped Successfully");
					$scope.loadUserBranchList();
				}
				if(err){
					$scope.showNotifications('top', 'center', 'danger', "error in save");
					$scope.saveMappingLoader = false;
					
				}
			});
			
		}
    };

	$scope.mappedData = [];
 
    $scope.getUserDetails = function(code){
        UserComponent.getUserByCode(code).then(function (data){
            
            $scope.showUserDetails = true;
			$scope.userDetails = data;

			$scope.loadgetSapBusinessCategories();

			$scope.loadUserBranchList();

           // $rootScope.$emit("GetUserConfigDetailsMethod",{userId:data.id});
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

	$scope.doSearchFilter = function(){
 
		$scope.search();

	}

	$scope.searchFilter = function () {

		$('.AdvancedFilterModal.in').modal('hide');

		$scope.onBoardingFilter.employee.empId = $scope.searchEmployeeId;
		$scope.onBoardingFilter.employee.name = $scope.searchEmployeeName;
		
		$scope.setPage(1);

	};
	
/*******************************************Modified by Vinoth*************************************************************************************/
	
	$rootScope.exportStatusObj = {};

	$scope.exportAllData = function(){
		$('.AdvancedFilterModalexport.in').modal('hide');
		$rootScope.exportStatusObj = {};
		$scope.downloaded = false;
		$scope.downloader=true;
		$scope.searchCriteria.list = true;
		$scope.searchCriteria.report = true;
		$scope.searchCriteria.columnName = "createdDate";
		$scope.searchCriteria.sortByAsc = false;
		if($scope.selectedBranchCode !=null){
		    $scope.searchCriteria.branchCode = $scope.selectedBranchCode;
        }

		if($scope.selectedProjectCode !=null){
		    $scope.searchCriteria.projectCode = $scope.selectedProjectCode;
        }
		if($scope.selectedWBSCode !=null){
		    $scope.searchCriteria.wbsCode = $scope.selectedWBSCode;
        }
		$scope.searchCriteria.verified = false;
		//alert("before");
		EmployeeComponent.exportOnboardingAllData($scope.searchCriteria).then(function(data){
			//alert("after")
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

/**************************************************************************************************************************************	*/
	
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
		$scope.searchCriteria.newEmployee = $scope.newEmployee;  
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


		}

		/* Root scope (search criteria) */
		$rootScope.searchFilterCriteria.isDashboard = false;

		$scope.searchCriteria.findAll = false;
		$scope.searchCriteria.list = false;
		$scope.searchCriteria.report = false;
		$scope.searchCriteria.isReport = false;

		if(!$scope.searchEmployeeId && !$scope.searchEmployeeName ) {
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
		console.log("to be verified");
		console.log($scope.verified);
		
		$scope.searchCriteria.newemployee = $scope.newemployee;
 		 
		$scope.searchCriteria.branchCode = $scope.client.selected ? $scope.client.selected.elementCode : null;
  
	    $scope.searchCriteria.projectCode = $scope.regionsListOne.selected ? $scope.regionsListOne.selected.elementCode : null;
   
		$scope.searchCriteria.wbsCode = $scope.branchsListOne.selected ? $scope.branchsListOne.selected.elementCode : null;
  	
		$scope.searchCriteria.verified = false;
		$scope.searchCriteria.submitted = true;
		$scope.searchCriteria.newemployee = false;
		OnBoardingComponent.searchEmployees($scope.searchCriteria).then(function (data) {
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
				$scope.pageEntries = $scope.onBoardingEmployees.length;
				$scope.totalCountPages = data.totalCount;
				$scope.pageSort = 10;
				$scope.noData = false;

			}else{
				$scope.noData = true;
			}

		}).catch(function(){
            $scope.noData = true;
            $scope.onBoardingEmployeesLoader = true;
            $scope.showNotifications('top','center','danger','Unable to load Employee list..');
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
                    $scope.employee.mobile = parseInt($scope.employee.mobile);
                    $scope.employee.emergencyContactNumber= parseInt($scope.employee.emergencyContactNumber);
                    $scope.employee.nomineeContactNumber = parseInt($scope.employee.nomineeContactNumber);

					console.log($scope.employee.newEmployee);

                    EmployeeComponent.getEmployeeDocuments(data.id).then(function (documents) {
                        console.log("Employee documents");
                        console.log(documents);
                        if(documents && documents.length>0){
                            for(var i=0; i<documents.length;i++){
                                console.log(documents[i].docType);
                                if(documents[i].docType === "address_proof_image" || documents[i].docType === "addressProof" ){
                                    $scope.addressproofImageUrl = documents[i].docUrl;
                                }
                                if(documents[i].docType === "bank_passbook_image" || documents[i].docType === "prePrintedStatement"){
                                    $scope.bankPassBookImageUrl = documents[i].docUrl;
                                }
                                if(documents[i].docType === "adhar_card_front" || documents[i].docType === "aadharPhotoCopy"){
                                    $scope.adharCardFrontUrl = documents[i].docUrl;
                                }
                                if(documents[i].docType === "adhar_card_back" || documents[i].docType === "aadharPhotoCopy"){
                                    $scope.adharCardBackUrl = documents[i].docUrl;
                                }
                                if(documents[i].docType === "fingerprint_left" || documents[i].docType === "thumbImpressenLeft"){
                                    $scope.fingerprintLeftUrl = documents[i].docUrl;
                                }
                                if(documents[i].docType === "fingerprint_right" || documents[i].docType === "thumbImpressenRight"){
                                    $scope.fingerprintrightUrl = documents[i].docUrl;
                                }
                                if(documents[i].docType === "driving_license" || documents[i].docType === "drivingLicense"){
                                    $scope.drivingLicenseUrl = documents[i].docUrl;
                                }
                                if(documents[i].docType === "voter_id" || documents[i].docType === "voterId"){
                                    $scope.voterIdUrl = documents[i].docUrl;
                                }
                                if(documents[i].docType === "pancard" || documents[i].docType === "pancardCopy"){
                                    $scope.pancardUrl = documents[i].docUrl;
                                }
                                if(documents[i].docType ==="profilepic" || documents[i].docType === "profilePicImg"){
                                	$scope.profilepicUrl = documents[i].docUrl;
                                }
                            }

                            if(
								$scope.employee.accountNumber !=null &&
								$scope.employee.position !=null &&
                                $scope.employee.adharCardNumber !=null &&
                                $scope.employee.bloodGroup !=null &&
                                $scope.employee.dob !=null &&
                                $scope.employee.doj !=null &&
                                $scope.employee.educationalQulification !=null &&
                                $scope.employee.empId !=null &&
                                $scope.employee.fatherName !=null &&
                                $scope.employee.gender !=null &&
                                $scope.employee.ifscCode !=null &&
                                $scope.employee.maritalStatus !=null &&
                                $scope.employee.mobile !=null &&
                                $scope.employee.name !=null &&
                                $scope.employee.nomineeName !=null &&
                                $scope.employee.nomineeRelationship !=null &&
                                $scope.employee.percentage !=null &&
                                $scope.employee.permanentAddress !=null &&
                                $scope.employee.permanentCity !=null &&
                                $scope.employee.permanentState !=null &&
                                $scope.employee.presentAddress !=null &&
                                $scope.employee.presentCity !=null &&
                                $scope.employee.presentState !=null &&
                                $scope.employee.projectCode !=null &&
                                $scope.employee.projectDescription !=null &&
                                $scope.employee.religion !=null &&
                                $scope.employee.wbsDescription !=null &&
                                $scope.employee.wbsId !=null &&
								_.find(documents,{docType:'aadharPhotoCopy'}) &&
								_.find(documents,{docType:'aadharPhotoCopyBack'}) && 
								(($scope.employee.newEmployee &&  _.find(documents,{docType:'prePrintedStatement'}) ||
								  !$scope.employee.newEmployee )
								)

                            ){
                                $scope.enableApproval = true;
                            }
                        }

                    });



                }else{
                    $location.path('/onBoarding-list');
                }
                $scope.loadingStop();

            }).catch(function(){
                $location.path('/onBoarding-list');
            });
        }else{
            $location.path('/onBoarding-list');
        }

    };

    $scope.conform = function(text,validation)
    {
        //console.log($scope.selectedProject)
        $rootScope.conformText = text;
        $scope.valid = validation;
        $('#conformationModal').modal();

    }
    
    $scope.editpage = function(text)
    {
    	if(text == 'edit'){
    		 $location.path('edit-onBoarding/'+ $scope.employee.id);
    	}
    }

    $rootScope.back = function (text) {
        if(text == 'cancel' || text == 'back')
        {
            /** @reatin - retaining scope value.**/
            $rootScope.retain=1;
            $location.path('/onBoarding-list');
        }
        else if(text == 'approve')
        {
            $scope.approveOnBoardingEmployee();
        }
        else if(text == 'update')
        {
            /** @reatin - retaining scope value.**/
            $rootScope.retain=1;
            $scope.saveOnBoardingEmployeeDetails();
        }
    };

    $scope.clearFilter = function() {
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

        $scope.allBranches = {id:0, element:' -- All Branches --'};
        $scope.branch={};
        $scope.branches = [];

        $scope.allProjects = {id:0, element:' -- All Projects --'};
        $scope.project={};
        $scope.projects=[];

        $scope.allWBS = {id:0, element:' -- All WBS --'};
        $scope.wbs = {};
        $scope.wbsList = [];

        $scope.clearFilterKeys();

        $scope.selectedBranchCode = null;
        $scope.selectedProjectCode = null;
        $scope.selectedWBSCode = null;
        delete $scope.searchCriteria.projectCode;
        delete $scope.searchCriteria.employeeEmpId;
        delete $scope.searchCriteria.name;


        $scope.pages = {
            currPage: 1,
            totalPages: 0
        }
        /* Root scope (search criteria) */
        $rootScope.searchFilterCriteria.isDashboard = false;
        // $scope.search();
        $scope.onBoardingEmployees = [];
 
        $scope.LoadEmpListByType($rootScope.onBoardingFilter.employee.type);

    };

    $scope.approveOnBoardingEmployee = function(){
		
		$scope.saveLoad = true;

        OnBoardingComponent.verifyOnBoardingEmployee($scope.employee).then(function (data) {
			 
				$scope.saveLoad = false;

				if(data.type!="E"){

					$scope.employee.verified =true;
					$location.path('/onBoarding-list'); 
					$scope.showNotifications('top', 'center', 'success', "Employee Saved Successfully in SAP. SAP ID is "+data.empId);
				}
				else{
					
					$scope.success = null;
					$scope.disable = false;
					$scope.btnDisable = false;
					$scope.showNotifications('top','center','danger','Error in approving Employee.-> ' + data.message);
					$scope.error = 'ERROR';

				}

        }).catch(function(response){
            $scope.saveLoad = false;
            $scope.success = null;
            $scope.disable = false;
            $scope.btnDisable = false;
            $scope.showNotifications('top','center','danger','Error in approving Employee.' + response.data.errorMessage);
            $scope.error = 'ERROR';
        });
    };

    $scope.saveOnBoardingEmployeeDetails = function(){
        console.log("Saving employee details");
        //alert($scope.employee.dob);
        OnBoardingComponent.editOnBoardingEmployee($scope.employee).then(function (data) {

            if(data.errorStatus){
                $scope.saveLoad = false;
                $scope.success = null;
                $scope.disable = false;
                $scope.btnDisable = false;
                console.log(response);
                $scope.showNotifications('top','center','danger','Error in updating Employee.' + data.errorMessage);
                $scope.error = 'ERROR';
            }else{
                console.log("on boarding employee successfully saved");
                console.log(data);
                $location.path('view-onBoarding/'+ $scope.employee.id);
                //$location.path('/onBoarding-list');
                $scope.showNotifications('top', 'center', 'success', "Employee Saved Successfully ");
                $('#dateOfBirth').data('DateTimePicker').clear();
                $('#dateOfJoining').data('DateTimePicker').clear();
                if($scope.addressProofImage){
                    $scope.uploadAddressProofImage($scope.employee.id);
                }
                if($scope.bankPassBookImage){
                    $scope.uploadBankPassbookImage($scope.employee.id);
                }
                if($scope.adharCardImageBack){
                    $scope.uploadAdharCardImageBack($scope.employee.id);
                }
                if($scope.adharCardImageFront){
                    $scope.uploadAdharCardImageFront($scope.employee.id);
                }
                if($scope.fingerprintRightImage){
                    $scope.uploadFingerPrintRight($scope.employee.id);
                }
                if($scope.fingerprintLeftImage){
                    $scope.uploadFingerPrintLeft($scope.employee.id);
                }$scope.uploadPancard
                if($scope.drivingLicenseImageFront){
                    $scope.uploadDrivingLicense($scope.employee.id);
                }
                if($scope.voterIdImage){
                    $scope.uploadVoterId($scope.employee.id);
                }
                if($scope.pancardImage){
                    $scope.uploadPancard($scope.employee.id);
                }
                if($scope.profilepicImage){
                    $scope.uploadProfilePic($scope.employee.id);
                }
            }


        }).catch(function(response){
            $scope.saveLoad = false;
            $scope.success = null;
            $scope.disable = false;
            $scope.btnDisable = false;
            console.log(response);
            $scope.showNotifications('top','center','danger','Error in updating Employee.' + response.statusText);
            $scope.error = 'ERROR';
        });




    };

    $scope.uploadAddressProofImage = function(employeeId){
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.addressProofImage,'address_proof_image')
            .then(function (response) {
                console.log("Address proof image uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload address proof image",response);
        });
    };

    $scope.uploadBankPassbookImage = function(employeeId){
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.bankPassBookImage,'bank_passbook_image')
            .then(function (response) {
                console.log("bankPassBookImage uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload bankPassBookImage",response);
        });
    };

    $scope.uploadAdharCardImageFront = function(employeeId){
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.adharCardImageFront,'adhar_card_front')
            .then(function (response) {
                console.log("adharCardImageFront uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload adharCardImageFront",response);
        });
    };

    $scope.uploadAdharCardImageBack = function(employeeId){
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.adharCardImageBack,'adhar_card_back')
            .then(function (response) {
                console.log("adharCardImageBack uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload adharCardImageBack",response);
        });
    };

    $scope.uploadFingerPrintLeft = function(employeeId){
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.fingerprintLeftImage,'fingerprint_left')
            .then(function (response) {
                console.log("fingerprintLeftImage uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload fingerprintLeftImage",response);
        });
    };

    $scope.uploadFingerPrintRight = function(employeeId){
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.fingerprintRightImage,'fingerprint_right')
            .then(function (response) {
                console.log("fingerprintRightImage uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload fingerprintRightImage",response);
        });
    };

    $scope.uploadDrivingLicense = function(employeeId){
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.drivingLicenseImageFront,'driving_license')
            .then(function (response) {
                console.log("drivingLicenseImageFront uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload drivingLicenseImageFront",response);
        });
    };

    $scope.uploadVoterId = function(employeeId){
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.voterIdImage,'voter_id')
            .then(function (response) {
                console.log("voterIdImage uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload voterIdImage",response);
        });
    };

    $scope.uploadPancard = function(employeeId){
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.pancardImage,'pancard')
            .then(function (response) {
                console.log("pancardImage uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload pancardImage ",response);
        });
    };

    $scope.uploadProfilePic = function(employeeId){
    	console.log("UPloading profile pic");
    	console.log(employeeId);
        OnBoardingComponent.uploadDocumentImages(employeeId,$scope.profilepicImage,'profilepic')
            .then(function (response) {
                console.log("profilepicImage uploaded");
                console.log(response);
            }).catch(function (response) {
            console.log("Failed to upload profilepicImage ",response);
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

//****************************modified by suresh */
	$scope.loadCompletedJob = function(imageUrl) {
		var eleId = 'photoStart';
		var ele = document.getElementById(eleId);
		ele.setAttribute('src',imageUrl);

	};

//*********************************************** */
	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}

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
		demo.showNotificationLonger(position,alignment,color,msg);
	};

	$scope.initCalender();

	//init load
	$scope.initLoad = function(){
		$scope.loadPageTop();
		$scope.init();
		//$scope.setPage(1);

        $scope.getOldTobeVerifiedEmployees();

    };



    $scope.newempverify = function(type){
    	$scope.loadPageTop();
    	 $scope.getNewTobeVerifiedEmployees();

	};



	/*
	 ** Pagination init function **
        @Param:integer

	 */

	$scope.setPage = function () {

		var args = arguments;

		var page = args[0];


		if (page < 1 || page > $scope.pager.totalPages) {
			return;
		}
		//alert(page);
		$scope.pages.currPage = page;

		$rootScope.onBoardingFilter.employee.page = page;

		if(args.length == 1){
 
			$scope.search();

		}
 
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
