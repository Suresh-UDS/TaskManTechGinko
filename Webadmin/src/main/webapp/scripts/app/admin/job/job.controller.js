'use strict';

angular.module('timeSheetApp')
		    .controller(
				'JobController',
				function($scope, $rootScope, $state, $timeout, JobComponent,AssetComponent,
						ProjectComponent, SiteComponent,EmployeeComponent, $http, $stateParams,
						$location) {
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
        $scope.status =[{ "name" : "OPEN"},{ "name" : "ASSIGNED"},{ "name" : "INPROGRESS"},{ "name" : "COMPLETED"}]
        $scope.isEdit = !!$stateParams.id

        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
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
        		$scope.selectedLocation = {id:data.location,name:data.locationName};
        		$scope.selectedAsset = {id:data.asset,title:data};
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
        	if($scope.isEdit){
        		$scope.editJob();
        	}else {
            	$scope.job = {};
            	$scope.job.scheduleDailyExcludeWeekend = true;
            	$scope.job.schedule = 'ONCE';
            	$scope.job.active = 'YES';
        	}
        }



        $scope.saveJob = function () {
        	$scope.error = null;
        	$scope.success =null;
        	$scope.errorProjectExists = null;
        	$scope.job.siteId = $scope.selectedSite.id
            $scope.job.locationId = $scope.selectedLocation.id;
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
	        }

        	if($scope.selectedJob){
        		$scope.searchCriteria.jobTitle = $scope.selectedJob;
        	}

        	console.log($scope.searchCriteria);
        	JobComponent.search($scope.searchCriteria).then(function (data) {
        		$scope.jobs = data.transactions
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
    });
