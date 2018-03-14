'use strict';

angular.module('timeSheetApp')
		    .controller(
				'JobController',
				function($scope, $rootScope, $state, $timeout, JobComponent,AssetComponent,
						ProjectComponent, SiteComponent,EmployeeComponent,ChecklistComponent, $http, $stateParams,
						$location) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorProjectExists = null;
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedJobDate = null;
        $scope.selectedStatus = null;
        $scope.selectedLocation = null;
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.status =[{ "name" : "OPEN"},{ "name" : "ASSIGNED"},{ "name" : "INPROGRESS"},{ "name" : "COMPLETED"}];
        $scope.isEdit = !!$stateParams.id;
        $scope.checklists;
        $scope.selectedChecklist;
        $scope.jobChecklistItems =[];

        $scope.monthDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

        $scope.initCalender = function(){
            demo.initFormExtendedDatetimepickers();
        };

        $scope.init = function() {
        		$scope.loadJobStatuses();
        }
        
        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
            });
        };

        $('#selectedJobDate').on('dp.change', function(e){
                $scope.selectedJobDate = e.date._d;
        });

        $scope.loadChecklists = function () {
        		ChecklistComponent.findAll().then(function (data) {
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
        
        $scope.loadEmployees = function () {
        		$scope.searchCriteria.siteId = $scope.selectedSite.id;
        		EmployeeComponent.search($scope.searchCriteria).then(function (data) {
        			$scope.selectedEmployee = null;
                $scope.employees = data.transactions;
            });
        };

        $scope.loadLocations = function(){
            JobComponent.loadLocations().then(function(data){
               $scope.selectedLocation = null;
               $scope.locations = data;
            });
        };
        
        $scope.loadJobStatuses = function(){
            JobComponent.loadJobStatuses().then(function(data){
               $scope.selectedLocation = null;
               $scope.statuses = data;
            });
        };

            $scope.getJobImages = function(){
                console.log()
            };

        $scope.getJobDetails = function(){
            JobComponent.findById($stateParams.id).then(function(jobData){
                console.log(jobData);
                if(jobData.jobStatus == "COMPLETED"){
                    JobComponent.getCompletedDetails($stateParams.id).then(function (data) {
                        console.log(data);
                        console.log(data.length);
                        for(var i=0;i<data.length;i++){
                            console.log(data[i].checkInOutImages);
                            $scope.checkInOutImages = data[i].checkInOutImages;
                            // for(var j=0;j<data[i].checkInOutImages.length;j++){
                            //     console.log(data[i].checkInOutImages[j].photoOut);
                            //     if(data[i].checkInOutImages[j].photoOut){
                            //         console.log("photo image id available");
                            //         JobComponent.getCompleteImage(jobData.employeeId,data[i].checkInOutImages[j].photoOut).then(function (imageResponse) {
                            //             console.log(imageResponse);
                            //             $scope.completedImage = imageResponse;
                            //         })
                            //     }else{
                            //         console.log("Photo image id not available");
                            //     }
                            // }
                        }
                    });
                }
            });



        };

        $scope.editJob = function(){
        	JobComponent.findById($stateParams.id).then(function(data){
        		console.log("Job details");
        	    console.log(data);
        		$scope.job=data;
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

        		if(data.images){
        		    $scope.completedImages = [];
        		    for(var i=0;i<data.images.length;i++){
        		        console.log(data.images[i]);
                        JobComponent.getCompleteImage(data.images[i].employeeEmpId,data.images[i].photoOut).then(function (imageResponse) {
                            // console.log(imageResponse);
                            $scope.completedImages.push(imageResponse);
                        });
                    }

                }
        	});
        };

        $scope.loadCompletedJob = function(image) {
            var eleId = 'photoStart';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',image);

        };
        $scope.loadJobs = function(){
        	$scope.search();
        }

        $scope.loadAllSites = function () {
        	SiteComponent.findAll().then(function (data) {
        		// $scope.selectedSite = null;
                $scope.sites = data;
            });
        };

        $scope.loadEmployee = function () {
        	JobComponent.findEmployees().then(function (data) {
        		// $scope.selectedEmployee = null;
                $scope.employees = data;
            });
        };

        $scope.loadPrice = function () {
            JobComponent.standardPrices().then(function (data) {
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
        };

        $scope.onSelectChecklist = function() {

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

        }

        $scope.saveJob = function () {
	        	$scope.error = null;
	        	$scope.success =null;
	        	$scope.errorProjectExists = null;
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
	        	// $scope.job.jobStatus = $scope.selectedStatus.name;
	        	var post = $scope.isEdit ? JobComponent.update : JobComponent.create
	        	post($scope.job).then(function () {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success','Job Created Successfully');
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
                // $scope.loadJobs();
                $scope.search();
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

        		console.log('$scope.pages - ' + $scope.pages + ', $scope.pages.currPage - ' + $scope.pages.currPage);
	        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
	        		var searchCriteria = {
	            			currPage : currPageVal
	            	}
	            	$scope.searchCriteria = searchCriteria;
	        	// }

	        	$scope.searchCriteria.currPage = currPageVal;
	        	console.log('Selected  project -' + $scope.selectedProject);
	        	console.log('Selected  job -' + $scope.selectedJob);
	        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaProject));

	        	if(!$scope.selectedProject && !$scope.selectedSite && !$scope.selectedStatus && !$scope.selectedJob){
	        		$scope.searchCriteria.findAll = true;
	        	}

	        	if($scope.selectedProject) {
	        		$scope.searchCriteria.projectId = $scope.selectedProject.id;
	        	}

	        	if($scope.selectedSite) {
	        		$scope.searchCriteria.siteId = $scope.selectedSite.id;
		        }
	        	console.log('selected status - '+ JSON.stringify($scope.selectedStatus));
	        	if($scope.selectedStatus){
		        		$scope.searchCriteria.jobStatus = $scope.selectedStatus;
		        }

	        	if($scope.selectedJob){
	        		$scope.searchCriteria.jobTitle = $scope.selectedJob;
	        	}
	        	
	        	if($scope.selectedJobDate) {
	        		$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedJobDate;
	        	}	        	

	        	console.log(JSON.stringify($scope.searchCriteria));
	        	JobComponent.search($scope.searchCriteria).then(function (data) {
	        		$scope.jobs = data.transactions
	        		$scope.pages.currPage = data.currPage;
	                $scope.pages.totalPages = data.totalPages;

	                $scope.numberArrays = [];
	                var startPage = 1;
	                if(($scope.pages.totalPages - $scope.pages.currPage) >= 10) {
	                		startPage = $scope.pages.currPage;
	                }else if($scope.pages.totalPages > 10) {
	                		startPage = $scope.pages.totalPages - 10;
	                }
	                var cnt = 0;
	                for(var i=startPage; i<=$scope.pages.totalPages; i++){
	                		cnt++;
	                		if(cnt <= 10) {
		                		$scope.numberArrays.push(i);
	                		}
	                }

	                if($scope.jobs && $scope.jobs.length > 0 ){
	                    $scope.showCurrPage = data.currPage;
	                    $scope.pageEntries = $scope.jobs.length;
	                    $scope.totalCountPages = data.totalCount;

	                    if($scope.showCurrPage != data.totalPages){
	                    	$scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1; // 1 to // 11 to

	                        $scope.pageEndIntex = $scope.pageEntries * $scope.showCurrPage; // 10 entries of 52 // 10 * 2 = 20 of 52 entries

	                    }else if($scope.showCurrPage === data.totalPages){
	                    	$scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1;
	                    	$scope.pageEndIntex = $scope.totalCountPages;
	                    }
	                }

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

        $scope.clickNextOrPrev = function(number){
	        	$scope.pages.currPage = number;
	        	$scope.search();
        }

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
		    		$scope.search();
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
	        	}

        };

        $scope.next = function() {
        		console.log('curr page - ' + $scope.pages.currPage + ', total pages - ' +$scope.pages.totalPages);
	        	if($scope.pages.currPage < $scope.pages.totalPages) {
	            	$scope.pages.currPage = $scope.pages.currPage + 1;
		    		$scope.search();
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
	        	}

        };

        $scope.last = function() {
	        	if($scope.pages.currPage < $scope.pages.totalPages) {
	            	$scope.pages.currPage = $scope.pages.totalPages;
	            	$scope.search();
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
	        	}

        };

        $scope.clearFilter = function() {
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.selectedJob = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
        };

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

        $scope.loadImages = function(employeeEmpId, jobPhotoId, ind) {
	        	if(jobPhotoId) {
	            	var uri = '/api/employee/' + employeeEmpId +'/checkInOut/' + jobPhotoId;
	                $http.get(uri).then(function (response) {
	                		console.log('image response - ' + response.data);
	                    var ele = document.getElementById('photoStop');
	                		ele.setAttribute('src',response.data);
	                }, function(response) {
	                		console.log('image response error -' + JSON.stringify(response))
	                    var ele = document.getElementById('photoStop');
	                		ele.setAttribute('src',"//placehold.it/250x250");
	                });
	        	}else {
	                var ele = document.getElementById('photoStop');
	            	ele.setAttribute('src',"//placehold.it/250x250");
	        	}
        }


        $scope.initCalender();
    });
