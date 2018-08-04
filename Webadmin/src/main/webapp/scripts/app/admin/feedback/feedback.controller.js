'use strict';

angular.module('timeSheetApp')
    .controller('FeedbackController', function ($rootScope, $scope, $state, $timeout,
     ProjectComponent, SiteComponent, LocationComponent,FeedbackComponent,
      $http,$stateParams,$location,$interval,$filter) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.averageRating ='0';
        $scope.feedbackCount ='0';
        $scope.readOnly = true;
        $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
        $scope.series = ['Series A'];
        $scope.selectedFromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.pager = {};


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

        $scope.selectedProject = {};

        $scope.selectedSite = {};

        $scope.selectedBlock = null;

        $scope.selectedFloor = null;

        $scope.selectedZone  = null;

        $scope.clientId = null;

        $scope.siteId = null;

        $scope.feedbackReport = {};

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

                $scope.searchCriteria.siteId = $scope.selectedSite.id;
                LocationComponent.search($scope.searchCriteria).then(function (data) {
                    $scope.filteredLocations = data.transactions;
                    console.log('searchLocations- ', $scope.filteredLocations);

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

        $scope.genZoneReport = function(client,site,block, floor, zone, $form) {

                $scope.clientId = client;
                $scope.siteId = site;
                $scope.selectedBlock = block;
                $scope.selectedFloor = floor;
                $scope.selectedZone = zone;

                //document.getElementById('searchForm').submit();

                $scope.search();
        };

        $scope.feedbackListLoader = true;

        $scope.search = function () {

            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            //if(!$scope.searchCriteria) {
                var searchCriteria = {
                    currPage : currPageVal
                }
                $scope.searchCriteria = searchCriteria;
           // }

            $scope.searchCriteria.currPage = currPageVal;
             $scope.searchCriteria.findAll = false;
            console.log('Selected feedback' + $scope.selectedLocation);

            if($scope.selectedDateFrom){
                $scope.searchCriteria.checkInDateTimeFrom = $scope.selectedDateFrom;
                console.log("From date found");
                console.log($scope.searchCriteria.checkInDateTimeFrom)


            }else{
                $scope.searchCriteria.checkInDateTimeFrom = new Date();
                console.log("From date not found")
                console.log($scope.searchCriteria.checkInDateTimeFrom)

            }

            if($scope.selectedDateTo){
                $scope.searchCriteria.checkInDateTimeTo = $scope.selectedDateTo;
                console.log("To date found")
                console.log($scope.searchCriteria.checkInDateTimeTo)

            }else{
                $scope.searchCriteria.checkInDateTimeTo= new Date();
                console.log("To date not found")
                console.log($scope.searchCriteria.checkInDateTimeTo)
            }


            if(!$scope.selectedProject) {
                /*if($rootScope.searchCriteriaFeedback) {
                    $scope.searchCriteria = $rootScope.searchCriteriaFeedback;
                }else {*/
                    $scope.searchCriteria.findAll = true;
                /*}*/

            }else {
                if($scope.selectedProject.id) {

                    $scope.searchCriteria.projectId = $scope.selectedProject.id;
                }
                else if($scope.clientId){

                  $scope.searchCriteria.projectId = $scope.clientId;
                }
                else {
                    $scope.searchCriteria.projectId = 0;
                }
                if($scope.selectedSite.id) {
                     $scope.searchCriteria.siteId = $scope.selectedSite.id;
                }
                else if($scope.siteId){
                     $scope.searchCriteria.siteId = $scope.siteId ;
                }
                else {
                    $scope.searchCriteria.siteId = 0;
                }
                if($scope.selectedBlock) {
                     $scope.searchCriteria.block = $scope.selectedBlock;
                }
                else {
                    $scope.searchCriteria.block = "";
                }
                if($scope.selectedFloor) {
                    $scope.searchCriteria.floor = $scope.selectedFloor;
                }
                else {
                    $scope.searchCriteria.floor = "";
                }
                if($scope.selectedZone) {
                     $scope.searchCriteria.zone = $scope.selectedZone;
                }
                else {
                    $scope.searchCriteria.zone = "";
                }

            }


              $scope.feedbackReport = {};
              $scope.feedbackListLoader = false;
              $scope.feedbackListData = false;
              $rootScope.loadingStart();
            console.log('Search Criteria : ', $scope.searchCriteria);
            FeedbackComponent.reports($scope.searchCriteria).then(function (data) {
                    $scope.feedbackReport = data;
                    $scope.feedbackListLoader = true;
                    $rootScope.loadingStop();
                    var qLength = ($scope.feedbackReport.questionRatings).length;
                    if(qLength > 0){

                        $scope.feedbackListData = true;
                    }

                    console.log('feedback report - ' + JSON.stringify($scope.feedbackReport));
                    $scope.averageRating = $scope.feedbackReport.overallRating;
                    $scope.feedbackCount = $scope.feedbackReport.feedbackCount;



                $scope.hide = true;
                //console.log('weeklyZone data - ' + $scope.feedbackReport.weeklyZone.length);
                $scope.labels = [];
                $scope.data = [];
                $scope.label = [];
                $scope.datas = [];


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




                }
            }).catch(function(res){
                $rootScope.loadingStop();
                $scope.feedbackListLoader = true;
                $scope.showNotifications('top','center','danger','Cannot Load Feedback');
            });

        };

        $scope.showNotifications= function(position,alignment,color,msg){
                    demo.showNotification(position,alignment,color,msg);
                }


        $scope.printDiv = function(printable) {
            var printContents = document.getElementById(printable).innerHTML;
            var popupWin = window.open('', '_blank', 'width=1400,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link href="../assets/css/bootstrap.min.css" type="text/css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="../assets/css/custom.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
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



        $scope.clearFilter = function() {
            $scope.selectedSite = {};
            $scope.selectedProject = {};
            $scope.searchCriteria = {};
            //$rootScope.searchCriteriaSite = null;
            $scope.averageRating = '0';
            $scope.feedbackCount ='0';
            $scope.selectedBlock = null;
            $scope.selectedFloor = null;
            $scope.selectedZone  = null;
            $scope.labels = [];
            $scope.data = [];
            $scope.label = [];
            $scope.datas = [];
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
