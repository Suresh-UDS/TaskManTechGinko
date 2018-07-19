'use strict';

angular.module('timeSheetApp')
    .controller('ProjectController', function ($scope, $rootScope, $state, $timeout,
     ProjectComponent,$http,$stateParams,$location,PaginationComponent) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorProjectExists = null;
        $scope.selectedProject = null;
        $scope.searchProject = null;
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.pager = {};
        $scope.noData = false;


        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.project = $scope.project || {};
        $scope.project.addressLat = $scope.project.addressLat || 0;
        $scope.project.addressLng = $scope.project.addressLng || 0;

        $scope.calendar = {
        		start : false,
        		end : false,
        };

        $scope.printPage = function () {
            window.print();
        }


        $scope.saveProject = function () {
        	console.log("-------")
        	console.log($scope.map)
            $scope.loadingStart();
        	$scope.error = null;
        	$scope.success =null;
        	$scope.errorProjectExists = null;
        	ProjectComponent.createProject($scope.project).then(function () {
                $scope.success = 'OK';
                $scope.showNotifications('top','center','success','Client has been added successfully!!');
                $scope.loadingStop();
            	//$scope.loadProjects();
            	$location.path('/projects');
            }).catch(function (response) {
                $scope.loadingStop();
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                    $scope.showNotifications('top','center','danger','Client already exists');
                } else {
                    $scope.showNotifications('top','center','danger','Unable to add client, please try again later..');
                    $scope.error = 'ERROR';
                }
            });;

        };

        $scope.cancelProject = function () {
        	$location.path('/projects');
        };

        $scope.loadProjectsList = function () {
            ProjectComponent.findAll().then(function (data) {
                $scope.projectsList = data;

            });
        };

        $scope.loadProjects = function () {
            $scope.clearFilter();
            $scope.search();
        };
        $scope.refreshPage = function(){
            $scope.loadProjects();
        }


        $scope.loadProject = function() {
        	ProjectComponent.findOne($stateParams.id).then(function (data) {
                $scope.project.addressLng = data.addressLng
                $scope.project.addressLat = data.addressLat;
                $scope.project = data;
            });

        };

        $scope.updateProject = function () {
            $scope.loadingStart();
        	ProjectComponent.updateProject($scope.project).then(function () {
                $scope.success = 'OK';
                $scope.showNotifications('top','center','success','Client has been updated successfully!!');
                $scope.loadingStop();
            	//$scope.loadProjects();
            	$location.path('/projects');
            }).catch(function (response) {
                $scope.success = null;
                $scope.loadingStop();
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                    $scope.showNotifications('top','center','danger','Client already exists');
                } else {
                    $scope.error = 'ERROR';
                    $scope.showNotifications('top','center','danger','Unable to update client, please try again later..');
                }
            });;
        };

        $scope.deleteConfirm = function (project){
        	$scope.confirmProject = project;
        }

        $scope.deleteProject = function () {
        	ProjectComponent.deleteProject($scope.confirmProject);
        	$scope.success = 'OK';
        	$state.reload();
        };

        var that =  $scope;

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        };

        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            //$scope.search();
            $scope.loadProjects();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadProjects();
        }


        $scope.searchFilter = function () {
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
        	console.log('Selected  project -' + $scope.searchProject);
        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaProject));

        	if(!$scope.searchProject) {
        		if($rootScope.searchCriteriaProject) {
            		$scope.searchCriteria = $rootScope.searchCriteriaProject;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}
        	}else if($scope.searchProject) {
        		$scope.searchCriteria.findAll = false;
	        	if($scope.searchProject) {
		        	$scope.searchCriteria.projectId = $scope.searchProject.id;
		        	if(!$scope.searchCriteria.projectId) {
		        		$scope.searchCriteria.projectName = $scope.searchProject.name;
		        		console.log('selected project name ='+ $scope.searchProject.name + ', ' +$scope.searchCriteria.projectName);
		        	}else {
			        	$scope.searchCriteria.projectName = $scope.searchProject.name;
		        	}
	        	}else {
	        		$scope.searchCriteria.projectId = 0;
	        	}



        	}
        	console.log($scope.searchCriteria);

        	//------
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
                $scope.projects = '';
                $scope.projectsLoader = false;
                $scope.loadPageTop();
            ProjectComponent.search($scope.searchCriteria).then(function (data) {
                $scope.projects = data.transactions;
                $scope.projectsLoader = true;

                /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                 console.log("Pagination",$scope.pager);
                 console.log($scope.projects);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;


                if($scope.projects && $scope.projects.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.projects.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;

                }else{
                     $scope.noData = true;
                }

            });

        };


        $scope.pageSort = 10;


        $scope.clearFilter = function() {
            $scope.selectedProject = null;
            $scope.searchProject = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaProject = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
        };

        //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.loadProjects();
             $scope.setPage(1);

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

        $scope.showNotifications= function(position,alignment,color,msg){
                        demo.showNotification(position,alignment,color,msg);
                    }

    });
