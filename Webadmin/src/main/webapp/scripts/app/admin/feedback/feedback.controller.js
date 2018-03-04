'use strict';

angular.module('timeSheetApp')
    .controller('FeedbackController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent, LocationComponent,FeedbackComponent, $http,$stateParams,$location,$interval) {
    		
    	
    		$scope.pages = { currPage : 1};
        
        $scope.searchCriteria = {
        		
        }
        
        $scope.feedbackList;
        
        $scope.selectedProject;
        
        $scope.selectedSite;
        
        $scope.selectedBlock;
        
        $scope.selectedFloor;
        
        $scope.selectedZone;
        
        $scope.feedbackReport;
        
        $scope.now = new Date()

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };

        $('#dateFilterFrom').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);
            $scope.selectedDateFrom=e.date._d;

        });
        $('#dateFilterTo').on('dp.change', function(e){
            console.log(e.date);

            console.log(e.date._d);
            $scope.selectedDateTo=e.date._d;

        });        
        
        $scope.init = function(){
	        $scope.loading = true;
	        $scope.loadProjects();
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
	    
	    $scope.refreshPage = function() {
			$scope.clearFilter();
			$scope.loadFeedbacks();
	    }	
	    
	    $scope.loadFeedbacks = function () {
	    		console.log('called loadFeedbacks');
	    		$scope.search();
	    };      
	    
	    $scope.search = function () {
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            if(!$scope.searchCriteria) {
                var searchCriteria = {
                    currPage : currPageVal
                }
                $scope.searchCriteria = searchCriteria;
            }

            $scope.searchCriteria.currPage = currPageVal;
            console.log('Selected feedback' + $scope.selectedLocation);

            if($scope.selectedDateFrom){
                $scope.searchCriteria.checkInDateTimeFrom = $scope.selectedDateFrom;
                $scope.searchCriteria.findAll = false;
                console.log("From date found");
                console.log($scope.searchCriteria.checkInDateTimeFrom)


            }else{
                $scope.searchCriteria.checkInDateTimeFrom = new Date();
                console.log("From date not found")
                console.log($scope.searchCriteria.checkInDateTimeFrom)

            }

            if($scope.selectedDateTo){
                $scope.searchCriteria.checkInDateTimeTo = $scope.selectedDateTo;
                $scope.searchCriteria.findAll = false;
                console.log("To date found")
                console.log($scope.searchCriteria.checkInDateTimeTo)

            }else{
                $scope.searchCriteria.checkInDateTimeTo= new Date();
                console.log("To date not found")
                console.log($scope.searchCriteria.checkInDateTimeTo)
            }
            
            
            if(!$scope.selectedProject) {
                if($rootScope.searchCriteriaFeedback) {
                    $scope.searchCriteria = $rootScope.searchCriteriaFeedback;
                }else {
                    $scope.searchCriteria.findAll = true;
                }

            }else {
                if($scope.selectedProject) {
                    $scope.searchCriteria.findAll = false;
                    $scope.searchCriteria.projectId = $scope.selectedProject.id;
                    $scope.searchCriteria.siteId = $scope.selectedSite.id;
                    $scope.searchCriteria.block = $scope.selectedBlock;
                    $scope.searchCriteria.floor = $scope.selectedFloor;
                    $scope.searchCriteria.zone = $scope.selectedZone;
                }else {
                    $scope.searchCriteria.projectId = 0;
                }
            }
            console.log($scope.searchCriteria);
            FeedbackComponent.reports($scope.searchCriteria).then(function (data) {
                //$scope.feedbackList = data.transactions;
            		$scope.feedbackReport = data;
            		console.log('feedback report - ' + JSON.stringify($scope.feedbackReport));
//                $scope.pages.currPage = data.currPage;
//                $scope.pages.totalPages = data.totalPages;
//                $scope.loading = false;
//                if($scope.feedbackList == null){
//                    $scope.pages.startInd = 0;
//                }else{
//                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
//                }
//
//                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
//                $scope.pages.totalCnt = data.totalCount;
                $scope.hide = true;
            });
            $rootScope.searchCriteriaFeedback = $scope.searchCriteria;
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
        
        $scope.cancelFeedback = function () {
        		$location.path('/feedback');
        };
        
        $scope.initCalender();

    })
