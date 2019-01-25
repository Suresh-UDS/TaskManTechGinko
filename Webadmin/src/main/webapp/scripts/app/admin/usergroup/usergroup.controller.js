'use strict';

angular.module('timeSheetApp')
    .controller('UserGroupController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, UserGroupComponent,$http,$stateParams,$location) {
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserGroupExists = null;

        $scope.userGroups;

        $scope.selectedUserGroup;

        $scope.pages = { currPage : 1};

        //$timeout(function (){angular.element('[ng-model="name"]').focus();});

//        $scope.saveUserGroup = function () {
//        	$scope.error ='';
//        	UserGroupComponent.createUserGroup($scope.userGroup, function(err) {
//        		if(err) {
//        			$scope.error = err.data;
//        			console.log($scope.err);
//        		}
//        	});
//        	if($scope.error == '') {
//            	$scope.success = 'OK';
//            	$scope.loadUserGroups();
//            	$location.path('/userGroups');
//        	}
//        };
//
         $scope.saveUserGroup = function () {

                	UserGroupComponent.createUserGroup($scope.userGroup).then(function () {
                    	$scope.success = 'OK';
                    	$scope.loadUserGroups();
                    	$location.path('/userGroups');
                    }).catch(function (response) {
                        $scope.success = null;
                        console.log('Error - '+ response.data);
                        if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                            $scope.errorUserGroupExists = true;
                            console.log($scope.errorUserGroupExists);
                        } else {
                            $scope.error = 'ERROR';
                        }
                    });
                };

        $scope.cancelUserGroup = function () {
        	$location.path('/userGroups');
        };

        $scope.loadUserGroups = function () {
        	$scope.search();
        };

        $scope.refreshPage = function() {
        	$scope.clearFilter();
        	$scope.loadUserGroups();
        }



        $scope.loadUserGroup = function() {
        	UserGroupComponent.findOne($stateParams.id).then(function (data) {
                $scope.userGroup = data;
            });

        };

        $scope.updateUserGroup = function () {
        	UserGroupComponent.updateUserGroup($scope.userGroup);
        	$scope.success = 'OK';
        	$location.path('/userGroups');
        };

        $scope.deleteConfirm = function(userGroup){
        	console.log(userGroup);
        	$scope.confirmUserGroup = userGroup;
        }

        $scope.deleteUserGroup = function () {

        	/*$scope.userGroup = userGroup;*/
        	UserGroupComponent.deleteUserGroup($scope.confirmUserGroup);
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
        	console.log('Selected  user group -' + JSON.stringify($scope.selectedUserGroup));

        	if(!$scope.selectedUserGroup) {
        		if($rootScope.searchCriteriaUserGroup) {
            		$scope.searchCriteria = $rootScope.searchCriteriaUserGroup;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}

        	}else {

	        	if($scope.selectedUserGroup) {
	        		$scope.searchCriteria.findAll = false;
		        	$scope.searchCriteria.userGroupId = $scope.selectedUserGroup.id;
		        	$scope.searchCriteria.userGroupName = $scope.selectedUserGroup.name;
		        	console.log('selected user group id ='+ $scope.searchCriteria.userGroupId);
	        	}else {
	        		$scope.searchCriteria.userGroupId = 0;
	        	}
        	}
        	console.log($scope.searchCriteria);
        	UserGroupComponent.search($scope.searchCriteria).then(function (data) {
                $scope.userGroups = data.transactions;
                console.log($scope.userGroups);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.userGroups == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaUserGroup = $scope.searchCriteria;
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

    });
