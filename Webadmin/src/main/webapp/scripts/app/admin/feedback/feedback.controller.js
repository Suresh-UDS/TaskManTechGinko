'use strict';

angular.module('timeSheetApp')
    .controller('FeedbackController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent, LocationComponent,FeedbackComponent, $http,$stateParams,$location,$interval) {
        $rootScope.loginView = false;
        $scope.readOnly = true;
        $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
        $scope.labels = [];
        $scope.series = ['Series A'];
        $scope.data = [
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        };


        $scope.label = [];
        $scope.datas = [];


        var vm = this;
        vm.numRecords = 6;
        vm.page = 1;

        vm.items = []
        for (var i = 0; i < 1000; ++i) {
            vm.items.push('item : ' + i);
        }

        vm.next = function(){
            vm.page = vm.page + 1;
        };

        vm.back = function(){
            vm.page = vm.page - 1;
        };



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

	    $scope.searchLocations = function () {
	    		console.log('searchLocations- '+ $scope.selectedSite.id);
	    		$scope.searchCriteria.siteId = $scope.selectedSite.id;
	    		LocationComponent.search($scope.searchCriteria).then(function (data) {
	    			$scope.filteredLocations = data.transactions;
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

	    $scope.genZoneReport = function(block, floor, zone, $form) {
	    		$scope.selectedBlock = block;
	    		$scope.selectedFloor = floor;
	    		$scope.selectedZone = zone;
	    		//document.getElementById('searchForm').submit()

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
            console.log("Search Criteria : "+$scope.searchCriteria);
            FeedbackComponent.reports($scope.searchCriteria).then(function (data) {
                $scope.feedbackList = data.transactions;
            		$scope.feedbackReport = data;
            		$scope.feedbackListLoader = true;
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
                console.log('weeklyZone data - ' + $scope.feedbackReport.weeklyZone.length);
                $scope.labels = [];
                $scope.data = [];
                $scope.label = [];
                $scope.datas = [];
                if($scope.feedbackReport.weeklyZone && $scope.feedbackReport.weeklyZone.length > 0) {
                    var zoneDateWiseRating = $scope.feedbackReport.weeklyZone;
                    var zoneDateWiseDataArr = [];
                    for(var i =0;i<zoneDateWiseRating.length; i++) {
                    		$scope.labels.push(zoneDateWiseRating[i].date);
                    		zoneDateWiseDataArr.push(zoneDateWiseRating[i].rating);
                    }
                    $scope.data.push(zoneDateWiseDataArr);

                    console.log('labels - ' + JSON.stringify($scope.labels));
                    console.log('data - ' + JSON.stringify($scope.data));
                    var zoneOverallRating = $scope.feedbackReport.weeklyZone;
                    for(var i =0;i<zoneOverallRating.length; i++) {
                    		$scope.label.push(zoneOverallRating[i].date);
                    		$scope.datas.push(zoneOverallRating[i].rating);
                    }
                    console.log('doughnut labels - ' + JSON.stringify($scope.label));
                    console.log('doughnut data - ' + JSON.stringify($scope.datas));

                }else {
                    var zoneWiseRating = $scope.feedbackReport.weeklySite;
                    var zoneWiseDataArr = [];
                    for(var i =0;i<zoneWiseRating.length; i++) {
                    		$scope.labels.push(zoneWiseRating[i].zoneName);
                    		zoneWiseDataArr.push(zoneWiseRating[i].rating);
                    }
                    $scope.data.push(zoneWiseDataArr);
                    var zoneDateWiseRating = $scope.feedbackReport.weeklySite;
                    var zoneDateWiseDataArr = [];
                    for(var i =0;i<zoneDateWiseRating.length; i++) {
                    		$scope.label.push(zoneDateWiseRating[i].zoneName);
                    		$scope.datas.push(zoneDateWiseRating[i].rating);
                    }
                    //$scope.datas.push(zoneDateWiseDataArr);

                }
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

    })
