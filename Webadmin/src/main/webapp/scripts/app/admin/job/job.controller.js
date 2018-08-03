'use strict';

angular.module('timeSheetApp')
		    .controller(
				'JobController',
				function($scope, $rootScope, $state, $timeout, JobComponent,AssetComponent,
						ProjectComponent, SiteComponent,EmployeeComponent,ChecklistComponent,
                        LocationComponent, $http, $stateParams,
						$location,PaginationComponent,$filter, TicketComponent, $q,$interval) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorProjectExists = null;
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedEmployee = null;
        $scope.selectedStatus = null;
        $scope.selectedLocation = null;
        $scope.selectedJobDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.selectedJobDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');

        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.status =[{ "name" : "OPEN"},{ "name" : "ASSIGNED"},{ "name" : "INPROGRESS"},{ "name" : "COMPLETED"}];
        $scope.isEdit = !!$stateParams.id;
        $scope.checklists;
        $scope.selectedChecklist;
        $scope.jobChecklistItems =[];
        $scope.jobTypeName = "";
        $scope.monthDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        $scope.pageSort = 10;
        $scope.pager = {};
        $scope.noData = false;
        $scope.ticketStatus;
        $scope.searchSite = null;
        $scope.searchProject = null;
        $scope.searchEmployee = null;
        $scope.searchStatus = null;
        $scope.disable = false;
        $rootScope.exportStatusObj  ={};
        $scope.status = 0;

        /*
        **
        Job type based records function.
        @param :string
        **
        */
        $scope.jobType = function(type){

           $scope.jobTypeName = type;
           $scope.setPage(1);
           $scope.search();

        };

        $scope.initCalender = function(){
            demo.initFormExtendedDatetimepickers();
        };

        $scope.init = function() {
        		$scope.loadJobStatuses();
            $scope.loadJobs();
        }

        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;

            });
        };


        $('input#jobStartDate').on('dp.change', function(e){

        		$scope.job.plannedStartTime = e.date._d;
        		console.log('job start time - ' + $scope.job.plannedStartTime);
        });

        $('input#scheduleEndDate').on('dp.change', function(e){

	    		$scope.job.scheduleEndDate = e.date._d;
	    		console.log('job schedule end date - ' + $scope.job.scheduleEndDate);
	    });


        $('input#selectedJobDate').on('dp.change', function(e){

                $scope.selectedJobDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
                $scope.selectedJobDateSer = e.date._d;
        });
        
        $('input#selectedJobDateTo').on('dp.change', function(e){

            $scope.selectedJobDateTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.selectedJobDateToSer = e.date._d;
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
                $scope.selectedSite = data;

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
                $scope.searchSite = null;
                $scope.sitesList = data;
            });
        };

        $scope.loadEmployees = function () {
            var deferred = $q.defer();
            if($scope.searchSite){
               $scope.searchCriteria.siteId = $scope.searchSite.id; 
            }else if($scope.selectedSite){
               $scope.searchCriteria.siteId = $scope.selectedSite.id; 
            }else{
                $scope.searchCriteria.siteId = null; 
            }


        		$scope.searchCriteria.list = true;
                $scope.employees = "";
        		EmployeeComponent.search($scope.searchCriteria).then(function (data) {
                    $scope.selectedEmployee = null;
        			$scope.searchEmployee = null;
        			$scope.employees = data.transactions;
                    console.log('Employee List',$scope.employees);
        			deferred.resolve($scope.employees);
            });
    			return deferred.promise;

        };

         $scope.checkSite  = function(){
            if($scope.searchCriteria.siteId == undefined || $scope.searchCriteria.siteId == 0){
            $scope.showNotifications('top','center','danger','Please select site before select employee.');
            }

        }

        $scope.loadLocations = function(){
            JobComponent.loadLocations().then(function(data){
               $scope.selectedLocation = null;
               $scope.locations = data;
            });
        };

        $scope.loadBlocks = function () {
	    		console.log('selected project -' + ($scope.selectedProject ? $scope.selectedProject.id : 0) + ', site -' + ($scope.selectedSite ? $scope.selectedSite.id : 0))
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
	    		var siteId = $scope.selectedSite ? $scope.selectedSite.id : 0;
	    		LocationComponent.findBlocks(projectId,siteId).then(function (data) {
	    			$scope.selectedBlock = null;
	            $scope.blocks = data;
	        });
	    };


        $scope.loadFloors = function () {
        		var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                var siteId = $scope.selectedSite ? $scope.selectedSite.id : 0;

	    		LocationComponent.findFloors(projectId,siteId,$scope.selectedBlock).then(function (data) {
	    			$scope.selectedFloor = null;
	            $scope.floors = data;
	        });
	    };

	    $scope.loadZones = function () {
	    		console.log('load zones - ' + $scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
	    		var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                var siteId = $scope.selectedSite ? $scope.selectedSite.id : 0;
	    		LocationComponent.findZones(projectId,siteId,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
	    			$scope.selectedZone = null;
	            $scope.zones = data;
	        });
	    };

	    $scope.getLocationDetails = function(block,floor,zone){
	        console.log('Loaded location data');
	        $scope.selectedBlock = block;
	        $scope.selectedFloor = floor;
	        $scope.selectedZone = zone;
	        var search={
	            projectId:$scope.selectedSite.projectId,
	            siteId:$scope.selectedSite.id,
                block:block,
                floor:floor,
                zone:zone
            };
	        LocationComponent.findId($scope.selectedSite.id,block,floor,zone).then(function (data) {
                console.log(data);
                $scope.job.locationId = data.id;
            })
        }

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
                $scope.loadingStop();
        	    console.log("Job details",data);
        		$scope.job=data;
        		$scope.job.pendingStatus='pendingAtUDS';
        		$scope.job.pendingAtUDS=true;
        		$scope.selectedSite = {id : data.siteId,name : data.siteName};
        		$scope.loadEmployees().then(function(employees){
        			console.log('load employees ');
            		$scope.selectedEmployee = {id : data.employeeId,name : data.employeeName};
            		//$scope.selectedLocation = {id:data.locationId,name:data.locationName};
            		$scope.loadBlocks();
            		$scope.selectedBlock = data.block;
            		$scope.loadFloors();
            		$scope.selectedFloor = data.floor;
            		$scope.loadZones();
            		$scope.selectedZone = data.zone;
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

            		if($scope.job.ticketId > 0) {
                		TicketComponent.getTicketDetails($scope.job.ticketId).then(function(data){
                            console.log("Ticket details");
                            console.log(data);
                            $scope.ticketStatus = data.status;
                		});

            		}
        		})



        	});
        };

        $scope.loadCompletedJob = function(image) {
            var eleId = 'photoStart';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',image);

        };


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
	        	//$scope.loadEmployee();
	        	//$scope.loadAllSites();
	        	//$scope.loadLocations();
	        	$scope.loadAssets();
	        	$scope.loadPrice();
	        	$scope.loadChecklists();
	        	if($scope.isEdit){
	        		$scope.editJob()
	        	}else {
	            	$scope.job = {};
	            	$scope.job.scheduleDailyExcludeWeekend = true;
	            	$scope.job.schedule = 'ONCE';
	            	$scope.job.active = 'Y';
	            	$scope.job.plannedHours = 1;
                    $scope.job.plannedStartTime = $filter('date')(new Date(), 'EEE, dd MMM yyyy HH:mm:ss Z');

	        	}
	        	if($stateParams.ticketId){
                TicketComponent.getTicketDetails($stateParams.ticketId).then(function(data){
                    console.log("Ticket details");
                    console.log(data);
                    $scope.job.title =data.title;
                    $scope.job.description = data.description;
                    $scope.job.ticketId = data.id;

                     /*if(data.siteId){

                        SiteComponent.findOne(data.siteID).then(function (data) {
                            console.log(data);
                            $scope.selectedSite = null;
                            $scope.selectedSite = data.name;
                            alert($scope.selectedSite);
                        })
                    }*/
                       $scope.selectedSite = {id:data.siteId};
                       $scope.selectedEmployee = {id:data.employeeId};
                       $scope.selectedBlock = {name:data.block};
                       $scope.selectedFloor = {name:data.floor};
                       $scope.selectedZone = {name:data.zone};
                       $scope.loadEmployees();
                       $scope.status = 1;


                })
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
                $scope.disable = true;
	        	$scope.error = null;
	        	$scope.success =null;
	        	$scope.errorProjectExists = null;
	        	console.log("job details before save job - "+$scope.selectedBlock+" - "+$scope.selectedFloor+" - "+$scope.selectedZone);
	        	if($scope.isEdit){
	        	    // $scope.job.ticketId
                }else{
                    $scope.job.ticketId = $stateParams.ticketId;
                }
	        	console.log($scope.job.pendingStatus);
	        	if($scope.job.pendingStatus && $scope.job.pendingStatus=='pendingAtUDS'){
	        	    $scope.job.pendingAtUDS = true;
                    $scope.job.pendingAtClient = false;

                }else if($scope.job.pendingStatus=='pendingAtClient'){
                    $scope.job.pendingAtClient = true;
                    $scope.job.pendingAtUDS = false;

                }else{
                    $scope.job.pendingAtUDS = true;
                    $scope.job.pendingAtClient = false;

                }
	        	if($scope.selectedChecklist) {
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


	        	$scope.job.siteId = $scope.selectedSite.id
	        	if($scope.selectedLocation) {
	    	        $scope.job.locationId = $scope.selectedLocation.id;
	        	}
	        	$scope.job.checklistItems = $scope.jobChecklistItems;
	        	if($scope.selectedAsset) {
	            	$scope.job.assetId = $scope.selectedAsset.id;
	        	}
	        	if($scope.selectedEmployee) {
	        		$scope.job.employeeId = $scope.selectedEmployee.id
	        	}
	        	if($scope.selectedBlock) {
	        	    console.log($scope.selectedBlock);
	        		$scope.job.block = $scope.selectedBlock;
	        	}else {
	        		$scope.job.block = "";
	        	}
	        	if($scope.selectedFloor) {
	        		$scope.job.floor = $scope.selectedFloor;
	        	}else {
	        		$scope.job.floor = "";
	        	}
	        	if($scope.selectedZone) {
	        		$scope.job.zone = $scope.selectedZone;
	        	}else {
	        		$scope.job.zone = "";
	        	}
	        	// $scope.job.jobStatus = $scope.selectedStatus.name;
	        	console.log('job details to save - ' + JSON.stringify($scope.job));
	        	var post = $scope.isEdit ? JobComponent.update : JobComponent.create
	        	var message = 'Job has been created successfully!!'
	        	if($scope.job.id) {
	        		message = 'Job has been updated successfully!!'
	        	}
	        	post($scope.job).then(function () {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success',message);
	            	$location.path('/jobs');
                    $scope.disable = false;
            }).catch(function (response) {
                $scope.success = null;
                $scope.disable = false;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                    $scope.showNotifications('top','center','danger','Job already exists');

                } else {
                    $scope.showNotifications('top','center','danger','Unable to creating job. Please try again later..');
                    $scope.error = 'ERROR';
                }
            });

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
         $scope.loadJobs = function(){
            $scope.clearFilter();
            $scope.search();
        }

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
            $scope.setPage(1);
            $scope.search();
         }

         $scope.searchFilter1 = function () {
            $scope.searchEmployee = null;
            $scope.searchStatus = null;
            $scope.searchCriteria.empId =null;
            $scope.searchCriteria.jobStatus =null;
            $scope.setPage(1);
            $scope.search();
         }


        $scope.search = function () {
                $scope.noData = false;
        		console.log('$scope.pages - ' + $scope.pages + ', $scope.pages.currPage - ' + $scope.pages.currPage);
	        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
	        		var searchCriteria = {
	            			currPage : currPageVal
	            	}
	            	$scope.searchCriteria = searchCriteria;
	        	// }
                $scope.searchCriteria.jobTypeName = $scope.jobTypeName;
	        	$scope.searchCriteria.currPage = currPageVal;
	        	console.log('Selected  project -' + $scope.selectedProject);
                console.log('Selected  job -' + $scope.selectedJob);
                console.log('Selected  site -' + $scope.selectedSite);
	        	console.log('Selected  employee -' + $scope.selectedEmployee);
	        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaProject));
                $scope.searchCriteria.findAll = false;
                 /*&& !$scope.selectedJob*/
	        	if(!$scope.searchProject && !$scope.searchSite && !$scope.searchStatus){
	        		$scope.searchCriteria.findAll = true;
	        	}

	        	if($scope.searchProject) {
	        		$scope.searchCriteria.projectId = $scope.searchProject.id;
	        	}else{
                    $scope.searchCriteria.projectId = null;
                }

	        	if($scope.searchSite) {
	        		$scope.searchCriteria.siteId = $scope.searchSite.id;
		        }else{
                    $scope.searchCriteria.siteId = null;
                }
	        	console.log('selected status - '+ JSON.stringify($scope.searchStatus));
	        	if($scope.searchStatus){
		        		$scope.searchCriteria.jobStatus = $scope.searchStatus;
		        }else{
                    $scope.searchCriteria.jobStatus = null;
                }

	        	/*if($scope.selectedJob){
	        		$scope.searchCriteria.jobTitle = $scope.selectedJob;
	        	}*/
                if($scope.searchEmployee){
                    $scope.searchCriteria.empId = $scope.searchEmployee.id;
                }else{
                    $scope.searchCriteria.empId = null;
                }


	        	if($scope.selectedJobDate) {
	        		$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedJobDateSer;
	        	}
	        	
	        	if($scope.selectedJobDateTo) {
	        		$scope.searchCriteria.checkInDateTimeTo = $scope.selectedJobDateToSer;
	        	}

	        	console.log('search criterias - ', JSON.stringify($scope.searchCriteria));
                //$scope.jobs = '';
                //$scope.jobsLoader = false;

                //----
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
                     $scope.jobs = '';
                     $scope.jobsLoader = false;
                     $scope.loadPageTop();
                     $rootScope.searchCriterias = $scope.searchCriteria;      
	        	JobComponent.search($rootScope.searchCriterias).then(function (data) {
                    $scope.jobs = data.transactions;
	        		$scope.jobsLoader = true;

                    /*
                        ** Call pagination  main function **
                    */
                     $scope.pager = {};
                     $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                     $scope.totalCountPages = data.totalCount;

                     console.log("Pagination",$scope.pager);
                     console.log("jobs",$scope.jobs);

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

        };

        $scope.clearFilter = function() {
            $rootScope.exportStatusObj.exportMsg = '';
            $scope.downloader=false;
            $scope.selectedJobDateSer = new Date();
            $scope.selectedJobDate = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.selectedJobDateToSer = new Date();
            $scope.selectedJobDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.selectedJob = null;
            $scope.selectedEmployee = null;
            $scope.searchSite = null;
            $scope.searchEmployee = null;
            $scope.searchStatus = null;
            $scope.searchProject = null;
            $scope.searchCriteria.columnName =null;
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

        //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.init();
             $scope.initPage();
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

        $scope.closeTicket = function (ticket){

            $scope.cTicket={id :ticket,status :'Closed'};
        }


        $scope.closeTicketConfirm =function(cTicket){

	        JobComponent.updateTicket(cTicket).then(function() {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success','Ticket status updated');
	                $(".fade").removeClass("modal-backdrop");
	                $scope.ticketStatus = 'Closed'
	                $state.reload();
	            });
        }


        $rootScope.exportStatusObj = {};


        $scope.exportAllData = function(type){
                $scope.searchCriteria.exportType = type;
                $rootScope.exportStatusObj.exportMsg = '';
                $scope.downloader=true;
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

        $scope.cancel = function () {
                            
             if($scope.status == 1){

                 $location.path('/tickets');

             }else{

                $location.path('/jobs');
             }

            
        };


    });
