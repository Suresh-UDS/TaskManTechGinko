'use strict';

angular.module('timeSheetApp')
.controller('FeedbackController', function ($rootScope, $scope, $state, $timeout,
		ProjectComponent, SiteComponent, LocationComponent,FeedbackComponent,
		$http,$stateParams,$location,$interval,$filter,PaginationComponent) {
	$rootScope.loadingStop();
	$rootScope.loginView = false;
	$scope.averageRating ='0';
	$scope.feedbackCount ='0';
	$scope.readOnly = true;
	$scope.downloaded = false;
	$scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
	$scope.series = ['Series A'];

	$scope.pager = {};
	$scope.pages = { currPage : 1};
	$scope.feedbackListData = false;
	$scope.noData = false;
	$scope.pageSort = 10;

	/** Ui-select scopes **/
	$scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
	$scope.client = {};
	$scope.clients = [];
	$scope.allSites = {id:0 , name: '-- ALL SITES --'};
	$scope.sitesListOne = {};
	$scope.sitesLists = [];
	$scope.sitesListOne.selected =  null;
	//$scope.SelectClientsNull = {id:0 , name: '-- SELECT CLIENT --'};
	$scope.SelectClient = {};
	$scope.SelectClients = [];
	$scope.allRegions = {id:0 , name: '-- SELECT REGIONS --'};
	$scope.regionsListOne = {};
	$scope.regionsLists = [];
	$scope.regionsListOne.selected =  null;
	$scope.allBranchs = {id:0 , name: '-- SELECT BRANCHES --'};
	$scope.branchsListOne = {};
	$scope.branchsLists = [];
	$scope.branchsListOne.selected =  null;
	$scope.selectedFromDateSer =  new Date();
	$scope.selectedFromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
	$scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
	$scope.selectedToDateSer =  new Date();


	$scope.onClick = function (points, evt) {
		//console.log(points, evt);
	};
	$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
	$scope.options = {
			scales: {
				yAxes: [
					{
						id: 'y-axis-1',
						type: 'linear',
						display: true,
						position: 'left'
					}
					]
			}
	};


	var vm = this;
	vm.numRecords = 6;
	vm.page = 1;

	vm.items = []
	for (var i = 0; i < 1000; ++i) {
		vm.items.push('item : ' + i);
	}

	vm.next = function(){
		vm.page = vm.page + 1;
	};

	vm.back = function(){
		vm.page = vm.page - 1;
	};



	$scope.pages = { currPage : 1};

	$scope.searchCriteria = {};

	$scope.selectedProject = null;

	$scope.selectedSite = null;

	$scope.selectedBlock = null;

	$scope.selectedFloor = null;

	$scope.selectedZone  = null;

	$scope.clientId = null;

	$scope.siteId = null;

	$scope.feedbackReport = {};

	$scope.now = new Date()

	$rootScope.exportStatusObj = {};
	$scope.checkStatus = 0;


	$scope.initCalender = function(){

		demo.initFormExtendedDatetimepickers();

	};

	$('#dateFilterFrom').on('dp.change', function(e){
		$scope.selectedFromDateSer =new Date(e.date._d);
		$scope.selectedFromDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
		$scope.selectedFromDateSer.setHours(0,0,0,0);
		if($scope.selectedToDateSer){
			$scope.selectedToDateSer.setHours(0,0,0,0);
		}


		if($scope.selectedFromDateSer > $scope.selectedToDateSer && $scope.selectedFromDateSer != $scope.selectedToDateSer){
			$scope.fromErrMsg = 'From date cannot be greater than To date';

			alert($scope.fromErrMsg);

			$('input#dateFilterFrom').data('DateTimePicker').clear();
			$('input#dateFilterTo').data('DateTimePicker').clear();
			$scope.selectedFromDateSer = new Date();
			$scope.selectedFromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.selectedToDateSer = new Date();
			$scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$('input#dateFilterFrom').val($scope.selectedFromDate);
			$('input#dateFilterTo').val($scope.selectedToDate);

			return false;
		}

	});
	$('#dateFilterTo').on('dp.change', function(e){
		$scope.selectedToDateSer =new Date(e.date._d);
		$scope.selectedToDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
		$scope.selectedToDateSer.setHours(0,0,0,0);
		if($scope.selectedFromDateSer){
			$scope.selectedFromDateSer.setHours(0,0,0,0);
		}

		if($scope.selectedFromDateSer > $scope.selectedToDateSer && $scope.selectedFromDateSer != $scope.selectedToDateSer){
			$scope.toErrMsg = 'To date cannot be lesser than From date';

			alert($scope.toErrMsg);

			$('input#dateFilterFrom').data('DateTimePicker').clear();
			$('input#dateFilterTo').data('DateTimePicker').clear();
			$scope.selectedFromDateSer = new Date();
			$scope.selectedFromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.selectedToDateSer = new Date();
			$scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$('input#dateFilterFrom').val($scope.selectedFromDate);
			$('input#dateFilterTo').val($scope.selectedToDate);

			return false;
		}

	});


	$scope.init = function(){
		$scope.loading = true;
		//$scope.loadProjects();
		$scope.loadProjectsList();
		$scope.search();
		$scope.setPage(1);
	};


	$scope.loadProjects = function () {
		ProjectComponent.findAll().then(function (data) {
			$scope.projects = data;
			//
			for(var i=0;i<$scope.projects.length;i++)
			{
				$scope.uiClient[i] = $scope.projects[i].name;
			}
			$scope.clientFilterDisable = false;

		});
	};

	$scope.loadProjectsList = function () {
		ProjectComponent.findAll().then(function (data) {
			$scope.projectsList = data;
			/** Ui-select scope **/
			//$scope.clients[0] = $scope.allClients;
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
				$scope.clients[i] = $scope.projectsList[i];

			}
			$scope.clientDisable = false;
			$scope.clientFilterDisable = false;
		});
	};

	/*$scope.loadSites = function () {
        if($scope.selectedProject){
               ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                    $scope.selectedSite = null;
                    $scope.sites = data;
                        // //
                        for(var i=0;i<$scope.sites.length;i++)
                        {
                            $scope.uiSite[i] = $scope.sites[i].name;
                        }
                        $scope.siteSpin = false;
                        $scope.siteFilterDisable = false;
                        //

               });
            }
        };*/

	/** Ui-select function **/

	$scope.loadDepSitesList = function (searchProject) {
		$scope.siteSpin = true;
		$scope.searchProject = searchProject;
		if(jQuery.isEmptyObject($scope.searchProject) == false && $scope.searchProject.id == 0){
			SiteComponent.findAll().then(function (data) {
				$scope.selectedSite = null;
				$scope.sitesList = data;
				$scope.sitesLists = [];
				$scope.sitesListOne.selected = null;
				$scope.sitesLists[0] = $scope.allSites;

				for(var i=0;i<$scope.sitesList.length;i++)
				{
					$scope.sitesLists[i] = $scope.sitesList[i];
				}
				$scope.siteFilterDisable = false;
				$scope.siteSpin = false;
			});
		}else{
			if(jQuery.isEmptyObject($scope.selectedProject) == false) {
				var depProj=$scope.selectedProject.id;
				$scope.selectedSite = null;
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
					$scope.sitesLists[i] = $scope.sitesList[i];
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



	//Filter
	// Load Clients for selectbox //
	$scope.clientFilterDisable = true;
	$scope.uiClient = [];
	$scope.getClient = function (search) {
		var newSupes = $scope.uiClient.slice();
		if (search && newSupes.indexOf(search) === -1) {
			newSupes.unshift(search);
		}
		return newSupes;
	}

	//Load Sites for selectbox //
	$scope.siteFilterDisable = true;
	$scope.uiSite = [];
	$scope.getSite = function (search) {

		var newSupes = $scope.uiSite.slice();
		if (search && newSupes.indexOf(search) === -1) {
			newSupes.unshift(search);
		}
		return newSupes;
	}

	//
	$scope.loadSearchProject = function (searchProject) {
		$scope.clearField = false;
		$scope.hideSite = false;
		$scope.siteSpin = true;
		$scope.uiSite.splice(0,$scope.uiSite.length);
		if(searchProject){
			$scope.selectedProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]
		}

	}
	$scope.loadSearchSite = function (searchSite) {
		if(searchSite){
			$scope.hideSite = true;
			$scope.selectedSite = $scope.sites[$scope.uiSite.indexOf(searchSite)]
			$scope.show = false;
		}

	}

	//

	$scope.searchLocations = function () {
		$scope.searchCriteria.block = null;
		$scope.searchCriteria.floor = null;
		$scope.searchCriteria.zone = null;
		if($scope.sitesListOne.selected){
			$scope.searchCriteria.siteId = $scope.sitesListOne.selected.id;
			$scope.searchCriteria.findAll = false;
		}else{
			$scope.searchCriteria.siteId = null;
			$scope.searchCriteria.findAll = false;
		}


		LocationComponent.search($scope.searchCriteria).then(function (data) {
			$scope.filteredLocations = data.transactions;
			//console.log('searchLocations- ', $scope.filteredLocations);

		});
	};


	$scope.loadBlocks = function () {
		var projectId = $scope.client.selected.id ? $scope.client.selected.id  : 0;
		var siteId = $scope.sitesListOne.selected ? $scope.sitesListOne.selected.id  : 0;
		//console.log('selected project -' + projectId + ', site -' + siteId);
		LocationComponent.findBlocks(projectId,siteId).then(function (data) {
			$scope.selectedBlock = null;
			$scope.blocks = data;

		});
	};

	$scope.loadFloors = function () {
		var projectId = $scope.client.selected.id ? $scope.client.selected.id  : 0;
		var siteId = $scope.sitesListOne.selected ? $scope.sitesListOne.selected.id  : 0;
		var block = $scope.selectedBlock ? $scope.selectedBlock  : null;
		LocationComponent.findFloors(projectId,siteId,block).then(function (data) {
			$scope.selectedFloor = null;
			$scope.floors = data;


		});
	};

	$scope.loadZones = function () {
		var projectId = $scope.client.selected.id ? $scope.client.selected.id  : 0;
		var siteId = $scope.sitesListOne.selected ? $scope.sitesListOne.selected.id  : 0;
		var block = $scope.selectedBlock ? $scope.selectedBlock  : null;
		var floor = $scope.selectedFloor ? $scope.selectedFloor  : null;
		//console.log('load zones - ' + projectId +',' + siteId +',' + block +','+ floor);
		LocationComponent.findZones(projectId,siteId,block,floor).then(function (data) {
			$scope.selectedZone = null;
			$scope.zones = data;


		});
	};

	$scope.refreshPage = function() {
		$scope.clearFilter();
		$scope.loadFeedbacks();
	}

	$scope.loadFeedbacks = function () {
		//console.log('called loadFeedbacks');
		$scope.search();
	};

	$scope.genZoneReport = function(client,site,block, floor, zone, $form) {

		$scope.clientId = client;
		$scope.siteId = site;
		$scope.selectedBlock = block;
		$scope.selectedFloor = floor;
		$scope.selectedZone = zone;

		//document.getElementById('searchForm').submit();

		//$scope.search();
	};

	$scope.feedbackListLoader = true;
	$scope.feedbackListDetailLoader = true;

	$scope.searchFilter = function () {
		$('.AdvancedFilterModal.in').modal('hide');
		$scope.setPage(1);
		$scope.search();
	}


	$scope.search = function () {

		var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
		//if(!$scope.searchCriteria) {
		var searchCriteria = {
				currPage : currPageVal
		}
		$scope.searchCriteria = searchCriteria;
		// }


		if($scope.client.selected && $scope.client.selected.id !=0){
			$scope.selectedProject = $scope.client.selected;
		}else{
			$scope.selectedProject = null;
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
			$scope.selectedSite = $scope.sitesListOne.selected;
		}else{
			$scope.selectedSite = null;
		}

		$scope.searchCriteria.isReport = false;

		$scope.searchCriteria.currPage = currPageVal;
		//console.log('Selected feedback' + $scope.selectedLocation);

		if($scope.selectedFromDateSer){
			$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedFromDateSer;
			//console.log("From date found");
			//console.log($scope.searchCriteria.checkInDateTimeFrom);
		}else if($stateParams.date){
			$scope.selectedFromDateSer = new Date($stateParams.date);
			$scope.selectedFromDate = $filter('date')($scope.selectedFromDateSer, 'dd/MM/yyyy');
			$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedFromDateSer;
		}else{
			$scope.selectedFromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.selectedFromDateSer = new Date();
			$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedFromDateSer;

		}

		if($scope.selectedToDateSer){
			$scope.searchCriteria.checkInDateTimeTo = $scope.selectedToDateSer;
			//console.log("To date found");
			//console.log($scope.searchCriteria.checkInDateTimeTo);
		}else if($stateParams.date){
			$scope.selectedToDateSer = new Date($stateParams.date);
			$scope.selectedToDate = $filter('date')($scope.selectedToDateSer, 'dd/MM/yyyy');
			$scope.searchCriteria.checkInDateTimeTo = $scope.selectedToDateSer;
		}else{
			$scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.selectedToDateSer = new Date();
			$scope.searchCriteria.checkInDateTimeTo = $scope.selectedToDateSer;
		}


		if(!$scope.selectedProject && !$scope.selectedSite && !$stateParams.pid && !$stateParams.sid) {
			/*if($rootScope.searchCriteriaFeedback) {
                    $scope.searchCriteria = $rootScope.searchCriteriaFeedback;
                }else {*/
			$scope.searchCriteria.findAll = true;
			/*}*/

		}else {
			$scope.searchCriteria.findAll = false;

			if($scope.selectedProject && $scope.selectedProject.id) {
				$scope.searchCriteria.projectId = $scope.selectedProject.id;
				$scope.searchCriteria.projectName = $scope.selectedProject.name;
			} else if($scope.clientId){
				$scope.searchCriteria.projectId = $scope.clientId;
			}else if($stateParams.pid){
				$scope.selectedProject = {id:parseInt($stateParams.pid),name:$stateParams.pName};
				$scope.searchCriteria.projectId = parseInt($stateParams.pid);
				$scope.searchCriteria.projectName = $stateParams.pName;
				$scope.client.selected = $scope.selectedProject;
				ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
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
			}else {
				$scope.searchCriteria.projectId = null;
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
			if($scope.selectedSite && $scope.selectedSite.id) {
				$scope.searchCriteria.siteId = $scope.selectedSite.id;
				$scope.searchCriteria.siteName = $scope.selectedSite.name;
			}
			else if($scope.siteId){
				$scope.searchCriteria.siteId = $scope.siteId ;
			}else if($stateParams.sid){
				$scope.selectedSite = {id:parseInt($stateParams.sid),name:$stateParams.sName};
				$scope.searchCriteria.siteId = parseInt($stateParams.sid);
				$scope.searchCriteria.siteName = $stateParams.sName;
				$scope.sitesListOne.selected = $scope.selectedSite;
				$scope.searchLocations();
			}else {
				$scope.searchCriteria.siteId = null;
			}
			if($scope.selectedBlock) {
				$scope.searchCriteria.block = $scope.selectedBlock;
			}else if($stateParams.block) {
				$scope.selectedBlock = $stateParams.block;
				$scope.searchCriteria.block = $stateParams.block;
			}else {
				$scope.searchCriteria.block = "";
			}
			if($scope.selectedFloor) {
				$scope.searchCriteria.floor = $scope.selectedFloor;
			}else if($stateParams.floor) {
				$scope.selectedFloor = $stateParams.floor;
				$scope.searchCriteria.floor = $stateParams.floor;
			}else {
				$scope.searchCriteria.floor = "";
			}
			if($scope.selectedZone) {
				$scope.searchCriteria.zone = $scope.selectedZone;
			}else if($stateParams.zone) {
				$scope.selectedZone = $stateParams.zone;
				$scope.searchCriteria.zone = $stateParams.zone;
			}else {
				$scope.searchCriteria.zone = "";
			}

		}

		$scope.searchCriteras = $scope.searchCriteria;
		$scope.feedbackReport = "";
		$scope.feedbackListLoader = false;
		$scope.feedbackListData = true;
		$rootScope.loadingStart();
		//console.log('Search Criteria : ', $scope.searchCriteria);
		FeedbackComponent.reports($scope.searchCriteria).then(function (data) {
			$scope.feedbackReport = data;
			$scope.feedbackListLoader = true;
			$rootScope.loadingStop();
			if($scope.feedbackReport.questionRatings){

				var qLength = ($scope.feedbackReport.questionRatings).length;
				if(qLength > 0){

					$scope.feedbackListData = false;
				}
			}
			//console.log('feedback report - ' + JSON.stringify($scope.feedbackReport));
			$scope.averageRating = $scope.feedbackReport.overallRating;
			$scope.feedbackCount = $scope.feedbackReport.feedbackCount;
			//console.log('feedback report - ' + JSON.stringify($scope.averageRating));


			$scope.hide = true;
			//console.log('weeklyZone data - ' + $scope.feedbackReport.weeklyZone.length);
			$scope.labels = [];
			$scope.data = [];
			$scope.label = [];
			$scope.datas = [];


			if($scope.feedbackReport.weeklyZone && $scope.feedbackReport.weeklyZone.length > 0) {

				// Line chart data

				var lineZoneDateWiseRating = $scope.feedbackReport.weeklyZone;
				//var chartZoneDateWiseDataArr = [];
				for(var i =0;i<lineZoneDateWiseRating.length; i++) {
					$scope.labels.push(lineZoneDateWiseRating[i].date);
					$scope.data.push(lineZoneDateWiseRating[i].rating);
				}

				//$scope.data.push(chartZoneDateWiseDataArr);
				//$scope.data = chartZoneDateWiseDataArr;

				//console.log('Line chart labels - ' + JSON.stringify($scope.labels));
				//console.log('Line chart data - ' + JSON.stringify($scope.data));

				// Doughnut chart data

				var doughnutZoneDateWiseRating = $scope.feedbackReport.weeklyZone;
				for(var i =0;i<doughnutZoneDateWiseRating.length; i++) {
					$scope.label.push(doughnutZoneDateWiseRating[i].date);
					$scope.datas.push(doughnutZoneDateWiseRating[i].rating);
				}

				$scope.chartOptions = { legend: { display: true } };



				//console.log('Doughnut chart labels - ' + JSON.stringify($scope.label));
				//console.log('Doughnut chart data - ' + JSON.stringify($scope.datas));


			}else {

				// Line chart data

				var lineZoneWiseRating = $scope.feedbackReport.weeklySite;
				//var chartZoneWiseDataArr = [];
				if(lineZoneWiseRating){
					for(var i =0;i<lineZoneWiseRating.length; i++) {
						$scope.labels.push(lineZoneWiseRating[i].zoneName);
						$scope.data.push(lineZoneWiseRating[i].rating);
					}
				}


				//$scope.data.push(chartZoneWiseDataArr);
				//$scope.data = chartZoneWiseDataArr;

				//console.log('Line chart labels - ' + JSON.stringify($scope.labels));
				//console.log('Line chart data - ' + JSON.stringify($scope.data));

				// Doughnut chart data

				var doughnutZoneWiseRating = $scope.feedbackReport.weeklySite;
				//var doughnutZoneWiseDataArr = [];
				if(doughnutZoneWiseRating){
					for(var i =0;i<doughnutZoneWiseRating.length; i++) {
						$scope.label.push(doughnutZoneWiseRating[i].zoneName);
						$scope.datas.push(doughnutZoneWiseRating[i].rating);
					}
				}


				//$scope.datas.push(zoneDateWiseDataArr);

				$scope.chartOptions = { legend: { display: true } };

				//console.log('Doughnut chart labels - ' + JSON.stringify($scope.label));
				//console.log('Doughnut chart data - ' + JSON.stringify($scope.datas));




			}

			//}

		}).catch(function(res){
			$rootScope.loadingStop();
			$scope.feedbackListLoader = true;
			//$scope.showNotifications('top','center','danger','Cannot Load Feedback');
		});


		/* Feedback Details List Start */
		if($scope.pageSort){
			$scope.searchCriteria.sort = $scope.pageSort;
		}

		$scope.feedbackReportDetail = "";
		$scope.feedbackListDetailLoader = false;
		$scope.noData = false;
		//console.log('Search Criteria : ', $scope.searchCriteria);
		FeedbackComponent.search($scope.searchCriteria).then(function (data) {
			console.log("Feedback details call result - ");
			console.log(data);
			$scope.feedbackReportDetail = data.transactions;
			$scope.feedbackListDetailLoader = true;


			/*
			 ** Call pagination  main function **
			 */
			$scope.pager = {};
			$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
			$scope.totalCountPages = data.totalCount;

			// //console.log("Pagination",$scope.pager);
			// //console.log($scope.sites);


			$scope.pages.currPage = data.currPage;
			$scope.pages.totalPages = data.totalPages;

			if($scope.feedbackReportDetail && $scope.feedbackReportDetail.length > 0 ){
				$scope.showCurrPage = data.currPage;
				$scope.pageEntries = $scope.feedbackReportDetail.length;
				$scope.totalCountPages = data.totalCount;
				$scope.pageSort = 10;
				$scope.noData = false;

			}else{
				$scope.noData = true;
			}
		}).catch(function(res){
			$scope.feedbackListDetailLoader = true;
			$scope.noData = true;
			//$scope.showNotifications('top','center','danger','Cannot Load Feedback');
		});

		/* Feedback Details List End */

	};



	$scope.showNotifications= function(position,alignment,color,msg){
		demo.showNotification(position,alignment,color,msg);
	}


	$scope.printDiv = function(printable) {
		var printContents = document.getElementById(printable).innerHTML;
		var popupWin = window.open('', '_blank', 'width=1400,height=600');
		popupWin.document.open();
		popupWin.document.write('<html><head><link href="../assets/css/bootstrap.min.css" type="text/css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="../assets/css/custom.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
		popupWin.document.close();
	}

	$scope.printPage = function () {
		window.print();
	}


	$scope.printToCart = function(printSectionId) {
		var innerContents = document.getElementById(printSectionId).innerHTML;
		var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
		popupWinindow.document.open();
		popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="assets/css/material-dashboard.css" /></head><body onload="window.print()">' + innerContents + '</html>');
		popupWinindow.document.close();
	}



	$scope.clearFilter = function() {
		$('input#dateFilterFrom').data('DateTimePicker').clear();
		$('input#dateFilterTo').data('DateTimePicker').clear();
		$rootScope.exportStatusObj = {};
		$scope.downloaded = true;
		$scope.clearField = true;
		$scope.siteFilterDisable = true;
		$scope.regionFilterDisable = true;
		$scope.branchFilterDisable = true;
		$scope.sites = null;
		$scope.clientId = null;
		$scope.siteId = null;

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
		$scope.searchCriteria = {};
		$scope.localStorage = null;
		$scope.selectedFromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.selectedFromDateSer = new Date();
		$scope.selectedToDateSer = new Date();
		$('input#dateFilterFrom').val($scope.selectedFromDate);
		$('input#dateFilterTo').val($scope.selectedToDate);
		//$rootScope.searchCriteriaSite = null;
		$scope.averageRating = '0';
		$scope.feedbackCount = '0';
		$scope.selectedBlock = null;
		$scope.selectedFloor = null;
		$scope.selectedZone  = null;
		$scope.labels = [];
		$scope.data = [];
		$scope.label = [];
		$scope.datas = [];
		$scope.pages = {
				currPage: 1,
				totalPages: 0
		}
		$scope.searchLocations();
		//$scope.search();
		if($stateParams){
			$location.path('/feedbacks');
		}
	};

	$scope.cancelFeedback = function () {
		$location.path('/feedback');
	};

	$scope.initCalender();

	//init load
	$scope.initLoad = function(){
		//console.log("***************************")
		$scope.loadPageTop();
		$scope.init();

	}


	$scope.exportAllData = function(type){
		$scope.downloaded = false;
		$scope.searchCriteria.exportType = type;
		$rootScope.exportStatusObj = {};
		$scope.typeMsg = type;
		$scope.downloader=true;
		$scope.searchCriteria.isReport = true;
		$scope.searchCriteria.columnName = "createdDate";
		$scope.searchCriteria.sortByAsc = false;
		FeedbackComponent.exportAllData($scope.searchCriteria).then(function(data){
			var result = data.results[0];
			//console.log(result);
			//console.log(result.file + ', ' + result.status + ',' + result.msg);
			var exportAllStatus = {
					fileName : result.file,
					exportMsg : 'Exporting All...',
					url: result.url
			};
			$rootScope.exportStatusObj = exportAllStatus;
			//console.log('exportStatusObj size - ' + $rootScope.exportStatusObj.length);
			$scope.start();
		},function(err){
			//console.log('error message for export all ')
			//console.log(err);
			$scope.start();
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
		//console.log('$rootScope.exportStatusObj -' , $rootScope.exportStatusObj);

		FeedbackComponent.exportStatus($rootScope.exportStatusObj.fileName).then(function(data) {
			//console.log('feedback export status - data -' + JSON.stringify(data));
			if(data) {
				$rootScope.exportStatusObj.exportStatus = data.status;
				//console.log('exportStatus - '+ JSON.stringify($rootScope.exportStatusObj));
				$rootScope.exportStatusObj.exportMsg = data.msg;
				$scope.downloader=false;
				//console.log('exportMsg - '+ $rootScope.exportStatusObj.exportMsg);
				if($rootScope.exportStatusObj.exportStatus == 'COMPLETED'){
					if($rootScope.exportStatusObj.url) {
						$rootScope.exportStatusObj.exportFile = $rootScope.exportStatusObj.url;
					}else {
						$rootScope.exportStatusObj.exportFile = data.file;
					}
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

			$scope.exportFile = ($rootScope.exportStatusObj ? $rootScope.exportStatusObj.exportFile : '#');

			$scope.exportMsg = ($rootScope.exportStatusObj ? $rootScope.exportStatusObj.exportMsg : '');

		});



	}




	$scope.clsDownload = function(){
		$scope.downloaded = true;
		$rootScope.exportStatusObj = {};
	}

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
		$scope.clientId = null;
		$scope.filteredLocations ="";
		$scope.siteId = null;
		$scope.selectedBlock = null;
		$scope.selectedFloor = null;
		$scope.selectedZone = null;
	};

	$scope.clearRegion = function($event) {
		$event.stopPropagation();
		$scope.regionsListOne.selected = undefined;
		$scope.branchsListOne.selected = undefined;
		$scope.sitesListOne.selected = undefined;
		$scope.branchFilterDisable = true;
		$scope.siteFilterDisable = true;
		$scope.filteredLocations ="";
		$scope.siteId = null;
		$scope.selectedBlock = null;
		$scope.selectedFloor = null;
		$scope.selectedZone = null;
	};

	$scope.clearBranch = function($event) {
		$event.stopPropagation();
		$scope.branchsListOne.selected = undefined;
		$scope.sitesListOne.selected = undefined;
		$scope.siteFilterDisable = true;
		$scope.filteredLocations ="";
		$scope.siteId = null;
		$scope.selectedBlock = null;
		$scope.selectedFloor = null;
		$scope.selectedZone = null;
	};

	$scope.clearSite = function($event) {
		$event.stopPropagation();
		$scope.sitesListOne.selected = null;
		$scope.filteredLocations ="";
		$scope.siteId = null;
		$scope.selectedBlock = null;
		$scope.selectedFloor = null;
		$scope.selectedZone = null;
	};



	/*
	 * Ui select allow-clear modified function end
	 *
	 * */


});

/*.controller("RatingCtrl", function($scope) {
  $scope.user1 = {rating:5};
  $scope.user2 = {rating:2};
  $scope.user3 = {rating:1};
  $scope.averageRating = 0;

  $scope.$watch(function(){return $scope.user1.rating + $scope.user2.rating + $scope.user3.rating;}, function(oldVal, newVal) {
        if (newVal) { updateAverageRating(); }
  });

  function updateAverageRating(){ $scope.averageRating = ($scope.user1.rating + $scope.user2.rating + $scope.user3.rating) / 3; }

  $scope.isReadonly = true;
  $scope.rateFunction = function(rating) {
  //console.log("Rating selected: " + rating);
  };
})*/
