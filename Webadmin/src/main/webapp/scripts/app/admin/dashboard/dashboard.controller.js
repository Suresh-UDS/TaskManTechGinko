'use strict';

angular.module('timeSheetApp')
    .directive('hcChartReading', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                title: '@',
                data: '='
            },
            link: function (scope, element) {

                console.log(scope.data);

                // $scope.sampleData = data[0];
                scope.readings = scope.data.readings;
                scope.pushingItems = {"name":"Readings","data":[],"color" :{
                    linearGradient: {
                      x1: 0,
                      x2: 0,
                      y1: 0,
                      y2: 1
                    },
                    stops: [
                      [0, '#f699ff'],
                      [1, '#d71ee8']
                    ]
                  }};
                scope.xAxis = []
                if(scope.readings.length > 0){

                    for(var i=0; i < scope.readings.length; i++) {
                        var indexItm = [];
                        scope.xAxis.push(scope.readings[i].date);
                        scope.pushingItems.data.push(scope.readings[i].value);

                    }

                }
                else{

                    for(i=6;i>=0;i--){

                        var date = moment( new Date() );
                        date.subtract(i,'days');
                        scope.xAxis.push(date.format('Y-MM-D'));
                        scope.pushingItems.data.push(0);

                    }

                }
                console.log("Asset Reading chart directives -" +JSON.stringify(scope.pushingItems));

                Highcharts.chart(element[0], {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: scope.data.assetName
                    },
                    xAxis: {
                        categories: scope.xAxis,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Consumtion'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#FFF',
                        borderColor: '#ff9800',
                        borderRadius: 10,
                        borderWidth: 3
    /*
                        headerFormat: '<span style="font-size:10px">{point.key}</span><br>',
                        pointFormat: '<span style="color:{series.color};padding:0">{series.name}: </span><br>' +
                            '<b>{point.y:.1f} </b>',
                        footerFormat: '',
                        shared: true,
                        useHTML: true */
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [scope.pushingItems]
                });
            }
        };
    })
    .directive('guagesList', function ($timeout) {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                title: '@',
                data: '=',
                fromDirectiveFn: '=method'
            },
            link: function (scope, element, attrs) {

               var guageData = scope.data;

                if(!guageData.meterValue){

                    guageData.meterValue = 0;

                }

                element.parent().append('<div id="'+scope.data.id+'" class="col-lg-4 loadingGuage"></div>');

                $(element[0]).click(function(){

                    console.log(scope.data);

                    if(scope.data.data && scope.data.data.length > 0){

                        scope.fromDirectiveFn(scope.data);
                        $('#deleteModal').modal();

                    }

                })

                var guageChartInfo = {

                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },

                    title: {
                        text: scope.title
                    },

                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                        background: [{
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#FFF'],
                                    [1, '#333']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '109%'
                        }, {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#333'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 1,
                            outerRadius: '107%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#DDD',
                            borderWidth: 0,
                            outerRadius: '105%',
                            innerRadius: '103%'
                        }]
                    },

                    // the value axis
                    yAxis: {
                        min: 0,
                        max: 100,

                        minorTickInterval: 'auto',
                        minorTickWidth: 1,
                        minorTickLength: 10,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',

                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#666',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: scope.data.label
                        },
                        plotBands: [{
                            from: 0,
                            to: 25,
                            color: '#55BF3B' // green
                        }, {
                            from: 25,
                            to: 50,
                            color: '#DDDF0D' // yellow
                        }, {
                            from: 50,
                            to: 100,
                            color: '#DF5353' // red
                        }]
                    },

                    series: [{
                        name: scope.data.label,
                        data:  [guageData.meterValue],
                        tooltip: {
                            valueSuffix: " "+scope.data.unit
                        }
                    }]

                };

                scope.$watch('data.data', function(newValue, oldValue) {

                    console.log(newValue);

                });

                scope.$watch('data.meterValue', function(newValue, oldValue) {

                    guageChartInfo.series[0].data = [newValue];

                    Highcharts.chart(element[0], guageChartInfo);

                });

                $timeout(function(){

                    Highcharts.chart(element[0], guageChartInfo);

                });


            }
        };
    })
    .controller('DashboardController', function ($timeout,$scope,$rootScope,$filter,
        DashboardComponent,JobComponent,EmployeeComponent, $state,$http,$stateParams,$location,TicketComponent,
        SiteComponent,AttendanceComponent,getLocalDbStorage) {
        $rootScope.loginView = false;

        $scope.ready = false;

        $rootScope.currentReadings = {};

        if($rootScope.loginView == false){
            $(".content").removeClass("remove-mr");
            $(".main-panel").removeClass("remove-hght");
        }
    	$scope.selectedProject ={};
        $scope.selectedSite ={};
        $scope.siteCount;
        $scope.totalEmployeeCount;
        $scope.employeeCount;
        $scope.presentCount;
        $scope.absentCount;
        $scope.regionList=null;
        $scope.branchList=null;
        $scope.selectedRegion=null;
        $scope.selectedBranch = null;
        $scope.assetAvailability = {};
        $scope.siteFilterDisable = false;
        $scope.regionFilterDisable = false;
        $scope.branchFilterDisable = false;
        $scope.clientFilterDisable = false;

        $scope.assetOpenTicketsCount = [];
        $scope.assetSeverityTicketsCount = [];
        $scope.showAssetTicketPieChart = false;
        /** root scope (searchCriteria) **/
        $rootScope.searchFilterCriteria = {};

        $scope.selectedFromDate =  $filter('date')(new Date(), 'dd/MM/yyyy') ;
        $scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');

        /** root scope (searchCriteria) **/
        $rootScope.searchFilterCriteria.selectedFromDate = new Date();
        $rootScope.searchFilterCriteria.selectedToDate = new Date();
        $rootScope.searchFilterCriteria.projectId = null;
        $rootScope.searchFilterCriteria.projectName = null;
        $rootScope.searchFilterCriteria.regionId = null;
        $rootScope.searchFilterCriteria.region = null;
        $rootScope.searchFilterCriteria.branchId = null;
        $rootScope.searchFilterCriteria.branch = null;
        $rootScope.searchFilterCriteria.siteId = null;
        $rootScope.searchFilterCriteria.siteName = null;
        $rootScope.searchFilterCriteria.jobStatus = null;
        $rootScope.searchFilterCriteria.ticketStatus = null;
        $rootScope.searchFilterCriteria.quotStatus = null;
        $rootScope.searchFilterCriteria.empStatus = null;
        $rootScope.searchFilterCriteria.isDashboard = false;

        $scope.selectedFromDateSer =new Date();
        $scope.selectedToDateSer = new Date();

        $scope.result = {
        		assignedJobCount :0,
        		completedJobCount :0,
        		overdueJobCount :0,
        		totalJobCount: 0
        };

        $scope.guageResults = [
            {"title":"Fuel Consumtion","guageType":"FUEL METER","meterValue":0,"unit":"%","label":"Fuel","id":"fuelGuageContainer"},
            {"title":"Water Consumtion","guageType":"WATER METER","meterValue":0,"unit":"%","label":"Water","id":"waterGuageContainer"},
            {"title":"Power Loss","guageType":"ENERGY METER","meterValue":0,"unit":"Kwh","label":"Power","id":"powerGuageContainer"}
        ]

        $scope.init = function() {
            $scope.loadAllProjects();
            $scope.loadAllSites();
            $scope.loadAllEmployee();
            $scope.loadAllAttendanceCounts();
            $scope.loadQuotationReportCounts();
            $scope.loadJobReport();
            $scope.loadingStart();
            $scope.loadChartData();
            // $scope.loadTicketStatusFromInflux();
            // $scope.loadCharts();
            $scope.loadAllJobs();
            $scope.loadAllQuotations();
            $scope.loadAllTickets();
            $scope.assetTicketPieCharts();

        };

        $scope.buildGuages = function(){

            for(var i in $scope.guageResults){

                var searchCriteria = {};
                searchCriteria.fromDate = new Date;
                searchCriteria.toDate = new Date;
                searchCriteria.siteId = $scope.selectedSite.id;
                searchCriteria.assetTypeName = $scope.guageResults[i].guageType;

                $scope.loadGuageData(searchCriteria,$scope.guageResults[i]);

           }

        }

        $scope.clearGuageResults = function(){

            $scope.setCurrentReading ({});

            for(var i in $scope.guageResults){

                $scope.guageResults[i].data = [];
                $scope.guageResults[i].meterValue = 0;

            }

        }

        $scope.toggleGuageLoading = function(id,opt){

            var ele = $("#"+id);

            if(ele.length>0){

                if(opt){

                        ele.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>&nbsp;Loading.. ');
                }
                else{

                    ele.html('&nbsp;');

                }

            }


        }

        $scope.loadGuageData = function(searchCriteria,guageResultObject){

            $scope.toggleGuageLoading(guageResultObject.id,1);

            DashboardComponent.getReadingsFromDate(searchCriteria).then(function(data) {

                $scope.toggleGuageLoading(guageResultObject.id,0);

                guageResultObject.data = data;

                var meterValue = 0;

                var parentMeterValue = 0;

                var difference = 0;

                var isRelationshipBased = false;

                var closingValue = 0;

                var parentMeterClosingValue = 0;

                for(var i in guageResultObject.data){

                    for(var j in guageResultObject.data[i].readings){

                        if(guageResultObject.data[i].readings[j].value){

                            meterValue += guageResultObject.data[i].readings[j].value;
                            closingValue += guageResultObject.data[i].readings[j].closingValue;

                        }

                        if(i == 0){

                            parentMeterValue = meterValue;

                            if(guageResultObject.data[i].parent){

                                isRelationshipBased = true;

                                parentMeterClosingValue = closingValue;

                            }

                        }

                    }

                }

                if(searchCriteria.assetTypeName == "ENERGY METER"){

                    if(isRelationshipBased){

                        difference = meterValue - parentMeterValue;

                        guageResultObject.meterValue = difference == 0 ? 0 : (((parentMeterValue-difference)/parentMeterValue) * 100);

                    }
                    else{

                        guageResultObject.meterValue = meterValue - parentMeterValue;

                    }

                }
                else{

                    if(isRelationshipBased && meterValue > parentMeterValue){

                        //guageResultObject.meterValue = meterValue - parentMeterValue;

                        guageResultObject.meterValue = ( parentMeterValue / parentMeterClosingValue ) * 100

                    }
                    else{

                        guageResultObject.meterValue = meterValue;

                        guageResultObject.meterValue = ( guageResultObject.meterValue / closingValue ) * 100

                    }

                }

                if(isNaN(guageResultObject.meterValue)){

                    guageResultObject.meterValue = 0;

                }

                guageResultObject.meterValue = parseFloat(guageResultObject.meterValue.toFixed(2));

            });

        }

        $scope.setCurrentReading = function(incomingValue){

            //console.log(incomingValue);

            $scope.currentReadings = incomingValue.data;

            //console.log($scope.currentReadings);

        }

        // Load Charts function
        $scope.loadCharts = function(){

            // $scope.loadQuotationReportChart();
            // $scope.loadAllJobsByCategoryCntFunc();
            // $scope.loadAllJobsByStatusCntFunc();
            // $scope.loadTicketAgeChart();
            // $scope.loadAttendanceStatusCounts();

            if(!_.isEmpty($scope.selectedSite)){


                $scope.clearGuageResults();

                $scope.buildGuages();

            }
            else{

                $scope.clearGuageResults();

            }

        };

        $scope.loadAllJobsByCategoryCntFunc = function(){
          DashboardComponent.loadAllJobsByCategoryCnt().then(function (data) {
              console.log("All jobs by category count " +JSON.stringify(data));
              if(data.length > 0) {
                  $scope.pieSeries = [];
                  data.map(function (item) {
                      if(item) {
                          var seriesData = {};
                          seriesData.name = item.type;
                          seriesData.y = item.categoryCount;
                          $scope.pieSeries.push(seriesData);
                      }
                  })
              }
              console.log($scope.pieSeries);
              $scope.ready = true;
          });
        }

        $scope.loadAllJobsByStatusCntFunc = function(){
           DashboardComponent.loadAllJobsByStatusCnt().then(function (data) {
               console.log("All jobs by status count per date" +JSON.stringify(data));
               if(data.length > 0) {
                   $scope.jobStackChart = data[0];
                   $scope.jobStackXSeries = $scope.jobStackChart.x;
                   $scope.jobStackYSeries = $scope.jobStackChart.status;
                   console.log($scope.jobStackChart.status);
                   $rootScope.jobGraph();
                   $scope.jobChart.showLoading();
                   $timeout(function(){$scope.jobChart.hideLoading();},8000);
               }

           });
        }

        $scope.loadJobs = function(siteId){
            var siteId = 176;
            //var selectedDate = new Date();

            DashboardComponent.loadJobs(siteId,$scope.selectedFromDate).then(function (data) {
                console.log(data);

            })
        }

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

        $scope.loadChartData = function (projectId,region,branch,siteId) {

            $scope.openTicketsCountArray = [];
            $scope.openTicketsLabels = [];
            $scope.closedTicketsCountArray = [];
            $scope.closedTicketsLabels = [];
            $scope.overAllTicketsCountArray = [];
            $scope.openTicketsDataArray = [];
            $scope.closedTicketsDataArray = [];

            $scope.openTicketsTotalCount=0;
            $scope.closedTicketsTotalCount =0;
            $scope.overAllTicketsTotalCount = 0;

            $scope.overallTicketLabels = ['New', 'Closed', 'Pending', 'Pending with Client', 'Pending with UDS'];
            $scope.overallTicketSeries = ['New', 'Closed','Pending', 'Pending with Client', 'Pending with UDS'];

            $scope.startDate = new Date($scope.selectedFromDateSer);
            $scope.endDate =  new Date($scope.selectedToDateSer);
            // var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            $scope.startDate = $scope.startDate.getDate()+'-0'+($scope.startDate.getUTCMonth()+1)+'-'+$scope.startDate.getFullYear();
            $scope.endDate = $scope.endDate.getDate()+'-0'+($scope.endDate.getMonth()+1)+'-'+$scope.endDate.getFullYear();
            console.log("Startdate---"+$scope.startDate);
            console.log("EndDate---"+$scope.endDate);
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.startDate = $scope.selectedFromDateSer.getDate() + '-' + ($scope.selectedFromDateSer.getMonth() +1) + '-' + $scope.selectedFromDateSer.getFullYear();
            console.log("Startdate---"+$scope.startDate);
            $scope.endDate = $scope.selectedToDateSer.getDate() + '-' + ($scope.selectedToDateSer.getMonth() +1) + '-' + $scope.selectedToDateSer.getFullYear();
            console.log("EndDate---"+$scope.endDate);

            // $scope.formatFromDate = $scope.selectedFromDateSer;
            // $scope.formatToDate =  $scope.selectedToDateSer;

            if(siteId){

                $scope.loadChartDataBySiteId($scope.selectedSite.id,$scope.startDate,$scope.endDate);
                // Asset ticket information pie chart
                $scope.loadAssetsCountForChart(siteId);
                $scope.loadAssetSeverityTicketCount($scope.selectedSite.id, $scope.startDate, $scope.endDate);
                $scope.loadAssetOpenTicketsCount($scope.selectedSite.id, $scope.startDate, $scope.endDate);

            }else if(region && branch){
                $scope.loadChartDataByBranch(projectId,region,branch,$scope.startDate,$scope.endDate);

            }else if(region){
                $scope.loadChartDataByRegion(projectId,region,$scope.startDate,$scope.endDate);

            }else if(projectId){

                $scope.loadChartDataByProjectId(projectId,$scope.startDate,$scope.endDate);

            }

        };

        $scope.loadChartDataByProjectId = function(projectId,startDate,endDate){
        	$scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = projectId;
            searchCriteria.fromDate = startDate;
            searchCriteria.toDate = endDate;
            // TicketComponent.getTicketsCountsByStatus(searchCriteria).then(function(response){
            //     /*console.log("Dashboard ticket data_________");
            //     console.log(response);
            //     console.log(response.closedTicketCounts["0-3"]);
            //     console.log(response.openTicketCounts);*/
            //     $scope.loadTicketCounts(response);
            //     // $scope.constructChartData(response);
            // });
            DashboardComponent.loadTicketChartDataByProject(searchCriteria.projectId, searchCriteria.fromDate, searchCriteria.toDate).then(function(response){  // old dashboard
                console.log(response);
                /*console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts);*/
                $scope.constructChartData(response);
            });
        };

        $scope.loadChartDataBySiteId = function(siteId,startDate,endDate){
        	$scope.loadingStart();
        	var searchCriteria = {};
            searchCriteria.siteId = siteId;
            searchCriteria.fromDate = startDate;
            searchCriteria.toDate = endDate;
            // TicketComponent.getTicketsCountsByStatus(searchCriteria).then(function(response){
            //     /*console.log("Dashboard ticket data_________");
            //     console.log(response);
            //     console.log(response.closedTicketCounts["0-3"]);
            //     console.log(response.openTicketCounts);*/
            //     $scope.loadTicketCounts(response);
            //     // $scope.constructChartData(response);
            // });
            DashboardComponent.loadTicketChartData(searchCriteria.siteId, searchCriteria.fromDate, searchCriteria.toDate).then(function(response){      // old dashboard
                /*console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts);*/
                // $scope.loadTicketCounts(response);
                $scope.constructChartData(response);
            });
        };

        $scope.loadChartDataByRegion = function(projectId,region,startDate,endDate){
        	$scope.loadingStart();
            // var sDate= $filter('date')(startDate, 'yyyy/MM/dd');
            // var eDate = $filter('date')(endDate, 'yyyy/MM/dd') ;
            // DashboardComponent.loadTicketChartDataByRegion(projectId,region,sDate,eDate).then(function(response){
            var searchCriteria = {};
            searchCriteria.projectId = projectId;
            searchCriteria.region = region;
            searchCriteria.fromDate = startDate;
            searchCriteria.toDate = endDate;
            // TicketComponent.getTicketsCountsByStatus(searchCriteria).then(function(response){
            //    /* console.log("Dashboard ticket data_________");
            //     console.log(response);
            //     console.log(response.closedTicketCounts["0-3"]);
            //     console.log(response.openTicketCounts);*/
            //     $scope.loadTicketCounts(response);
            //     // $scope.constructChartData(response);
            //
            // });
            DashboardComponent.loadTicketChartDataByRegion(searchCriteria.projectId, searchCriteria.region, searchCriteria.fromDate, searchCriteria.toDate).then(function(response){    // old dashboard
                /* console.log("Dashboard ticket data_________");
                 console.log(response);
                 console.log(response.closedTicketCounts["0-3"]);
                 console.log(response.openTicketCounts);*/
                // $scope.loadTicketCounts(response);
                $scope.constructChartData(response);
            });
        };

        $scope.loadChartDataByBranch = function(projectId,region,branch,startDate,endDate){
        	$scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = projectId;
            searchCriteria.region = region;
            searchCriteria.fromDate = startDate;
            searchCriteria.toDate = endDate;
            searchCriteria.branch = branch;
            // TicketComponent.getTicketsCountsByStatus(searchCriteria).then(function(response){
            //     /*console.log("Dashboard ticket data_________");
            //     console.log(response);
            //     console.log(response.closedTicketCounts["0-3"]);
            //     console.log(response.openTicketCounts)*/;
            //     $scope.loadTicketCounts(response);
            //     // $scope.constructChartData(response);
            //
            // });
            DashboardComponent.loadTicketChartDataByBranch(searchCriteria.projectId, searchCriteria.region, searchCriteria.branch, searchCriteria.fromDate, searchCriteria.toDate, searchCriteria.branch).then(function(response){    // old dashboard
                /* console.log("Dashboard ticket data_________");
                 console.log(response);
                 console.log(response.closedTicketCounts["0-3"]);
                 console.log(response.openTicketCounts);*/
                // $scope.loadTicketCounts(response);
                $scope.constructChartData(response);
            });
        };

        $scope.loadTicketCounts = function(data) {
            console.log("Ticket Status wise counts" +JSON.stringify(data));
            if(data.length > 0) {
                $scope.openTicketsTotalCount = data[0].openCounts;
                $scope.closedTicketsTotalCount = data[0].closedCounts;
                $scope.overAllTicketsTotalCount = data[0].totalCounts;
                $scope.assignedTicketTotalCount = data[0].assignedCounts;
            } else {
                $scope.openTicketsTotalCount = 0;
                $scope.closedTicketsTotalCount = 0;
                $scope.overAllTicketsTotalCount = 0;
                $scope.assignedTicketTotalCount = 0;
            }

        }

        $scope.constructChartData = function(response){
            $scope.chartsDataResponse = response;
            var openTicketsData = {};
            $scope.openTicketsCountArray.push(response.openTicketCounts["0-3"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["0-3"]);
            $scope.openTicketsLabels.push("0-3");
            $scope.openTicketsCountArray.push(response.openTicketCounts["4-5"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["4-5"]);
            $scope.openTicketsLabels.push("4-5");
            $scope.openTicketsCountArray.push(response.openTicketCounts["6-7"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["6-7"]);
            $scope.openTicketsLabels.push("6-7");
            $scope.openTicketsCountArray.push(response.openTicketCounts["8-10"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["8-10"]);
            $scope.openTicketsLabels.push("8-10");
            $scope.openTicketsCountArray.push(response.openTicketCounts["11-365"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["11-365"]);
            console.log("tickets total count - "+$scope.openTicketsTotalCount);
            $scope.openTicketsLabels.push(">-11");

            $scope.closedTicketsCountArray.push(response.closedTicketCounts["0-3"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["0-3"]);
            $scope.closedTicketsLabels.push("0-3");
            $scope.closedTicketsCountArray.push(response.closedTicketCounts["4-5"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["4-5"]);
            $scope.closedTicketsLabels.push("4-5");
            $scope.closedTicketsCountArray.push(response.closedTicketCounts["6-7"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["6-7"]);
            $scope.closedTicketsLabels.push("6-7");
            $scope.closedTicketsCountArray.push(response.closedTicketCounts["8-10"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["8-10"]);
            $scope.closedTicketsLabels.push("8-10");
            $scope.closedTicketsCountArray.push(response.closedTicketCounts["> 11"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["> 11"]);
            $scope.closedTicketsLabels.push(">-11");
            $scope.overAllTicketsTotalCount=$scope.openTicketsTotalCount+$scope.closedTicketsTotalCount;

            $scope.assignedTicketTotalCount = response.totalAssignedTicketCount;
            $scope.openTicketTotalCnt = response.totalOpenTicketCount;

            // if($scope.openTicketsTotalCount > 0) {
            //
	        //     var ctx = document.getElementById("bar1").getContext('2d');
	        //     $scope.myChart = new Chart(ctx, {
	        //         type: 'bar',
	        //         data: {
	        //             labels:$scope.openTicketsLabels ,
	        //             datasets: [{
	        //                 // label: '# of Votes',
	        //                 data:$scope.openTicketsCountArray ,
	        //                 backgroundColor: [
	        //                     'rgba(255, 99, 132, 0.2)',
	        //                     'rgba(54, 162, 235, 0.2)',
	        //                     'rgba(255, 206, 86, 0.2)',
	        //                     'rgba(75, 192, 192, 0.2)',
	        //                     'rgba(153, 102, 255, 0.2)'
	        //                 ],
	        //                 borderColor: [
	        //                     'rgba(255,99,132,1)',
	        //                     'rgba(54, 162, 235, 1)',
	        //                     'rgba(255, 206, 86, 1)',
	        //                     'rgba(75, 192, 192, 1)',
	        //                     'rgba(153, 102, 255, 1)'
	        //                 ],
	        //                 borderWidth: 1
	        //             }]
	        //         },
	        //         options: {
	        //             scales: {
	        //                 yAxes: [{
	        //                     ticks: {
	        //                         beginAtZero:true
	        //                     }
	        //                 }]
	        //             }
	        //         }
	        //     });
            //
            // }else {
            // 		document.getElementById("openTicketPanel").style.display = 'none';
            // }
            //
            //
            // if($scope.closedTicketsTotalCount > 0) {
            //
	        //     var ctx2 = document.getElementById("bar2").getContext('2d');
	        //     $scope.myChart = new Chart(ctx2, {
	        //         type: 'bar',
	        //         data: {
	        //             labels:$scope.closedTicketsLabels ,
	        //             datasets: [{
	        //                 // label: '# of Votes',
	        //                 data:$scope.closedTicketsCountArray ,
	        //                 backgroundColor: [
	        //                     'rgba(255, 99, 132, 0.2)',
	        //                     'rgba(54, 162, 235, 0.2)',
	        //                     'rgba(255, 206, 86, 0.2)',
	        //                     'rgba(75, 192, 192, 0.2)',
	        //                     'rgba(153, 102, 255, 0.2)'
	        //                 ],
	        //                 borderColor: [
	        //                     'rgba(255,99,132,1)',
	        //                     'rgba(54, 162, 235, 1)',
	        //                     'rgba(255, 206, 86, 1)',
	        //                     'rgba(75, 192, 192, 1)',
	        //                     'rgba(153, 102, 255, 1)'
	        //                 ],
	        //                 borderWidth: 1
	        //             }]
	        //         },
	        //         options: {
	        //             scales: {
	        //                 yAxes: [{
	        //                     ticks: {
	        //                         beginAtZero:true
	        //                     }
	        //                 }]
	        //             }
	        //         }
	        //     });
            // }else {
            // 		document.getElementById("closedTicketPanel").style.display = 'none';
            // }
            //
            // if($scope.overAllTicketsTotalCount > 0) {
            //
	        //     var ctx3 = document.getElementById("bar3").getContext('2d');
	        //     $scope.myChart = new Chart(ctx3, {
	        //         type: 'bar',
	        //         data: {
	        //             labels:$scope.overallTicketLabels ,
	        //             datasets: [{
	        //                 // label: '# of Votes',
	        //                 data:$scope.overAllTicketsCountArray ,
	        //                 backgroundColor: [
	        //                     'rgba(255, 99, 132, 0.2)',
	        //                     'rgba(54, 162, 235, 0.2)',
	        //                     'rgba(255, 206, 86, 0.2)',
	        //                     'rgba(75, 192, 192, 0.2)',
	        //                     'rgba(153, 102, 255, 0.2)'
	        //                 ],
	        //                 borderColor: [
	        //                     'rgba(255,99,132,1)',
	        //                     'rgba(54, 162, 235, 1)',
	        //                     'rgba(255, 206, 86, 1)',
	        //                     'rgba(75, 192, 192, 1)',
	        //                     'rgba(153, 102, 255, 1)'
	        //                 ],
	        //                 borderWidth: 1
	        //             }]
	        //         },
	        //         options: {
	        //             scales: {
	        //                 yAxes: [{
	        //                     ticks: {
	        //                         beginAtZero:true
	        //                     }
	        //                 }]
	        //             }
	        //         }
	        //     });
            // }else {
            // 		document.getElementById("overallTicketPanel").style.display = 'none';
            // }
            //
            //


            $scope.overAllTicketsCountArray.push(response.totalNewTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalClosedTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalPendingTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalPendingDueToClientTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalPendingDueToCompanyTicketCount);

            $scope.overallTicketData = $scope.overAllTicketsCountArray;
            $scope.openTicketsData = $scope.openTicketsCountArray;
            $scope.closedTicketsData = $scope.closedTicketsCountArray;
            $scope.loadingStop();

        }

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();


        }
        $scope.initCharts = function(){
                    console.log("Calling charts")
                    demo.initCharts();
        }

        $('input#dateFilterFrom').on('dp.change', function(e){

            if(e.date._d > $scope.selectedToDateSer) {
            		$scope.fromErrMsg = 'From date cannot be greater than To date';
                    alert($scope.fromErrMsg);
                    $('input#dateFilterFrom').data('DateTimePicker').clear();
            		$scope.selectedFromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
            		$scope.selectedFromDateSer = new Date();
                     $('input#dateFilterFrom').val($scope.selectedFromDate);

                     // root scope (searchCriteria)
                     $rootScope.searchFilterCriteria.selectedFromDate = new Date();

                     // retaining list search value.
                     getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                     $scope.refreshReport();

                     $scope.loadCharts();

            		return false;
            }else if ((e.date._d <= $scope.selectedToDateSer)) {

                $scope.selectedFromDateSer = new Date(e.date._d);
                $scope.selectedFromDate = $filter('date')(e.date._d, 'dd/MM/yyyy') ;

                // root scope (searchCriteria)
                $rootScope.searchFilterCriteria.selectedFromDate = new Date(e.date._d);

                // retaining list search value.
                getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                $scope.refreshReport();

                $scope.loadCharts();

            }


        });

        $('input#dateFilterTo').on('dp.change', function(e){

            if($scope.selectedFromDateSer > e.date._d) {
            		$scope.toErrMsg = 'To date cannot be lesser than From date';
                    alert($scope.toErrMsg);
                    $('input#dateFilterTo').data('DateTimePicker').clear();
            		$scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
            		$scope.selectedToDateSer = new Date() ;
                    $('input#dateFilterTo').val($scope.selectedToDate);

                    // root scope (searchCriteria)
                    $rootScope.searchFilterCriteria.selectedToDate = new Date();

                    // retaining list search value.
                    getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                    $scope.refreshReport();

                    $scope.loadCharts();

            		return false;
            }else if($scope.selectedFromDateSer <= e.date._d) {
            	$scope.selectedToDateSer = new Date(e.date._d);
                $scope.selectedToDate = $filter('date')(e.date._d, 'dd/MM/yyyy') ;

                // root scope (searchCriteria)
                $rootScope.searchFilterCriteria.selectedToDate = new Date(e.date._d);

                // retaining list search value.
                getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                $scope.refreshReport();

                $scope.loadCharts();
            }

        });

        $scope.siteOptions = function(sites){

        }

        $scope.loadAllProjects = function(){
            $scope.clientFilterDisable = true;
            DashboardComponent.loadAllProjects().then(function(data){
                console.log(data)
                $scope.projects = data;
                $scope.projectCount = data.length;
                $scope.initialProject = data[0];
                //$scope.loadSites($scope.initialProject.id);
                $scope.clientFilterDisable = false;
            })
        };

        $scope.loadSites = function(projectId,region,branch){
            $scope.siteFilterDisable = true;
            if(branch){

                SiteComponent.getSitesByBranch(projectId,region,branch).then(function (data) {
                    console.log('Sites - ');
                    console.log(data);
                    $scope.sites = data;
                    $scope.siteFilterDisable = false;
                });

            }else if(region){

                SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
                    $scope.sites = data;
                    console.log("Sites - ");
                    console.log(data);
                    $scope.siteFilterDisable = false;
                })

            }else if(projectId >0){
                console.log('projectid - ' + projectId);
                DashboardComponent.loadSites(projectId).then(function(data){
                    console.log('sites ' + JSON.stringify(data));
                    $scope.sites = data;
                    $scope.siteFilterDisable = false;
                })
            }


        };

        // Ovear all sites count

        $scope.loadAllSites = function(){
        	 DashboardComponent.loadAllSites().then(function (data) {
                 console.log(data);
                 //$scope.sites = data;
                 $scope.siteCount = data.length;
             });
        };


        // Ovear all Employee count

        $scope.loadAllEmployee = function(){
        	EmployeeComponent.search({findAll:true}).then(function(data){
                 //console.log('Total emp',data);
                 $scope.totalEmployeeCount = data.totalCount;

             });
        };

        function dateConverter (dateString){

            var str = dateString.split("/");

            return new Date(str[2],(Number(str[1])-1),str[0]);

        }

        $scope.loadAllJobs = function(){

            var fromDate = dateConverter($scope.selectedFromDate);
            var toDate = dateConverter($scope.selectedToDate);

            DashboardComponent.loadAllJobsByDate(fromDate,toDate).then(function(data){

                $scope.currentJobCount = data.totalJobCount ? data.totalJobCount : 0;

            })
        };

        $scope.loadAllQuotations = function(){

            var fromDate = dateConverter($scope.selectedFromDate);
            var toDate = dateConverter($scope.selectedToDate);

            DashboardComponent.loadAllQuotationByDate(fromDate,toDate).then(function(data){

                $scope.totalCurrentQuotationCount = data.totalCount ? data.totalCount : 0;

            })

        }

        $scope.loadAllTickets = function(){

            var fromDate = dateConverter($scope.selectedFromDate);
            var toDate = dateConverter($scope.selectedToDate);

            DashboardComponent.loadAllTicketByDate(fromDate,toDate).then(function(data){

                $scope.totalCurrenTicketsCount = data.totalTicketsCount ? data.totalTicketsCount : 0;

            })

        }

        $scope.loadAllAttendanceCounts = function () {

            console.log($scope.selectedFromDateSer);
             $scope.selectedFromDateSer.setHours(0,0,0,0);
             $scope.selectedToDateSer.setHours(23,59,59,0);
            console.log($scope.selectedFromDateSer + ' ' + $scope.selectedToDateSer);
            $scope.loadingStart();

            var searchCriteria = {};
            // searchCriteria.siteId = 0;
            // relieverCriteria.fromDate = $scope.selectedFromDateSer;
            // relieverCriteria.toDate = $scope.selectedToDateSer;
            searchCriteria.fromDate = new Date;
            searchCriteria.toDate = new Date;
            DashboardComponent.getRelieverCounts(searchCriteria).then(function (data) {
               console.log("Employee Reliever cnts :" +JSON.stringify(data));
               $scope.relieverCnt = data;
                $scope.loadingStop();
            });

            // DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
            //     console.log(data);
            //     // $scope.totalEmployeeCount = data.totalEmployees;
            //     $scope.employeeCount = data.totalEmployees;
            //     $scope.presentCount = data.totalPresent;
            //     $scope.absentCount = data.totalAbsent;
            //     $scope.leftCount = data.totalLeft;
            //     $scope.loadingStop();
            // });

        };

        $scope.loadQuotationReportChart = function() {
            $scope.quotationCount = 0;
            DashboardComponent.loadQuotationReport().then(function (data) {
                console.log("All quotations by status counts" +JSON.stringify(data));
                if(data.length > 0) {
                    $scope.quoteStackChart = data[0];
                    $scope.quoteStackXSeries = $scope.quoteStackChart.x;
                    $scope.quoteStackYSeries = $scope.quoteStackChart.status;
                    console.log($scope.quoteStackChart.status);
                    $rootScope.quotGraph();
                    $scope.quotationStackChart.showLoading();
                    $timeout(function(){$scope.quotationStackChart.hideLoading();},5000);
                }else{
                    $scope.quoteStackXSeries = "";
                    $scope.quoteStackYSeries = [
                        {
                             name: "Waiting For Approval",
                             data: [0]
                        },
                        {
                            name: "Pending",
                            data: [0]
                        },
                        {
                            name: "Approved",
                            data: [0]
                        },
                        {
                            name: "Rejected",
                            data: [0]
                        }];
                    $rootScope.quotGraph();
                    $scope.quotationStackChart.showLoading();
                    $timeout(function(){$scope.quotationStackChart.hideLoading();},5000);
                }

            });
        };

        $scope.changeProject = function() {
        		console.log('selected project - ' + JSON.stringify($scope.selectedProject));
        		$scope.loadSites($scope.selectedProject.id);
        		$scope.selectedSite = null;
        		$scope.refreshReport();
        };

        $scope.loadRegions = function (projectId) {
            $scope.regionFilterDisable = true;
            SiteComponent.getRegionByProject(projectId).then(function (response) {
                console.log(response);
                $scope.regionList = response;
                $scope.regionFilterDisable = false;
            })
        };

        $scope.loadBranch = function (projectId) {
             $scope.branchFilterDisable = true;
            if($scope.selectedProject){

                if($scope.selectedRegion){
                    console.log($scope.selectedRegion);
                    SiteComponent.getBranchByProject(projectId,$scope.selectedRegion.id).then(function (response) {
                        console.log(response);
                        $scope.branchList = response;
                        $scope.branchFilterDisable = false;
                    })

                }else{
                    $scope.showNotifications('top','center','danger','Please Select Region to continue...');

                }

            }else{
                $scope.showNotifications('top','center','success','Please select Project to continue...');

            }

        };

        $scope.refreshReport = function() {
        		if($scope.selectedSite && $scope.selectedSite.id) {
        			$scope.refreshReportBySite();
                    $scope.loadChartData($scope.selectedProject.id,null,null,$scope.selectedSite.id);
                }else if($scope.selectedBranch && $scope.selectedBranch.id){
                	$scope.sites= "";
                    $scope.refreshReportByBranch();
                    $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name);
                    $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name,null);

                }else if($scope.selectedRegion && $scope.selectedRegion.id){
                	$scope.branchList= "";
                	$scope.sites= "";
                    $scope.refreshReportByRegion();
                    $scope.loadBranch($scope.selectedProject.id);
                    $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,null);
                    $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,null,null);

                }else if($scope.selectedProject && $scope.selectedProject.id) {
                	$scope.regionList= "";
                	$scope.branchList= "";
                	$scope.sites= "";
        			$scope.refreshReportByProject();
        			$scope.loadRegions($scope.selectedProject.id);
        			$scope.loadSites($scope.selectedProject.id,null,null);
                    $scope.loadChartData($scope.selectedProject.id,null,null,null);

                }else{
        		    $scope.loadJobReport();
                    $scope.loadAllAttendanceCounts();
                    // $scope.loadTicketStatusCounts();
                    $scope.loadQuotationReportCounts();
                }
            // $scope.loadAllAttendanceCounts();
        		// $scope.loadJobReport();
            // $scope.myChart.update();
            $scope.loadAllJobs();
            $scope.loadAllQuotations();
            $scope.loadAllTickets();

        };

        $scope.LoadFilterProjects = function(){
        	$scope.regionList= "";
        	$scope.branchList= "";
        	$scope.sites= "";
        	if($scope.selectedProject) {

        		/** root scope (searchCriteria) **/
                $rootScope.searchFilterCriteria.projectId = $scope.selectedProject.id;
                $rootScope.searchFilterCriteria.projectName = $scope.selectedProject.name;
                $rootScope.searchFilterCriteria.regionId = null;
                $rootScope.searchFilterCriteria.region = null;
                $rootScope.searchFilterCriteria.branchId = null;
                $rootScope.searchFilterCriteria.branch = null;
                $rootScope.searchFilterCriteria.siteId = null;
                $rootScope.searchFilterCriteria.siteName = null;

                 /** retaining list search value.**/
                 getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

    			$scope.refreshReportByProject();
    			$scope.loadRegions($scope.selectedProject.id);
    			$scope.loadSites($scope.selectedProject.id,null,null);
                $scope.loadChartData($scope.selectedProject.id,null,null,null);

                $scope.loadCharts();

            }else{
                $rootScope.searchFilterCriteria.projectId = null;
                $rootScope.searchFilterCriteria.projectName = null;
                $rootScope.searchFilterCriteria.regionId = null;
                $rootScope.searchFilterCriteria.region = null;
                $rootScope.searchFilterCriteria.branchId = null;
                $rootScope.searchFilterCriteria.branch = null;
                $rootScope.searchFilterCriteria.siteId = null;
                $rootScope.searchFilterCriteria.siteName = null;

                /** retaining list search value.**/
                getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                $scope.init();
            }
        };

        $scope.LoadFilterRegions = function(){
        	$scope.branchList= "";
        	$scope.sites= "";
        	if($scope.selectedRegion){

        		/** root scope (searchCriteria) **/
                $rootScope.searchFilterCriteria.regionId = $scope.selectedRegion.id;
                $rootScope.searchFilterCriteria.region = $scope.selectedRegion.name;
                $rootScope.searchFilterCriteria.branchId = null;
                $rootScope.searchFilterCriteria.branch = null;
                $rootScope.searchFilterCriteria.projectId = $scope.selectedProject.id;
                $rootScope.searchFilterCriteria.projectName = $scope.selectedProject.name;
                $rootScope.searchFilterCriteria.siteId = null;
                $rootScope.searchFilterCriteria.siteName = null;

                 /** retaining list search value.**/
                 getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                $scope.refreshReportByRegion();
                $scope.loadBranch($scope.selectedProject.id);
                $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,null);
                $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,null,null);

                $scope.loadCharts();

            }else{
                    $rootScope.searchFilterCriteria.regionId = null;
                    $rootScope.searchFilterCriteria.region = null;
                    $rootScope.searchFilterCriteria.branchId = null;
                    $rootScope.searchFilterCriteria.branch = null;
                    $rootScope.searchFilterCriteria.siteId = null;
                    $rootScope.searchFilterCriteria.siteName = null;

                    /** retaining list search value.**/
                    getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                    $scope.LoadFilterProjects();
            }
        };

        $scope.LoadFilterBranches = function(){
        	$scope.sites= "";
        	if($scope.selectedBranch){

        		/** root scope (searchCriteria) **/
        		$rootScope.searchFilterCriteria.regionId = $scope.selectedRegion.id;
                $rootScope.searchFilterCriteria.region = $scope.selectedRegion.name;
                $rootScope.searchFilterCriteria.branchId = $scope.selectedBranch.id;
                $rootScope.searchFilterCriteria.branch = $scope.selectedBranch.name;
                $rootScope.searchFilterCriteria.projectId = $scope.selectedProject.id;
                $rootScope.searchFilterCriteria.projectName = $scope.selectedProject.name;
                $rootScope.searchFilterCriteria.siteId = null;
                $rootScope.searchFilterCriteria.siteName = null;

                 /** retaining list search value.**/
                 getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                $scope.refreshReportByBranch();
                $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name);
                $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name,null);

               $scope.loadCharts();

            }else{
               $rootScope.searchFilterCriteria.branchId = null;
               $rootScope.searchFilterCriteria.branch = null;
               $rootScope.searchFilterCriteria.siteId = null;
               $rootScope.searchFilterCriteria.siteName = null;

               /** retaining list search value.**/
               getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                $scope.LoadFilterRegions();
             }
        };

        $scope.LoadFilterSites = function(){
        	if($scope.selectedSite) {

        	    var siteId = $scope.selectedSite.id;
        	    $scope.loadAssetOpenTicketsCount(siteId,$scope.startDate,$scope.endDate);
        	    $scope.loadAssetSeverityTicketCount(siteId,$scope.startDate,$scope.endDate);

        		/** root scope (searchCriteria) **/
        		if($scope.selectedRegion){
        		  $rootScope.searchFilterCriteria.regionId = $scope.selectedRegion.id;
                  $rootScope.searchFilterCriteria.region = $scope.selectedRegion.name;
        		}
        		if($scope.selectedBranch){
        		  $rootScope.searchFilterCriteria.branchId = $scope.selectedBranch.id;
                  $rootScope.searchFilterCriteria.branch = $scope.selectedBranch.name;
        		}
        		$rootScope.searchFilterCriteria.projectId = $scope.selectedProject.id;
                $rootScope.searchFilterCriteria.projectName = $scope.selectedProject.name;
                $rootScope.searchFilterCriteria.siteId = $scope.selectedSite.id;
                $rootScope.searchFilterCriteria.siteName = $scope.selectedSite.name;


                 /** retaining list search value.**/
                 getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

    			$scope.refreshReportBySite();
                $scope.loadChartData($scope.selectedProject.id,null,null,$scope.selectedSite.id);
                console.log('Root search values',$rootScope.searchFilterCriteria);

                $scope.loadCharts();

            }else{
                 $rootScope.searchFilterCriteria.siteId = null;
                 $rootScope.searchFilterCriteria.siteName = null;

                 /** retaining list search value.**/
                 getLocalDbStorage.updateSearch($rootScope.searchFilterCriteria);

                 $scope.LoadFilterBranches();
             }
        };

        $scope.refreshReportByProject = function() {
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadQuotationReportCounts();
            $scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = $scope.selectedProject.id;
            searchCriteria.fromDate = new Date();
            searchCriteria.toDate = $scope.selectedToDateSer;
            // searchCriteria.fromDate = new Date;
            // searchCriteria.toDate = new Date;
            // DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
            // console.log(data);
            //     $scope.employeeCount = data.totalEmployees;
            //     $scope.presentCount = data.totalPresent;
            //     $scope.absentCount = data.totalAbsent;
            //     $scope.leftCount = data.totalLeft;
            // });
            DashboardComponent.loadAttendanceReportByProject(searchCriteria.projectId, searchCriteria.fromDate, searchCriteria.toDate).then(function(data){
                console.log(data);
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
                // $scope.leftCount = data.totalLeft;
            });

        };

        $scope.refreshReportByRegion = function(){
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadQuotationReportCounts();
            $scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = $scope.selectedProject.id;
            searchCriteria.fromDate = new Date();
            searchCriteria.toDate = $scope.selectedToDateSer;
            // searchCriteria.fromDate = new Date();
            // searchCriteria.toDate = new Date();
            searchCriteria.region = $scope.selectedRegion.name;
            // DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
            //     console.log(data);
            //     $scope.employeeCount = data.totalEmployees;
            //     $scope.presentCount = data.totalPresent;
            //     $scope.absentCount = data.totalAbsent;
            //     $scope.leftCount = data.totalLeft;
            // });
            DashboardComponent.loadAttendanceReportByRegion(searchCriteria.projectId, searchCriteria.region, searchCriteria.fromDate, searchCriteria.toDate).then(function(data){
                console.log(data);
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
                // $scope.leftCount = data.totalLeft;
            });

        };

        $scope.refreshReportByBranch = function(){
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadQuotationReportCounts();
            $scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = $scope.selectedProject.id;
            searchCriteria.fromDate = new Date();
            searchCriteria.toDate = $scope.selectedToDateSer;
            //searchCriteria.fromDate = new Date();
            //searchCriteria.toDate = new Date();
            searchCriteria.region = $scope.selectedRegion.name;
            searchCriteria.branch = $scope.selectedBranch.name;
            // DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
            //     console.log(data);
            //     $scope.employeeCount = data.totalEmployees;
            //     $scope.presentCount = data.totalPresent;
            //     $scope.absentCount = data.totalAbsent;
            //     $scope.leftCount = data.totalLeft;
            // });

            DashboardComponent.loadAttendanceReportByBranch(searchCriteria.projectId, searchCriteria.region, searchCriteria.branch, searchCriteria.fromDate, searchCriteria.toDate).then(function(data){
                console.log(data);
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
                // $scope.leftCount = data.totalLeft;
            });

        };

        $scope.refreshReportBySite = function() {
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadQuotationReportCounts();
            $scope.loadingStart();
            if($scope.selectedSite && $scope.selectedSite.id){
                var searchCriteria = {};
                searchCriteria.siteId = $scope.selectedSite.id;
                searchCriteria.fromDate = new Date();
                searchCriteria.toDate = $scope.selectedToDateSer;
                //searchCriteria.fromDate = new Date();
                //searchCriteria.toDate = new Date();
            	// DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
                //     console.log(data);
                //     $scope.employeeCount = data.totalEmployees;
                //     $scope.presentCount = data.totalPresent;
                //     $scope.absentCount = data.totalAbsent;
                //     $scope.leftCount = data.totalLeft;
                // });
                DashboardComponent.loadAttendanceReportBySite(searchCriteria.siteId, searchCriteria.fromDate, searchCriteria.toDate).then(function(data){
                    console.log(data);
                    $scope.employeeCount = data.totalEmployeeCount;
                    $scope.presentCount = data.presentEmployeeCount;
                    $scope.absentCount = data.absentEmployeeCount;
                    // $scope.leftCount = data.totalLeft;
                });
            }


       };



        $scope.loadJobReport = function () {
	        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
	        		var searchCriteria = {
	            			currPage : currPageVal
	            	}
	            	$scope.searchCriteria = searchCriteria;
	        	//}

	        	$scope.searchCriteria.currPage = currPageVal;
	        	console.log('Selected  project -' , $scope.selectedProject);
	        	console.log('Selected  job -' , $scope.selectedJob);
	        	console.log('search criteria - ',JSON.stringify($scope.searchCriteriaProject));

	        	if($scope.selectedProject) {
	        		$scope.searchCriteria.projectId = $scope.selectedProject.id;
	        	}

                $scope.searchCriteria.region = $scope.selectedRegion!=null?$scope.selectedRegion.name:"";
                $scope.searchCriteria.branch = $scope.selectedBranch!=null?$scope.selectedBranch.name:"";

	        	if($scope.selectedSite) {
	        		$scope.searchCriteria.siteId = $scope.selectedSite.id;
		        }

	        	$scope.searchCriteria.consolidated = true;

	        	if($scope.selectedJob){
	        		$scope.searchCriteria.jobTitle = $scope.selectedJob;
	        	}
	        	$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedFromDateSer;
	        	$scope.searchCriteria.checkInDateTimeTo = $scope.selectedToDateSer;
	        	$scope.searchCriteria.graphRequest = false;

	        	console.log('job report search criteria -' , JSON.stringify($scope.searchCriteria));
            // $scope.loadingStop();
                JobComponent.generateReport(searchCriteria).then(function (data) {
                    console.log("Job Total Counts" +JSON.stringify(data));
                    $scope.loadingStop();
                    // if(data.length > 0) {
                    //     $scope.result.totalJobCount = data[0].totalCounts;
                    //     $scope.result.assignedJobCount = data[0].assignedCounts;
                    //     $scope.result.overdueJobCount = data[0].overdueCounts;
                    //     $scope.result.completedJobCount = data[0].completedCounts;
                    // } else {
                    //     $scope.result.totalJobCount = 0;
                    //     $scope.result.assignedJobCount = 0;
                    //     $scope.result.overdueJobCount = 0;
                    //     $scope.result.completedJobCount = 0;
                    // }

                    $scope.result.assignedJobCount = 0;                             // old job dashboard counts
                    $scope.result.completedJobCount = 0;
                    $scope.result.overdueJobCount = 0;
                    $scope.result.totalJobCount = 0;

                    for(var i = 0; i < data.length; i++) {
                        $scope.result.assignedJobCount += data[i].assignedJobCount;
                        $scope.result.completedJobCount += data[i].completedJobCount;
                        $scope.result.overdueJobCount += data[i].overdueJobCount;
                        $scope.result.totalJobCount += data[i].totalJobCount;
                    }

                    if(jQuery.isEmptyObject($scope.selectedProject)== true &&
                      jQuery.isEmptyObject($scope.selectedSite)== true &&
                      jQuery.isEmptyObject($scope.selectedRegion)== true &&
                      jQuery.isEmptyObject($scope.selectedBranch)== true){
                        $scope.loadingStop();
                    }

                });

	        	// JobComponent.generateReport($scope.searchCriteria).then(function (data) {
	        	// 	$scope.result.assignedJobCount = 0;
	        	// 	$scope.result.completedJobCount = 0;
	        	// 	$scope.result.overdueJobCount = 0;
	        	// 	$scope.result.totalJobCount = 0;
	        	// 	$scope.loadingStart();
                //
	        	// 	for(var i = 0; i < data.length; i++) {
	        	// 		$scope.loadingStart();
	        	// 		$scope.result.assignedJobCount += data[i].assignedJobCount;
	        	// 		$scope.result.completedJobCount += data[i].completedJobCount;
	        	// 		$scope.result.overdueJobCount += data[i].overdueJobCount;
	        	// 		$scope.result.totalJobCount += data[i].totalJobCount;
                //
	        	// 		if((i+1) == (data.length)){
                //
	        	// 			$scope.loadingStop();
	        	// 	    }
                //
	        	// 	}
                //

	        	// 	//$scope.result = data[0];
	        	// 	console.log('job report - ' , $scope.result.assignedJobCount);
	        	// 	console.log('job report - ' , $scope.result.completedJobCount);
	        	// 	console.log('job report - ' , $scope.result.overdueJobCount);
	        	// 	console.log('job report - ' , $scope.result.totalJobCount);
                //
                //
	        	// });

        };

        $scope.loadQuotationReportCounts = function () {
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            var searchCriteria = {
                currPage : currPageVal
            }
            $scope.searchCriteria = searchCriteria;
            //}

            $scope.searchCriteria.currPage = currPageVal;
            console.log('Selected  project -' , $scope.selectedProject);
            console.log('search criteria - ',JSON.stringify($scope.searchCriteriaProject));

            if($scope.selectedProject) {
                $scope.searchCriteria.projectId = $scope.selectedProject.id;
            }

            $scope.searchCriteria.region = $scope.selectedRegion!=null?$scope.selectedRegion.name:"";
            $scope.searchCriteria.branch = $scope.selectedBranch!=null?$scope.selectedBranch.name:"";

            if($scope.selectedSite) {
                $scope.searchCriteria.siteId = $scope.selectedSite.id;
            }

            $scope.searchCriteria.consolidated = true;


            // $scope.searchCriteria.fromDate = $scope.selectedFromDateSer;
            $scope.searchCriteria.quotationCreatedDate = $scope.selectedFromDateSer;
            $scope.searchCriteria.toDate = $scope.selectedToDateSer;

            console.log('quotation report search criteria -' , JSON.stringify($scope.searchCriteria));

            DashboardComponent.getTotalQuoteCounts(searchCriteria).then(function (data) {
                console.log("Quotations Total Counts" +JSON.stringify(data));
                $scope.loadingStop();

                /*
                if(data.length > 0) {
                    $scope.overAllQuotationCount = data[0].totalQuotations;
                    $scope.waitingQuotationCount = data[0].waitingForApproveCnts;
                    $scope.pendingQuotationCount = data[0].pendingCounts;
                    $scope.approvedQuotationCount = data[0].approvedCounts;
                    $scope.rejectedQuotationCount = data[0].rejectedCounts;
                } else {
                    $scope.overAllQuotationCount = 0;
                    $scope.waitingQuotationCount = 0;
                    $scope.pendingQuotationCount = 0;
                    $scope.approvedQuotationCount = 0;
                    $scope.rejectedQuotationCount = 0;
                }
                */

                if(data) {
                    $scope.overAllQuotationCount = data.totalCount;
                    $scope.waitingQuotationCount = data.totalSubmitted;
                    $scope.pendingQuotationCount = data.totalPending;
                    $scope.approvedQuotationCount = data.totalApproved;
                    $scope.rejectedQuotationCount = data.totalRejected;
                }else {
                    $scope.overAllQuotationCount = 0;
                    $scope.waitingQuotationCount = 0;
                    $scope.pendingQuotationCount = 0;
                    $scope.approvedQuotationCount = 0;
                    $scope.rejectedQuotationCount = 0;
                }

                if(jQuery.isEmptyObject($scope.selectedProject)== true &&
                		jQuery.isEmptyObject($scope.selectedSite)== true &&
                		jQuery.isEmptyObject($scope.selectedRegion)== true &&
                		jQuery.isEmptyObject($scope.selectedBranch)== true){
                    $scope.loadingStop();
                }

            });

        };


        $scope.loadJobReportFromInflux = function(searchCriteria) {         // Jobs for get Total status counts

            JobComponent.getTotalCounts(searchCriteria).then(function (data) {
                console.log("Job Total Counts" +JSON.stringify(data));
                $scope.loadingStop();
                if(data.length > 0) {
                    $scope.result.totalJobCount = data[0].totalCounts;
                    $scope.result.assignedJobCount = data[0].assignedCounts;
                    $scope.result.overdueJobCount = data[0].overdueCounts;
                    $scope.result.completedJobCount = data[0].completedCounts;
                } else {
                    $scope.result.totalJobCount = 0;
                    $scope.result.assignedJobCount = 0;
                    $scope.result.overdueJobCount = 0;
                    $scope.result.completedJobCount = 0;
                }

            });

        };

        $scope.loadTicketStatusFromInflux = function() {          // Ticket chart for get category wise status counts
            TicketComponent.getStatusCountsByCategory().then(function (data) {
                console.log("Ticket category wise Status counts" +JSON.stringify(data));
                if(data.length > 0) {
                    $scope.ticketStackChart = data[0];
                    $scope.ticketStackXSeries = $scope.ticketStackChart.x;
                    $scope.ticketStackYSeries = $scope.ticketStackChart.status;
                    $rootScope.ticketGraph();
                    $scope.ticketsChart.showLoading();
                    $timeout(function(){$scope.ticketsChart.hideLoading();},5000);
                }

            });
        };

        $scope.loadTicketAgeChart = function() {          // Ticket chart for get Avg age category wise
            TicketComponent.getAverageAge().then(function (data) {
                console.log("Ticket category wise avg age" +JSON.stringify(data));
                if(data.length > 0) {
                    $scope.ticketAgeChart = data[0];
                    $scope.ticketAgeXSeries = $scope.ticketAgeChart.x;
                    $scope.ticketAgeYSeries = $scope.ticketAgeChart.avgStatus;
                    $rootScope.ticketSingleGraph();
                    $scope.ticketSingleStackChart.showLoading();
                    $timeout(function(){$scope.ticketSingleStackChart.hideLoading();},8000);
                }

            });
        };

        $scope.loadAttendanceStatusCounts = function() {
            AttendanceComponent.getTotalStatusCounts().then(function (data) {
               console.log("Total Attendance status counts" + JSON.stringify(data));
               if(data.length > 0) {
                   $scope.attnStackChart = data[0];
                   $scope.attnStackXSeries = $scope.attnStackChart.x;
                   $scope.attnStackYSeries = $scope.attnStackChart.status;
                   $rootScope.attendGraph();
                   $scope.attendsChart.showLoading();
                   $timeout(function(){$scope.attendsChart.hideLoading();},8000);
               }else{
                   $scope.attnStackXSeries = "";
                   $scope.attnStackYSeries = [
                       {
                            name: "Left",
                            data: [0]
                       },
                       {
                           name: "Absent",
                           data: [0]
                       },
                       {
                           name: "Present",
                           data: [0]
                       }];
                   $rootScope.attendGraph();
                   $scope.attendsChart.showLoading();
                   $timeout(function(){$scope.attendsChart.hideLoading();},8000);
               }

            });
        };

        $scope.loadTicketStatusCounts = function(searchCriteria) {
            // Ticket for get total status counts
            var searchCriteriaTicket = {};
            searchCriteriaTicket.fromDate = $scope.selectedFromDateSer;
            searchCriteriaTicket.toDate = $scope.selectedToDateSer;
            searchCriteriaTicket.projectId = null;
            searchCriteriaTicket.siteId = null;
            searchCriteriaTicket.region = null;
            searchCriteriaTicket.branch = null;
            TicketComponent.getTicketsCountsByStatus(searchCriteriaTicket).then(function (data) {
               console.log("Ticket Status wise counts" +JSON.stringify(data));
                $scope.loadingStop();
               if(data.length > 0) {
                   $scope.openTicketsTotalCount = data[0].openCounts;
                   $scope.closedTicketsTotalCount = data[0].closedCounts;
                   $scope.overAllTicketsTotalCount = data[0].totalCounts;
                   $scope.assignedTicketTotalCount = data[0].assignedCounts;
               } else {
                   $scope.openTicketsTotalCount = 0;
                   $scope.closedTicketsTotalCount = 0;
                   $scope.overAllTicketsTotalCount = 0;
                   $scope.assignedTicketTotalCount = 0;
               }

            });
        };

        $scope.loadAssetSeverityTicketCount = function(siteId, fromDate, toDate){

            TicketComponent.getAssetTicketSeverityCount(siteId, fromDate, toDate).then(function (data) {
                console.log("ticket count based on severity");
                console.log(data);
                $scope.assetSeverityTicketsCount = data;

                    Highcharts.chart('assetPieChartContainer', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    connectorColor: 'silver'
                                }
                            }
                        },
                        series: [{
                            name: 'Share',
                            data: [
                                { name: 'Medium', y: $scope.assetSeverityTicketsCount.mediumSeverityTicketCount  },
                                { name: 'High', y:  $scope.assetSeverityTicketsCount.highSeverityTicketCount },
                                { name: 'Low', y: $scope.assetSeverityTicketsCount.lowSeverityTicketCount}
                            ]
                        }]
                    });


            })
        };

        $scope.loadAssetOpenTicketsCount = function (siteId, fromDate, toDate) {
            TicketComponent.getAssetTicketOpenCount(siteId, fromDate, toDate).then(function (data) {
                console.log(data);

                $scope.assetOpenTicketsCount = data;

                if(data && data.inProgressCounts>0 || data.openCounts>0 || data.assignedCounts>0){
                    $scope.showAssetTicketPieChart = true;
                    Highcharts.chart('container', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    connectorColor: 'silver'
                                }
                            }
                        },
                        series: [{
                            name: 'Share',
                            data: [
                                { name: 'In Progress', y: $scope.assetOpenTicketsCount.inProgressCounts },
                                { name: 'Open', y: $scope.assetOpenTicketsCount.openCounts },
                                { name: 'Assigned', y: $scope.assetOpenTicketsCount.assignedCounts }
                            ]
                        }]
                    });
                }else{
                    console.log("No tickets found for this selection");
                    console.log(data);
                }


            });
        };

        $scope.loadAssetsCountForChart = function(siteId){
            console.log("Asset count function");
          DashboardComponent.getAssetCountData(siteId).then(function (data) {
              console.log("Asset count information");
              console.log(data);
              $scope.assetAvailability = data;

              Highcharts.chart('assetAvailability', {
                  chart: {
                      plotBackgroundColor: null,
                      plotBorderWidth: null,
                      plotShadow: false,
                      type: 'pie'
                  },
                  title: {
                      text: ''
                  },
                  tooltip: {
                      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                  },
                  plotOptions: {
                      pie: {
                          allowPointSelect: true,
                          cursor: 'pointer',
                          dataLabels: {
                              enabled: true,
                              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                              connectorColor: 'silver'
                          }
                      }
                  },
                  series: [{
                      name: 'Share',
                      data: [
                          { name: 'Assets Under Maintenance', y: $scope.assetAvailability.assetsUnderMaintenance },
                          { name: 'Breakdown Assets', y: $scope.assetAvailability.breakDownAssets },
                          { name: 'Available Assets', y: $scope.assetAvailability.workingAssets}
                      ]
                  }]
              });
          })
        };


        $scope.initCalender();

        // $scope.initCharts();





        // Chart data sample start


        // Stacked colum charts

        // var seriesObj1={
        //     name:['Assigned','Overdue','Completed']
        // };
        // var seriesObj2={
        //     data:[5, 3, 4, 7, 2]
        // };

        //var jobxdata=['Electrical', 'Carpentry', 'Plumbing'];

        $rootScope.jobGraph = function () {
        	console.log('job chart',$scope.jobStackYSeries);
         $scope.jobChart = Highcharts.chart('jobStackedCharts', {
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'Jobs Status'
              },
              xAxis: {
                  categories:$scope.jobStackXSeries
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: 'Total Job Count'
                  },
                  stackLabels: {
                      enabled: true,
                      style: {
                          fontWeight: 'bold',
                          color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                      }
                  }
              },
              legend: {
                  align: 'right',
                  x: -30,
                  verticalAlign: 'top',
                  y: 25,
                  floating: true,
                  backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                  borderColor: '#CCC',
                  borderWidth: 1,
                  shadow: false
              },
              tooltip: {
                  headerFormat: '<b>{point.x}</b><br/>',
                  pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
              },
              plotOptions: {
                  column: {
                      stacking: 'normal',
                      dataLabels: {
                          enabled: true,
                          color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                      }
                  }
              },
              series: $scope.jobStackYSeries
          });
      };
        // Timeout jobGraph function

        //$rootScope.jobGraphTimeout = $timeout($rootScope.jobGraph(), 2500);


        // Sample data for pie chart
        $scope.pieData = [{
            name: "AC & APPLIANCES",
            y: 12
        },{
            name: "CLEANING",
            y: 30
        },{
            name: "PLUMBING",
            y: 10
        }, {
            name: "ELECTRICAL",
            y: 15
            // sliced: true,
            // selected: true
        }, {
            name: "CARPENTRY",
            y: 25
        }]

        $rootScope.attendGraph = function () {
        $scope.attendsChart = Highcharts.chart('AttendanceStackedCharts', {
             chart: {
                 type: 'column'
             },
             title: {
                 text: 'Attendance Status'
             },
             xAxis: {
                 categories: $scope.attnStackXSeries
             },
             yAxis: {
                 min: 0,
                 title: {
                     text: 'Total Count'
                 },
                 stackLabels: {
                     enabled: true,
                     style: {
                         fontWeight: 'bold',
                         color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                     }
                 }
             },
             legend: {
                 align: 'right',
                 x: -30,
                 verticalAlign: 'top',
                 y: 25,
                 floating: true,
                 backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                 borderColor: '#CCC',
                 borderWidth: 1,
                 shadow: false
             },
             tooltip: {
                 headerFormat: '<b>{point.x}</b><br/>',
                 pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
             },
             plotOptions: {
                 column: {
                     stacking: 'normal',
                     dataLabels: {
                         enabled: true,
                         color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                     }
                 }
             },
             series: $scope.attnStackYSeries
         });
     };

        //Timeout attendGraph function

        //$rootScope.attendGraphTimeout = $timeout($rootScope.attendGraph(), 2500);





        $rootScope.ticketGraph = function () {
         $scope.ticketsChart = Highcharts.chart('ticketStackedCharts', {
             chart: {
                 type: 'column'
             },
             title: {
                 text: 'Tickets'
             },
             xAxis: {
                 categories: $scope.ticketStackXSeries
             },
             yAxis: {
                 min: 0,
                 title: {
                     text: 'Total Count'
                 },
                 stackLabels: {
                     enabled: true,
                     style: {
                         fontWeight: 'bold',
                         color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                     }
                 }
             },
             legend: {
                 align: 'right',
                 x: -30,
                 verticalAlign: 'top',
                 y: 25,
                 floating: true,
                 backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                 borderColor: '#CCC',
                 borderWidth: 1,
                 shadow: false
             },
             tooltip: {
                 headerFormat: '<b>{point.x}</b><br/>',
                 pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
             },
             plotOptions: {
                 column: {
                     stacking: 'normal',
                     dataLabels: {
                         enabled: true,
                         color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                     }
                 }
             },
             series: $scope.ticketStackYSeries
         });
     };
        //Timeout ticketGraph function

       //$rootScope.ticketGraphTimeout = $timeout($rootScope.ticketGraph(),1000);



        // $scope.ticketsAgeChart = Highcharts.chart('catgAgeTicketsCharts', {
        //     chart: {
        //         type: 'spline'
        //     },
        //     title: {
        //         text: 'Monthly Tickets'
        //     },
        //     subtitle: {
        //         text: ''
        //     },
        //     xAxis: {
        //         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        //             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        //     },
        //     yAxis: {
        //         title: {
        //             text: 'Average Ticket Age'
        //         },
        //         labels: {
        //             formatter: function () {
        //                 return this.value;
        //             }
        //         }
        //     },
        //     tooltip: {
        //         crosshairs: true,
        //         shared: true
        //     },
        //     plotOptions: {
        //         spline: {
        //             marker: {
        //                 radius: 4,
        //                 lineColor: '#666666',
        //                 lineWidth: 1
        //             }
        //         }
        //     },
        //     series: [{
        //         name: 'Ac',
        //         marker: {
        //             symbol: 'square'
        //         },
        //         data: [7.5, 7.9, 5.5, 17.5, 20.2, 24.5, 29.2, {
        //             y: 26.5
        //         }, 32.3, 33.3, 38.9, 44.6]
        //
        //     },{
        //         name: 'CLEANING',
        //         marker: {
        //             symbol: 'circle'
        //         },
        //         data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
        //             y: 26.5
        //         }, 23.3, 18.3, 13.9, 9.6]
        //
        //     },{
        //         name: 'PLUMBING',
        //         marker: {
        //             symbol: 'square'
        //         },
        //         data: [2.0, 9.9, 11.5, 17.5, 23.2, 27.5, 29.2, {
        //             y: 26.5
        //             // marker: {
        //             //     symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
        //             // }
        //         }, 33.3, 40.3, 43.9, 12.6]
        //
        //     }, {
        //         name: 'ELECTRICAL',
        //         marker: {
        //             symbol: 'diamond'
        //         },
        //         data: [{
        //             y: 3.9
        //         }, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        //     }]
        // });

        $rootScope.ticketSingleGraph = function(){
           $scope.ticketSingleStackChart = Highcharts.chart('ticketSingleStackedCharts', {
               chart: {
                   type: 'column'
               },
               title: {
                   text: 'Average Ticket Age'
               },
               subtitle: {
                   text: ''
               },
               xAxis: {
                   type: 'category'
               },
               yAxis: {
                   title: {
                       text: 'Average Age'
                   }

               },
               legend: {
                   enabled: false
               },
               plotOptions: {
                   series: {
                       borderWidth: 0,
                       dataLabels: {
                           enabled: true,
                           format: '{point.y}'
                       }
                   }
               },
               tooltip: {
                   headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                   pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
               },
               "series": [
                   {
                       "name": "Ticket Categories",
                       "colorByPoint": true,
                       "data": $scope.ticketAgeYSeries
                   }
               ],
               "drilldown": {
                   "series": [
                       {
                           "name": "Chrome",
                           "id": "Chrome",
                           "data": [
                               [
                                   "v65.0",
                                   0.1
                               ],
                               [
                                   "v64.0",
                                   1.3
                               ],
                               [
                                   "v63.0",
                                   53.02
                               ],
                               [
                                   "v62.0",
                                   1.4
                               ],
                               [
                                   "v61.0",
                                   0.88
                               ],
                               [
                                   "v60.0",
                                   0.56
                               ],
                               [
                                   "v59.0",
                                   0.45
                               ],
                               [
                                   "v58.0",
                                   0.49
                               ],
                               [
                                   "v57.0",
                                   0.32
                               ],
                               [
                                   "v56.0",
                                   0.29
                               ],
                               [
                                   "v55.0",
                                   0.79
                               ],
                               [
                                   "v54.0",
                                   0.18
                               ],
                               [
                                   "v51.0",
                                   0.13
                               ],
                               [
                                   "v49.0",
                                   2.16
                               ],
                               [
                                   "v48.0",
                                   0.13
                               ],
                               [
                                   "v47.0",
                                   0.11
                               ],
                               [
                                   "v43.0",
                                   0.17
                               ],
                               [
                                   "v29.0",
                                   0.26
                               ]
                           ]
                       },
                       {
                           "name": "Firefox",
                           "id": "Firefox",
                           "data": [
                               [
                                   "v58.0",
                                   1.02
                               ],
                               [
                                   "v57.0",
                                   7.36
                               ],
                               [
                                   "v56.0",
                                   0.35
                               ],
                               [
                                   "v55.0",
                                   0.11
                               ],
                               [
                                   "v54.0",
                                   0.1
                               ],
                               [
                                   "v52.0",
                                   0.95
                               ],
                               [
                                   "v51.0",
                                   0.15
                               ],
                               [
                                   "v50.0",
                                   0.1
                               ],
                               [
                                   "v48.0",
                                   0.31
                               ],
                               [
                                   "v47.0",
                                   0.12
                               ]
                           ]
                       },
                       {
                           "name": "Internet Explorer",
                           "id": "Internet Explorer",
                           "data": [
                               [
                                   "v11.0",
                                   6.2
                               ],
                               [
                                   "v10.0",
                                   0.29
                               ],
                               [
                                   "v9.0",
                                   0.27
                               ],
                               [
                                   "v8.0",
                                   0.47
                               ]
                           ]
                       },
                       {
                           "name": "Safari",
                           "id": "Safari",
                           "data": [
                               [
                                   "v11.0",
                                   3.39
                               ],
                               [
                                   "v10.1",
                                   0.96
                               ],
                               [
                                   "v10.0",
                                   0.36
                               ],
                               [
                                   "v9.1",
                                   0.54
                               ],
                               [
                                   "v9.0",
                                   0.13
                               ],
                               [
                                   "v5.1",
                                   0.2
                               ]
                           ]
                       },
                       {
                           "name": "Edge",
                           "id": "Edge",
                           "data": [
                               [
                                   "v16",
                                   2.6
                               ],
                               [
                                   "v15",
                                   0.92
                               ],
                               [
                                   "v14",
                                   0.4
                               ],
                               [
                                   "v13",
                                   0.1
                               ]
                           ]
                       },
                       {
                           "name": "Opera",
                           "id": "Opera",
                           "data": [
                               [
                                   "v50.0",
                                   0.96
                               ],
                               [
                                   "v49.0",
                                   0.82
                               ],
                               [
                                   "v12.1",
                                   0.14
                               ]
                           ]
                       }
                   ]
               }
           });
       };
        //Timeout ticketSignalGraph function

        //$rootScope.ticketSingleGraphTimeout = $timeout($rootScope.ticketSingleGraph(),2500);


        // var quotationxdata = ['15/10/2018', '16/10/2018', '17/10/2018', '18/10/2018', '19/10/2018', '20/10/2018', '21/10/2018', '22/10/2018', '23/10/2018',]

        $rootScope.quotGraph = function () {
           $scope.quotationStackChart = Highcharts.chart('quotationStackedCharts', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Quotation Status'
                },
                xAxis: {
                    categories: $scope.quoteStackXSeries
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Quotation Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                series: $scope.quoteStackYSeries
            });

        };

        $scope.assetTicketPieCharts = function(){

            Highcharts.setOptions({
                colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
                    return {
                        radialGradient: {
                            cx: 0.5,
                            cy: 0.3,
                            r: 0.7
                        },
                        stops: [
                            [0, color],
                            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                        ]
                    };
                })
            });


            // Build the chart
        };

        // Timeout quotGraph function

        //$rootScope.quotGraphTimeout = $timeout($rootScope.quotGraph(),1500);

