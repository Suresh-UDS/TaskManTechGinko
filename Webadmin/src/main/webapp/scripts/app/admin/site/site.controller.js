'use strict';

angular.module('timeSheetApp')
    .controller('SiteController', function ($rootScope, $scope, $state, $timeout,$filter,
        ProjectComponent, SiteComponent,$http,$stateParams,$location,PaginationComponent,getLocalStorage) {
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
        $scope.localStorage = null;

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pageSort = 10;


        $scope.calendar = {
        		start : false,
        		end : false,
        }

        $scope.newShiftItem ={};
        $scope.shiftItems=[];

        $scope.shiftFrom = new Date();
        $scope.shiftTo = new Date();

          $scope.stateNames = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Chandigarh",
        "Dadra and Nagar Haveli","Daman and Diu","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh",
        "Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
        "Manipur","Meghalaya","Mizoram","Nagaland","Orissa","Punjab","Pondicherry","Rajasthan",
        "Sikkim","Tamil Nadu","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];


        $scope.loadProjectsList = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projectsList = data;
                 $scope.loadingStop();
                for(var i=0;i<$scope.projectsList.length;i++)
                {
                    $scope.uiClient[i] = $scope.projectsList[i].name;
                }
                $scope.clientDisable = false;
                $scope.clientFilterDisable = false;
            });
        };

         $scope.loadSitesList = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.sitesList = data;

            });
        };




        // Load Clients for selectbox //
        $scope.clienteDisable = true;
        $scope.uiClient = [];
        $scope.getClient = function (search) {
            var newSupes = $scope.uiClient.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }

        $scope.selectProject = function(project)
        {
            $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(project)]
            console.log('Project dropdown list:',$scope.searchProject)
        }
        //

        // Load Sites for selectbox //
        $scope.siteDisable = true;
        $scope.uiSite = [];

        $scope.getSite = function (search) {
            var newSupes = $scope.uiSite.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }

        $scope.selectSite = function(site)
        {
            $scope.searchSite = $scope.sitesList[$scope.uiSite.indexOf(site)]
            $scope.hideSite = true;
            console.log('Site dropdown list:',$scope.searchSite)
        }
        $scope.addProject = function (selectedProject) {
            $scope.selectedProject = $scope.projectsList[$scope.uiClient.indexOf(selectedProject)]
            $scope.edit = false;
        }
        //

        //Filter
        $scope.filter = false;
        $scope.clientFilterDisable = true;
        $scope.siteFilterDisable = true;
        $scope.siteSpin = false;
        $scope.loadDepSites = function (searchProject) {
            $scope.searchSite = null;
            $scope.hideSite = false;
            if($scope.localStorage)
            {
                $scope.localStorage.siteName = null;
            }
            $scope.searchCriteria.siteName = null;
            $scope.siteSpin = true;
            $scope.filter = false;
            $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(searchProject)]
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
                for(var i=0;i<$scope.sitesList.length;i++)
                {
                    $scope.uiSite[i] = $scope.sitesList[i].name;
                }
                $scope.siteFilterDisable = false;
                $scope.siteSpin = false;
            });
        };

        //




        $scope.initCalender = function(){
            demo.initFormExtendedDatetimepickers();
        }

        $scope.initCalender();

        $('#shiftFrom').on('dp.change', function(e){

            console.log('shiftFrom', e.date._d);

            if(e.date._d) {
                $scope.newShiftItem.startTime = $filter('date')(e.date._d, 'HH:mm');
                $scope.newShiftItem.startTimeDup = $filter('date')(e.date._d, 'hh:mm a');
            }
            

        });

        $('#shiftTo').on('dp.change', function(e){

            console.log('shiftTo', e.date._d);

            if(e.date._d) {
                $scope.newShiftItem.endTime = $filter('date')(e.date._d, 'HH:mm');
                $scope.newShiftItem.endTimeDup = $filter('date')(e.date._d, 'hh:mm a');
            }

        });
        


        //
        $scope.valid= null;
        $scope.conform = function(text,validation)
        {
            console.log($scope.selectedProject)
            $rootScope.conformText = text;
            $scope.valid = validation;
            $('#conformationModal').modal();

        }
        $rootScope.back = function (text) {
            if(text == 'cancel')
            {
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.cancelSite();
            }
            else if(text == 'save')
            {
                $scope.saveSite($scope.valid);
            }
            else if(text == 'update')
            {
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updateSite($scope.valid);
            }
        };

        //
        $scope.saveLoad = false;
        $scope.saveSite = function (validation) {
            $scope.saveLoad = true;
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
                        $scope.saveLoad = false;
	                    $scope.showNotifications('top','center','success','Site has been added successfully!!');
	                    $scope.selectedProject = null;
	                	$scope.loadSites();
	                	$location.path('/sites');
	                }).catch(function (response) {
	                    $scope.success = null;
                        $scope.saveLoad = false;
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

        

          $scope.sStatus = false;
          $scope.eStatus = false;
        $scope.addShiftItem = function(event) {
            if(jQuery.isEmptyObject($scope.newShiftItem) == false){
                if(!$scope.newShiftItem.startTime){
                   $scope.sStatus = true;
                   $scope.eStatus = false;
                }
                else if(!$scope.newShiftItem.endTime){
                    $scope.eStatus = true;
                    $scope.sStatus = false;
                }
                else{
                    console.log(shiftFrom,shiftTo);
            		event.preventDefault();
            		console.log('new shift item - ' + JSON.stringify($scope.newShiftItem));
            		$scope.shiftItems.push($scope.newShiftItem);
            		console.log('shiftItems - '+ JSON.stringify($scope.shiftItems));
            		$scope.newShiftItem = {};
                    $scope.sStatus = false;
                    $scope.eStatus = false;
                }
            }else{
                $scope.sStatus = false;
                $scope.eStatus = false;
            }   
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
                $scope.edit = true;
            });
        };

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }


        $scope.updateSite = function (validation) {

            console.log("=======Update=========")
            if(validation){
                return false;
            }

        	$scope.error = null;
        	$scope.success = null;
        	$scope.errorProject = null;
        	if($scope.selectedProject && !$scope.selectedProject.id){
        		$scope.errorProject = "true";
                console.log("=======Update=========")
        	}else{
        	    console.log("update site");
        	    console.log($scope.site);
        		$scope.site.projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
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
        	}else if(($scope.searchSite && $scope.searchSite.searchStatus != '0') || ($scope.searchProject && $scope.searchProject.searchStatus != '0')) {
        		$scope.searchCriteria.findAll = false;
	        	if($scope.searchSite  && $scope.searchSite.searchStatus != '0') {
		        	$scope.searchCriteria.siteId = $scope.searchSite.id;
                    $scope.searchCriteria.siteName = $scope.searchSite.name;
		        	if(!$scope.searchCriteria.siteId) {
		        		$scope.searchCriteria.siteName = $scope.searchSite.name;
		        	}else {
			        	$scope.searchCriteria.siteName = $scope.searchSite.name;
		        	}
		        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
	        	}else {
	        		$scope.searchCriteria.siteId = null;
	        	}

	        	if($scope.searchProject && $scope.searchProject.searchStatus != '0') {
		        	$scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.projectName = $scope.searchProject.name;
		        	if(!$scope.searchCriteria.projectId) {
		        		$scope.searchCriteria.projectName = $scope.searchProject.name;
		        		console.log('selected project name ='+ $scope.searchProject + ', ' +$scope.searchCriteria.projectName);
		        	}
		        	console.log('selected project id ='+ $scope.searchCriteria.projectId);
	        	}else {
	        		$scope.searchCriteria.projectId = null;
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

                 /* Localstorage (Retain old values while edit page to list) start */

                 if($rootScope.retain == 1){
                    $scope.localStorage = getLocalStorage.getSearch();
                    console.log('Local storage---',$scope.localStorage);

                    if($scope.localStorage){
                            $scope.filter = true;
                            $scope.pages.currPage = $scope.localStorage.currPage;
                            $scope.searchProject = {searchStatus:'0',id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                            $scope.searchSite = {searchStatus:'0',id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};

                    }

                    $rootScope.retain = 0;

                    var searchCriteras  = $scope.localStorage;
                 }else{

                    var searchCriteras  = $scope.searchCriteria;
                 }

                 /* Localstorage (Retain old values while edit page to list) end */



            SiteComponent.search(searchCriteras).then(function (data) {
                $scope.sites = data.transactions;
                $scope.sitesLoader = true;


                 /** retaining list search value.**/
                getLocalStorage.updateSearch(searchCriteras);


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
            $scope.localStorage = null;
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
           //$scope.loadSites();
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
