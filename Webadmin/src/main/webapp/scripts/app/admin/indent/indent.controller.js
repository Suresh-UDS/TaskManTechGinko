'use strict';

angular.module('timeSheetApp')
    .controller('IndentController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent, EmployeeComponent, IndentComponent, $http, $stateParams, $location, PaginationComponent) {
	
		$scope.selectedProject = {};
	
		$scope.selectedSite = {};
		
		$scope.selectedEmployee = {};
		
		$rootScope.loginView = false;
	
		$scope.pages = { currPage : 1};
	
		$scope.pager = {};
	
	    $scope.noData = false;
			
		$scope.refreshPage = function() { 
			 $scope.pages = {
		                currPage: 1,
		                totalPages: 0
		            }
//			 $scope.clearFilter();
		}
		
		//init load
		$scope.initLoad = function(){
			$scope.loadProjects();
		    $scope.loadPageTop();
		    $scope.searchFilter();
		 }
	
		$scope.initList = function() {
			$scope.loadMaterialIndents();
			$scope.setPage(1);
		}
		
		$scope.loadMaterialIndents = function() { 
			$scope.refreshPage();
	    	$scope.search();
	    	$location.path('/indent-list');
		}
		
		$scope.loadProjects = function() {
        	ProjectComponent.findAll().then(function (data) {
        		console.log("All projects");
        		$scope.projects = data;
        		console.log(data);
        		$scope.loadingStop();
        	});

        };

        $scope.loadSites = function () {
        	console.log("selected project - " + JSON.stringify($scope.selectedProject));
        	if($scope.selectedProject) {
            	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                    $scope.sites = data;

                });
        	}else {
            	SiteComponent.findAll().then(function (data) {
                    $scope.sites = data;
                });
        	}
        };
        
        $scope.loadAllSites = function() { 
        	SiteComponent.findAll().then(function (data) {
                $scope.sites = data;
            });
        }
        
        $scope.loadAllEmployee = function() { 
        	EmployeeComponent.findAll().then(function (data) {
                $scope.employees = data;
            });
        }
        
        $scope.loadEmployees = function () {
            if($scope.selectedSite.id){
               var empParam = {siteId: $scope.selectedSite.id, list: true};
               EmployeeComponent.search(empParam).then(function (data) {
                   console.log(data);
                   $scope.employees = data.transactions;
               });
            }
        }
		
		$scope.viewIndents = function() { 
			IndentComponent.findById($stateParams.id).then(function(data) { 
				console.log(data);
				$scope.loadingStop();
				$scope.materialIndentObj = data;
			});
		}
		
		$scope.editIndent = function() {
			IndentComponent.findById($stateParams.id).then(function(data) { 
				console.log(data);
				$scope.editIndentObj = data;
				$scope.selectedProject = {id: $scope.editIndentObj.projectId };
				$scope.selectedSite = {id: $scope.editIndentObj.siteId };
				$scope.selectedEmployee = {id: $scope.editIndentObj.requestedById }
				$scope.materialItems = $scope.editIndentObj.items;
				
			});
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
        	console.log('Selected  indent -' + JSON.stringify($scope.selectedIndent));
        	
        	if(!$scope.selectedIndentlist) {
        		if($rootScope.selectedIndentlist) {
            		$scope.searchCriteria = $rootScope.selectedIndentlist;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}

        	}else {
	        	if($scope.selectedIndentlist) {
	        		$scope.searchCriteria.findAll = false;
		        	$scope.searchCriteria.indentlistId = $scope.selectedIndentlist.id;
		        	$scope.searchCriteria.name = $scope.selectedIndentlist.name;
		        	$scope.searchCriteria.activeFlag = $scope.selectedIndentlist.activeFlag;
		        	console.log('selected inventory id ='+ $scope.searchCriteria.indentlistId);
	        	}else {
	        		$scope.searchCriteria.indentlistId = 0;
	        	}
        	}
        	if($scope.searchProject) { 
        		$scope.searchCriteria.projectId = $scope.searchProject.id;
        	}
        	if($scope.searchSite) { 
        		$scope.searchCriteria.siteId = $scope.searchSite.id;
        	}
            console.log("search criteria",$scope.searchCriteria);
            $scope.loadPageTop();
            IndentComponent.search($scope.searchCriteria).then(function (data) {
            	console.log(data);
                $scope.materialIndents = data.transactions;

                 /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                 console.log("Pagination",$scope.pager);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.materialIndents && $scope.materialIndents.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.materialIndents.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;

                }else{
                     $scope.noData = true;
                }
            });

        };
        
		//Loading Page go to top position
		$scope.loadPageTop = function(){
		    $("#loadPage").animate({scrollTop: 0}, 2000);
		}
	
       // Page Loader Function
        $scope.loadingStart = function(){ $('.pageCenter').show();$('.overlay').show();}
        $scope.loadingAuto = function(){
            $scope.loadingStart();
            $scope.loadtimeOut = $timeout(function(){
	            $('.pageCenter').hide();$('.overlay').hide();

            }, 2000);
        }
        
        $scope.loadingStop = function(){
            console.log("Calling loader");
            $('.pageCenter').hide();$('.overlay').hide();
        };

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

        $scope.cancelIndent = function () {
            $location.path('/indent-list');
        };

        $scope.setPage = function (page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
            $scope.pages.currPage = page;
            $scope.search();
        };


});
