'use strict';

angular.module('timeSheetApp')
    .controller('ChecklistController', function ($rootScope, $scope, $state, $timeout, ChecklistComponent,EmployeeComponent, $http, $stateParams, $location, JobComponent) {
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];
        $scope.noData = false;
        $scope.isEdit = false;

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
          //console.log($scope.selectedProject)
            $rootScope.conformText = text;
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
        	$scope.checklistItems.splice(ind,1);
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
//        	$scope.user = user;
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

        	console.log($scope.searchCriteria);
        	ChecklistComponent.search($scope.searchCriteria).then(function (data) {
                $scope.checklists = data.transactions;
                $scope.checklistsLoader = true;
              //console.log($scope.checklists);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.checklists == null){
                    $scope.pages.startInd = 0;
                    $scope.noData = true;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                    $scope.noData = false;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaChecklist = $scope.searchCriteria;
        	if($scope.pages.currPage == 1) {
            	$scope.firstStyle();
        	}
        };


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
          //console.log("Calling previous")

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
          //console.log("Calling next")

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
          //console.log("Calling last")
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



    });


