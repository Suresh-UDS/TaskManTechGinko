'use strict';

angular.module('timeSheetApp')
		    .controller(
				'JobController',
				function($scope, $rootScope, $state, $timeout, JobComponent,AssetComponent,
						ProjectComponent, SiteComponent,EmployeeComponent,ChecklistComponent, 
                        LocationComponent, $http, $stateParams,
						$location,PaginationComponent,$filter, TicketComponent) {
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
        
        $scope.ticketStatus;
        
        /*
        **
        Job type based records function.
        @param :string
        **
        */
        $scope.jobType = function(type){

           $scope.jobTypeName = type;
           $scope.setPage(1);
           //$scope.search();

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


        $('input#dateFilterFrom').on('dp.change', function(e){

        		$scope.job.plannedStartTime = e.date._d;
        		console.log('job start time - ' + $scope.job.plannedStartTime);
        });

        $('input#selectedJobDate').on('dp.change', function(e){

                $scope.selectedJobDate = $filter('date')(e.date._d, 'dd/MM/yyyy'); 
                $scope.selectedJobDateSer = e.date._d;
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

        $scope.loadBlocks = function () {
	    		console.log('selected project -' + ($scope.selectedProject ? $scope.selectedProject.id : 0) + ', site -' + ($scope.selectedSite ? $scope.selectedSite.id : 0))
	    		var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
	    		LocationComponent.findBlocks(projectId,$scope.selectedSite.id).then(function (data) {
	    			$scope.selectedBlock = null;
	            $scope.blocks = data;
	        });
	    };


        $scope.loadFloors = function () {
        		var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
	    		LocationComponent.findFloors(projectId,$scope.selectedSite.id,$scope.selectedBlock).then(function (data) {
	    			$scope.selectedFloor = null;
	            $scope.floors = data;
	        });
	    };

	    $scope.loadZones = function () {
	    		console.log('load zones - ' + $scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
	    		var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
	    		LocationComponent.findZones(projectId,$scope.selectedSite.id,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
	    			$scope.selectedZone = null;
	            $scope.zones = data;
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
                $scope.loadingStop();
        	    console.log("Job details",data);
        		$scope.job=data;
        		$scope.selectedSite = {id : data.siteId,name : data.siteName};
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
	        	$scope.loadEmployee();
	        	$scope.loadAllSites();
	        	//$scope.loadLocations();
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
	        	if($stateParams.ticketId){
                TicketComponent.getTicketDetails($stateParams.ticketId).then(function(data){
                    console.log("Ticket details");
                    console.log(data);
                    $scope.job.title =data.title;
                    $scope.job.description = data.description;
                    $scope.job.ticketId = data.id;
                    if(data.siteId){
                        SiteComponent.findOne(data.siteID).then(function (data) {
                            console.log(data);
                            $scope.selectedSite = data;
                        })
                    }
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
	        	$scope.error = null;
	        	$scope.success =null;
	        	$scope.errorProjectExists = null;
	        	$scope.job.ticketId = $stateParams.ticketId;
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
	        		$scope.job.block = $scope.selectedBlock;
	        	}
	        	if($scope.selectedFloor) {
	        		$scope.job.floor = $scope.selectedFloor;
	        	}
	        	if($scope.selectedZone) {
	        		$scope.job.zone = $scope.selectedZone;
	        	}
	        	// $scope.job.jobStatus = $scope.selectedStatus.name;
	        	console.log('job details to save - ' + JSON.stringify($scope.job));
	        	var post = $scope.isEdit ? JobComponent.update : JobComponent.create
	        	var message = 'Job Created Successfully'
	        	if($scope.job.id) {
	        		message = 'Job Updated Successfully'
	        	}		
	        	post($scope.job).then(function () {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success',message);
	            	$location.path('/jobs');
            }).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                } else {
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


        $scope.search = function () {

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
                if($scope.selectedEmployee){
                    $scope.searchCriteria.empId = $scope.selectedEmployee.id;
                }
               

	        	if($scope.selectedJobDate) {
	        		$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedJobDateSer;
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

	        	JobComponent.search($scope.searchCriteria).then(function (data) {
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

	                   
	                }

	           
	        	});
 	
        };

        $scope.clearFilter = function() {
            $scope.selectedJobDateSer = new Date(); 
            $scope.selectedJobDate = $filter('date')(new Date(), 'dd/MM/yyyy'); 
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.selectedJob = null;
            $scope.selectedEmployee = null;
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

       //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);
        }

         // Page Loader Function

        $scope.loadingStart = function(){ $('.pageCenter').show();$('.overlay').show();}
        $scope.loadingStop = function(){

            console.log("Calling loader");
            $('.pageCenter').hide();$('.overlay').hide();

        }

        $scope.loadingAuto = function(){
            $scope.loadingStart();
            $scope.loadtimeOut = $timeout(function(){

            //console.log("Calling loader stop");
            $('.pageCenter').hide();$('.overlay').hide();

        }, 2000);}


    /*
        ** Pagination init function **
        @Param:integer

    */

        $scope.setPage = function (page) {
        		if($scope.pager) {
                if (page < 1 || page > $scope.pager.totalPages) {
                    return;
                }
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

        
    });
