'use strict';

angular.module('timeSheetApp')
    .controller('FeedbackSetupController', function ($rootScope, $scope, $state, $timeout, FeedbackComponent,ProjectComponent,SiteComponent, LocationComponent, $http, $stateParams, $location) {
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

        $scope.searchCriteria = {

        }

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

        $scope.feedbackMasterList;

        $scope.init = function(){
	        $scope.loading = true;
	        $scope.loadProjects();
	        //$scope.loadFeedbackMasters();
	        //$scope.search();
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
    			$scope.clearFilter();
    			$scope.loadFeedbackItems();
        }

        $scope.loadFeedbackMappings = function () {
	    		console.log('called loadFeedbackMappings');
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

        //------
        $scope.pageSizes = [{
            value: 10
        }, {
            value: 15
        }, {
            value: 20
        }];

        $scope.sort = $scope.pageSizes[0];
        $scope.pageSort = $scope.pageSizes[0].value;

        $scope.hasChanged = function(){
            alert($scope.sort.value)
            $scope.pageSort = $scope.sort.value;
            $scope.search();
        }

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isAscOrder = true;
            $scope.search();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isAscOrder = false;
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
            console.log($scope.searchCriteria);
            //-------
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }


            FeedbackComponent.searchFeedbackMapping($scope.searchCriteria).then(function (data) {
                $scope.feedbackMappingList = data.transactions;
                $scope.feedbackMappingListLoader = true;
                console.log($scope.feedbackMappingList);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                $scope.loading = false;

                //------
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

                if($scope.feedbackMasterList && $scope.feedbackMasterList.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.feedbackMasterList.length;
                    $scope.totalCountPages = data.totalCount;

                    if($scope.showCurrPage != data.totalPages){
                        $scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1; // 1 to // 11 to

                        $scope.pageEndIntex = $scope.pageEntries * $scope.showCurrPage; // 10 entries of 52 // 10 * 2 = 20 of 52 entries

                    }else if($scope.showCurrPage === data.totalPages){
                        $scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1;
                        $scope.pageEndIntex = $scope.totalCountPages;
                    }
                }



                if($scope.feedbackMasterList == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
                $scope.hide = true;
            });
            $rootScope.searchCriteriaFeedback = $scope.searchCriteria;
            if($scope.pages.currPage == 1) {
                $scope.firstStyle();
            }
        };

        //----
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
            var first = document.getElementById('#first');
            var ele = angular.element(first);
            ele.addClass('disabledLink');
            var previous = document.getElementById('#previous');
            ele = angular.element(previous);
            ele.addClass('disabledLink');
            if($scope.pages.totalPages > 1) {
                var nextSitePage = document.getElementById('#next');
                var ele = angular.element(next);
                ele.removeClass('disabledLink');
                var lastSitePage = document.getElementById('#lastSitePage');
                ele = angular.element(lastSitePage);
                ele.removeClass('disabledLink');
            }

        }

        $scope.previous = function() {
            console.log("Calling previous")

            if($scope.pages.currPage > 1) {
                $scope.pages.currPage = $scope.pages.currPage - 1;
                if($scope.pages.currPage == 1) {
                    var first = document.getElementById('#first');
                    var ele = angular.element(first);
                    ele.addClass('disabled');
                    var previous = document.getElementById('#previous');
                    ele = angular.element(previous);
                    ele.addClass('disabled');
                }
                var next = document.getElementById('#next');
                var ele = angular.element(next);
                ele.removeClass('disabled');
                var lastSitePage = document.getElementById('#last');
                ele = angular.element(last);
                ele.removeClass('disabled');
                $scope.search();
            }

        };

        $scope.next = function() {
            console.log("Calling next")

            if($scope.pages.currPage < $scope.pages.totalPages) {
                $scope.pages.currPage = $scope.pages.currPage + 1;
                if($scope.pages.currPage == $scope.pages.totalPages) {
                    var next = document.getElementById('#next');
                    var ele = angular.element(next);
                    ele.addClass('disabled');
                    var last = document.getElementById('#last');
                    ele = angular.element(last);
                    ele.addClass('disabled');
                }
                var first = document.getElementById('#first')
                var ele = angular.element(first);
                ele.removeClass('disabled');
                var previous = document.getElementById('#previous')
                ele = angular.element(previous);
                ele.removeClass('disabled');
                $scope.search();
            }

        };

        $scope.last = function() {
            console.log("Calling last")
            if($scope.pages.currPage < $scope.pages.totalPages) {
                $scope.pages.currPage = $scope.pages.totalPages;
                if($scope.pages.currPage == $scope.pages.totalPages) {
                    var next = document.getElementById('#next');
                    var ele = angular.element(next);
                    ele.addClass('disabled');
                    var last = document.getElementById('#last');
                    ele = angular.element(last);
                    ele.addClass('disabled');
                }
                var first = document.getElementById('#first');
                var ele = angular.element(first);
                ele.removeClass('disabled');
                var previous = document.getElementById('#previous');
                ele = angular.element(previous);
                ele.removeClass('disabled');
                $scope.search();
            }

        };

        $scope.clearFilter = function() {
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaSite = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
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


    });


