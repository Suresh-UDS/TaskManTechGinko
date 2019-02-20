'use strict';

angular.module('timeSheetApp')
.controller('FeedbackQueController', function ($rootScope, $scope, $state, $timeout,
		FeedbackComponent,ProjectComponent,SiteComponent, $http, $stateParams, $location,PaginationComponent) {
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
	$scope.noData = false;
	$scope.isEdit = 'no';

	//$timeout(function (){angular.element('[ng-model="name"]').focus();});

	$scope.pages = { currPage : 1};

	$scope.feedbackMasterList;
	$scope.feedbackItem=null;
	$scope.newFeedbackItem=null;
	$scope.feedbackItems = [];
	$scope.selectedFeedback=null;
	$rootScope.searchCriteriaFeedback = null;

	$scope.selectedProject;
	$scope.selectedSite;

	$scope.pageSort = 10;


	$scope.init = function(){
		$scope.feedbackItem = {};
		$scope.newFeedbackItem = {};
		$scope.feedbackItem.displayType = 'form';
		$scope.loading = true;
		$scope.newFeedbackItem.remarksRequired=false;
		$scope.loadProjects();
		$scope.search();
		$scope.qType();
		$scope.ratRadioActive();
	};

	$scope.showNotifications= function(position,alignment,color,msg){
		demo.showNotification(position,alignment,color,msg);
	}

	// Question option types y/n and rating

	$scope.qType = function(){

		var quesType = $('#displayType1:checked').val();

		if(quesType == 'form'){
			$('#answerType1').prop('checked', true);

		}else if(quesType == 'wizard'){

			$('#answerType2').prop('checked', true);

		}
		$("#YesOrNo").removeClass("in", 2000);
		//alert($('#answerType2:checked').val());
	}

	// Question option type rating

	$scope.ratRadio = function(){

		$("#YesOrNo").removeClass("in");
	}

	$scope.ratRadioActive = function(){

		$("#YesOrNo").addClass("in");
	}

	$scope.yesMarkP = function(){

		$('#noMarkP').prop('checked', false);
		$('#noMarkN').prop('checked', true);
	}
	$scope.yesMarkN = function(){

		$('#noMarkP').prop('checked', true);
		$('#noMarkN').prop('checked', false);
	}
	$scope.noMarkP = function(){

		$('#yesMarkN').prop('checked', true);
		$('#yesMarkP').prop('checked', false);
	}

	$scope.noMarkN = function(){

		$('#yesMarkP').prop('checked', true);
		$('#yesMarkN').prop('checked', false);
	}


	$scope.loadProjects = function () {
		ProjectComponent.findAll().then(function (data) {
			$scope.projects = data;
		});
	};

	$scope.loadSites = function () {
		return ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
			$scope.selectedSite = null;
			$scope.sites = data;
		});
	};


	$scope.addFeedbackItem = function(newItem){
		if(!$scope.newFeedbackItem.question || !$scope.selectedSite || !$scope.selectedProject){
			return false;
		}
		console.log("Adding feedback questions");
		if(!newItem.scoreType){
			newItem.scoreType = "yes:1";
		}
		if(newItem.answerType) {
			$scope.feedbackItems.push(newItem);
		}else {
			newItem.answerType = "YESNO";
			$scope.feedbackItems.push(newItem);
			//$scope.showNotifications('top','center','danger','Please select an answer type');
		}
		$scope.newFeedbackItem = null;
	};

	$scope.removeItem = function(ind) {
		$scope.feedbackItems.splice(ind,1);
	}


	$scope.cancelFeedbackQuestions = function () {
		$scope.selectedSite =null;
		$scope.selectedProject =null;
		$scope.feedbackItem.name =null;
		$scope.feedbackItems = [];
		$scope.feedback = {};
		$scope.isEdit = 'no';
	};

	$scope.loadFeedbackItems = function () {
		console.log('called loadFeedbackItems');
		$scope.search();
	};

	$scope.refreshPage = function() {
		$scope.clearFilter();
		$scope.loadFeedbackItems();
	};



	$scope.loadFeedback = function(id) {
		$scope.isEdit = 'yes';
		console.log('loadFeedback -' + id);
		$scope.loadingStart();
		$scope.feedbackItems = [];
		FeedbackComponent.findOneFeedbackMaster(id).then(function (data) {
			$scope.loadingStop();
			$scope.feedbackItem = data;
			console.log('Feedback retrieved - ' + JSON.stringify($scope.feedbackItem));
			for(var i in data.questions) {
				$scope.feedbackItems.push(data.questions[i]);
			}
			$scope.selectedProject = {id: data.projectId, name: data.projectName};
			$scope.loadSites().then(function(){
				$scope.selectedSite = {id: data.siteId, name: data.siteName};
			})

		});

		$scope.loadPageTop();
	};


	$scope.updateFeebackQuestions = function () {
		console.log('Feedback questions details - ' + JSON.stringify($scope.feedbackItem));

		FeedbackComponent.updateFeedbackMaster($scope.feedbackItem).then(function () {
			$scope.success = 'OK';
			$scope.feedbackItems = [];
			$scope.feedbackItem = {};
			//$scope.loadFeedbackItems();
			//$location.path('/feedback-questions');
			$scope.loadFeedbackItems();
		}).catch(function (response) {
			$scope.success = null;
			console.log('Error - '+ response.data);
			if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
				$scope.errorChecklistExists = true;
			} else if(response.status === 400 && response.data.message === 'error.validation'){
				$scope.validationError = true;
				$scope.validationErrorMsg = response.data.description;
			} else {
				$scope.error = 'ERROR';
			}
		});
	};

	$scope.saveFeedback = function(){
	    $scope.loadingStart();
		console.log($scope.feedbackItems);
		$scope.feedbackItem.projectName = $scope.selectedProject.name;
		$scope.feedbackItem.projectId = $scope.selectedProject.id;
		$scope.feedbackItem.siteId = $scope.selectedSite.id;
		$scope.feedbackItem.siteName = $scope.selectedSite.name;

		$scope.feedbackItem.questions= $scope.feedbackItems;
		console.log("Before pushing feedback to server");
		console.log($scope.feedbackItem);
		FeedbackComponent.createFeedbackMaster($scope.feedbackItem).then(function(){
			console.log("success");
			$scope.feedbackItems = [];
			$scope.feedbackItem = {};
			//$location.path('/feedback-questions');
			$scope.loadFeedbackItems();
			$scope.loadingStop();
		}).catch(function (response) {
		    $scope.loadingStop();
			$scope.success = null;
			console.log(response.data);
			if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
				$scope.errorChecklistExists = true;
			} else if(response.status === 400 && response.data.message === 'error.validation'){
				$scope.validationError = true;
				$scope.validationErrorMsg = response.data.description;
			} else {
				$scope.error = 'ERROR';
			}
		});
	}

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

	$scope.search = function () {
		$scope.noData = false;
		var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
		if(!$scope.searchCriteria) {
			var searchCriteria = {
					currPage : currPageVal
			}
			$scope.searchCriteria = searchCriteria;
		}

		$scope.searchCriteria.currPage = currPageVal;
		console.log('Selected feedback' + $scope.selectedFeedback);

		if(!$scope.selectedFeedback) {
			if($rootScope.searchCriteriaFeedback) {
				$scope.searchCriteria = $rootScope.searchCriteriaFeedback;
			}else {
				$scope.searchCriteria.findAll = true;
			}

		}else {
			if($scope.selectedFeedback) {
				$scope.searchCriteria.findAll = false;
				$scope.searchCriteria.feedbackId = $scope.selectedFeedback.id;
				$scope.searchCriteria.title = $scope.selectedFeedback.title;
				console.log('selected user role id ='+ $scope.selectedFeedback);
			}else {
				$scope.searchCriteria.feedbackId = 0;
			}
		}
		console.log($scope.searchCriteria);
		//-------
		if($scope.pageSort){
			$scope.searchCriteria.sort = $scope.pageSort;
		}

		if($scope.selectedColumn){

			$scope.searchCriteria.columnName = $scope.selectedColumn;
			$scope.searchCriteria.sortByAsc = $scope.isAscOrder;

		}else{
			$scope.searchCriteria.columnName ="id";
		}
        $scope.feedbackMasterList = "";
        $scope.feedbackMasterListLoader = false;
		FeedbackComponent.searchFeedbackMaster($scope.searchCriteria).then(function (data) {
			$scope.feedbackMasterList = data.transactions;
			$scope.feedbackMasterListLoader = true;
			/*
			 ** Call pagination  main function **
			 */
			$scope.pager = {};
			$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
			$scope.totalCountPages = data.totalCount;

			console.log("Pagination",$scope.pager);
			console.log('feedback Question list -' + JSON.stringify($scope.feedbackMasterList));
			$scope.pages.currPage = data.currPage;
			$scope.pages.totalPages = data.totalPages;
			$scope.loading = false;

			if($scope.feedbackMasterList && $scope.feedbackMasterList.length > 0 ){
				$scope.showCurrPage = data.currPage;
				$scope.pageEntries = $scope.feedbackMasterList.length;
				$scope.totalCountPages = data.totalCount;
				$scope.pageSort = 10;
				$scope.noData = false;

			}else{
				$scope.noData = true;
			}
		}).catch(function(){
			$scope.feedbackMasterListLoader = true;
			$scope.loading = false;
			$scope.noData = true;
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


	//init load
	$scope.initLoad = function(){
		$scope.loadPageTop();
		$scope.init();


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

	$scope.remarksAdded = function(remarks){
		if(remarks){
			console.log(remarks)
			$scope.newFeedbackItem.remarksRequired=true;
		}else{
			$scope.newFeedbackItem.remarksRequired=false;
			console.log($scope.newFeedbackItem.remarksRequired);
		}
	}


});
