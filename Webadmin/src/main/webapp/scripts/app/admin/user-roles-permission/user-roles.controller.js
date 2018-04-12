'use strict';

angular.module('timeSheetApp')
    .controller('UserRolesController', function ($rootScope, $scope, $state, $timeout, UserRoleComponent,EmployeeComponent, UserComponent, $http, $stateParams, $location, JobComponent) {
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

        $scope.userRoles;

        $scope.selectedUserRole;

        $scope.saveUserRole = function () {
        	console.log('userRole -'+ $scope.userRole);
        	UserRoleComponent.createUserRole($scope.userRole).then(function () {
            	$scope.success = 'OK';
            	$scope.loadUsers();
            	$location.path('/user-roles');
            }).catch(function (response) {
                $scope.success = null;
                console.log(response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorUserRoleExists = true;
                } else if(response.status === 400 && response.data.message === 'error.validation'){
                	$scope.validationError = true;
                	$scope.validationErrorMsg = response.data.description;
                } else {
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
        	$scope.loadUsers();
        }



        $scope.loadUserRole = function() {
        	console.log('loadUserRole -' + $stateParams.id);
        	UserRoleComponent.findOne($stateParams.id).then(function (data) {
                $scope.loadingStop();
                $scope.userRole = data;
            });

        };

        $scope.updateUserRole = function () {
        	console.log('UserRole details - ' + JSON.stringify($scope.userRole));

        	UserRoleComponent.updateUserRole($scope.userRole).then(function () {
            	$scope.success = 'OK';
            	$scope.loadUserRoles();
            	$location.path('/user-roles');
            }).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorUserRoleExists = true;
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

        $scope.search = function () {
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        	if(!$scope.searchCriteria) {
            	var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;
        	}

        	$scope.searchCriteria.currPage = currPageVal;
        	console.log('Selected  user role -' + $scope.selectedUserRole);

        	if(!$scope.selectedUserRole) {
        		if($rootScope.searchCriteriaUserRole) {
            		$scope.searchCriteria = $rootScope.searchCriteriaUserRole;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}

        	}else {
	        	if($scope.selectedUserRole) {
	        		$scope.searchCriteria.findAll = false;
		        	$scope.searchCriteria.userRoleId = $scope.selectedUserRole.id;
		        	$scope.searchCriteria.name = $scope.selectedUserRole.name;
		        	$scope.searchCriteria.activeFlag = $scope.selectedUserRole.activeFlag;
		        	console.log('selected user role id ='+ $scope.searchCriteria.userRoleId);
	        	}else {
	        		$scope.searchCriteria.userRoleId = 0;
	        	}
        	}
        	console.log($scope.searchCriteria);
        	UserRoleComponent.search($scope.searchCriteria).then(function (data) {
                $scope.userRoles = data.transactions;
                $scope.userRolesLoader = true;
                console.log($scope.userRoles);
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
        	$rootScope.searchCriteriaUserRole = $scope.searchCriteria;
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


