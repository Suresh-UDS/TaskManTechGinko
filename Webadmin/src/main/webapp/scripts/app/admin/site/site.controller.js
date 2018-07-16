'use strict';

angular.module('timeSheetApp')
    .controller('SiteController', function ($rootScope, $scope, $state, $timeout, 
        ProjectComponent, SiteComponent,$http,$stateParams,$location,PaginationComponent) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorSitesExists = null;
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.searchProject = null;
        $scope.searchSite = null;
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.pager = {};
        $scope.noData = false;

        $timeout(function (){angular.element('[ng-model="name"]').focus();});
        
        $scope.pageSort = 10;
     

        $scope.calendar = {
        		start : false,
        		end : false,
        }

        $scope.newShiftItem ={}

        $scope.shiftFrom = new Date();
        $scope.shiftTo = new Date();


        $scope.loadProjectsList = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projectsList = data;
                 $scope.loadingStop();
            });
        };

         $scope.loadSitesList = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.sitesList = data;
            });
        };
         $scope.loadDepSites = function () {

            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depSite=$scope.selectedProject.id;
            }else{
                    var depSite=$scope.searchProject.id;
                }
            ProjectComponent.findSites(depSite).then(function (data) {
                $scope.selectedSite = null;
                $scope.sitesList = data;
            });
        };

        $scope.initCalender = function(){
            demo.initFormExtendedDatetimepickers();
        }

        $('#shiftFrom').on('dp.change', function(e){

            console.log(e.date._d);
            if(e.date._d > $scope.newShiftItem.endTime) {
            		$scope.showNotifications('top','center','danger','From time cannot be after To time');
            		$scope.shiftFrom = $scope.newShiftItem.startTime;
            		return false;
            }else {
                $scope.newShiftItem.startTime = e.date._d.getHours() + ':' + e.date._d.getMinutes();
            }
        });

        $('#shiftTo').on('dp.change', function(e){

            console.log(e.date._d);
            if($scope.newShiftItem.startTime > e.date._d) {
            		$scope.showNotifications('top','center','danger','To time cannot be before From time');
            		$scope.shiftTo = $scope.newShiftItem.endTime;
            		return false;
            }else {
                $scope.newShiftItem.endTime = e.date._d.getHours() + ':' + e.date._d.getMinutes();
            }

        });
        $scope.initCalender();

        $scope.saveSite = function () {
	        	$scope.error = null;
	        	$scope.success = null;
	        	$scope.errorSitesExists = null;
	        	$scope.errorProject = null;
	        	if(!$scope.selectedProject.id){
	        		$scope.errorProject = "true";
	        	}else{
	        		$scope.site.projectId = $scope.selectedProject.id;
	        		console.log('shifts - ' + JSON.stringify($scope.shiftItems));
	        		$scope.site.shifts = $scope.shiftItems;
	            	SiteComponent.createSite($scope.site).then(function() {
	                    $scope.success = 'OK';
	                    $scope.showNotifications('top','center','success','Site Added');
	                    $scope.selectedProject = null;
	                	$scope.loadSites();
	                	$location.path('/sites');
	                }).catch(function (response) {
	                    $scope.success = null;
	                    console.log('Error - '+ response.data);
	                    console.log('status - '+ response.status + ' , message - ' + response.data.message);
	                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                            $scope.errorSitesExists = 'ERROR';
	                        $scope.showNotifications('top','center','danger','Site Already Exists');

	                        console.log($scope.errorSitesExists);
	                    } else {
	                        $scope.showNotifications('top','center','danger','Error in creating Site. Please try again later..');
	                        $scope.error = 'ERROR';
	                    }
	                });
	        	}

        };

        $scope.shiftItems=[];

        $scope.newshiftItem = {};

        $scope.addShiftItem = function(event) {
        		event.preventDefault();
        		console.log('new shift item - ' + JSON.stringify($scope.newShiftItem));
        		$scope.shiftItems.push($scope.newShiftItem);
        		console.log('shiftItems - '+ JSON.stringify($scope.shiftItems));
        		$scope.newShiftItem = {};
        }

        $scope.removeItem = function(ind) {
        		$scope.shiftItems.splice(ind,1);
        }


        $scope.cancelSite = function () {
        		$location.path('/sites');
        };

        $scope.loadSites = function () {
	        	$scope.clearFilter();
	        	$scope.search();
        };

        $scope.refreshPage = function(){
               $scope.loadSites();
        }


        $scope.loadSite = function() {
        	SiteComponent.findOne($stateParams.id).then(function (data) {
                $scope.site = data;
                console.log('$scope.site.shifts - '+$scope.site.shifts);
                $scope.shiftItems = $scope.site.shifts;
                $scope.loadSelectedProject($scope.site.projectId);
            });
        };

        $scope.loadSelectedProject = function(projectId) {
        	ProjectComponent.findOne(projectId).then(function (data) {
                $scope.selectedProject = data;

            });
        };

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }


        $scope.updateSite = function () {

        	$scope.error = null;
        	$scope.success = null;
        	$scope.errorProject = null;
        	if(!$scope.selectedProject.id){
        		$scope.errorProject = "true";
        	}else{
        	    console.log("update site");
        	    console.log($scope.site);
        		$scope.site.projectId = $scope.selectedProject.id;
        		$scope.site.shifts = $scope.shiftItems;
	        	SiteComponent.updateSite($scope.site).then(function() {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success','Site updated');
                    $scope.loadSites();
                    $location.path('/sites');
	            }).catch(function (response) {
	                $scope.success = null;
	                // console.log('Error - '+ response.data);
	                // console.log('status - '+ response.status + ' , message - ' + response.data.message);

	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                	$scope.$apply(function() {
	                        $scope.errorSitesExists = 'ERROR';
	                		$scope.success = 'OK';
                            $scope.showNotifications('top','center','danger','Site Already Exists');
	                	})
	                    console.log($scope.errorSitesExists);
	                } else {
	                    $scope.error = 'ERROR';
	                }
	            });;
        	}
        };

        $scope.deleteConfirm = function (site){
        		$scope.confirmSite = site;
        }

        $scope.deleteSite = function (site) {
        	SiteComponent.deleteSite($scope.confirmSite);
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
            $scope.loadSites();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadSites();
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
        	console.log('Selected  project -' + JSON.stringify($scope.searchProject) +" , "+ $scope.searchSite);
        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaSite));

        	if(!$scope.searchSite && !$scope.searchProject) {
        		if($rootScope.searchCriteriaSite) {
            		$scope.searchCriteria = $rootScope.searchCriteriaSite;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}
        	}else if($scope.searchSite || $scope.searchProject) {
        		$scope.searchCriteria.findAll = false;
	        	if($scope.searchSite) {
		        	$scope.searchCriteria.siteId = $scope.searchSite.id;
		        	if(!$scope.searchCriteria.siteId) {
		        		$scope.searchCriteria.siteName = $scope.searchSite.name;
		        	}else {
			        	$scope.searchCriteria.siteName = $scope.searchSite.name;
		        	}
		        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
	        	}else {
	        		$scope.searchCriteria.siteId = 0;
	        	}

	        	if($scope.searchProject) {
		        	$scope.searchCriteria.projectId = $scope.searchProject.id;
		        	if(!$scope.searchCriteria.projectId) {
		        		$scope.searchCriteria.projectName = $scope.searchProject;
		        		console.log('selected project name ='+ $scope.searchProject + ', ' +$scope.searchCriteria.projectName);
		        	}else {
			        	$scope.searchCriteria.projectName = $scope.searchProject.name;
		        	}
		        	console.log('selected project id ='+ $scope.searchCriteria.projectId);
	        	}else {
	        		$scope.searchCriteria.projectId = 0;
	        	}

        	}
        	console.log($scope.searchCriteria);

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
                $scope.sites = '';
                $scope.sitesLoader = false;
                $scope.loadPageTop();
            SiteComponent.search($scope.searchCriteria).then(function (data) {
                $scope.sites = data.transactions;
                $scope.sitesLoader = true;

                 /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                 console.log("Pagination",$scope.pager);
                 console.log($scope.sites);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.sites && $scope.sites.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.sites.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10; 
                    $scope.noData = false;

                }else{
                     $scope.noData = true;
                }
            });
        	
        };

      

        $scope.clearFilter = function() {
        	$scope.selectedSite = null;
        	$scope.selectedProject = null;
            $scope.searchProject = null;
            $scope.searchSite = null;
        	$scope.searchCriteria = {};
        	$rootScope.searchCriteriaSite = null;
        	$scope.pages = {
        		currPage: 1,
        		totalPages: 0
        	}
        	//$scope.search();
        };


      //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.loadSites();
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

    });
