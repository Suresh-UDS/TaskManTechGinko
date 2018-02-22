'use strict';

angular.module('timeSheetApp')
		    .controller(
				'JobReportController',
				function($scope, $rootScope, $state, $timeout, JobComponent,AssetComponent,
						ProjectComponent, SiteComponent,EmployeeComponent,ChecklistComponent, $http, $stateParams,
						$location,$interval) {
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
        
        $scope.fromDate;
        
        $scope.toDate;

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };

        $('#dateFilterFrom').on('dp.change', function(e){
            console.log(e.date);
            $scope.fromDate = e.date._d;
            console.log(e.date._d);

        });

        $('#dateFilterTo').on('dp.change', function(e){
            console.log(e.date);
            $scope.toDate = e.date._d;
            console.log(e.date._d);

        });

        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
            });
        };
        
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
            });
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
            console.log("Standard prices");
            JobComponent.standardPrices().then(function (data) {
                console.log("Standard prices");
                console.log(data);
                if(!data){
                    $scope.StandardPricing = 0;

                }else{
                    $scope.StandardPricing = data;

                }
            });
        };



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
                console.log('Error - '+ response.data);
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
                $scope.clearFilter();
                //$scope.loadJobs();
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

        $scope.search = function () {
        	var reportUid = $stateParams.uid;
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        		var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;
        	//}

        	$scope.searchCriteria.currPage = currPageVal;
        	console.log('Selected  project -' + $scope.selectedProject);
        	console.log('Selected  job -' + $scope.selectedJob);
        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaProject));

        	if($scope.selectedProject) {
        		$scope.searchCriteria.projectId = $scope.selectedProject.id;
        	}

        	if($scope.selectedSite) {
        		$scope.searchCriteria.siteId = $scope.selectedSite.id;
	    }

        	if($scope.selectedStatus){
	        	$scope.searchCriteria.jobStatus = $scope.selectedStatus.name;
	        	if($scope.selectedStatus.name == 'ASSIGNED'){
	        		$scope.searchCriteria.assignedStatus = true;
	        	}else if($scope.selectedStatus.name == 'OPEN'){
	        		
	        	}else if($scope.selectedStatus.name == 'INPROGRESS'){
	        		
	        	}else if($scope.selectedStatus.name == 'COMPLETED'){
	        		$scope.searchCriteria.completedStatus = true;
	        	}else if($scope.selectedStatus.name == 'OVERDUE'){
	        		$scope.searchCriteria.overdueStatus = true;
	        	}
	    }

        	if($scope.selectedJob){
        		$scope.searchCriteria.jobTitle = $scope.selectedJob;
        	}
        	$scope.searchCriteria.checkInDateTimeFrom = $scope.fromDate;
        	$scope.searchCriteria.checkInDateTimeTo = $scope.toDate;

        	console.log($scope.searchCriteria);
        	console.log('uid - ' + reportUid);
        	JobComponent.search($scope.searchCriteria, reportUid).then(function (data) {
        		$scope.jobs = data.transactions
        		console.log('job search result - ' + $scope.jobs);
        		$scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.jobs == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;

        	});

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
               	 var ele = angular.element('#first');
            	 ele.addClass('disabledLink');
            	 ele = angular.element('#previous');
            	 ele.addClass('disabledLink');
            	 if($scope.pages.totalPages > 1) {
         	       	 var ele = angular.element('#next');
        	    	 ele.removeClass('disabledLink');
        	    	 ele = angular.element('#last');
        	    	 ele.removeClass('disabledLink');
            	 }

                }

                $scope.previous = function() {
                	if($scope.pages.currPage > 1) {
                    	$scope.pages.currPage = $scope.pages.currPage - 1;
                    	if($scope.pages.currPage == 1) {
        	       	       	 var ele = angular.element('#first');
        	    	    	 ele.addClass('disabled');
        	    	    	 ele = angular.element('#previous');
        	    	    	 ele.addClass('disabled');
                    	}
             	       	 var ele = angular.element('#next');
            	    	 ele.removeClass('disabled');
            	    	 ele = angular.element('#last');
            	    	 ele.removeClass('disabled');
        	    		$scope.search();
                	}

                };

                $scope.next = function() {
                	if($scope.pages.currPage < $scope.pages.totalPages) {
                    	$scope.pages.currPage = $scope.pages.currPage + 1;
                    	if($scope.pages.currPage == $scope.pages.totalPages) {
        	       	       	 var ele = angular.element('#next');
        	    	    	 ele.addClass('disabled');
        	    	    	 ele = angular.element('#last');
        	    	    	 ele.addClass('disabled');
                    	}
             	       	 var ele = angular.element('#first');
            	    	 ele.removeClass('disabled');
            	    	 ele = angular.element('#previous');
            	    	 ele.removeClass('disabled');
        	    		$scope.search();
                	}

                };

                $scope.last = function() {
                	if($scope.pages.currPage < $scope.pages.totalPages) {
                    	$scope.pages.currPage = $scope.pages.totalPages;
                    	if($scope.pages.currPage == $scope.pages.totalPages) {
        	       	       	 var ele = angular.element('#next');
        	    	    	 ele.addClass('disabled');
        	    	    	 ele = angular.element('#last');
        	    	    	 ele.addClass('disabled');
                    	}
              	       	var ele = angular.element('#first');
            	    	ele.removeClass('disabled');
            	    	ele = angular.element('#previous');
            	    	ele.removeClass('disabled');
            	    	$scope.search();
                	}

                };

        $scope.clearFilter = function() {
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
        };
        
	    $rootScope.exportStatusObj = {};

        
        $scope.exportAllData = function(type){
        		$scope.searchCriteria.exportType = type;
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
	            	  console.log('error message for export all ')
	            	  console.log(err);
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
	      console.log('promise -'+promise);
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
        
        
        
        $scope.initCalender();

    });
