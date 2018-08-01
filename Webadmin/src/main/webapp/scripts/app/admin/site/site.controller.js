'use strict';

angular.module('timeSheetApp')
    .controller('SiteController', function (Name,$rootScope, $scope, $state, $timeout,$filter,
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

        Name.setName('hello world!');
         $scope.name = Name.getName();
         console.log('Stored service name msg' , $scope.name);

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
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }

            ProjectComponent.findSites(depProj).then(function (data) {
                $scope.selectedSite = null;
                $scope.sitesList = data;
            });
        };

        $scope.initCalender = function(){
            demo.initFormExtendedDatetimepickers();
        }

        $('#shiftFrom').on('dp.change', function(e){

            console.log(e.date._d);
            console.log($filter('date')(e.date._d, 'HH:mm:ss'))
            if(e.date._d > $scope.newShiftItem.endTime) {
            		$scope.showNotifications('top','center','danger','From time cannot be after To time');
            		$scope.shiftFrom = $scope.newShiftItem.startTime;
            		return false;
            }else {
                $scope.newShiftItem.startTime = e.date._d.getHours() + ':' + e.date._d.getMinutes();
                $scope.newShiftItem.startTime = $filter('date')(e.date._d, 'HH:mm');
            }
        });

        $('#shiftTo').on('dp.change', function(e){

            console.log(e.date._d);
            if($scope.newShiftItem.startTime > e.date._d) {
            		$scope.showNotifications('top','center','danger','To time cannot be before From time');
            		$scope.shiftTo = $scope.newShiftItem.endTime;
            		return false;
            }else {
                $scope.newShiftItem.endTime = $filter('date')(e.date._d, 'HH:mm');
            }

        });
        $scope.initCalender();

        $scope.saveSite = function (validation) {

            if(validation){

                return false;
            }

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
	                    $scope.showNotifications('top','center','success','Site has been added successfully!!');
	                    $scope.selectedProject = null;
	                	$scope.loadSites();
	                	$location.path('/sites');
	                }).catch(function (response) {
	                    $scope.success = null;
	                    console.log('Error - '+ response.data);
	                    console.log('status - '+ response.status + ' , message - ' + response.data.message);
	                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                            $scope.errorSitesExists = 'ERROR';
	                        $scope.showNotifications('top','center','danger','Site already exists');

	                        console.log($scope.errorSitesExists);
	                    } else {
	                        $scope.showNotifications('top','center','danger','Unable to add site. Please try again later..');
	                        $scope.error = 'ERROR';
	                    }
	                });
	        	}

        };

        $scope.shiftItems=[];

        $scope.newshiftItem = {};

        $scope.addShiftItem = function(event) {
            console.log(shiftFrom,shiftTo)
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


                // Shift time HH:MM
                console.log(data);
                for(var i=0;i<$scope.shiftItems.length;i++) {
                    console.log($scope.shiftItems[i].startTime.length);
                    var start = $scope.shiftItems[i].startTime.split(':');
                    console.log(start)
                    if(start[0].length == 1)
                    {
                        console.log("Yes");
                        start[0] = '0'+start[0];
                        $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                        if(start[1].length == 1)
                        {

                            if(start[1]==0)
                            {
                                start[1] = '00';
                                $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                            }
                            else {
                                start[1] = '0'+start[1];
                                $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                            }


                        }
                    }
                    else if(start[1].length == 1)
                    {
                        if(start[1]==0)
                        {
                            start[1] = '00';
                            $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                        }
                        else {
                            start[1] = '0'+start[1];
                            $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                        }
                    }
                    else
                    {
                        $scope.shiftItems =$scope.site.shifts;
                    }


                    var end =  $scope.shiftItems[i].endTime.split(':');
                    console.log(end)
                    if(end[0].length == 1)
                    {
                        end[0] = '0'+end[0];
                        $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
                        if(end[1].length == 1)
                        {
                            if(end[1]==0)
                            {
                                end[1] = '00';
                                $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
                            }
                            else {
                                end[1] = '0'+start[1];
                                $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
                            }
                        }
                    }
                    else if(end[1].length == 1)
                    {
                        if(end[1].length == 1)
                        {

                            if(end[1]==0)
                            {
                                end[1] = '00';
                                $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
                            }
                            else {
                                end[1] = '0'+start[1];
                                $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
                            }
                        }
                    }
                    else
                    {
                        $scope.shiftItems = $scope.site.shifts;
                    }


                }
                //

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


        $scope.updateSite = function (validation) {

            if(validation){

                return false;
            }

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
	                $scope.showNotifications('top','center','success','Site has been updated successfully!!');
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
                            $scope.showNotifications('top','center','danger','Site already exists');
	                	})
	                    console.log($scope.errorSitesExists);
	                } else {
	                    $scope.error = 'ERROR';
                        $scope.showNotifications('top','center','danger','Unable to update site,please try again later.');
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
            $scope.noData = false;
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
