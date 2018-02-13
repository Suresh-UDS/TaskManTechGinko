'use strict';

angular.module('timeSheetApp')
    .controller('UserController', function ($rootScope, $scope, $state, $timeout, UserGroupComponent,EmployeeComponent, UserComponent, UserRoleComponent, $http, $stateParams, $location, JobComponent) {
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

        //$scope.user = {};
        //$scope.user.emailSubscribed = true;

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
            console.log("load employees ");
        	EmployeeComponent.findAll().then(function (data) {
        		$scope.selectedEmployee = null;
                $scope.employees = data;
                console.log($scope.employees);
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
        	console.log($scope.user);
        	UserComponent.createUser($scope.user).then(function () {
            	$scope.success = 'OK';
            	$scope.loadUsers();
            	$location.path('/users');
            }).catch(function (response) {
                $scope.success = null;
                console.log(response.data);
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
        	console.log('User details - ' + JSON.stringify($scope.user));

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
        	console.log('...>>>delete confirm<<<');
        	$scope.confirmUser = user;
        	console.log(user.id);
        }

        $scope.deleteUser = function () {
        	console.log("user>>>>",+$scope.confirmUser);
//        	$scope.user = user;
        	UserComponent.deleteUser($scope.confirmUser);
        	$scope.success = 'OK';
        	$state.reload();
        };

        $scope.search = function () {
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        	if(!$scope.searchCriteria) {
            	var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;
        	}

        	$scope.searchCriteria.currPage = currPageVal;
        	console.log('Selected  user group -' + $scope.selectedUser);

        	if(!$scope.selectedUser) {
        		if($rootScope.searchCriteriaUser) {
            		$scope.searchCriteria = $rootScope.searchCriteriaUser;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}

        	}else {
	        	if($scope.selectedUser) {
	        		$scope.searchCriteria.findAll = false;
		        	$scope.searchCriteria.userId = $scope.selectedUser.id;
		        	$scope.searchCriteria.userLogin = $scope.selectedUser.login;
		        	$scope.searchCriteria.userFirstName = $scope.selectedUser.firstName;
		        	$scope.searchCriteria.userLastName = $scope.selectedUser.lastName;
		        	$scope.searchCriteria.userEmail = $scope.selectedUser.email;
		        	console.log('selected user id ='+ $scope.searchCriteria.userId);
	        	}else {
	        		$scope.searchCriteria.userId = 0;
	        	}
        	}
        	console.log($scope.searchCriteria);
        	UserComponent.search($scope.searchCriteria).then(function (data) {
        		$scope.loadEmployee();
                $scope.users = data.transactions;
                console.log($scope.users);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
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



    });


