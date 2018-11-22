'use strict';

angular.module('timeSheetApp')
    .controller('UserRolesController', function ($rootScope, $scope, $state, $timeout,
     UserRoleComponent,EmployeeComponent, UserComponent, $http, $stateParams, $location,
      JobComponent, PaginationComponent,getLocalStorage) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];
        $scope.searchCriteria = {};
        $scope.pager = {};
        $scope.pageSort = 10;
        $scope.selectedUserRoleId = null;
        $scope.selectedUserRoleName = null;
        $scope.selectedUserRoleLevel = null;
        $scope.searchUserRoleId = null;
        $scope.searchUserRoleName = null;
        $scope.searchUserRoleLevel = null;
        $scope.noData = false;
        $scope.btnDisable = false;

        //$timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedGroup;

        $scope.users;

        $scope.userRoles;

        $scope.selectedUserRole;

        $scope.conform = function(text)
        {
            console.log($scope.selectedProject)
            $rootScope.conformText = text;
            $('#conformationModal').modal();

        }
        $rootScope.back = function (text) {
            if(text == 'cancel')
            {
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.cancelUserRole();
            }
            else if(text == 'save')
            {
                $scope.saveUserRole();
            }
            else if(text == 'update')
            {
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updateUserRole()
            }
        };


        $scope.saveUserRole = function () {
            $scope.saveLoad = true;
            $scope.btnDisable = true;
        	console.log('userRole -'+ $scope.userRole);
        	UserRoleComponent.createUserRole($scope.userRole).then(function () {
            	$scope.success = 'OK';
                $scope.saveLoad = false;
            	//$scope.loadUsers();
                $scope.showNotifications('top','center','success','UserRole Created Successfully');
            	$location.path('/user-roles');
            }).catch(function (response) {
                $scope.saveLoad = false;
                $scope.success = null;
                $scope.btnDisable = false;
                console.log(response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorUserRoleExists = true;
                     $scope.showNotifications('top','center','danger','User role already exists!.. Please choose another one');
                } else if(response.status === 400 && response.data.message === 'error.validation'){
                    $scope.showNotifications('top','center','danger','User role invalid!..');
                	$scope.validationError = true;
                	$scope.validationErrorMsg = response.data.description;
                } else {
                    $scope.showNotifications('top','center','danger','Unable to create user role, Please try again later..');
                    $scope.error = 'ERROR';
                }
            });
        };

        $scope.cancelUserRole = function () {
        	$location.path('/user-roles');
        };

        $scope.loadUserRoles = function () {
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
            //$scope.loadUsers();
        	$scope.search();
        }



        $scope.loadUserRole = function(id) {
        	//console.log('loadUserRole -' + $stateParams.id);
        	UserRoleComponent.findOne(id).then(function (data) {
                $scope.loadingStop();
                $scope.userRole = data;
            });

        };

          $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

        $scope.updateUserRole = function () {
        	console.log('UserRole details - ' + JSON.stringify($scope.userRole));
            $scope.btnDisable = true;
        	UserRoleComponent.updateUserRole($scope.userRole).then(function () {
            	$scope.success = 'OK';
            	$scope.loadUserRoles();
                $scope.showNotifications('top','center','success','UserRole Created Successfully');
            	$location.path('/user-roles');
            }).catch(function (response) {
                $scope.success = null;
                $scope.btnDisable = false;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorUserRoleExists = true;
                    $scope.showNotifications('top','center','danger','User role already exists!.. Please choose another one');
                } else if(response.status === 400 && response.data.message === 'error.validation'){
					$scope.validationError = true;
					$scope.validationErrorMsg = response.data.description;
                    $scope.showNotifications('top','center','danger','User role invalid!..');
                } else {
                    $scope.error = 'ERROR';
                    $scope.showNotifications('top','center','danger','Unable to update user role!.. Please try again later.');
                }
            });
        };

        $scope.deleteConfirm = function (user){
        	console.log('...>>>delete confirm<<<');
        	$scope.confirmUserRole = userRole;
        	console.log(userRole.id);
        }

        $scope.deleteUserRole = function () {
        	console.log("user>>>>",+$scope.confirmUserRole);
//        	$scope.user = user;
        	UserRoleComponent.deleteUserRole($scope.confirmUserRole);
        	$scope.success = 'OK';
        	$state.reload();
        };


        $scope.hasChanged = function(){
            alert($scope.sort.value)
            $scope.pageSort = $scope.sort.value;
            $scope.search();
        }

        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            $scope.search();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            $scope.search();
        }
        $scope.searchFilter = function () {
        	$('.BasicFilterModal.in').modal('hide');
            $scope.setPage(1);
            $scope.search();
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
            $scope.searchCriteria.findAll = false;

             if( !$scope.searchUserRoleId && !$scope.searchUserRoleName
                && !$scope.searchUserRoleLevel) {
                $scope.searchCriteria.findAll = true;
            }
            if($scope.searchUserRoleId) {
                    $scope.searchCriteria.userRoleId = $scope.searchUserRoleId;

            }else{
                 $scope.searchCriteria.userRoleId = null;
            }

             if($scope.searchUserRoleName) {
                    $scope.searchCriteria.role = $scope.searchUserRoleName;

            }else{
                 $scope.searchCriteria.role = null;
            }

             if($scope.searchUserRoleLevel) {
                    $scope.searchCriteria.roleLevel= $scope.searchUserRoleLevel;

            }else{
                $scope.searchCriteria.roleLevel = null;
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
             $scope.userRoles = '';
             $scope.userRolesLoader = false;
             $scope.loadPageTop();

            /* Localstorage (Retain old values while edit page to list) start */

            if($rootScope.retain == 1){
                $scope.localStorage = getLocalStorage.getSearch();
                console.log('Local storage---',$scope.localStorage);

                if($scope.localStorage){
                    $scope.filter = true;
                    $scope.pages.currPage = $scope.localStorage.currPage;
                    // $scope.searchProject = {searchStatus:'0',id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                    // $scope.searchSite = {searchStatus:'0',id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};

                }

                $rootScope.retain = 0;

                $scope.searchCriteras  = $scope.localStorage;
            }else{

            	$scope.searchCriteras  = $scope.searchCriteria;
            }

            /* Localstorage (Retain old values while edit page to list) end */


        	UserRoleComponent.search($scope.searchCriteras).then(function (data) {
                $scope.userRoles = data.transactions;
                $scope.userRolesLoader = true;

                /** retaining list search value.**/
                getLocalStorage.updateSearch($scope.searchCriteras);

                /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log('UserRole list -' + JSON.stringify($scope.userRoles));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.userRoles && $scope.userRoles.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.userRoles.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;

                }else{
                     $scope.noData = true;
                }


            });

        };

        $scope.clearFilter = function() {
            $scope.selectedUserRoleId = null;
            $scope.selectedUserRoleName = null;
            $scope.selectedUserRoleLevel = null;
            $scope.searchUserRoleId = null;
            $scope.searchUserRoleName = null;
            $scope.searchUserRoleLevel = null;
            $scope.searchCriteria = {};
            $scope.localStorage = null;
            $rootScope.searchCriteriaSite = null;
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


    });


