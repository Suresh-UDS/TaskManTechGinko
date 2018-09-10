'use strict';

angular.module('timeSheetApp')
    .controller('ExpenseController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent, ExpenseComponent, $http,$stateParams,$location, PaginationComponent) {


    	$scope.selectedProject = {};

    	$scope.selectedSite = {};

    	$scope.selectedSla = {};

    	$rootScope.loginView = false;

    	$scope.pages = { currPage : 1};

    	$scope.pager = {};

        $scope.noData = false;

			//init load
			$scope.initLoad = function(){
				$scope.loadProjects();
			    $scope.loadPageTop();
			    $scope.searchFilter();
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

                };


                $scope.searchFilter = function () {
                    $scope.setPage(1);
                    $scope.search();
                 }

                $scope.cancelExpense = function () {
                    $location.path('/expense-list');
                };

                $scope.setPage = function (page) {

                    if (page < 1 || page > $scope.pager.totalPages) {
                        return;
                    }
                    //alert(page);
                    $scope.pages.currPage = page;
                    $scope.search();
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
                	console.log('Selected  site -' + JSON.stringify($scope.selectedSite));
                	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaSite));

                	if(!$scope.selectedSite) {
                		if($rootScope.searchCriteriaSite) {
                    		$scope.searchCriteria = $rootScope.searchCriteriaSite;
                		}else {
                			$scope.searchCriteria.findAll = true;
                		}
                	}else if($scope.selectedSite) {
                		$scope.searchCriteria.findAll = false;
        	        	if($scope.selectedSite) {
        		        	$scope.searchCriteria.siteId = $scope.selectedSite.id;
        		        	if(!$scope.searchCriteria.siteId) {
        		        		$scope.searchCriteria.siteName = $scope.selectedSite.name;
        		        	}else {
        			        	$scope.searchCriteria.siteName = $scope.selectedSite.name;
        		        	}
        		        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
        	        	}else {
        	        		$scope.searchCriteria.siteId = 0;
        	        	}
                	}

                    console.log("search criteria",$scope.searchCriteria);
                        $scope.slas = '';
                        $scope.sitesLoader = false;
                        $scope.loadPageTop();
                    ExpenseComponent.search($scope.searchCriteria).then(function (data) {
                        $scope.slas = data.transactions;
                        $scope.sitesLoader = true;

                         /*
                            ** Call pagination  main function **
                        */
                         $scope.pager = {};
                         $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                         $scope.totalCountPages = data.totalCount;

                         console.log("Pagination",$scope.pager);
                         console.log($scope.slas);

                        $scope.pages.currPage = data.currPage;
                        $scope.pages.totalPages = data.totalPages;

                        if($scope.slas && $scope.slas.length > 0 ){
                            $scope.showCurrPage = data.currPage;
                            $scope.pageEntries = $scope.slas.length;
                            $scope.totalCountPages = data.totalCount;
                            $scope.pageSort = 10;
                            $scope.noData = false;

                        }else{
                             $scope.noData = true;
                        }
                    });

                };


                $scope.loadProjects = function() {
                	ProjectComponent.findAll().then(function (data) {
                		console.log("SLA projects");
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


    });
