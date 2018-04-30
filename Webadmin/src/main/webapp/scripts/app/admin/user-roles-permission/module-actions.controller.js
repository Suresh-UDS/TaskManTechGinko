'use strict';

angular.module('timeSheetApp')
    .controller('ModuleActionsController', function ($rootScope, $scope, $state, $timeout, ModuleActionComponent,EmployeeComponent, $http, $stateParams, $location, JobComponent) {
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

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

        $scope.addAction = function() {
        	var action = $scope.actionSelector
        	console.log('action selected -' + action);
        	$scope.selectedActions.push(action);
        	console.log('action selected -' + action + ',' + $scope.selectedActions)
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

        	$scope.search();
        };

        $scope.refreshPage = function() {
        	$scope.clearFilter();
        	$scope.loadUsers();
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
//        	$scope.user = user;
        	ModuleActionComponent.deleteModuleAction($scope.confirmModuleAction);
        	$scope.success = 'OK';
        	$state.reload();
        };

        //----
        $scope.pageSizes = [{
            value: 10
        }, {
            value: 15
        }, {
            value: 20
        }];

        $scope.sort = $scope.pageSizes[0];
        $scope.pageSort = $scope.pageSizes[0].value;

        $scope.hasChanged = function(){
            alert($scope.sort.value)
            $scope.pageSort = $scope.sort.value;
            $scope.search();
        }

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isAscOrder = true;
            $scope.search();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isAscOrder = false;
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

        	$scope.searchCriteria.currPage = currPageVal;
        	console.log('Selected  module action -' + $scope.selectedModuleAction);

        	if(!$scope.selectedModuleAction) {
        		if($rootScope.searchCriteriaModuleAction) {
            		$scope.searchCriteria = $rootScope.searchCriteriaModuleAction;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}

        	}else {
	        	if($scope.selectedModuleAction) {
	        		$scope.searchCriteria.findAll = false;
		        	$scope.searchCriteria.moduleActionId = $scope.selectedModuleAction.id;
		        	$scope.searchCriteria.name = $scope.selectedModuleAction.name;
		        	$scope.searchCriteria.activeFlag = $scope.selectedModuleAction.activeFlag;
		        	console.log('selected user role id ='+ $scope.searchCriteria.moduleActionId);
	        	}else {
	        		$scope.searchCriteria.moduleActionId = 0;
	        	}
        	}
        	console.log($scope.searchCriteria);
        	//---
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }else{
                $scope.searchCriteria.columnName ="id";
            }


        	ModuleActionComponent.search($scope.searchCriteria).then(function (data) {
                $scope.moduleActions = data.transactions;
                $scope.moduleActionsLoader = true;
                console.log($scope.moduleActions);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                //---
                $scope.numberArrays = [];
                var startPage = 1;
                if(($scope.pages.totalPages - $scope.pages.currPage) >= 10) {
                    startPage = $scope.pages.currPage;
                }else if($scope.pages.totalPages > 10) {
                    startPage = $scope.pages.totalPages - 10;
                }
                var cnt = 0;
                for(var i=startPage; i<=$scope.pages.totalPages; i++){
                    cnt++;
                    if(cnt <= 10) {
                        $scope.numberArrays.push(i);
                    }
                }

                if($scope.moduleActions && $scope.moduleActions.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.moduleActions.length;
                    $scope.totalCountPages = data.totalCount;

                    if($scope.showCurrPage != data.totalPages){
                        $scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1; // 1 to // 11 to

                        $scope.pageEndIntex = $scope.pageEntries * $scope.showCurrPage; // 10 entries of 52 // 10 * 2 = 20 of 52 entries

                    }else if($scope.showCurrPage === data.totalPages){
                        $scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1;
                        $scope.pageEndIntex = $scope.totalCountPages;
                    }
                }



                if($scope.moduleActions == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaModuleAction = $scope.searchCriteria;
        	if($scope.pages.currPage == 1) {
            	$scope.firstStyle();
        	}
        };

//----
        $scope.clickNextOrPrev = function(number){
            $scope.pages.currPage = number;
            $scope.search();
        }

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

                       //Loading Page go to top position
                        $scope.loadPageTop = function(){
                            //alert("test");
                            //$("#loadPage").scrollTop();
                            $("#loadPage").animate({scrollTop: 0}, 2000);
                        }

                        // Page Loader Function

                        $scope.loadingStart = function(){ $('.pageCenter').show();$('.overlay').show();}
                        $scope.loadingStop = function(){

                            console.log("Calling loader");
                            $('.pageCenter').hide();$('.overlay').hide();

                        }



    });


