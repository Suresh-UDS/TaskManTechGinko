'use strict';

angular.module('timeSheetApp')
		    .controller(
				'JobController',
				function($scope, $rootScope, $state, $timeout, JobComponent,AssetComponent,
						ProjectComponent, SiteComponent,EmployeeComponent,ChecklistComponent,
                        LocationComponent, $http, $stateParams,
						$location,PaginationComponent,$filter, TicketComponent, $q,$interval,getLocalStorage) {
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
        $scope.searchJobDate = null;
        $scope.searchJobDateTo = null;

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
        $scope.selectedJobId = null;
        $scope.selectedJobTitle = null;
        $scope.disable = false;
        $rootScope.exportStatusObj  ={};
        $scope.checkStatus = 0;
        $scope.selectPlannedStartTime;
        $scope.btnDisable = false;
        
        /** Ui-select scopes **/
        $scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
        $scope.client = {};
        $scope.clients = [];
        $scope.allSites = {id:0 , name: '-- ALL SITES --'};
        $scope.sitesListOne = {};
        $scope.sitesLists = [];
        $scope.allEmp = {id:0 , name: '-- ALL EMPLOYEES --'};
        $scope.empListOne = {};
        $scope.empLists = [];
        $scope.allStatus = '-- ALL STATUS --';
        $scope.statusListOne = {};
        $scope.statusLists = [];
        $scope.statusListOne.selected =  null;
        //$scope.SelectClientsNull = {id:0 , name: '-- SELECT CLIENT --'};
        $scope.SelectClient = {};
        $scope.SelectClients = [];
        $scope.SelectSite = {};
        $scope.SelectSites = [];

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

        $scope.initCalender();

        $scope.init = function() {
            $scope.loadJobStatuses();
            //$scope.loadJobs();
        }

        //

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
                            $scope.cancel();
                        }
                        else if(text == 'save')
                        {
                            $scope.saveJob($scope.valid);
                        }
                        else if(text == 'update')
                        {
                            /** @reatin - retaining scope value.**/
                            $rootScope.retain=1;
                            $scope.saveJob();
                        }
                    };

                    //


        $scope.initscrollbar = function()
         {
           console.log("---- Calling scrollbar ---- ");

           $('.sidebar .sidebar-wrapper').perfectScrollbar();

         }

          $scope.initscrollbar();


        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
                /** Ui-select scope **/
                $scope.clients[0] = $scope.allClients;
                for(var i=0;i<$scope.projects.length;i++)
                {
                    $scope.uiClient[i] = $scope.projects[i].name;
                    /** Ui-select scope **/
                    $scope.clients[i+1] = $scope.projects[i];
                }
               
                
                $scope.clientDisable = false;
                $scope.clientFilterDisable = false;

            });
        };
        /*$(document).ready(function(){
           $('#jobStartDate').datetimepicker({ dateFormat: 'dd/MM/yyyy hh:mm a' }).val();
        });*/

        $('input#jobStartDate').datetimepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker').minDate(e.date);
        });

        //Date
        $('input#jobStartDate').on('dp.change', function(e){
        		$scope.job.plannedStartTime = new Date(e.date._d);
                $scope.selectPlannedStartTime = $filter('date')(e.date._d, 'dd/MM/yyyy hh:mm a');
        		console.log('job start time - ' + $scope.job.plannedStartTime);
                $scope.job.scheduleEndDate = "";
                $scope.selectScheduleEndDate = "";
                $('input#scheduleEndDate').datetimepicker().on('dp.show', function () {
                return $(this).data('DateTimePicker').minDate(e.date);
                });
        });

        $('#jobStartDate').datetimepicker({
        format: 'DD/MM/YYYY HH:mm A'
        });

        $('input#scheduleEndDate').on('dp.change', function(e){

	    		$scope.job.scheduleEndDate = new Date(e.date._d);
                $scope.selectScheduleEndDate = $filter('date')(e.date._d, 'dd/MM/yyyy hh:mm a');
	    		console.log('job schedule end date - ' + $scope.job.scheduleEndDate);
	    });

        $('#scheduleEndDate').datetimepicker({
        format: 'DD/MM/YYYY HH:mm A'
        });

        
        /*
        $('input#selectedJobDate').on('dp.change', function(e){

                $scope.selectedJobDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
                $scope.selectedJobDateSer = new Date(e.date._d);
        });
        	*/


        /*
        $('input#selectedJobDateTo').on('dp.change', function(e){

            $scope.selectedJobDateTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.selectedJobDateToSer = new Date(e.date._d);
        });
        */

        $('input#searchJobDate').on('dp.change', function(e){

            $scope.searchJobDateSer = new Date(e.date._d);
            $scope.searchJobDate = $filter('date')(e.date._d, 'dd/MM/yyyy');

            if($scope.searchJobDate > $scope.searchJobDateTo){
               $scope.searchJobDateTo = null;
               $scope.searchJobDateToSer = null;
            }

             /*$('#searchJobDateTo').datetimepicker().on('dp.show', function () {
                return $(this).data('DateTimePicker').minDate(e.date);
            });*/
        });

        $('input#searchJobDateTo').on('dp.change', function(e){

            $scope.searchJobDateToSer = new Date(e.date._d);
            $scope.searchJobDateTo = $filter('date')(e.date._d, 'dd/MM/yyyy');

            if($scope.searchJobDate > $scope.searchJobDateTo){
              $scope.searchJobDate = null;
              $scope.searchJobDateSer = null;
            }

        });

        //

        // All Site
        $scope.loadAllSites = function () {
            $scope.siteSpin = true;
              SiteComponent.findAll().then(function (data) {
              // $scope.selectedSite = null;

                  //
              $scope.sites = data;
              //     for(var i=0;i<$scope.sites.length;i++)
              //     {
              //         $scope.uiSite[i] = $scope.sites[i].name;
              //     }
              //     $scope.siteFilterDisable = false;
              //     $scope.siteSpin = false;

              });
        };


        //Check
        // Load dep sites
       /* $scope.loadDepSites = function () {
                if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                    var depProj=$scope.selectedProject.id;
                }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                     var depProj=$scope.searchProject.id;
                }else{
                     var depProj=0;
                }

                  $scope.siteFilterDisable = true;
                  $scope.uiSite.splice(0,$scope.uiSite.length);
                  $scope.clearField = false;
                  $scope.searchSite = null;
                  $scope.hideSite = false;

                $scope.siteSpin = true;
                ProjectComponent.findSites(depProj).then(function (data) {
                    $scope.searchSite = null;
                    $scope.sitesList = data;
                    console.log($scope.sitesList)
                    for(var i=0;i<$scope.sitesList.length;i++)
                    {
                        $scope.uiSite[i] = $scope.sitesList[i].name;
                    }
                    $scope.siteFilterDisable = false;
                    $scope.siteSpin = false;
                });
        };*/
        
        /** Ui-select function **/
        
        $scope.loadDepSitesList = function (searchProject) {
	         if(searchProject){
	           $scope.siteSpin = true;
	           $scope.searchProject = searchProject;
	           if(jQuery.isEmptyObject($scope.searchProject) == false && $scope.searchProject.id == 0){
	         	  SiteComponent.findAll().then(function (data) {
	                  $scope.selectedSite = null;
	                  $scope.sitesList = data;
	                  $scope.sitesLists = [];
	                  $scope.sitesListOne.selected = null;
	                  $scope.sitesLists[0] = $scope.allSites;
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
	                  $scope.selectedSite = null;
	                  $scope.sitesList = data;
	                  $scope.sitesLists = [];
	                  //$scope.sitesListOne.selected = null;
	                  $scope.sitesLists[0] = $scope.allSites;
	                  $scope.SelectSite = {};
	                  $scope.SelectSites = [];
	                  for(var i=0;i<$scope.sitesList.length;i++)
	                  {
	                      $scope.sitesLists[i+1] = $scope.sitesList[i];
	                  }
	                  for(var i=0;i<$scope.sitesList.length;i++)
	                  {
	                      $scope.SelectSites[i] = $scope.sitesList[i];
	                      
	                  }
	                  console.log('Select sites',$scope.SelectSites);
	                  $scope.siteFilterDisable = false;
	                  $scope.siteSpin = false;
	              });
	           }
	         }

        };
        // Load Sites for selectbox //
        $scope.siteDisable = true;
        $scope.uiSite = [];
        $scope.siteFilterDisable = true;
        $scope.getSite = function (search) {
             var newSupes = $scope.uiSite.slice();
             if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
             }

             return newSupes;
             }
        //

        // Load dep blocks
        $scope.loadBlocks = function () {
            // $scope.blockSpin = true;
            // $scope.selectedSite = $scope.sites[$scope.uiSite.indexOf(selectedSite)]
            console.log('selected project -' + ($scope.selectedProject ? $scope.selectedProject.id : 0) + ', site -' + ($scope.selectedSite ? $scope.selectedSite.id : 0))
            var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
            var siteId = $scope.selectedSite ? $scope.selectedSite.id : 0;
                LocationComponent.findBlocks(projectId,siteId).then(function (data) {
                //$scope.selectedBlock = null;
                $scope.blocks = data;

                    // for(var i=0;i<$scope.blocks.length;i++)
                    // {
                    //     $scope.uiBlock[i] = $scope.blocks[i];
                    // }
                    // console.log( $scope.blocks)
                    // console.log( $scope.uiBlock)
                    // $scope.blockFilterDisable = false;
                    // $scope.blockSpin = false;

                });
        };
        //

        // Load Blocks for selectbox //
        $scope.uiBlock = [];
        $scope.blockFilterDisable = true;
        $scope.getBlock = function (search) {
            var newSupes = $scope.uiBlock.slice();
            if (search && newSupes.indexOf(search) === -1) {
                 newSupes.unshift(search);
            }

            return newSupes;
        }
        //


        //Load dep Floor
        $scope.loadFloors = function () {
            // $scope.floorSpin = true;
            // $scope.selectedBlock = $scope.blocks[$scope.uiFloor.indexOf(selectedBlock)]
             var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
             var siteId = $scope.selectedSite ? $scope.selectedSite.id : 0;

                        LocationComponent.findFloors(projectId,siteId,$scope.selectedBlock).then(function (data) {
                            //$scope.selectedFloor = null;
                            $scope.floors = data;
                            // for(var i=0;i<$scope.floors.length;i++)
                            // {
                            //     $scope.uiFloor[i] = $scope.floors[i];
                            // }
                            // $scope.floorFilterDisable = false;
                            // $scope.floorSpin = false;

                        });
        };
        //

        // Load Floors for selectbox //
                    $scope.floorSpin = false;
                    $scope.floorFilterDisable = true;
                    $scope.uiFloor = [];
                    $scope.getFloor = function (search) {
                        var newSupes = $scope.uiFloor.slice();
                        if (search && newSupes.indexOf(search) === -1) {
                            newSupes.unshift(search);
                        }

                        return newSupes;
                    }
        //


                    // Load Clients for selectbox //
                    $scope.siteSpin = false;
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
                    $scope.employeeFilterDisable = true;
                    $scope.uiEmployee = [];

                    $scope.getEmp = function (search) {
                        var newSupes = $scope.uiEmployee.slice();
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


        //Chec
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
                $scope.searchCriteria.isReport = true;

                $scope.employees = "";
        		EmployeeComponent.search($scope.searchCriteria).then(function (data) {
                    $scope.selectedEmployee = null;
        			$scope.searchEmployee = null;
        			$scope.employees = data.transactions;
                    if($scope.employees){
                        for(var i=0;i<$scope.employees.length;i++)
                        {
                            $scope.uiEmployee[i] = $scope.employees[i].name;
                        }
                    }
                    console.log($scope.uiEmployee)
                    $scope.employeeFilterDisable = false;
                    $scope.empSpin = false;
        			deferred.resolve($scope.employees);
            });
    			return deferred.promise;

        };


                    $scope.loadSearchProject = function (searchProject) {
                        $scope.clearField = false;
                        $scope.hideSite = false;
                        $scope.hideEmp = false;
                        $scope.hideStatus = false;
                        $scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]
                        $scope.uiSite.splice(0,$scope.uiSite.length)
                    }
                    $scope.loadSearchSite = function (searchSite) {
                        $scope.hideEmp = false;
                        $scope.empSpin = true;
                        $scope.hideSite = true;
                        $scope.hideStatus = false;
                        $scope.uiEmployee.splice(0,$scope.uiEmployee.length);
                        $scope.searchSite = $scope.sitesList[$scope.uiSite.indexOf(searchSite)]
                    }
         $scope.loadSearchEmployees = function (searchEmployee) {
               $scope.clearField = false;
               $scope.hideEmp = true;
            if(searchEmployee){
               $scope.searchEmployee = $scope.employees[$scope.uiEmployee.indexOf(searchEmployee)];
            }

         }
         $scope.loadSearchStatus = function (searchStatus) {
              $scope.hideStatus = true;
             $scope.clearField = false;
              $scope.searchStatus = $scope.statuses[$scope.uiStatus.indexOf(searchStatus)]
         }

                    $scope.loadFilter = true;
                    $scope.loadDepEmployees = function () {
                      $scope.empSpin = true;
                      $scope.empLists = [];
  	                  //$scope.empListOne.selected = null;
  	                  $scope.empLists[0] = $scope.allEmp;
  	                  $scope.searchCriteria.list = true;
                        if($scope.sitesListOne.selected) {
                        	
                            $scope.searchCriteria.siteId = $scope.sitesListOne.selected.id;
                            EmployeeComponent.search($scope.searchCriteria).then(function (data) {
                                $scope.searchEmployee = null;
                                $scope.employees = data.transactions;

                                console.log($scope.employees)
                                if($scope.employees){
                                    for(var i=0;i<$scope.employees.length;i++)
                                    {
                                        $scope.uiEmployee[i] = $scope.employees[i].name;
                                    }
                                  for(var i=0;i<$scope.employees.length;i++)
    	      	                  {
    	      	                      $scope.empLists[i+1] = $scope.employees[i];
    	      	                  }
                                }
                                // console.log($scope.uiEmployee)
                                $scope.employeeFilterDisable = false;
                                $scope.empSpin = false;
                            });
                        }else{
                        	
                        	JobComponent.findEmployees().then(function (data) {
                        		// $scope.selectedEmployee = null;
                                $scope.employees = data;
                                $scope.loadFilter = false;
                                console.log("==============",$scope.loadFilter)
                                for(var i=0;i<$scope.employees.length;i++)
                                {
                                    $scope.uiEmployee[i] = $scope.employees[i].name;
                                }
                                for(var i=0;i<$scope.employees.length;i++)
  	      	                  {
  	      	                      $scope.empLists[i+1] = $scope.employees[i];
  	      	                  }
                                $scope.employeeFilterDisable = false;
                                $scope.empSpin = false;
                            });
                        }
                       
                        
                    };

         //
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






	    $scope.loadZones = function () {
	    		//console.log('load zones - ' + $scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
	    		var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                var siteId = $scope.selectedSite ? $scope.selectedSite.id : 0;
	    		LocationComponent.findZones(projectId,siteId,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
	    			//$scope.selectedZone = null;
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
        $scope.statusSpin = true;
        $scope.loadJobStatuses = function(){
            JobComponent.loadJobStatuses().then(function(data){
               $scope.selectedLocation = null;
               $scope.statuses = data;
                $scope.hideStatus = false;
                /** Ui-select scope **/
                $scope.statusLists[0] = $scope.allStatus;
                for(var i=0;i<$scope.statuses.length;i++)
                {
                    $scope.uiStatus[i] = $scope.statuses[i];
                }
                /** Ui-select scope **/
                for(var i=0;i<$scope.statuses.length;i++)
                {
                    $scope.statusLists[i+1] = $scope.statuses[i];
                }
                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
                console.log($scope.statuses )
                console.log($scope.uiStatus )
                $scope.statusFilterDisable = false;
                $scope.statusSpin = false;
            });
        };

            $scope.getJobImages = function(){
                console.log()
            };

        $scope.getJobDetails = function(){
                 var jobId = parseInt($stateParams.id);
                 JobComponent.findById(jobId).then(function(jobData){
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
            if(parseInt($stateParams.id) > 0){

                var jobId = parseInt($stateParams.id)
                JobComponent.findById(jobId).then(function(data){
                    $scope.loadingStop();
                    console.log("Job details",data);
                    $scope.job=data;
                    if(!$scope.job){
                       $location.path('/jobs');
                    }
                    $scope.title = $scope.job.title;
                    $scope.job.pendingStatus='pendingAtUDS';
                    $scope.job.pendingAtUDS=true;
                    $scope.selectedSite = {id : data.siteId,name : data.siteName};
                    $scope.job.plannedStartTime = data.plannedStartTime;
                    $scope.selectPlannedStartTime = $filter('date')(data.plannedStartTime, 'dd/MM/yyyy hh:mm a');
                    if($scope.job.schedule == 'ONCE'){
                      $scope.job.scheduleEndDate = "";
                    }else{
                       $scope.job.scheduleEndDate = data.scheduleEndDate;
                    }
                    $scope.selectScheduleEndDate = $filter('date')(data.scheduleEndDate, 'dd/MM/yyyy hh:mm a');
                    $scope.loadEmployees().then(function(employees){
                        console.log('load employees ');
                        $scope.selectedEmployee = {id : data.employeeId,name : data.employeeName};
                        //$scope.selectedLocation = {id:data.locationId,name:data.locationName};
                        $scope.loadBlocks();
                        if(data.block){
                           $scope.selectedBlock = data.block;
                        }else{
                           $scope.selectedBlock = null;
                        }
                        $scope.loadFloors();
                        if(data.floor){
                           $scope.selectedFloor = data.floor;
                        }else{
                           $scope.selectedFloor = null;
                        }
                        $scope.loadZones();
                        if(data.zone){
                           $scope.selectedZone = data.zone;
                        }else{
                           $scope.selectedZone = null;
                        }
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

//                        if(data.images){
//                            $scope.completedImages = [];
//                            for(var i=0;i<data.images.length;i++){
//                                console.log(data.images[i]);
//                                JobComponent.getCompleteImage(data.images[i].employeeEmpId,data.images[i].photoOut).then(function (imageResponse) {
//                                    // console.log(imageResponse);
//                                    $scope.completedImages.push(imageResponse);
//                                });
//                            }
//
//                        }

                        if($scope.job.ticketId > 0) {
                            TicketComponent.getTicketDetails($scope.job.ticketId).then(function(data){
                                console.log("Ticket details");
                                console.log(data);
                                $scope.ticketStatus = data.status;
                            });

                        }
                    })



                }).catch(function(){
                   $location.path('/jobs');
                });
        	}else{
        	   $location.path('/jobs');
        	}
        };

        $scope.loadCompletedJob = function(imageUrl) {
            var eleId = 'photoStart';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',imageUrl);

        };




        $scope.loadEmployee = function () {
            $scope.empSpin = true;
        	JobComponent.findEmployees().then(function (data) {
        		// $scope.selectedEmployee = null;
                $scope.employees = data;
                $scope.loadFilter = false;
                console.log("==============",$scope.loadFilter)
                for(var i=0;i<$scope.employees.length;i++)
                {
                    $scope.uiEmployee[i] = $scope.employees[i].name;
                }
                $scope.employeeFilterDisable = false;
                $scope.empSpin = false;
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
	        	//$scope.loadAssets();
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
                    $scope.job.plannedStartTime =new Date();
                    $scope.selectPlannedStartTime = $filter('date')(new Date(), 'dd/MM/yyyy hh:mm a');


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
                           if(data.block) {
                               $scope.selectedBlock = {name:data.block};
                           }
                           if(data.floor) {
                               $scope.selectedFloor = {name:data.floor};
                           }
                           if(data.zone) {
                               $scope.selectedZone = {name:data.zone};
                           }
                           $scope.loadEmployees();
                           $scope.loadBlocks();
                           $scope.loadFloors();
                           $scope.loadZones();
                           $scope.checkStatus  = 1;


                    })
                }
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

        $scope.saveLoad = false;
        $scope.saveJob = function () {
                $scope.saveLoad = true;
                $scope.disable = true;
	        	$scope.error = null;
	        	$scope.success =null;
	        	$scope.errorProjectExists = null;
	        	$scope.btnDisable = true;
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
	        	var message = 'Job created successfully!!'
	        	if($scope.job.id) {
	        		message = 'Job updated successfully!!'
	        	}
	        	post($scope.job, function (response, err) {
	        		if(response) {
	        			if(response.data.errorMesssage) {
                        $scope.saveLoad = false;
                        $scope.success = null;
                        $scope.disable = false;
                        $scope.btnDisable = false;
                        $scope.showNotifications('top','center','danger','Failed to save job.' + response.data.errorMessage);
                        $scope.error = 'ERROR';
	        			}else {
		        			$scope.success = 'OK';
		        			$scope.saveLoad = false;
		                	$scope.showNotifications('top','center','success',message);
		            		$location.path('/jobs');
		            		$scope.disable = false;
		            		$scope.btnDisable = false;
	        			}
	        		}else if(err) {
                    $scope.saveLoad = false;
                    $scope.success = null;
                    $scope.disable = false;
                    $scope.btnDisable = false;
                    console.log('Error - '+ err);
                    if (err.status === 400 && err.data.message === 'error.duplicateRecordError') {
                        $scope.errorProjectExists = 'ERROR';
                        $scope.showNotifications('top','center','danger','Job already exists');

                    } else {
                        $scope.showNotifications('top','center','danger','Failed to save job.' + err.data.errorMessage);
                        $scope.error = 'ERROR';
                    }
	        		}
            }).catch(function(){
                 $scope.btnDisable = false;
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
             $scope.loadJobStatuses();
        }

        $scope.refreshPage = function(){
            $scope.loadJobs();
            $scope.clearField = true;

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
            // $scope.searchEmployee = null;
            // $scope.searchStatus = null;
            // $scope.searchCriteria.empId =null;
            // $scope.searchCriteria.jobStatus =null;
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
             	if($scope.empListOne.selected && $scope.empListOne.selected.id != 0){
             		$scope.searchEmployee = $scope.empListOne.selected;
             		
             	}else{
             	   $scope.searchEmployee = null;
             	}
             	if($scope.statusListOne.selected && $scope.statusListOne.selected != '-- ALL STATUS --'){
             		$scope.searchStatus = $scope.statusListOne.selected;
             		
             	}else{
             	   $scope.searchStatus = null;
             	}
             	
                $scope.searchCriteria.jobTypeName = $scope.jobTypeName;
	        	$scope.searchCriteria.currPage = currPageVal;
	        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaProject));
                $scope.searchCriteria.findAll = false;
                $scope.searchCriteria.isReport = false;
                 /*&& !$scope.selectedJob*/
	        	if(!$scope.searchProject && !$scope.searchSite && !$scope.searchStatus
	        	&& !$scope.searchEmployee && !$scope.searchJobId && !$scope.searchJobTitle && !$scope.searchJobDate && !$scope.searchJobDateTo){
	        		$scope.searchCriteria.findAll = true;
	        	}

	        	if($scope.searchProject && $scope.searchProject.searchStatus != '0') {
	        		$scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.projectName = $scope.searchProject.name;
	        	}else{
                    $scope.searchCriteria.projectId = null;
                }

	        	if($scope.searchSite && $scope.searchSite.searchStatus != '0') {
	        		$scope.searchCriteria.siteId = $scope.searchSite.id;
                    $scope.searchCriteria.siteName = $scope.searchSite.name;
		        }else{
                    $scope.searchCriteria.siteId = null;
                }

	        	if($scope.searchStatus){
		        		$scope.searchCriteria.jobStatus = $scope.searchStatus;
		        }else{
                    $scope.searchCriteria.jobStatus = null;
                }

                if($scope.searchJobId){
                    $scope.searchCriteria.jobId = $scope.searchJobId;
                }else{
                    $scope.searchCriteria.jobId = null;
                }
                if($scope.searchJobTitle){
                    $scope.searchCriteria.jobTitle = $scope.searchJobTitle;
                }else{
                    $scope.searchCriteria.jobTitle = null;
                }
                if($scope.searchEmployee){
                    $scope.searchCriteria.employeeId = $scope.searchEmployee.id;
                    $scope.searchCriteria.employeeName = $scope.searchEmployee.name;
                }else{
                    $scope.searchCriteria.employeeId = null;
                }


	        	if($scope.searchJobDate) {
	        		$scope.searchCriteria.checkInDateTimeFrom = $scope.searchJobDateSer;
	        	}else{
	        	    $scope.searchCriteria.checkInDateTimeFrom = null;
	        	}

	        	if($scope.searchJobDateTo) {
	        		$scope.searchCriteria.checkInDateTimeTo = $scope.searchJobDateToSer;
	        	}else{
	        	    $scope.searchCriteria.checkInDateTimeTo = null;
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

            /* Localstorage (Retain old values while edit page to list) start */

            if($rootScope.retain == 1){
                $scope.localStorage = getLocalStorage.getSearch();
                console.log('Local storage---',$scope.localStorage);

                if($scope.localStorage){
                    $scope.filter = true;
                    $scope.pages.currPage = $scope.localStorage.currPage;
                    if($scope.localStorage.projectId){
                    	$scope.searchProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                    	$scope.client.selected = $scope.searchProject;
                    	ProjectComponent.findSites($scope.searchProject.id).then(function (data) {
        	                  $scope.selectedSite = null;
        	                  $scope.sitesList = data;
        	                  $scope.sitesLists = [];
        	                  $scope.sitesLists[0] = $scope.allSites;
        	                  
        	                  for(var i=0;i<$scope.sitesList.length;i++)
        	                  {
        	                      $scope.sitesLists[i+1] = $scope.sitesList[i];
        	                  }
        	                  $scope.siteFilterDisable = false;
        	                  $scope.siteSpin = false;
        	              });
                    }else{
                    	$scope.searchProject = null;
                    	$scope.client.selected = $scope.searchProject;
                    }
                    if($scope.localStorage.siteId){
                    	$scope.searchSite  = {id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
                    	$scope.sitesListOne.selected = $scope.searchSite;
                        $scope.siteFilterDisable=false;
                    }else{
                    	$scope.searchSite  = null;
                    	$scope.sitesListOne.selected = $scope.searchSite;
                    }
                    if($scope.localStorage.employeeId){
                    	$scope.searchEmployee = {id:$scope.localStorage.employeeId,name:$scope.localStorage.employeeName};
                    	$scope.empListOne.selected = $scope.searchEmployee;
                    }else{
                    	$scope.searchEmployee = null;
                    	$scope.empListOne.selected = $scope.searchEmployee;
                    	
                    }
                    if($scope.localStorage.jobStatus){
                    	$scope.searchStatus  = $scope.localStorage.jobStatus;
                    	$scope.statusListOne.selected  = $scope.searchStatus;
                    }else{
                    	$scope.statusListOne.selected  = null;
                    	$scope.statusListOne.selected  = $scope.searchStatus;
                    } 
                    if($scope.localStorage.jobTitle){
                   	 $scope.searchJobTitle = $scope.localStorage.jobTitle;
                   }else{
                   	 $scope.searchJobTitle = "";
                   }
                    if($scope.localStorage.jobId){
                   	 $scope.searchJobId = $scope.localStorage.jobId;
                   }else{
                   	 $scope.searchJobId = "";
                   }

                    $scope.searchJobDate = $filter('date')($scope.localStorage.checkInDateTimeFrom, 'dd/MM/yyyy');
                    $scope.searchJobDateTo = $filter('date')($scope.localStorage.checkInDateTimeTo, 'dd/MM/yyyy');
                    $scope.searchJobDateSer = $scope.localStorage.checkInDateTimeFrom;
                    $scope.searchJobDateToSer = $scope.localStorage.checkInDateTimeTo;

                }

                $rootScope.retain = 0;

                var searchCriteras  = $scope.localStorage;
            }else{

                var searchCriteras  = $scope.searchCriteria;
            }

            /* Localstorage (Retain old values while edit page to list) end */





            JobComponent.search(searchCriteras).then(function (data) {
                    $scope.jobs = data.transactions;
	        		$scope.jobsLoader = true;


                /** retaining list search value.**/
                getLocalStorage.updateSearch(searchCriteras);


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
         $scope.clearField = false;
        $scope.clearFilter = function() {
            $('input#searchJobDate').data('DateTimePicker').clear();
            $('input#searchJobDateTo').data('DateTimePicker').clear();
            $rootScope.exportStatusObj = {};
            $scope.downloader=false;
            $scope.downloaded = true;
            $scope.siteFilterDisable = true;
            $scope.sitesList = null;
            
            /** Ui-select scopes **/
        	$scope.client.selected = null;
        	$scope.sitesLists =  [];
        	$scope.sitesListOne.selected =  null;
        	$scope.empLists =  [];
        	$scope.empListOne.selected =  null;
        	$scope.statusLists = [];
            $scope.statusListOne.selected =  null;
            $scope.loadDepEmployees();
        	
            $scope.selectedJobDateSer = new Date();
            $scope.selectedJobDate = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.selectedJobDateToSer = new Date();
            $scope.searchJobDateSer = null;
            $scope.searchJobDate = null;
            $scope.searchJobDateTo = null;
            $scope.searchJobDateToSer = null;
            $scope.selectedJobDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.searchJobId = null;
            $scope.searchJobTitle = null;
            $scope.searchCriteria = {};
            $scope.searchSite = null;
            $scope.searchEmployee = null;
            $scope.searchStatus = null;
            $scope.searchProject = null;
            $scope.localStorage = null;
            $scope.searchCriteria.columnName =null;
            $scope.selectedJobDate = null;
            $scope.selectedJobDateTo = null;
            $scope.filter = false;
            $scope.clearField = true;
            $scope.loadEmployee();

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


        //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.init();
             $scope.initPage();
             //$scope.setPage(1);
         }
         $scope.initList = function(){
                        $scope.loadPageTop();
                        $scope.setPage(1);
                        $scope.loadJobStatuses();
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
            $scope.loadingStart();
            JobComponent.updateTicket(cTicket).then(function(response) {
                $scope.loadingStop();
                console.log("Error saving ticket");
                console.log(response);
                if(response.errorStatus){
                    $scope.success = null;
                    $scope.error = 'ERROR';
                    $(".fade").removeClass("modal-backdrop");
                    $('#closeTicket').modal('hide');
                    $scope.showNotifications('top','center','danger',response.errorMessage);
                }else{
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Ticket status has been updated successfuly!!');
                    $(".fade").removeClass("modal-backdrop");
                    $('#closeTicket').modal('hide');
                    $state.reload();
                }
            }).catch(function(response){
                $scope.success = null;
                $scope.loadingStop();
                $(".fade").removeClass("modal-backdrop");
                $('#closeTicket').modal('hide');
                console.log("Error saving ticket");
                console.log(response);
                if(response.errorStatus){
                    $scope.error = 'ERROR';
                    $scope.showNotifications('top','center','danger',response.errorMessage);
                }else{
                    $scope.showNotifications('top','center','danger',response.message);
                }

            });
        }


        $rootScope.exportStatusObj = {};


        $scope.exportAllData = function(type){
                $scope.searchCriteria.exportType = type;
                $rootScope.exportStatusObj = {};
                $scope.typeMsg = type;
                $scope.downloader=true;
                $scope.downloaded = false;
                $scope.searchCriteria.isReport = true;
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

        $scope.downloaded = false;

        $scope.clsDownload = function(){
          $scope.downloaded = true;
          $rootScope.exportStatusObj = {};
        }

        $scope.cancel = function () {

             if($scope.checkStatus == 1){

                 $location.path('/tickets');

             }else{

                $location.path('/jobs');
             }


        };

        $scope.resetDate = function(){
            $scope.selectScheduleEndDate= "";
        }
        $scope.clearSiteEmp = function(){
        	if($scope.sitesListOne || $scope.empListOne){
        		$scope.sitesListOne = {};
            	$scope.empListOne = {};	
        	}
        	
        }
        $scope.clearEmp = function(){
        	if($scope.empListOne){
        	   $scope.empListOne = {};  
        	}
        }


    });
