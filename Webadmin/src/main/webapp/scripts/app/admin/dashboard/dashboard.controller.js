'use strict';

angular.module('timeSheetApp')

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
    })

    .controller('DashboardController', function ($timeout,$scope,$rootScope,$filter,DashboardComponent,JobComponent, $state,$http,$stateParams,$location,TicketComponent,SiteComponent,AttendanceComponent) {
        $rootScope.loginView = false;

        $scope.ready = false;

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

        $scope.selectedFromDate =  $filter('date')(new Date(), 'dd/MM/yyyy') ;
        $scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');

        $scope.selectedFromDateSer =new Date();
        $scope.selectedToDateSer = new Date();

        $scope.result = {
        		assignedJobCount :0,
        		completedJobCount :0,
        		overdueJobCount :0,
        		totalJobCount: 0
        };


        $scope.init = function() {
            $scope.loadAllProjects();
            $scope.loadAllSites();
            $scope.loadQuotationReportChart();
            $scope.loadJobReport();
            $scope.loadingStart();
            $scope.loadChartData();
            $scope.loadTicketStatusFromInflux();
            $scope.loadAttendanceStatusCounts();

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

            DashboardComponent.loadAllJobsByStatusCnt().then(function (data) {
                console.log("All jobs by status count per date" +JSON.stringify(data));
                if(data.length > 0) {
                    $scope.jobStackChart = data[0];
                    $scope.jobStackXSeries = $scope.jobStackChart.x;
                    $scope.jobStackYSeries = $scope.jobStackChart.status;
                    console.log($scope.jobStackChart.status);
                }
            });

        };

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
            // $scope.startDate = $scope.startDate.getDate()+'-0'+($scope.startDate.getUTCMonth()+1)+'-'+$scope.startDate.getFullYear();
            // $scope.endDate = $scope.endDate.getDate()+'-0'+($scope.endDate.getMonth()+1)+'-'+$scope.endDate.getFullYear();
            // console.log("Startdate---"+$scope.startDate);
            // console.log("EndDate---"+$scope.endDate);
            // $scope.selectedFromDateSer.setHours(0,0,0,0);
            // $scope.selectedToDateSer.setHours(23,59,59,0);
            // $scope.startDate = $scope.selectedFromDateSer.getDate() + '-' + ($scope.selectedFromDateSer.getMonth() +1) + '-' + $scope.selectedFromDateSer.getFullYear();
            // console.log("Startdate---"+$scope.startDate);
            // $scope.endDate = $scope.selectedToDateSer.getDate() + '-' + ($scope.selectedToDateSer.getMonth() +1) + '-' + $scope.selectedToDateSer.getFullYear();
            // console.log("EndDate---"+$scope.endDate);

            $scope.formatFromDate = $scope.selectedFromDateSer;
            $scope.formatToDate =  $scope.selectedToDateSer;

            if(siteId){

                $scope.loadChartDataBySiteId($scope.selectedSite.id,$scope.formatFromDate,$scope.formatToDate);

            }else if(region && branch){
                $scope.loadChartDataByBranch(projectId,region,branch,$scope.formatFromDate,$scope.formatToDate);

            }else if(region){
                $scope.loadChartDataByRegion(projectId,region,$scope.formatFromDate,$scope.formatToDate);

            }else if(projectId){

                $scope.loadChartDataByProjectId(projectId,$scope.formatFromDate,$scope.formatToDate);

            }

        };

        $scope.loadChartDataByProjectId = function(projectId,startDate,endDate){
        	$scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = projectId;
            searchCriteria.fromDate = startDate;
            searchCriteria.toDate = endDate;
            TicketComponent.getTicketsCountsByStatus(searchCriteria).then(function(response){
                /*console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts);*/
                $scope.loadTicketCounts(response);
                // $scope.constructChartData(response);


            });
        };

        $scope.loadChartDataBySiteId = function(siteId,startDate,endDate){
        	$scope.loadingStart();
        	var searchCriteria = {};
            searchCriteria.siteId = siteId;
            searchCriteria.fromDate = startDate;
            searchCriteria.toDate = endDate;
            TicketComponent.getTicketsCountsByStatus(searchCriteria).then(function(response){
                /*console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts);*/
                $scope.loadTicketCounts(response);
                // $scope.constructChartData(response);


            });
        };

        $scope.loadChartDataByRegion = function(projectId,region,startDate,endDate){
        	$scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = projectId;
            searchCriteria.region = region;
            searchCriteria.fromDate = startDate;
            searchCriteria.toDate = endDate;
            TicketComponent.getTicketsCountsByStatus(searchCriteria).then(function(response){
               /* console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts);*/
                $scope.loadTicketCounts(response);
                // $scope.constructChartData(response);

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
            TicketComponent.getTicketsCountsByStatus(searchCriteria).then(function(response){
                /*console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts)*/;
                $scope.loadTicketCounts(response);
                // $scope.constructChartData(response);

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


            if($scope.openTicketsTotalCount > 0) {

	            var ctx = document.getElementById("bar1").getContext('2d');
	            $scope.myChart = new Chart(ctx, {
	                type: 'bar',
	                data: {
	                    labels:$scope.openTicketsLabels ,
	                    datasets: [{
	                        // label: '# of Votes',
	                        data:$scope.openTicketsCountArray ,
	                        backgroundColor: [
	                            'rgba(255, 99, 132, 0.2)',
	                            'rgba(54, 162, 235, 0.2)',
	                            'rgba(255, 206, 86, 0.2)',
	                            'rgba(75, 192, 192, 0.2)',
	                            'rgba(153, 102, 255, 0.2)'
	                        ],
	                        borderColor: [
	                            'rgba(255,99,132,1)',
	                            'rgba(54, 162, 235, 1)',
	                            'rgba(255, 206, 86, 1)',
	                            'rgba(75, 192, 192, 1)',
	                            'rgba(153, 102, 255, 1)'
	                        ],
	                        borderWidth: 1
	                    }]
	                },
	                options: {
	                    scales: {
	                        yAxes: [{
	                            ticks: {
	                                beginAtZero:true
	                            }
	                        }]
	                    }
	                }
	            });

            }else {
            		document.getElementById("openTicketPanel").style.display = 'none';
            }


            if($scope.closedTicketsTotalCount > 0) {

	            var ctx2 = document.getElementById("bar2").getContext('2d');
	            $scope.myChart = new Chart(ctx2, {
	                type: 'bar',
	                data: {
	                    labels:$scope.closedTicketsLabels ,
	                    datasets: [{
	                        // label: '# of Votes',
	                        data:$scope.closedTicketsCountArray ,
	                        backgroundColor: [
	                            'rgba(255, 99, 132, 0.2)',
	                            'rgba(54, 162, 235, 0.2)',
	                            'rgba(255, 206, 86, 0.2)',
	                            'rgba(75, 192, 192, 0.2)',
	                            'rgba(153, 102, 255, 0.2)'
	                        ],
	                        borderColor: [
	                            'rgba(255,99,132,1)',
	                            'rgba(54, 162, 235, 1)',
	                            'rgba(255, 206, 86, 1)',
	                            'rgba(75, 192, 192, 1)',
	                            'rgba(153, 102, 255, 1)'
	                        ],
	                        borderWidth: 1
	                    }]
	                },
	                options: {
	                    scales: {
	                        yAxes: [{
	                            ticks: {
	                                beginAtZero:true
	                            }
	                        }]
	                    }
	                }
	            });
            }else {
            		document.getElementById("closedTicketPanel").style.display = 'none';
            }

            if($scope.overAllTicketsTotalCount > 0) {

	            var ctx3 = document.getElementById("bar3").getContext('2d');
	            $scope.myChart = new Chart(ctx3, {
	                type: 'bar',
	                data: {
	                    labels:$scope.overallTicketLabels ,
	                    datasets: [{
	                        // label: '# of Votes',
	                        data:$scope.overAllTicketsCountArray ,
	                        backgroundColor: [
	                            'rgba(255, 99, 132, 0.2)',
	                            'rgba(54, 162, 235, 0.2)',
	                            'rgba(255, 206, 86, 0.2)',
	                            'rgba(75, 192, 192, 0.2)',
	                            'rgba(153, 102, 255, 0.2)'
	                        ],
	                        borderColor: [
	                            'rgba(255,99,132,1)',
	                            'rgba(54, 162, 235, 1)',
	                            'rgba(255, 206, 86, 1)',
	                            'rgba(75, 192, 192, 1)',
	                            'rgba(153, 102, 255, 1)'
	                        ],
	                        borderWidth: 1
	                    }]
	                },
	                options: {
	                    scales: {
	                        yAxes: [{
	                            ticks: {
	                                beginAtZero:true
	                            }
	                        }]
	                    }
	                }
	            });
            }else {
            		document.getElementById("overallTicketPanel").style.display = 'none';
            }




            $scope.overAllTicketsCountArray.push(response.totalNewTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalClosedTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalPendingTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalPendingDueToClientTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalPendingDueToCompanyTicketCount);

            $scope.overallTicketData = $scope.overAllTicketsCountArray;
            $scope.openTicketsData = $scope.openTicketsCountArray;
            $scope.closedTicketsData = $scope.closedTicketsCountArray;

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
            		$scope.showNotifications('top','center','danger','From date cannot be greater than To date');
            		$scope.selectedFromDate = "";
            		$scope.selectedFromDateSer = "";
            		return false;
            }else {
                $scope.selectedFromDateSer = new Date(e.date._d);
                $scope.selectedFromDate = $filter('date')(e.date._d, 'dd/MM/yyyy') ;
                $scope.refreshReport();
            }
        });

        $('input#dateFilterTo').on('dp.change', function(e){
            console.log(e.date);

            console.log(e.date._d);
            if($scope.selectedFromDateSer > e.date._d) {
            		$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
            		$scope.selectedToDate = "";
            		$scope.selectedToDateSer = "";
            		return false;
            }else {
            	$scope.selectedToDateSer = new Date(e.date._d);
                $scope.selectedToDate = $filter('date')(e.date._d, 'dd/MM/yyyy') ;
                $scope.refreshReport();
            }

        });

        $scope.siteOptions = function(sites){

        }

        $scope.loadAllProjects = function(){
            DashboardComponent.loadAllProjects().then(function(data){
                console.log(data)
                $scope.projects = data;
                $scope.projectCount = data.length;
                $scope.initialProject = data[0];
                $scope.loadSites($scope.initialProject.id);
            })
        };

        $scope.loadSites = function(projectId,region,branch){

            if(branch){

                SiteComponent.getSitesByBranch(projectId,region,branch).then(function (data) {
                    console.log('Sites - ');
                    console.log(data);
                    $scope.sites = data;
                });

            }else if(region){

                SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
                    $scope.sites = data;
                    console.log("Sites - ");
                    console.log(data);
                })

            }else if(projectId >0){
                console.log('projectid - ' + projectId);
                DashboardComponent.loadSites(projectId).then(function(data){
                    console.log('sites ' + JSON.stringify(data));
                    $scope.sites = data;
                })
            }


        };

        $scope.loadAllSites = function () {
            DashboardComponent.loadAllSites().then(function (data) {
                console.log(data);

                $scope.sites = data;
                $scope.siteCount = data.length;
            });
            console.log($scope.selectedFromDateSer);
             $scope.selectedFromDateSer.setHours(0,0,0,0);
             $scope.selectedToDateSer.setHours(23,59,59,0);
            console.log($scope.selectedFromDateSer + ' ' + $scope.selectedToDateSer);
            $scope.loadingStart();
            // DashboardComponent.loadAttendanceReport(0,$scope.selectedFromDateSer,$scope.selectedToDateSer).then(function(data){
            //     console.log(data);
            //     $scope.totalEmployeeCount = data.totalEmployeeCount;
            //     $scope.employeeCount = data.totalEmployeeCount;
            //     $scope.presentCount = data.presentEmployeeCount;
            //     $scope.absentCount = data.absentEmployeeCount;
            //
            // });
            var searchCriteria = {};
            searchCriteria.siteId = 0;
            searchCriteria.fromDate = $scope.selectedFromDateSer;
            searchCriteria.toDate = $scope.selectedToDateSer;
            DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
                console.log(data);
                // $scope.totalEmployeeCount = data.totalEmployees;
                $scope.employeeCount = data.totalEmployees;
                $scope.presentCount = data.totalPresent;
                $scope.absentCount = data.totalAbsent;
                $scope.leftCount = data.totalLeft;


            })

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
            SiteComponent.getRegionByProject(projectId).then(function (response) {
                console.log(response);
                $scope.regionList = response;
            })
        };

        $scope.loadBranch = function (projectId) {

            if($scope.selectedProject){

                if($scope.selectedRegion){
                    console.log($scope.selectedRegion);
                    SiteComponent.getBranchByProject(projectId,$scope.selectedRegion.id).then(function (response) {
                        console.log(response);
                        $scope.branchList = response;
                    })

                }else{
                    $scope.showNotifications('top','center','danger','Please Select Region to continue...');

                }

            }else{
                $scope.showNotifications('top','center','success','Please select Project to continue...');

            }


        };

        $scope.refreshReport = function() {
        		if($scope.selectedSite) {
        			$scope.refreshReportBySite();
                    $scope.loadChartData($scope.selectedProject.id,null,null,$scope.selectedSite.id);

                }else if($scope.selectedBranch){
                	$scope.sites= "";
                    $scope.refreshReportByBranch();
                    $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name);
                    $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name,null);

                }else if($scope.selectedRegion){
                	$scope.branchList= "";
                	$scope.sites= "";
                    $scope.refreshReportByRegion();
                    $scope.loadBranch($scope.selectedProject.id);
                    $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,null);
                    $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,null,null);

                }else if($scope.selectedProject) {
                	$scope.regionList= "";
                	$scope.branchList= "";
                	$scope.sites= "";
        			$scope.refreshReportByProject();
        			$scope.loadRegions($scope.selectedProject.id);
        			$scope.loadSites($scope.selectedProject.id,null,null);
                    $scope.loadChartData($scope.selectedProject.id,null,null,null);

                }
        		// $scope.loadJobReport();
            // $scope.myChart.update();
        };

        $scope.LoadFilterSites = function(){
        	if($scope.selectedSite) {
    			$scope.refreshReportBySite();
                $scope.loadChartData($scope.selectedProject.id,null,null,$scope.selectedSite.id);

            }
        };

        $scope.LoadFilterBranches = function(){
        	$scope.sites= "";
        	if($scope.selectedBranch){
                $scope.refreshReportByBranch();
                $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name);
                $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name,null);

            }
        };

        $scope.LoadFilterRegions = function(){
        	$scope.branchList= "";
        	$scope.sites= "";
        	if($scope.selectedRegion){
                $scope.refreshReportByRegion();
                $scope.loadBranch($scope.selectedProject.id);
                $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,null);
                $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,null,null);

            }
        };

        $scope.LoadFilterProjects = function(){
        	$scope.regionList= "";
        	$scope.branchList= "";
        	$scope.sites= "";
        	if($scope.selectedProject) {
    			$scope.refreshReportByProject();
    			$scope.loadRegions($scope.selectedProject.id);
    			$scope.loadSites($scope.selectedProject.id,null,null);
                $scope.loadChartData($scope.selectedProject.id,null,null,null);

            }
        };


        $scope.refreshReportByProject = function() {
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = $scope.selectedProject.id;
            searchCriteria.fromDate = $scope.selectedFromDateSer;
            searchCriteria.toDate = $scope.selectedToDateSer;
            DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
            console.log(data);
            $scope.employeeCount = data.totalEmployees;
            $scope.presentCount = data.totalPresent;
            $scope.absentCount = data.totalAbsent;
            $scope.leftCount = data.totalLeft;

            })

        };

        $scope.refreshReportByRegion = function(){
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = $scope.selectedProject.id;
            searchCriteria.fromDate = $scope.selectedFromDateSer;
            searchCriteria.toDate = $scope.selectedToDateSer;
            searchCriteria.region = $scope.selectedRegion.name;
            DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
                console.log(data);
                $scope.employeeCount = data.totalEmployees;
                $scope.presentCount = data.totalPresent;
                $scope.absentCount = data.totalAbsent;
                $scope.leftCount = data.totalLeft;

            })

        };

        $scope.refreshReportByBranch = function(){
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadingStart();
            var searchCriteria = {};
            searchCriteria.projectId = $scope.selectedProject.id;
            searchCriteria.fromDate = $scope.selectedFromDateSer;
            searchCriteria.toDate = $scope.selectedToDateSer;
            searchCriteria.region = $scope.selectedRegion.name;
            searchCriteria.branch = $scope.selectedBranch.name;
            DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
                console.log(data);
                $scope.employeeCount = data.totalEmployees;
                $scope.presentCount = data.totalPresent;
                $scope.absentCount = data.totalAbsent;
                $scope.leftCount = data.totalLeft;

            })

        };

        $scope.refreshReportBySite = function() {
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadingStart();
            if($scope.selectedSite && $scope.selectedSite.id){
                var searchCriteria = {};
                searchCriteria.siteId = $scope.selectedSite.id;
                searchCriteria.fromDate = $scope.selectedFromDateSer;
                searchCriteria.toDate = $scope.selectedToDateSer;
            	DashboardComponent.loadAttendanceReport(searchCriteria).then(function(data){
                    console.log(data);
                    $scope.employeeCount = data.totalEmployees;
                    $scope.presentCount = data.totalPresent;
                    $scope.absentCount = data.totalAbsent;
                    $scope.leftCount = data.totalLeft;

                })
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

	        	console.log('job report search criteria -' , JSON.stringify($scope.searchCriteria));

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

                    if(!$scope.selectedProject.id && !$scope.selectedSite.id && !$scope.selectedRegion && !$scope.selectedBranch){
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

        }

        $scope.loadTicketStatusFromInflux = function() {          // Ticket chart for get category wise status counts
            TicketComponent.getStatusCountsByCategory().then(function (data) {
                console.log("Ticket category wise Status counts" +JSON.stringify(data));
                if(data.length > 0) {
                    $scope.ticketStackChart = data[0];
                    $scope.ticketStackXSeries = $scope.ticketStackChart.x;
                    $scope.ticketStackYSeries = $scope.ticketStackChart.status;
                }

            });
        }

        $scope.loadAttendanceStatusCounts = function() {
            AttendanceComponent.getTotalStatusCounts().then(function (data) {
               console.log("Total Attendance status counts" + JSON.stringify(data));
               if(data.length > 0) {
                   $scope.attnStackChart = data[0];
                   $scope.attnStackXSeries = $scope.attnStackChart.x;
                   $scope.attnStackYSeries = $scope.attnStackChart.status;
               }
            });
        }

        $scope.loadTicketStatusCounts = function() {
            // Ticket for get total status counts
            // var searchCriteriaTicket = {};
            // searchCriteriaTicket.fromDate = ;
            // searchCriteriaTicket.toDate = ;
            // searchCriteriaTicket.projectId = ;
            // searchCriteriaTicket.siteId = ;
            // searchCriteriaTicket.region = ;
            // searchCriteriaTicket.branch = ;
            // TicketComponent.getTicketsCountsByStatus().then(function (data) {
            //    console.log("Ticket Status wise counts" +JSON.stringify(data));
            //     $scope.loadingStop();
            //    if(data.length > 0) {
            //        $scope.openTicketsTotalCount = data[0].openCounts;
            //        $scope.closedTicketsTotalCount = data[0].closedCounts;
            //        $scope.overAllTicketsTotalCount = data[0].totalCounts;
            //        $scope.assignedTicketTotalCount = data[0].assignedCounts;
            //    } else {
            //        $scope.openTicketsTotalCount = 0;
            //        $scope.closedTicketsTotalCount = 0;
            //        $scope.overAllTicketsTotalCount = 0;
            //        $scope.assignedTicketTotalCount = 0;
            //    }
            //
            // });
        }

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

        $timeout(function () {
            Highcharts.chart('jobStackedCharts', {
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
        }, 2500);


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

        $timeout(function () {
            Highcharts.chart('AttendanceStackedCharts', {
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
        }, 2500)


        $timeout(function () {
            Highcharts.chart('ticketStackedCharts', {
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
        },1000);


        
        Highcharts.chart('catgAgeTicketsCharts', {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Monthly Tickets'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Average Ticket Age'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }
            },
            series: [{
                name: 'Ac',
                marker: {
                    symbol: 'square'
                },
                data: [7.5, 7.9, 5.5, 17.5, 20.2, 24.5, 29.2, {
                    y: 26.5
                }, 32.3, 33.3, 38.9, 44.6]

            },{
                name: 'CLEANING',
                marker: {
                    symbol: 'circle'
                },
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
                    y: 26.5
                }, 23.3, 18.3, 13.9, 9.6]

            },{
                name: 'PLUMBING',
                marker: {
                    symbol: 'square'
                },
                data: [2.0, 9.9, 11.5, 17.5, 23.2, 27.5, 29.2, {
                    y: 26.5
                    // marker: {
                    //     symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
                    // }
                }, 33.3, 40.3, 43.9, 12.6]

            }, {
                name: 'ELECTRICAL',
                marker: {
                    symbol: 'diamond'
                },
                data: [{
                    y: 3.9
                }, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });


        Highcharts.chart('ticketSingleStackedCharts', {
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
                    "data": [
                        {
                            "name": "AC & APPLIANCES",
                            "y": 6,
                            "drilldown": "AC & APPLIANCES"
                        },
                        {
                            "name": "CLEANING",
                            "y": 10,
                            "drilldown": "CLEANING"
                        },
                        {
                            "name": "PLUMBING",
                            "y": 7,
                            "drilldown": "PLUMBING"
                        },
                        {
                            "name": "ELECTRICAL",
                            "y": 5,
                            "drilldown": "ELECTRICAL"
                        },
                        {
                            "name": "CARPENTRY",
                            "y": 4,
                            "drilldown": "CARPENTRY"
                        }
                    ]
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

        // var quotationxdata = ['15/10/2018', '16/10/2018', '17/10/2018', '18/10/2018', '19/10/2018', '20/10/2018', '21/10/2018', '22/10/2018', '23/10/2018',]

        $timeout(function () {
            Highcharts.chart('quotationStackedCharts', {
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

        },1500);












// Chart data sample end


//
//        $scope.overDueJobs=[35,42,67,89];
//        $scope.completedJobs=[28,40,39,36];
//        $scope.upcomingJobs = [21,75,55,81];
//    $scope.value = "Chart"
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


    });
