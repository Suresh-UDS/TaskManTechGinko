'use strict';

angular.module('timeSheetApp')
    .controller('UserController', function ($rootScope, $scope, $state, $timeout, UserGroupComponent,EmployeeComponent, UserComponent, UserRoleComponent, $http, $stateParams, $location, JobComponent) {
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

        $scope.userGroups;

        $scope.userRoles;

        $scope.selectedRole;

        $scope.selectedUser;

        $scope.loading;

        //$scope.user = {};
        //$scope.user.emailSubscribed = true;

        $scope.init = function() {
    		$scope.loadUserRoles();
        		$scope.loadUsers();
        }

        $scope.loadGroups = function () {
        	UserGroupComponent.findAll().then(function (data) {
                $scope.userGroups = data;
            });
        };

        $scope.loadUserRoles = function () {
        	UserRoleComponent.findAll().then(function (data) {
                $scope.userRoles = data;
            });
        };


        $scope.loadEmployee = function () {
            $scope.loading = true;
            EmployeeComponent.findAll().then(function (data) {
        		$scope.selectedEmployee = null;
                $scope.loadingStop();
                $scope.employees = data;
                $scope.loading=false;

            });
        };

        $scope.saveUser = function () {
        	if($scope.selectedGroup) {
            	$scope.user.userGroupId = $scope.selectedGroup.id;
        	}
        	if($scope.selectedRole) {
            	$scope.user.userRoleId = $scope.selectedRole.id;
        	}
        	$scope.user.clearPassword = $scope.user.password;
        	if($scope.selectedEmployee) {
            	$scope.user.employeeId = $scope.selectedEmployee.id
        	}
        	UserComponent.createUser($scope.user).then(function () {
            	$scope.success = 'OK';
            	$scope.loadUsers();
            	$location.path('/users');
            }).catch(function (response) {
                $scope.success = null;
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorUserExists = true;
                } else if(response.status === 400 && response.data.message === 'error.validation'){
                	$scope.validationError = true;
                	$scope.validationErrorMsg = response.data.description;
                } else {
                    $scope.error = 'ERROR';
                }
            });
        };

        $scope.cancelUser = function () {
        	$location.path('/users');
        };

        $scope.loadUsers = function () {
//        	if($rootScope.searchCriteriaUser) {
//        		$scope.search();
//        	}else {
//	        	UserComponent.findAll().then(function (data) {
//	                $scope.users = data;
//	            });
//        	}
        	$scope.search();
        };

        $scope.refreshPage = function() {
        		$scope.clearFilter();
        		$scope.loadUsers();
        }



        $scope.loadUser = function() {
	        	$scope.loadEmployee();
	        	UserComponent.findOne($stateParams.id).then(function (data) {
	                $scope.user = data;
	                $scope.selectedRole = {id : data.userRoleId, name : data.userRoleName}
	                $scope.selectedEmployee = {id : data.employeeId,name : data.employeeName}
	            });
        };

        $scope.updateUser = function () {
        	if($scope.selectedGroup) {
        		$scope.user.userGroupId = $scope.selectedGroup.id;
        	}
        	$scope.user.password = $scope.user.clearPassword;
        	if($scope.selectedEmployee) {
            	$scope.user.employeeId = $scope.selectedEmployee.id
        	}

        	UserComponent.updateUser($scope.user).then(function () {
            	$scope.success = 'OK';
            	$scope.loadUsers();
            	$location.path('/users');
            }).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorUserExists = true;
                } else if(response.status === 400 && response.data.message === 'error.validation'){
                	$scope.validationError = true;
                	$scope.validationErrorMsg = response.data.description;
                } else {
                    $scope.error = 'ERROR';
                }
            });
        };

        $scope.deleteConfirm = function (user){
        	$scope.confirmUser = user;
        }

        $scope.deleteUser = function () {
//        	$scope.user = user;
        	UserComponent.deleteUser($scope.confirmUser);
        	$scope.success = 'OK';
        	$state.reload();
        };

        //-----
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

	        	//------
            console.log('Selected  user -' + JSON.stringify($scope.searchCriteria.userLogin));
            console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaUser));

	        	if(!$scope.searchCriteria.userLogin && !$scope.searchCriteria.userFirstName
	        			&& !$scope.searchCriteria.userLastName && !$scope.searchCriteria.userEmail && !$scope.selectedRole) {
	        		if($rootScope.searchCriteriaUser) {
	            		$scope.searchCriteria = $rootScope.searchCriteriaUser;
	        		}else {
	        			$scope.searchCriteria.findAll = true;
	        		}

	        	}else {
	        		$scope.searchCriteria.findAll = false;
		        	//$scope.searchCriteria.userId = $scope.selectedUser.id;
	        		/*
		        	$scope.searchCriteria.userLogin = $scope.selectedUser.login;
		        	$scope.searchCriteria.userFirstName = $scope.selectedUser.firstName;
		        	$scope.searchCriteria.userLastName = $scope.selectedUser.lastName;
		        	$scope.searchCriteria.userEmail = $scope.selectedUser.email;
		        	*/
		        	if($scope.selectedRole) {
		        		$scope.searchCriteria.userRoleId = $scope.selectedRole.id;
		        	}
		        	//console.log('selected user id ='+ $scope.searchCriteria.userId);
	        	}

	        	//----
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }

            console.log("search Criteria to be sent - "+JSON.stringify($rootScope.searchCriteriaUser));


            UserComponent.search($scope.searchCriteria).then(function (data) {
	        		$scope.loadEmployee();
	        		console.log("Employee details---"+JSON.stringify($scope.loadEmployee()));
	                $scope.users = data.transactions;
	                for(var i=0;i<$scope.users.length;i++) console.log($scope.users[i].id);

                    $scope.usersLoader = true;
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


                    //--------

                if($scope.users && $scope.users.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.users.length;
                    $scope.totalCountPages = data.totalCount;

                    if($scope.showCurrPage != data.totalPages){
                        $scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1; // 1 to // 11 to

                        $scope.pageEndIntex = $scope.pageEntries * $scope.showCurrPage; // 10 entries of 52 // 10 * 2 = 20 of 52 entries

                    }else if($scope.showCurrPage === data.totalPages){
                        $scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1;
                        $scope.pageEndIntex = $scope.totalCountPages;
                    }
                }




                if($scope.users == null){
	                    $scope.pages.startInd = 0;
	                }else{
	                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
	                }

	                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
	                $scope.pages.totalCnt = data.totalCount;
	            	$scope.hide = true;
	            });
	        	$rootScope.searchCriteriaUser = $scope.searchCriteria;
	        	if($scope.pages.currPage == 1) {
	            	$scope.firstStyle();
	        	}
        };



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
            $scope.searchCriteria.userLogin = null;
            $scope.searchCriteria.userFirstName = null;
            $scope.searchCriteria.userLastName = null;
            $scope.searchCriteria.userEmail = null;
            $scope.selectedRole = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaUser = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
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
                $scope.loadingAuto = function(){
                    $scope.loadingStart();
                    $scope.loadtimeOut = $timeout(function(){

                    //console.log("Calling loader stop");
                    $('.pageCenter').hide();$('.overlay').hide();

                }, 2000);
                   // alert('hi');
                }
                $scope.loadingStop = function(){

                    console.log("Calling loader");
                    $('.pageCenter').hide();$('.overlay').hide();

                }



    });


