'use strict';

angular.module('timeSheetApp')
		    .controller(
				'JobReportController',
				function($scope, $rootScope, $state, $timeout, JobComponent,AssetComponent,
						ProjectComponent, SiteComponent,EmployeeComponent,ChecklistComponent,
                         $http, $stateParams,
						$location,$interval,PaginationComponent,$filter) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorProjectExists = null;
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedStatus = null;
        $scope.selectedLocation = null;
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.status =[{ "name" : "OPEN"},{ "name" : "ASSIGNED"},{ "name" : "INPROGRESS"},{ "name" : "COMPLETED"},{ "name" : "OVERDUE"}]
        $scope.isEdit = !!$stateParams.id
        $scope.checklists;
        $scope.selectedChecklist;
        $scope.jobChecklistItems =[];
        $scope.pageSort = 10;
        //$scope.selectedDateFrom = $filter('date')('01/01/2018', 'dd/MM/yyyy');
        $scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
        var d = new Date();
        d.setFullYear(2018, 0, 1);
        //$scope.selectedDateFromSer= d;
        $scope.selectedDateFromSer= new Date();
        $scope.selectedDateToSer= new Date();
        $scope.pager = {};
        $scope.noData = false;
        
        /** Ui-select scopes **/
        $scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
        $scope.client = {};
        $scope.clients = [];
        $scope.allSites = {id:0 , name: '-- ALL SITES --'};
        $scope.sitesListOne = {};
        $scope.sitesLists = [];
        $scope.allStatus = '-- ALL STATUS --';
        $scope.statusListOne = {};
        $scope.statusLists = [];
        $scope.statusListOne.selected =  null;


        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };

        $('input#dateFilterFrom').on('dp.change', function(e){
          //console.log(e.date);
          //console.log(e.date._d);
            $scope.selectedDateFromSer= new Date(e.date._d);

            $.notifyClose();

            if($scope.selectedDateFromSer > $scope.selectedDateToSer) {

                    $scope.showNotifications('top','center','danger','From date cannot be greater than To date');
                    $scope.selectedDateFrom =$filter('date')(new Date(), 'dd/MM/yyyy');
                    return false;
            }else {
               $scope.selectedDateFrom= $filter('date')(e.date._d, 'dd/MM/yyyy');
               // $scope.refreshReport();
            }



        });
        $('input#dateFilterTo').on('dp.change', function(e){
          //console.log(e.date);
          //console.log(e.date._d);
            $scope.selectedDateToSer= new Date(e.date._d);

            $.notifyClose();

            if($scope.selectedDateFromSer > $scope.selectedDateToSer) {
                    $scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
                    $scope.selectedDateTo=$filter('date')(new Date(), 'dd/MM/yyyy');
                    return false;
            }else {
                $scope.selectedDateTo= $filter('date')(e.date._d, 'dd/MM/yyyy');
                //$scope.refreshReport();
            }

        });

                    // Load Clients for selectbox //
                    $scope.clientFilterDisable = true;
                    $scope.uiClient = [];
                    $scope.getClient = function (search) {
                        var newSupes = $scope.uiClient.slice();
                        if (search && newSupes.indexOf(search) === -1) {
                            newSupes.unshift(search);
                        }

                        return newSupes;
                    }
                    //

                    // Load Sites for selectbox //
                    $scope.siteFilterDisable = true;
                    $scope.uiSite = [];
                    $scope.getSite = function (search) {
                        var newSupes = $scope.uiSite.slice();
                        if (search && newSupes.indexOf(search) === -1) {
                            newSupes.unshift(search);
                        }
                        return newSupes;
                    }

                    //
                    // Load Status for selectbox //
                    $scope.statusFilterDisable = true;
                    $scope.uiStatus = [];

                    $scope.getStatus= function (search) {
                        var newSupes = $scope.uiStatus.slice();
                        if (search && newSupes.indexOf(search) === -1) {
                            newSupes.unshift(search);
                        }

                        return newSupes;
                    }

                    //
                    // Load Status for selectbox //
                    $scope.statusFilterDisable = true;
                    $scope.uiStatus = [];

                    $scope.getStatus= function (search) {
                        var newSupes = $scope.uiStatus.slice();
                        if (search && newSupes.indexOf(search) === -1) {
                            newSupes.unshift(search);
                        }

                        return newSupes;
                    }

                    //

        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
                /** Ui-select scope **/
                $scope.clients[0] = $scope.allClients;
                //
                for(var i=0;i<$scope.projects.length;i++)
                {
                    //$scope.uiClient[i] = $scope.projects[i].name;
                    /** Ui-select scope **/
                    $scope.clients[i+1] = $scope.projects[i];
                }
                $scope.clientFilterDisable = false;
                //
            });
        };

                    //

                    $scope.loadSearchProject = function (searchProject) {
                        $scope.siteSpin = true;
                        $scope.hideSite = false;
                        $scope.clearField = false;
                        $scope.hideStatus = false;
                        $scope.uiSite.splice(0,$scope.uiSite.length)
                        $scope.searchSite = null;
                        $scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)];
                    }

                    $scope.loadSearchSite = function (searchSite) {
                        $scope.hideSite = true;
                        $scope.hideStatus = false;
                        $scope.searchSite = $scope.sites[$scope.uiSite.indexOf(searchSite)];
                    }
                    $scope.loadSearchStatus = function (searchStatus) {
                        $scope.hideStatus = true;
                        $scope.clearField = false;
                        $scope.searchStatus = $scope.statuses[$scope.uiStatus.indexOf(searchStatus)]
                    }
                    //

        $scope.loadChecklists = function () {
        		ChecklistComponent.findAll().then(function (data) {
        			console.log('retrieved checklists - ' + JSON.stringify(data));
                $scope.checklists = data;
            });
        };

        $scope.loadAssets = function(){
            AssetComponent.search().then(function (data) {
                $scope.selectedAsset = null;
                $scope.assets = data;
            });
        };

        $scope.loadSites = function () {
        	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
        		$scope.selectedSite = null;
                $scope.sites = data;

                //
                for(var i=0;i<$scope.sites.length;i++)
                {
                    $scope.uiSite[i] = $scope.sites[i].name;
                }
                $scope.siteSpin = false;
                $scope.siteFilterDisable = false;

                //
            });
        };


        /*$scope.loadDepSites = function () {

            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }

            ProjectComponent.findSites(depProj).then(function (data) {
                $scope.searchSite = null;
                $scope.sites = data;

                //
                for(var i=0;i<$scope.sites.length;i++)
                {
                    $scope.uiSite[i] = $scope.sites[i].name;
                }
                $scope.siteSpin = false;
                $scope.siteFilterDisable = false;

                //
            });
        };*/
        
