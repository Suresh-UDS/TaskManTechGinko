'use strict';

angular.module('timeSheetApp')
.controller('ChecklistController', function ($rootScope, $scope, $state, $timeout, ChecklistComponent,EmployeeComponent, $http, $stateParams, $location, JobComponent,PaginationComponent) {
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
	$scope.isEdit = false;
    $scope.pageSort = 10;

	//$timeout(function (){angular.element('[ng-model="name"]').focus();});

	$scope.pages = { currPage : 1};

	$scope.selectedGroup;

	$scope.users;
	$scope.masterActions;
	$scope.checklists;

	$scope.selectedChecklist;

	$scope.checklist;

	$scope.moduleId;
	$scope.moduleName;

	$scope.checklistItems=[];

	$scope.newChecklistItem = {};

	$scope.checklistError = false;

	$scope.addChecklistItem = function() {
		if(jQuery.isEmptyObject($scope.newChecklistItem) == false){
			console.log('new checklist item - ' + $scope.newChecklistItem);
			$scope.checklistItems.push($scope.newChecklistItem);
			$scope.newChecklistItem = {};
			$scope.checklistError = false;
		}else{
			$scope.checklistError = true;
		}
	}

    $scope.conform = function(text)
    {
        if($scope.isEdit && text == 'save'){
            $rootScope.conformText = 'update';
        }else{
            $rootScope.conformText = text;
        }

        $('#conformationModal').modal();

    }
	$rootScope.back = function (text) {

		$scope.isEdit = false;

		if(text == 'cancel')
		{
			$scope.cancelChecklist();
		}
		else if(text == 'save')
		{
			$scope.saveChecklist();
		}
	};


	$scope.removeItem = function(ind) {
	    var conRemove =window.confirm('Are you sure to remove item in this list..!!!');
	    if(conRemove){
            $scope.checklistItems.splice(ind,1);
            return false;
        }else{
	        return false;
        }

	}

	$scope.saveChecklist = function () {
		$scope.saveLoad = true;
		console.log('checklist -' , JSON.stringify($scope.checklist));
		console.log('checklist -' , JSON.stringify($scope.checklistItems));
		$scope.checklist.items = $scope.checklistItems;

		console.log('checklist after adding items - ' , JSON.stringify($scope.checklist));
		var post = $scope.isEdit == true ? ChecklistComponent.updateChecklist($scope.checklist) : ChecklistComponent.createChecklist($scope.checklist);
		post.then(function () {
			$scope.saveLoad = false;
			$scope.success = 'OK';
			$scope.checklistItems = [];
			$scope.checklist = {};
			$scope.loadChecklists();
			$location.path('/checklists');
		}).catch(function (response) {
			$scope.saveLoad = false;
			$scope.success = null;
			//console.log(response.data);
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

	$scope.cancelChecklist = function () {
		$scope.checklistItems = [];
		$scope.checklist = {};
		$scope.loadPageTop();
	};

	$scope.loadChecklists = function () {
		$scope.search();
	};

	$scope.refreshPage = function() {
		$scope.clearFilter();
		$scope.loadChecklists();
	}



	$scope.loadChecklist = function(id,action) {
		$scope.isEdit = (action == 'edit') ? true : false;
		console.log('loadChecklist -' + id);
        $scope.checklistItems=[];
		ChecklistComponent.findOne(id).then(function (data) {
			$scope.checklist = data;
			for(var i in data.items) {
				$scope.checklistItems.push(data.items[i]);
			}

		});

		// Page Loader Function

		$('.pageCenter').show();$('.overlay').show();
		$scope.loader = function(){

			//console.log("Calling loader");
			$('.pageCenter').hide();$('.overlay').hide();

		}

		$scope.loadPageTop();

		$timeout(function() {
			$scope.loader() ;
		}, 8000);


	};

	$scope.updateChecklist = function () {
		console.log('Checklist details - ' + JSON.stringify($scope.checklist));

		ChecklistComponent.updateChecklist($scope.checklist).then(function () {
			$scope.success = 'OK';
			$scope.checklistItems = [];
			$scope.checklist = {};
			$scope.loadChecklists();
			$location.path('/checklists');
		}).catch(function (response) {
			$scope.success = null;
			//console.log('Error - '+ response.data);
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

	$scope.deleteConfirm = function (user){
		console.log('...>>>delete confirm<<<');
		$scope.confirmChecklist = checklist;
		console.log(checklist.id);
	}

	$scope.deleteChecklist = function () {
		console.log("user>>>>",+$scope.confirmChecklist);
//		$scope.user = user;
		ChecklistComponent.deleteChecklist($scope.confirmChecklist);
		$scope.success = 'OK';
		$state.reload();
	};

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
		console.log('Selected  module action -' + $scope.selectedChecklist);

		if(!$scope.selectedChecklist) {
			if($rootScope.searchCriteriaChecklist) {
				$scope.searchCriteria = $rootScope.searchCriteriaChecklist;
			}else {
				$scope.searchCriteria.findAll = true;
			}

		}else {
			if($scope.selectedChecklist) {
				$scope.searchCriteria.findAll = false;
				$scope.searchCriteria.checklistId = $scope.selectedChecklist.id;
				$scope.searchCriteria.name = $scope.selectedChecklist.name;
				$scope.searchCriteria.activeFlag = $scope.selectedChecklist.activeFlag;
				console.log('selected user role id ='+ $scope.searchCriteria.checklistId);
			}else {
				$scope.searchCriteria.checklistId = 0;
			}
		}
        if($scope.pageSort){
            $scope.searchCriteria.sort = $scope.pageSort;
        }

		console.log($scope.searchCriteria);
        $scope.checklists = '';
        $scope.checklistsLoader = false;
		ChecklistComponent.search($scope.searchCriteria).then(function (data) {
			$scope.checklists = data.transactions;
			$scope.checklistsLoader = true;
			//console.log($scope.checklists);

            /*
             ** Call pagination  main function **
             */
            $scope.pager = {};
            $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
            $scope.totalCountPages = data.totalCount;

			$scope.pages.currPage = data.currPage;
			$scope.pages.totalPages = data.totalPages;

			if($scope.checklists && $scope.checklists.length > 0){
                $scope.showCurrPage = data.currPage;
                $scope.pageEntries = $scope.checklists.length;
                $scope.totalCountPages = data.totalCount;
                $scope.pageSort = 10;
                $scope.noData = false;

			}else{
                $scope.noData = true;
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

		//console.log("Data tables function")

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

		//$scope.initPage();
		$scope.loadPageTop();

	}

	//Loading Page go to top position
	$scope.loadPageTop = function(){
		//alert("test");
		//$("#loadPage").scrollTop();
		$("#loadPage").animate({scrollTop: 0}, 2000);
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




});


