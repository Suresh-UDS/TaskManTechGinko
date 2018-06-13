'use strict';

angular.module('timeSheetApp')
    .controller('UserController', function ($rootScope, $scope, $state, $timeout, 
        UserGroupComponent,EmployeeComponent, UserComponent, UserRoleComponent,
         $http, $stateParams, $location, JobComponent, PaginationComponent) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];
        $scope.pageSort = 10;
        $scope.pager = {};

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedGroup;

        $scope.users;

        $scope.userGroups;

        $scope.userRoles;

        $scope.selectedRole = null;

        $scope.selectedUser;

        $scope.loading;

        $scope.searchCriteria = {};

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
            	//$scope.loadUsers();
            	$scope.showNotifications('top','center','success','User Created Successfully');
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
            $scope.clearFilter();
        	$scope.search();
        };

        $scope.refreshPage = function() {
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
	        	if($scope.selectedRole) {
	        		$scope.user.userRoleId = $scope.selectedRole.id;
	        	}
	        	if($scope.selectedGroup) {
	        		$scope.user.userGroupId = $scope.selectedGroup.id;
	        	}
	        	$scope.user.password = $scope.user.clearPassword;
	        	if($scope.selectedEmployee) {
	            	$scope.user.employeeId = $scope.selectedEmployee.id
	        	}

        	UserComponent.updateUser($scope.user).then(function () {
            	$scope.success = 'OK';
            	//$scope.loadUsers();
            	$scope.showNotifications('top','center','success','User Details Updated Successfully');
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

        

        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            $scope.search();
            //$scope.loadJobs();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            $scope.search();
            //$scope.loadJobs();
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

	        	$scope.searchCriteria.currPage = currPageVal;

	        	//------
            console.log('Selected  user -' + JSON.stringify($scope.searchCriteria.userLogin));
            console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaUser));
            $scope.searchCriteria.findAll = false;

	        	if(!$scope.userLogin && !$scope.userFirstName
	        			&& !$scope.userLastName && !$scope.userEmail && !$scope.selectedRole) {
	        		
	        			$scope.searchCriteria.findAll = true;
	        		}

                if($scope.userLogin) {
                    $scope.searchCriteria.userLogin = $scope.userLogin;
                }  

                if($scope.userFirstName) {
                    $scope.searchCriteria.userFirstName = $scope.userFirstName;
                }    

                if($scope.userLastName) {
                    $scope.searchCriteria.userLastName = $scope.userLastName;
                } 

                if($scope.userEmail) {
                    $scope.searchCriteria.userEmail = $scope.userEmail;
                }
	        		
	        	if($scope.selectedRole) {
	        		$scope.searchCriteria.userRoleId = $scope.selectedRole.id;
	        	}

	        	
    	        	//----
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
                    
                   
                     console.log("search criteria",$scope.searchCriteria);
                     $scope.users = '';
                     $scope.usersLoader = false;
                     $scope.loadPageTop();


            UserComponent.search($scope.searchCriteria).then(function (data) {
	        		$scope.loadEmployee();
	        		console.log("Employee details---"+JSON.stringify($scope.loadEmployee()));
	                $scope.users = data.transactions;
	                //for(var i=0;i<$scope.users.length;i++) console.log($scope.users[i].id);

                    $scope.usersLoader = true;

                    /*
                        ** Call pagination  main function **
                    */
                     $scope.pager = {};
                     $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                     $scope.totalCountPages = data.totalCount;

                     console.log("Pagination",$scope.pager);
                     console.log("jobs",$scope.users);

                    $scope.pages.currPage = $scope.pages.currPage;
                    $scope.pages.totalPages = data.totalPages;
               
                    if($scope.users && $scope.users.length > 0 ){
                        $scope.showCurrPage = data.currPage;
                        $scope.pageEntries = $scope.users.length;
                        $scope.totalCountPages = data.totalCount;
                        $scope.pageSort = 10;

                       
                    }

	            
	            });
	        
        };


        $scope.clearFilter = function() {
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.userLogin = null;
            $scope.userFirstName = null;
            $scope.userLastName = null;
            $scope.userEmail = null;
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

        /*
            ** Pagination init function **
            @Param:integer

        */

            $scope.setPage = function (page) {
                    if($scope.pager) {
                    if (page < 1 || page > $scope.pager.totalPages) {
                        return;
                    }
                    }
                //alert(page);
                $scope.pages.currPage = page;
                $scope.search();
            };

            $scope.showNotifications= function(position,alignment,color,msg){
                demo.showNotification(position,alignment,color,msg);
            }


    });


