'use strict';

angular.module('timeSheetApp')
.controller('ModuleActionsController', function ($rootScope, $scope, $state, $timeout,
		ModuleActionComponent,EmployeeComponent, $http,
		$stateParams, $location, JobComponent,PaginationComponent) {
	$rootScope.loadingStop();
	$rootScope.loginView = false;
	$scope.success = null;
	$scope.error = null;
	$scope.doNotMatch = null;
	$scope.errorUserExists = null;
	$scope.validationError = null;
	$scope.validationErrorMsg = null;
	$scope.authorities = ["User", "Admin"];
	$scope.pager = {};

	//$timeout(function (){angular.element('[ng-model="name"]').focus();});

	$scope.pages = { currPage : 1};

	$scope.selectedGroup;

	$scope.users;
	$scope.masterActions;
	$scope.moduleActions;

	$scope.selectedModuleAction;

	$scope.moduleActions;

	$scope.moduleId;
	$scope.moduleName;

	$scope.selectedActions=[];

	$scope.searchCriteria = {};

	$scope.pageSort = 10;

	$scope.addAction = function() {
		var action = $scope.actionSelector;
		console.log('action selected -' + action);
		$scope.selectedActions.push(action);
		console.log('action selected -' + action + ',' + $scope.selectedActions);
		//$scope.moduleName = null;
		$scope.actionSelector = null;
	}

	$scope.selectAction = function(obj) {
		console.log('action id -' +obj.id +', name - ' + obj.name);

	}

	$scope.removeAction = function(ind) {
		$scope.selectedActions.splice(ind,1);
	}

	$scope.saveModuleActions = function () {
		console.log('moduleActions -'+ $scope.moduleName +' , id -'+ $scope.moduleId);
		console.log('moduleActions -'+ $scope.selectedActions);
		var actions = []
		for(var i in $scope.selectedActions) {
			actions[i] = $scope.selectedActions[i];
		}
		$scope.moduleActions = {
				"id" : $scope.moduleId,
				"name" : $scope.moduleName,
				"moduleActions" : actions
		}
		console.log('module actions- ' + JSON.stringify($scope.moduleActions));
		ModuleActionComponent.createModuleAction($scope.moduleActions).then(function () {
			$scope.success = 'OK';
			$scope.moduleId = 0;
			$scope.moduleName = '';
			$scope.selectedActions = [];
			$scope.moduleActions = {};
			$scope.loadModuleActions();
			$location.path('/app-module-actions');
		}).catch(function (response) {
			$scope.success = null;
			console.log(response.data);
			if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
				$scope.errorModuleActionExists = true;
			} else if(response.status === 400 && response.data.message === 'error.validation'){
				$scope.validationError = true;
				$scope.validationErrorMsg = response.data.description;
			} else {
				$scope.error = 'ERROR';
			}
		});
	};

	$scope.cancelModuleAction = function () {
		$scope.selectedActions = [];
	};

	$scope.loadActions = function() {
		ModuleActionComponent.findAllActions().then(function (data) {
			$scope.masterActions = data;
		})

	}

	$scope.loadModuleActions = function () {
		$scope.clearFilter();
		$scope.search();
	};

	$scope.refreshPage = function() {
		$scope.loadModuleActions();
	}



	$scope.loadModuleAction = function(id) {
		console.log('loadModuleAction -' + id);
		$scope.loadingStart();
		ModuleActionComponent.findOne(id).then(function (data) {
			$scope.loadingStop();
			$scope.moduleId = data.id;
			$scope.moduleName = data.name;
			for(var i in data.moduleActions) {
				$scope.selectedActions.push(data.moduleActions[i]);
			}

		});

		$scope.initLoad();

	};

	$scope.updateModuleAction = function () {
		console.log('ModuleAction details - ' + JSON.stringify($scope.moduleAction));

		ModuleActionComponent.updateModuleAction($scope.moduleAction).then(function () {
			$scope.success = 'OK';
			$scope.moduleName = '';
			$scope.selectedActions = [];
			$scope.moduleActions = {};
			$scope.loadModuleActions();
			$location.path('/user-roles');
		}).catch(function (response) {
			$scope.success = null;
			console.log('Error - '+ response.data);
			if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
				$scope.errorModuleActionExists = true;
			} else if(response.status === 400 && response.data.message === 'error.validation'){
				$scope.validationError = true;
				$scope.validationErrorMsg = response.data.description;
			} else {
				$scope.error = 'ERROR';
			}
		});
	};

	$scope.deleteConfirm = function (user){
		console.log('...>>>delete confirm<<<');
		$scope.confirmModuleAction = moduleAction;
		console.log(moduleAction.id);
	}

	$scope.deleteModuleAction = function () {
		console.log("user>>>>",+$scope.confirmModuleAction);
//		$scope.user = user;
		ModuleActionComponent.deleteModuleAction($scope.confirmModuleAction);
		$scope.success = 'OK';
		$state.reload();
	};



	$scope.isActiveAsc = 'id';
	$scope.isActiveDesc = '';

	$scope.columnAscOrder = function(field){
		$scope.selectedColumn = field;
		$scope.isActiveAsc = field;
		$scope.isActiveDesc = '';
		$scope.isAscOrder = true;
		$scope.search();
		//$scope.loadModuleActions();
	}

	$scope.columnDescOrder = function(field){
		$scope.selectedColumn = field;
		$scope.isActiveDesc = field;
		$scope.isActiveAsc = '';
		$scope.isAscOrder = false;
		$scope.search();
		//$scope.loadModuleActions();
	}


	$scope.searchFilter = function () {
		$scope.setPage(1);
		$scope.search();
	}

	$scope.search = function () {
		var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
		if(!$scope.searchCriteria) {
			var searchCriteria = {
					currPage : currPageVal
			}
			$scope.searchCriteria = searchCriteria;
		}
		console.log('Selected  module action -' + $scope.selectedModuleAction);
		$scope.searchCriteria.currPage = currPageVal;
		$scope.searchCriteria.findAll = false;

		if( !$scope.selectedModuleAction) {
			$scope.searchCriteria.findAll = true;
		}
		if($scope.selectedModuleAction) {
			$scope.searchCriteria.moduleActionId = $scope.selectedModuleAction.id;

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
		$scope.moduleActions = '';
		$scope.moduleActionsLoader = false;
		$scope.loadPageTop();


		ModuleActionComponent.search($scope.searchCriteria).then(function (data) {
			$scope.moduleActions = data.transactions;
			$scope.moduleActionsLoader = true;

			/*
			 ** Call pagination  main function **
			 */
			$scope.pager = {};
			$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
			$scope.totalCountPages = data.totalCount;

			console.log("Pagination",$scope.pager);
			console.log('Module Actions list -' + JSON.stringify($scope.moduleActions));
			$scope.pages.currPage = data.currPage;
			$scope.pages.totalPages = data.totalPages;

			if($scope.moduleActions && $scope.moduleActions.length > 0 ){
				$scope.showCurrPage = data.currPage;
				$scope.pageEntries = $scope.moduleActions.length;
				$scope.totalCountPages = data.totalCount;
				$scope.pageSort = 10;
			}

		});

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


	$scope.inputType = "password";
	$scope.passwordCheckbox = "true";
	$scope.showPwd = function(){
		if($scope.inputType == "password"){
			$scope.inputType = "text";
			$scope.passwordCheckbox = "false";

		}else{
			$scope.inputType = "password";
			$scope.passwordCheckbox = "true";

		}

	}

	// Datatable
	$scope.initDataTables = function(){

		console.log("Data tables function")

		$('#datatables').DataTable({
			"pagingType": "full_numbers",
			"lengthMenu": [
				[10, 25, 50, -1],
				[10, 25, 50, "All"]
				],
				responsive: true,
				language: {
					search: "_INPUT_",
					searchPlaceholder: "Search records",
				}

		});


		var table = $('#datatables').DataTable();

		// Edit record
		table.on('click', '.edit', function() {
			$tr = $(this).closest('tr');

			var data = table.row($tr).data();
			alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
		});

		// Delete a record
		table.on('click', '.remove', function(e) {
			$tr = $(this).closest('tr');
			table.row($tr).remove().draw();
			e.preventDefault();
		});

		//Like record
		table.on('click', '.like', function() {
			alert('You clicked on Like button');
		});

		$('.card .material-datatables label').addClass('form-group');

	}

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

     $scope.showNotifications= function(position,alignment,color,msg){
         demo.showNotification(position,alignment,color,msg);
     }


});


