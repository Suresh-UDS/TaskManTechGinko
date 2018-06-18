'use strict';

angular.module('timeSheetApp')
    .controller('FeedbackController', function ($rootScope, $scope, $state, $timeout,
     ProjectComponent, SiteComponent, LocationComponent,FeedbackComponent,
      $http,$stateParams,$location,$interval,$filter) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.averageRating ='0';
        $scope.readOnly = true;
        $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
        $scope.labels = [];
        $scope.series = ['Series A'];
        $scope.selectedFromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.pager = {};
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

        $scope.searchCriteria = {};

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

	    		//$scope.search();
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
                    $scope.averageRating = $scope.feedbackReport.overallRating;

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
                $scope.options = [];
//                $scope.options = {}
//                $scope.options.legend = { "display" : true}
//                $scope.option = {}
//                $scope.option.legend = { "display" : true}
                if($scope.feedbackReport.weeklyZone && $scope.feedbackReport.weeklyZone.length > 0) {

                    // Line chart data
                    
                    var lineZoneDateWiseRating = $scope.feedbackReport.weeklyZone;
                    //var chartZoneDateWiseDataArr = [];
                    for(var i =0;i<lineZoneDateWiseRating.length; i++) {
                    		$scope.labels.push(lineZoneDateWiseRating[i].date);
                    		$scope.data.push(lineZoneDateWiseRating[i].rating);
                    }

                    //$scope.data.push(chartZoneDateWiseDataArr);
                    //$scope.data = chartZoneDateWiseDataArr;

                    console.log('Line chart labels - ' + JSON.stringify($scope.labels));
                    console.log('Line chart data - ' + JSON.stringify($scope.data));

                     // Doughnut chart data

                    var doughnutZoneDateWiseRating = $scope.feedbackReport.weeklyZone;
                    for(var i =0;i<doughnutZoneDateWiseRating.length; i++) {
                    		$scope.label.push(doughnutZoneDateWiseRating[i].date);
                    		$scope.datas.push(doughnutZoneDateWiseRating[i].rating);
                    }
                    
                    $scope.chartOptions = { legend: { display: true } };

                                          

                    console.log('Doughnut chart labels - ' + JSON.stringify($scope.label));
                    console.log('Doughnut chart data - ' + JSON.stringify($scope.datas));
                    console.log('Doughnut chart Legend - ' + JSON.stringify($scope.options));

                }else {

                    // Line chart data

                    var lineZoneWiseRating = $scope.feedbackReport.weeklySite;
                    //var chartZoneWiseDataArr = [];

                    for(var i =0;i<lineZoneWiseRating.length; i++) {
                    		$scope.labels.push(lineZoneWiseRating[i].zoneName);
                    		$scope.data.push(lineZoneWiseRating[i].rating);
                    }

                    //$scope.data.push(chartZoneWiseDataArr);
                    //$scope.data = chartZoneWiseDataArr;

                    console.log('Line chart labels - ' + JSON.stringify($scope.labels));
                    console.log('Line chart data - ' + JSON.stringify($scope.data));

                     // Doughnut chart data

                    var doughnutZoneWiseRating = $scope.feedbackReport.weeklySite;
                    //var doughnutZoneWiseDataArr = [];
                    for(var i =0;i<doughnutZoneWiseRating.length; i++) {
                    		$scope.label.push(doughnutZoneWiseRating[i].zoneName);
                    		$scope.datas.push(doughnutZoneWiseRating[i].rating);
                    }

                    //$scope.datas.push(zoneDateWiseDataArr);

                     $scope.chartOptions = { legend: { display: true } };

                    console.log('Doughnut chart labels - ' + JSON.stringify($scope.label));
                    console.log('Doughnut chart data - ' + JSON.stringify($scope.datas));
                    console.log('Doughnut chart Legend - ' + JSON.stringify($scope.options));

                    

                }
            });
            /*$rootScope.searchCriteriaFeedback = $scope.searchCriteria;
            if($scope.pages.currPage == 1) {
                $scope.firstStyle();
            }*/
        };



       /* $scope.first = function() {
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

        };*/

        $scope.printDiv = function(printable) {
            var printContents = document.getElementById(printable).innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;

        }

        $scope.printPage = function () {
            window.print();
        }


        $scope.printToCart = function(printSectionId) {
            var innerContents = document.getElementById(printSectionId).innerHTML;
            var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="assets/css/material-dashboard.css" /></head><body onload="window.print()">' + innerContents + '</html>');
            popupWinindow.document.close();
        }

       /* $scope.next = function() {
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

        };*/

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

    });

/*.controller("RatingCtrl", function($scope) {
  $scope.user1 = {rating:5};
  $scope.user2 = {rating:2};
  $scope.user3 = {rating:1};
  $scope.averageRating = 0;

  $scope.$watch(function(){return $scope.user1.rating + $scope.user2.rating + $scope.user3.rating;}, function(oldVal, newVal) {
        if (newVal) { updateAverageRating(); }
  });

  function updateAverageRating(){ $scope.averageRating = ($scope.user1.rating + $scope.user2.rating + $scope.user3.rating) / 3; }

  $scope.isReadonly = true;
  $scope.rateFunction = function(rating) {
    console.log("Rating selected: " + rating);
  };
})*/