//        Chart data sample end


//
//        $scope.overDueJobs=[35,42,67,89];
//        $scope.completedJobs=[28,40,39,36];
//        $scope.upcomingJobs = [21,75,55,81];
//        $scope.value = "Chart"
//        var chartData = {
//            type: "bar",  // Specify your chart type here.
//            title: {
//                text: $scope.value // Adds a title to your chart
//            },
//            legend: {}, // Creates an interactive legend
//            series: [  // Insert your series data here.
//                { values: $scope.overDueJobs},
//                { values: $scope.completedJobs},
//                { values: $scope.upcomingJobs}
//            ]
//        };
//        zingchart.render({ // Render Method[3]
//            id: "chartDiv",
//            data: chartData,
//            height: 400,
//            width: 600
//        });
//        zingchart.render({ // Render Method[3]
//            id: "chartDiv2",
//            data: chartData,
//            height: 400,
//            width: 600
//        });
//


        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

        /* Root scope (search criteria) function */

         $scope.dbdNoFilter = function(filter){

             $rootScope.searchFilterCriteria.isDashboard = true;
             $rootScope.searchFilterCriteria.empStatus = filter;

        }

        $scope.dbdEmpFilter = function() {
            $rootScope.searchFilterCriteria.isDashboard = true;
            // $rootScope.searchFilterCriteria.empFromDate = $rootScope.searchFilterCriteria.selectedFromDate;
            // $rootScope.searchFilterCriteria.empToDate = $rootScope.searchFilterCriteria.selectedToDate;
        }

        $scope.dbdFilter = function(filter){

             $rootScope.searchFilterCriteria.isDashboard = true;
             $rootScope.searchFilterCriteria.empStatus = filter;
             $rootScope.searchFilterCriteria.attendFromDate = new Date();
             $rootScope.searchFilterCriteria.attendToDate = new Date();

        }

        $scope.dbdStatusFilter = function(jobStatus){

            $rootScope.searchFilterCriteria.isDashboard = true;
            $rootScope.searchFilterCriteria.jobStatus = jobStatus;

        }

        $scope.dbdTStatusFilter = function(ticketStatus){

            $rootScope.searchFilterCriteria.isDashboard = true;
            $rootScope.searchFilterCriteria.ticketStatus = ticketStatus;

        }
        $scope.dbdQuotStatusFilter = function(quotStatus){

            $rootScope.searchFilterCriteria.isDashboard = true;
            $rootScope.searchFilterCriteria.quotStatus = quotStatus;

        }

        /* Localstorage (Retain old values while edit page to list) start */
        if($rootScope.isDashboard){

          $scope.localStorage = getLocalDbStorage.getSearch();

          $scope.selectedFromDateSer = new Date();
          $scope.selectedFromDate = $filter('date')(new Date(), 'dd/MM/yyyy') ;

          /** root scope (searchCriteria) from date **/
          $rootScope.searchFilterCriteria.selectedFromDate = $scope.selectedFromDateSer;

          // $scope.selectedToDateSer = new Date($scope.localStorage.selectedToDate);
          // $scope.selectedToDate = $filter('date')($scope.localStorage.selectedToDate, 'dd/MM/yyyy') ;

          $scope.selectedToDateSer = new Date();
          $scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy') ;

          /** root scope (searchCriteria) to date **/
          $rootScope.searchFilterCriteria.selectedToDate = $scope.selectedToDateSer;

              console.log('Local storage' , $scope.localStorage);
              if($scope.localStorage.projectId && $scope.localStorage.siteId
                 && $scope.localStorage.regionId && $scope.localStorage.branchId){

                   $scope.selectedProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                   $scope.selectedSite = {id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
                   $scope.selectedRegion = {id:$scope.localStorage.regionId,name:$scope.localStorage.region};
                   $scope.selectedBranch = {id:$scope.localStorage.branchId,name:$scope.localStorage.branch};

                   $scope.loadRegions($scope.selectedProject.id);
                   $scope.loadBranch($scope.selectedProject.id);
                   $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name);

                   $scope.refreshReportBySite();
                   $scope.loadChartData($scope.selectedProject.id,null,null,$scope.selectedSite.id);

              }else if($scope.localStorage.projectId && !$scope.localStorage.siteId
                && $scope.localStorage.regionId && $scope.localStorage.branchId){

                    $scope.selectedProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                    $scope.selectedSite = {id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
                    $scope.selectedRegion = {id:$scope.localStorage.regionId,name:$scope.localStorage.region};
                    $scope.selectedBranch = {id:$scope.localStorage.branchId,name:$scope.localStorage.branch};

                    $scope.loadRegions($scope.selectedProject.id);
                    $scope.loadBranch($scope.selectedProject.id);
                    $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name);

                    $scope.refreshReportByBranch();
                    $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name);
                    $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name,null);

              }else if($scope.localStorage.projectId && !$scope.localStorage.siteId
                  && $scope.localStorage.regionId && !$scope.localStorage.branchId){

                   $scope.selectedProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                   $scope.selectedRegion = {id:$scope.localStorage.regionId,name:$scope.localStorage.region};

                   $scope.loadRegions($scope.selectedProject.id);
                   $scope.loadBranch($scope.selectedProject.id);

                   $scope.refreshReportByRegion();
                   $scope.loadBranch($scope.selectedProject.id);
                   $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,null);
                   $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,null,null);

              }else if($scope.localStorage.projectId && !$scope.localStorage.siteId
                     && !$scope.localStorage.regionId && !$scope.localStorage.branchId){

                   $scope.selectedProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};

                   $scope.loadRegions($scope.selectedProject.id);
                   $scope.loadSites($scope.selectedProject.id,null,null);

                   $scope.refreshReportByProject();
                   $scope.loadChartData($scope.selectedProject.id,null,null,null);
              }

              $rootScope.searchFilterCriteria = $scope.localStorage;


        }
        /* Localstorage (Retain old values while edit page to list) end */

    })

    // Directive for pie charts, pass in title and data only
        .directive('hcPieChart', function () {
            return {
                restrict: 'E',
                template: '<div></div>',
                scope: {
                    title: '@',
                    data: '='
                },
                link: function (scope, element) {
                    Highcharts.chart(element[0], {
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: scope.title
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                }
                            }
                        },
                        series: [{
                            data: scope.data
                        }]
                    });
                }
            };



        });

