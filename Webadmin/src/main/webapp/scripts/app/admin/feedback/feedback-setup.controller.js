'use strict';

angular.module('timeSheetApp')
    .controller('FeedbackSetupController', function ($rootScope, $scope, $state, $timeout,
     FeedbackComponent,ProjectComponent,SiteComponent, LocationComponent, $http, $stateParams, 
     $location,PaginationComponent) {
        $rootScope.loginView = false;
    	$scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.feedbackMappingList;

        $scope.selectedProject;

        $scope.selectedSite;

        $scope.selectedBlock;

        $scope.selectedFloor;

        $scope.selectedZone;

        $scope.selectedFeedbackMaster;

        $scope.feedbackMapping ={};

        $scope.projects;

        $scope.sites;

        $scope.blocks;

        $scope.floors;

        $scope.zones;

        $scope.searchCriteria = {};
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedBlock = null;
        $scope.selectedFloor = null;
        $scope.selectedZone = null;
        $scope.selectedLocation = null;

        $scope.feedbackMasterList;

        $scope.pageSort = 10;

        $scope.init = function(){
	        $scope.loading = true;
	        //$scope.loadFeedbackMasters();
	        $scope.loadFeedbackMappings();
        };

        $scope.loadProjects = function () {
        		ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
            });
        };

        $scope.loadSites = function () {
        		ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
        			$scope.selectedSite = null;
                $scope.sites = data;
            });
        };

        $scope.loadBlocks = function () {
        		console.log('selected project -' + $scope.selectedProject.id + ', site -' + $scope.selectedSite.id)
	    		LocationComponent.findBlocks($scope.selectedProject.id,$scope.selectedSite.id).then(function (data) {
	    			$scope.selectedBlock = null;
	            $scope.blocks = data;
	        });
	    };

        $scope.loadFloors = function () {
	    		LocationComponent.findFloors($scope.selectedProject.id,$scope.selectedSite.id,$scope.selectedBlock).then(function (data) {
	    			$scope.selectedFloor = null;
	            $scope.floors = data;
	        });
	    };

        $scope.loadZones = function () {
        		console.log('load zones - ' + $scope.selectedProject.id +',' +$scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
	    		LocationComponent.findZones($scope.selectedProject.id,$scope.selectedSite.id,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
	    			$scope.selectedZone = null;
	            $scope.zones = data;
	        });
	    };


	    $scope.loadFeedbackMasters = function() {
	    		if($scope.selectedProject) {
		    		$scope.searchCriteria.projectId = $scope.selectedProject.id;
	    		}
	    		if($scope.selectedSite) {
		    		$scope.searchCriteria.siteId = $scope.selectedSite.id;
	    		}
	    		if(!$scope.selectedProject && !$scope.selectedSite) {
	    			$scope.searchCriteria.findAll = true;
	    		}
        		FeedbackComponent.searchFeedbackMaster($scope.searchCriteria).then(function(data) {
        			$scope.feedbackMasterList = data.transactions;
        		})
        }


        $scope.refreshPage = function() {
    			
    			$scope.loadFeedbackMappings();
        }

        $scope.loadFeedbackMappings = function () {
	    		console.log('called loadFeedbackMappings');
                $scope.clearFilter();
	    		$scope.search();
	    };

        $scope.loadFeedbackMapping = function(id) {
        		console.log('loadFeedbackMapping -' + id);
        		FeedbackComponent.findOneFeedbackMapping(id).then(function (data) {
        			$scope.feedbackMapping = data;
        			console.log('Feedback mapping retrieved - ' + JSON.stringify($scope.feedbackMapping));

            });

        };

        $scope.updateFeebackMapping = function () {
        		console.log('Feedback mapping details - ' + JSON.stringify($scope.feedbackMapping));

        		FeedbackComponent.updateFeedbackMapping($scope.feedbackMapping).then(function () {
	            	$scope.success = 'OK';
	            	$location.path('/feedback-setup');
	            }).catch(function (response) {
	                $scope.success = null;
	                console.log('Error - '+ response.data);
	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                    $scope.errorChecklistExists = true;
	                } else if(response.status === 400 && response.data.message === 'error.validation'){
	                	$scope.validationError = true;
	                	$scope.validationErrorMsg = response.data.description;
	                } else {
	                    $scope.error = 'ERROR';
	                }
            });
        };

        $scope.saveFeedbackMapping = function(){
        		$scope.feedbackMapping.projectName = $scope.selectedProject.name;
        		$scope.feedbackMapping.projectId = $scope.selectedProject.id;
        		$scope.feedbackMapping.siteId = $scope.selectedSite.id;
        		$scope.feedbackMapping.siteName = $scope.selectedSite.name;
        		$scope.feedbackMapping.block = $scope.selectedBlock;
        		$scope.feedbackMapping.floor = $scope.selectedFloor;
        		$scope.feedbackMapping.zone = $scope.selectedZone;
        		$scope.feedbackMapping.feedback = $scope.selectedFeedback;
            console.log("Before pushing feedback mapping to server");
            console.log(JSON.stringify($scope.feedbackMapping));
            FeedbackComponent.createFeedbackMapping($scope.feedbackMapping).then(function(){
            		console.log("success");
  	        		$location.path('/feedback-setup');
  	        		//$scope.loadFeedbackItems();
  	        }).catch(function (response) {
  	            $scope.success = null;
  	            console.log(response.data);
  	            if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
  	                $scope.errorFeedbackMappingExists = true;
  	            } else if(response.status === 400 && response.data.message === 'error.validation'){
  	            	$scope.validationError = true;
  	            	$scope.validationErrorMsg = response.data.description;
  	            } else {
  	                $scope.error = 'ERROR';
  	            }
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
            //$scope.loadModuleActions();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            $scope.search();
            //$scope.loadModuleActions();
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
            console.log('Selected feedback' + $scope.selectedFeedback);

            if(!$scope.selectedFeedback) {
                if($rootScope.searchCriteriaFeedback) {
                    $scope.searchCriteria = $rootScope.searchCriteriaFeedback;
                }else {
                    $scope.searchCriteria.findAll = true;
                }

            }else {
                if($scope.selectedFeedback) {
                    $scope.searchCriteria.findAll = false;
                    $scope.searchCriteria.feedbackId = $scope.selectedFeedback.id;
                    $scope.searchCriteria.title = $scope.selectedFeedback.title;
                    console.log('selected user role id ='+ $scope.selectedFeedback);
                }else {
                    $scope.searchCriteria.feedbackId = 0;
                }
            }
          

             $scope.searchCriteria.currPage = currPageVal;
            $scope.searchCriteria.findAll = false;

             if( !$scope.selectedProject && !$scope.selectedSite 
                &&  !$scope.selectedStatus) {
                $scope.searchCriteria.findAll = true;
            }

        
                if($scope.selectedTitle)
                {
                    $scope.searchCriteria.ticketTitle = $scope.selectedTitle;
                    console.log('selected Title ='+ $scope.searchCriteria.ticketTitle);
                }
                if($scope.selectedDescription)
                {
                    $scope.searchCriteria.ticketDescription = $scope.selectedDescription;
                    console.log('selected ticket Description ='+ $scope.searchCriteria.ticketDescription);
                }
                

                if($scope.selectedProject) {
                    $scope.searchCriteria.projectId = $scope.selectedProject.id;
                
                }

                if($scope.selectedSite) {
                    $scope.searchCriteria.siteId = $scope.selectedSite.id;
                    }
                if($scope.selectedBlock) {
                    $scope.searchCriteria.block = $scope.selectedBlock;
                }
                if($scope.selectedFloor) {
                    $scope.searchCriteria.floor = $scope.selectedFloor;
                }
                if($scope.selectedZone) {
                    $scope.searchCriteria.zone = $scope.selectedZone;
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

               console.log("search criteria",$scope.searchCriteria);
                     $scope.feedbackMappingList = '';
                     $scope.feedbackMappingListLoader = false;
                     $scope.loadPageTop();


            FeedbackComponent.searchFeedbackMapping($scope.searchCriteria).then(function (data) {
                $scope.feedbackMappingList = data.transactions;
                $scope.feedbackMappingListLoader = true;

                 /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log('feedback Mapping list -' + JSON.stringify($scope.feedbackMappingList));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                $scope.loading = false;

                if($scope.feedbackMappingList && $scope.feedbackMappingList.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.feedbackMappingList.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                }

            

               
            });
          
        };

        

        $scope.clearFilter = function() {
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.selectedBlock = null;
            $scope.selectedFloor = null;
            $scope.selectedZone = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaSite = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
        };

        $scope.cancelFeedbackMapping = function () {
        		$location.path('/feedback-setup');
        };

      //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.init();


         }

       //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);
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