/** Ui-select function **/
        
        $scope.loadDepSitesList = function (searchProject) {

              $scope.siteSpin = true;
              $scope.searchProject = searchProject;
              if(jQuery.isEmptyObject($scope.searchProject) == true){
            	  SiteComponent.findAll().then(function (data) {
	                  $scope.sitesList = data;
	                  $scope.sitesLists = [];
	                  $scope.sitesListOne.selected = null;
	                  $scope.sitesLists[0] = $scope.allSitesVal;
	                  
	                  for(var i=0;i<$scope.sitesList.length;i++)
	                  {
	                      $scope.sitesLists[i+1] = $scope.sitesList[i];
	                  }
	                  $scope.siteFilterDisable = false;
	                  $scope.siteSpin = false;
	              });
              }else{
	              if(jQuery.isEmptyObject($scope.selectedProject) == false) {
	                     var depProj=$scope.selectedProject.id;
	              }else if(jQuery.isEmptyObject($scope.searchProject) == false){
	                      var depProj=$scope.searchProject.id;
	              }else{
	                      var depProj=0;
	              }
	              
	              ProjectComponent.findSites(depProj).then(function (data) {
	                  $scope.sitesList = data;
	                  $scope.sitesLists = [];
	                  $scope.sitesListOne.selected = null;
	                  $scope.sitesLists[0] = $scope.allSitesVal;
	                  
	                  for(var i=0;i<$scope.sitesList.length;i++)
	                  {
	                      $scope.sitesLists[i+1] = $scope.sitesList[i];
	                  }
	                  $scope.siteFilterDisable = false;
	                  $scope.siteSpin = false;
	              });
              }
            

            };

            $scope.loadLocations = function(){
            JobComponent.loadLocations().then(function(data){
               $scope.selectedLocation = null;
               $scope.locations = data;
            });
        };

        $scope.editJob = function(){
        	JobComponent.findById($stateParams.id).then(function(data){
        		$scope.job=data;
        		console.log($scope.job);
        		$scope.selectedSite = {id : data.siteId,name : data.siteName};
        		$scope.selectedEmployee = {id : data.employeeId,name : data.employeeName};
        		$scope.selectedLocation = {id:data.locationId,name:data.locationName};
        		$scope.selectedAsset = {id:data.assetId,title:data.assetTitle};
        		if(data.checklistItems) {
        			var checklist = {};
        			var items = [];
        			for(var i =0; i < data.checklistItems.length ; i++) {
        				var item = {};
        				var checklistItem = data.checklistItems[i];
        				checklist.id = checklistItem.checklistId;
        				checklist.name = checklistItem.checklistName;
        				item.id = checklistItem.checklistItemId;
        				item.name = checklistItem.checklistItemName;
        				item.completed = checklistItem.completed;
        				items.push(item);
        			}
        			checklist.items = items;
            		$scope.selectedChecklist = checklist;
        		}
        	});
        }
        $scope.loadJobs = function(){
            $scope.clearFilter();
        	$scope.search();
        }

        $scope.loadAllSites = function () {
        	SiteComponent.findAll().then(function (data) {
        		//$scope.selectedSite = null;
                $scope.sites = data;
            });
        };

        $scope.loadEmployee = function () {
        	JobComponent.findEmployees().then(function (data) {
        		//$scope.selectedEmployee = null;
                $scope.employees = data;
            });
        };

        $scope.loadPrice = function () {
          //console.log("Standard prices");
            JobComponent.standardPrices().then(function (data) {
              //console.log("Standard prices");
              //console.log(data);
                if(!data){
                    $scope.StandardPricing = 0;

                }else{
                    $scope.StandardPricing = data;

                }
            });
        };

        $scope.loadJobStatuses = function(){
            $scope.statusSpin = true;
            JobComponent.loadJobStatuses().then(function(data){
               $scope.selectedLocation = null;
               $scope.statuses = data;
               /** Ui-select scope **/
               $scope.statusLists[0] = $scope.allStatus;
                //
                /*for(var i=0;i<$scope.statuses.length;i++)
                {
                    $scope.uiStatus[i] = $scope.statuses[i];
                }*/
                /** Ui-select scope **/
                for(var i=0;i<$scope.statuses.length;i++)
                {
                    $scope.statusLists[i+1] = $scope.statuses[i];
                }
                $scope.statusFilterDisable = false;
                $scope.statusSpin = false;
                //
            });
        };

         $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }



        $scope.initPage=function (){
        	$scope.loadEmployee();
        	$scope.loadAllSites();
        	$scope.loadLocations();
        	$scope.loadAssets();
        	$scope.loadPrice();
        	$scope.loadChecklists();
        	if($scope.isEdit){
        		$scope.editJob();
        	}else {
            	$scope.job = {};
            	$scope.job.scheduleDailyExcludeWeekend = true;
            	$scope.job.schedule = 'ONCE';
            	$scope.job.active = 'YES';
        	}
        }

        $scope.onSelectChecklist = function() {
        	console.log('selected check list - ' + JSON.stringify($scope.selectedChecklist));
        	/*
        	var items = $scope.selectedChecklist.items;
        	for(var i =0; i<items.length;i++) {
        		var checklistItem = {
        			"checklistId" : $scope.selectedChecklist.id,
        			"checklistName" : $scope.selectedChecklist.name,
        			"checklistItemId" : items[i].id,
        			"checklistItemName" : items[i].name,
        			"jobId" : $scope.job.id,
        			"jobTitle" : $scope.job.title
        		}
        		$scope.jobChecklistItems.push(checklistItem);
        	}
        	*/
        }

        $scope.saveJob = function () {
	        	$scope.error = null;
	        	$scope.success =null;
	        	$scope.errorProjectExists = null;
	        	console.log('selected check list - ' + JSON.stringify($scope.selectedChecklist));
	        	var items = $scope.selectedChecklist.items;
	        	for(var i =0; i<items.length;i++) {
	        		var checklistItem = {
	        			"checklistId" : $scope.selectedChecklist.id,
	        			"checklistName" : $scope.selectedChecklist.name,
	        			"checklistItemId" : items[i].id,
	        			"checklistItemName" : items[i].name,
	        			"jobId" : $scope.job.id,
	        			"jobTitle" : $scope.job.title
	        		}
	        		$scope.jobChecklistItems.push(checklistItem);
	        	}

	        	$scope.job.siteId = $scope.selectedSite.id
	            $scope.job.locationId = $scope.selectedLocation.id;
	        	$scope.job.checklistItems = $scope.jobChecklistItems;
	        	if($scope.selectedAsset) {
	            	$scope.job.assetId = $scope.selectedAsset.id;
	        	}
	        	if($scope.selectedEmployee) {
	        		$scope.job.employeeId = $scope.selectedEmployee.id
	        	}
	        	console.log('job details ='+ JSON.stringify($scope.job));
	        	//$scope.job.jobStatus = $scope.selectedStatus.name;
	        	var post = $scope.isEdit ? JobComponent.update : JobComponent.create
	        	post($scope.job).then(function () {
	                $scope.success = 'OK';
	            	$location.path('/jobs');
            }).catch(function (response) {
                $scope.success = null;
              //console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                } else {
                    $scope.error = 'ERROR';
                }
            });;

        };

        var that =  $scope;

        $scope.calendar = {
        		actualStart : false,
        		actualEnd : false,
        		plannedStart : false,
        		plannedEnd : false,
        }

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        };

        $scope.refreshPage = function(){

                $scope.loadJobs();
        }

        $scope.deleteConfirm = function (job){
        	$scope.deleteJobId= job.id;
        }

        $scope.deleteJob = function () {
        	JobComponent.remove($scope.deleteJobId).then(function(){

            	$scope.success = 'OK';
            	$state.reload();
        	});
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
        	$('.AdvancedFilterModal.in').modal('hide');
            $scope.setPage(1);
            $scope.search();
         }

         $scope.searchFilter1 = function () {
            // $scope.searchStatus = null;
            // $scope.searchCriteria.jobStatus =null;
            // $scope.searchCriteria.assignedStatus =null;
            // $scope.searchCriteria.completedStatus =null;
            // $scope.searchCriteria.overdueStatus =null;
            $scope.setPage(1);
            $scope.search();
         }



        $scope.search = function () {
            $scope.noData = false;
        	var reportUid = $stateParams.uid;
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        		var searchCriteria = {
            			currPage : currPageVal,
                        isReport:true
            	}
            	$scope.searchCriteria = searchCriteria;
        	//}
        		
        		 if($scope.client.selected && $scope.client.selected.id !=0){
              		$scope.searchProject = $scope.client.selected;
              	}else{
              	   $scope.searchProject = null;
              	}
        		 
              	if($scope.sitesListOne.selected && $scope.sitesListOne.selected.id !=0){
              		$scope.searchSite = $scope.sitesListOne.selected;
              	}else{
              	   $scope.searchSite = null;
              	}
              	
              	if($scope.statusListOne.selected && $scope.statusListOne.selected != '-- ALL STATUS --'){
              		$scope.searchStatus = $scope.statusListOne.selected;
              		
              	}else{
              	   $scope.searchStatus = null;
              	}

                $scope.searchCriteria.isReport = false;

                $scope.searchCriteria.currPage = currPageVal;
                $scope.searchCriteria.findAll = false;
                $scope.searchCriteria.isReport = true;
               /* && !$scope.selectedJob*/

                if(!$scope.searchProject && !$scope.searchSite && !$scope.searchStatus){
                    $scope.searchCriteria.findAll = true;
                }


                if($scope.selectedDateFrom) {
                    $scope.searchCriteria.checkInDateTimeFrom = $scope.selectedDateFromSer;
                }
                if($scope.selectedDateTo) {
                    $scope.searchCriteria.checkInDateTimeTo = $scope.selectedDateToSer;
                }

                if($scope.searchProject) {
                    $scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.projectName = $scope.searchProject.name;
                }else{
                    $scope.searchCriteria.projectId = null;
                    $scope.searchCriteria.projectName = null;
                }

                if($scope.searchSite) {
                    $scope.searchCriteria.siteId = $scope.searchSite.id;
                    $scope.searchCriteria.siteName = $scope.searchSite.name;
                }else{
                     $scope.searchCriteria.siteId = null;
                     $scope.searchCriteria.siteName = null;
                }
              //console.log('selected status - '+ JSON.stringify($scope.searchStatus));
                if($scope.searchStatus){
                $scope.searchCriteria.jobStatus = $scope.searchStatus;
                if($scope.searchStatus == 'ASSIGNED'){
                    $scope.searchCriteria.assignedStatus = true;
                }else if($scope.searchStatus == 'OPEN'){

                }else if($scope.searchStatus == 'INPROGRESS'){

                }else if($scope.searchStatus == 'COMPLETED'){
                    $scope.searchCriteria.completedStatus = true;
                }else if($scope.searchStatus == 'OVERDUE'){
                    $scope.searchCriteria.overdueStatus = true;
                }
              }else{
                    $scope.searchCriteria.jobStatus =null;
                    $scope.searchCriteria.assignedStatus =null;
                    $scope.searchCriteria.completedStatus =null;
                    $scope.searchCriteria.overdueStatus =null;
              }


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

              $scope.searchCriteras = $scope.searchCriteria;
              
                   //console.log("search criteria",$scope.searchCriteria);
                     $scope.jobs = '';
                     $scope.jobsLoader = false;
                     $scope.loadPageTop();


            //JobComponent.search($scope.searchCriteria, reportUid).then(function (data) {
            JobComponent.search($scope.searchCriteria).then(function (data) {
                $scope.jobs = data.transactions;
        		$scope.jobsLoader = true;
        		/*
                        ** Call pagination  main function **
                    */
                     $scope.pager = {};
                     $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                     $scope.totalCountPages = data.totalCount;

                   //console.log("Pagination",$scope.pager);
                   //console.log("jobs",$scope.jobs);

                    $scope.pages.currPage = $scope.pages.currPage;
                    $scope.pages.totalPages = data.totalPages;

                    if($scope.jobs && $scope.jobs.length > 0 ){
                        $scope.showCurrPage = data.currPage;
                        $scope.pageEntries = $scope.jobs.length;
                        $scope.totalCountPages = data.totalCount;
                        $scope.pageSort = 10;

                        $scope.noData = false;

                    }else{
                         $scope.noData = true;
                    }


        	});
        }



        $scope.clearFilter = function() {
            $rootScope.exportStatusObj = {};
            $scope.downloader=false;
            $scope.downloaded = true;
            $scope.siteFilterDisable = true;
            $scope.sitesList = null;
            
            /** Ui-select scopes **/
        	$scope.client.selected = null;
        	$scope.sitesLists =  [];
        	$scope.sitesListOne.selected =  null;
        	$scope.statusLists = [];
            $scope.statusListOne.selected =  null;
            $scope.loadJobStatuses();
            
            //$scope.selectedDateFrom = $filter('date')('01/01/2018', 'dd/MM/yyyy');
            $scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
            //$scope.selectedDateFromSer = d;
            $scope.selectedDateFromSer = new Date();
            $scope.selectedDateToSer = new Date();
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.searchProject = null;
            $scope.searchSite = null;
            $scope.searchStatus = null;
            $scope.selectedStatus = null;
            $scope.clearField = true;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }

          //console.log("=======================");
          //console.log($scope.searchCriteria )
            //$scope.search();
        };

	    $rootScope.exportStatusObj = {};


        $scope.exportAllData = function(type){
        		$scope.searchCriteria.exportType = type;
        		$scope.typeMsg = type;
                $rootScope.exportStatusObj = {};
                $scope.downloader=true;
                $scope.downloaded = false;
                $scope.searchCriteria.report = true;
                $scope.searchCriteria.columnName = "createdDate";
                $scope.searchCriteria.sortByAsc = false;
	        	JobComponent.exportAllData($scope.searchCriteria).then(function(data){
	        		var result = data.results[0];
	        		console.log(result);
	        		console.log(result.file + ', ' + result.status + ',' + result.msg);
	        		var exportAllStatus = {
	        				fileName : result.file,
	        				exportMsg : 'Exporting All...',
	        				url: result.url
	        		};
	        		$rootScope.exportStatusObj = exportAllStatus;
	        		console.log('exportStatusObj size - ' + $rootScope.exportStatusObj.length);
	        		$scope.start();
	              },function(err){
	            	//console.log('error message for export all ')
	            	//console.log(err);
	              });
	    };

	 // store the interval promise in this variable
	    var promise;

	 // starts the interval
	    $scope.start = function() {
	      // stops any running interval to avoid two intervals running at the same time
	      $scope.stop();

	      // store the interval promise
	      promise = $interval($scope.exportStatus, 5000);
	    //console.log('promise -'+promise);
	    };

	    // stops the interval
	    $scope.stop = function() {
	      $interval.cancel(promise);
	    };



	    $scope.exportStatus = function() {
	        	console.log('$rootScope.exportStatusObj -'+$rootScope.exportStatusObj);

	            	JobComponent.exportStatus($rootScope.exportStatusObj.fileName).then(function(data) {
	            		console.log('job export status - data -' + JSON.stringify(data));
	            		if(data) {
	            			$rootScope.exportStatusObj.exportStatus = data.status;
	                		console.log('exportStatus - '+ JSON.stringify($rootScope.exportStatusObj));
	                		$rootScope.exportStatusObj.exportMsg = data.msg;
                            $scope.downloader=false;
	                		console.log('exportMsg - '+ $rootScope.exportStatusObj.exportMsg);
	                		if($rootScope.exportStatusObj.exportStatus == 'COMPLETED'){
	                			if($rootScope.exportStatusObj.url) {
	                				$rootScope.exportStatusObj.exportFile = $rootScope.exportStatusObj.url;
	                			}else {
		                			$rootScope.exportStatusObj.exportFile = data.file;
	                			}
	                    		console.log('exportFile - '+ $rootScope.exportStatusObj.exportFile);
	                    		$scope.stop();
	                		}else if($rootScope.exportStatusObj.exportStatus == 'FAILED'){
	                    		$scope.stop();
	                		}else if(!$rootScope.exportStatusObj.exportStatus){
	                			$scope.stop();
	                		}else {
	                			$rootScope.exportStatusObj.exportFile = '#';
	                		}
	            		}

	            	});

	    }

	    $scope.exportFile = function() {
	        return ($rootScope.exportStatusObj ? $rootScope.exportStatusObj.exportFile : '#');
	    }


	    $scope.exportMsg = function() {
	        return ($rootScope.exportStatusObj ? $rootScope.exportStatusObj.exportMsg : '');
	    };

	    $scope.downloaded = false;

        $scope.clsDownload = function(){
          $scope.downloaded = true;
          $rootScope.exportStatusObj = {};
        }



        $scope.initCalender();

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
