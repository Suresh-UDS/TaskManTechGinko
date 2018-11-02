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

    .controller('DashboardController', function ($timeout,$scope,$rootScope,DashboardComponent,JobComponent, $state,$http,$stateParams,$location) {
        $rootScope.loginView = false;



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

        $scope.selectedFromDate;
        $scope.selectedToDate;

        $scope.dateFilterFrom = new Date();
        $scope.dateFilterTo = new Date();

        $scope.result = {
        		assignedJobCount :0,
        		completedJobCount :0,
        		overdueJobCount :0,
        		totalJobCount: 0
        };


        $scope.init = function() {
        		$scope.selectedFromDate = $scope.dateFilterFrom;
        		$scope.selectedToDate = $scope.dateFilterTo;
        		$scope.loadAllProjects();
        		$scope.loadAllSites();
        		$scope.loadQuotationReport();
                $scope.loadJobReport();
                $scope.loadingStart();
                $scope.loadChartData();

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

        $scope.loadChartData = function () {
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

            // $scope.closedTicketsLabels = ['0-3 days', '3-5 days', '5-7 days', '7-10 days', '10 and Above'];
            // // $scope.openTicketsLabels = ['0-3 days', '3-5 days', '5-7 days', '7-10 days', '10 and Above'];
            // $scope.closedTicketsSeries = ['0-3 days', '3-5 days', '5-7 days', '7-10 days','Above 10'];
            // $scope.openTicketsSeries = ['0-3 days', '3-5 days', '5-7 days', '7-10 days','Above 10'];

            $scope.overallTicketLabels = ['New', 'Closed', 'Pending', 'Pending with Client', 'Pending with UDS'];
            $scope.overallTicketSeries = ['New', 'Closed','Pending', 'Pending with Client', 'Pending with UDS'];

            $scope.startDate = new Date($scope.selectedFromDate);
            $scope.endDate =  new Date($scope.selectedToDate);
            // var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            $scope.startDate = $scope.startDate.getDate()+'-0'+($scope.startDate.getUTCMonth()+1)+'-'+$scope.startDate.getFullYear();
            $scope.endDate = $scope.endDate.getDate()+'-0'+($scope.endDate.getMonth()+1)+'-'+$scope.endDate.getFullYear();
            console.log("Startdate---"+$scope.startDate);
            console.log("EndDate---"+$scope.endDate);
            $scope.selectedFromDate.setHours(0,0,0,0);
            $scope.selectedToDate.setHours(23,59,59,0);
            $scope.startDate = $scope.selectedFromDate.getDate() + '-' + ($scope.selectedFromDate.getMonth() +1) + '-' + $scope.selectedFromDate.getFullYear();
            console.log("Startdate---"+$scope.startDate);
            $scope.endDate = $scope.selectedToDate.getDate() + '-' + ($scope.selectedToDate.getMonth() +1) + '-' + $scope.selectedToDate.getFullYear();
            console.log("EndDate---"+$scope.endDate);

            DashboardComponent.loadTicketChartData($scope.selectedSite.id,$scope.startDate,$scope.endDate).then(function(response){
                console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts);
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



                var ctx = document.getElementById("bar").getContext('2d');
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




                $scope.overAllTicketsCountArray.push(response.totalNewTicketCount);
                $scope.overAllTicketsCountArray.push(response.totalClosedTicketCount);
                $scope.overAllTicketsCountArray.push(response.totalPendingTicketCount);
                $scope.overAllTicketsCountArray.push(response.totalPendingDueToClientTicketCount);
                $scope.overAllTicketsCountArray.push(response.totalPendingDueToCompanyTicketCount);

                $scope.overallTicketData = $scope.overAllTicketsCountArray;
                $scope.openTicketsData = $scope.openTicketsCountArray;
                $scope.closedTicketsData = $scope.closedTicketsCountArray;

            });
        }

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();


        }
        $scope.initCharts = function(){
                    console.log("Calling charts")
                    demo.initCharts();
        }

        $('input#dateFilterFrom').on('dp.change', function(e){
            console.log(e.date);

            console.log(e.date._d);
            if(e.date._d > $scope.selectedToDate) {
            		$scope.showNotifications('top','center','danger','From date cannot be greater than To date');
            		$scope.dateFilterFrom = $scope.selectedFromDate;
            		return false;
            }else {
                $scope.selectedFromDate = new Date(e.date._d);
                $scope.refreshReport();
            }
        });

        $('input#dateFilterTo').on('dp.change', function(e){
            console.log(e.date);

            console.log(e.date._d);
            if($scope.selectedFromDate > e.date._d) {
            		$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
            		$scope.dateFilterTo = $scope.selectedToDate;
            		return false;
            }else {
                $scope.selectedToDate = new Date(e.date._d);
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
        }

        $scope.loadSites = function(projectId){
        		console.log('projectid - ' + projectId);
            DashboardComponent.loadSites(projectId).then(function(data){
                console.log('sites ' + JSON.stringify(data));
                $scope.sites = data;
            })
        }

        $scope.loadAllSites = function () {
            DashboardComponent.loadAllSites().then(function (data) {
                console.log(data);
                $scope.loadingStop();
                $scope.sites = data;
                $scope.siteCount = data.length;
            })
            console.log($scope.selectedFromDate)
             $scope.selectedFromDate.setHours(0,0,0,0);
            	 $scope.selectedToDate.setHours(23,59,59,0);
            console.log($scope.selectedFromDate + ' ' + $scope.selectedToDate)
            DashboardComponent.loadAttendanceReport(0,$scope.selectedFromDate,$scope.selectedToDate).then(function(data){
                console.log(data)
                $scope.totalEmployeeCount = data.totalEmployeeCount;
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
            })

        }

        $scope.loadQuotationReport = function() {
        		$scope.quotationCount = 0;
        }

        $scope.changeProject = function() {
        		console.log('selected project - ' + JSON.stringify($scope.selectedProject));
        		$scope.loadSites($scope.selectedProject.id);
        		$scope.selectedSite = null;
        		$scope.refreshReport();
        }

        $scope.refreshReport = function() {
        		if($scope.selectedSite) {
        			$scope.refreshReportBySite();
        		}else if($scope.selectedProject) {
        			$scope.refreshReportByProject();
        		}
        		$scope.loadJobReport();
        		$scope.loadChartData();
        		// $scope.myChart.update();
        }

        $scope.refreshReportByProject = function() {
             $scope.selectedFromDate.setHours(0,0,0,0);
             $scope.selectedToDate.setHours(23,59,59,0);
             DashboardComponent.loadAttendanceReportByProject($scope.selectedProject.id,$scope.selectedFromDate,$scope.selectedToDate).then(function(data){
                console.log(data)
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
            })

        }

        $scope.refreshReportBySite = function() {
            $scope.selectedFromDate.setHours(0,0,0,0);
            $scope.selectedToDate.setHours(23,59,59,0);
            DashboardComponent.loadAttendanceReport($scope.selectedSite.id,$scope.selectedFromDate,$scope.selectedToDate).then(function(data){
               console.log(data)
               $scope.employeeCount = data.totalEmployeeCount;
               $scope.presentCount = data.presentEmployeeCount;
               $scope.absentCount = data.absentEmployeeCount;
           })

       }



        $scope.loadJobReport = function () {
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

	        	$scope.searchCriteria.consolidated = true;

	        	if($scope.selectedJob){
	        		$scope.searchCriteria.jobTitle = $scope.selectedJob;
	        	}
	        	$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedFromDate;
	        	$scope.searchCriteria.checkInDateTimeTo = $scope.selectedToDate;

	        	console.log($scope.searchCriteria);
	        	JobComponent.generateReport($scope.searchCriteria).then(function (data) {
	        		$scope.result.assignedJobCount = 0;
	        		$scope.result.completedJobCount = 0;
	        		$scope.result.overdueJobCount = 0;
	        		$scope.result.totalJobCount = 0;
	        		for(var i = 0; i < data.length; i++) {
	        			$scope.result.assignedJobCount += data[i].assignedJobCount;
	        			$scope.result.completedJobCount += data[i].completedJobCount;
	        			$scope.result.overdueJobCount += data[i].overdueJobCount;
	        			$scope.result.totalJobCount += data[i].totalJobCount;
	        		}
	        		//$scope.result = data[0];
	        		console.log('job report - ' + $scope.result.assignedJobCount);
	        		console.log('job report - ' + $scope.result.completedJobCount);
	        		console.log('job report - ' + $scope.result.overdueJobCount);
	        		console.log('job report - ' + $scope.result.totalJobCount);

	        	});



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

        var jobxdata=['19/10/2018', '20/10/2018', '21/10/2018', '22/10/2018', '23/10/2018'];


        Highcharts.chart('jobStackedCharts', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Jobs Status'
            },
            xAxis: {
                categories:jobxdata
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
            series: [{
                name: 'Assigned',
                data: [5, 3, 4, 7, 2]
            }, {
                name: 'Overdue',
                data: [2, 2, 3, 2, 1]
            }, {
                name: 'Completed',
                data: [3, 4, 4, 2, 5]
            }]
        });

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


        Highcharts.chart('AttendanceStackedCharts', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Attendance Status'
            },
            xAxis: {
                categories: ['15/10/2018', '16/10/2018', '17/10/2018', '18/10/2018', '19/10/2018', '20/10/2018', '21/10/2018', '22/10/2018', '23/10/2018',]
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
            series: [{
                name: 'Left',
                data: [5, 3, 4, 7, 2,5, 3, 4, 7]
            }, {
                name: 'Absent',
                data: [2, 2, 3, 2, 1,5, 3, 4, 7]
            }, {
                name: 'Present',
                data: [3, 4, 4, 2, 5,5, 3, 4, 7]
            }]
        });




        Highcharts.chart('ticketStackedCharts', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Tickets'
            },
            xAxis: {
                categories: ['15/10/2018', '16/10/2018', '17/10/2018', '18/10/2018', '19/10/2018', '20/10/2018', '21/10/2018', '22/10/2018', '23/10/2018',]
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
            series: [{
                name: 'Open',
                data: [5, 3, 4, 7, 2,5, 3, 4, 7]
            }, {
                name: 'Closed',
                data: [2, 2, 3, 2, 1,5, 3, 4, 7]
            }, {
                name: 'Assigned',
                data: [3, 4, 4, 2, 5,5, 3, 4, 7]
            }]
        });



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
                        format: '{point.y:.1f}%'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },

            "series": [
                {
                    "name": "Ticket Categories",
                    "colorByPoint": true,
                    "data": [
                        {
                            "name": "AC & APPLIANCES",
                            "y": 62.74,
                            "drilldown": "AC & APPLIANCES"
                        },
                        {
                            "name": "CLEANING",
                            "y": 10.57,
                            "drilldown": "CLEANING"
                        },
                        {
                            "name": "PLUMBING",
                            "y": 7.23,
                            "drilldown": "PLUMBING"
                        },
                        {
                            "name": "ELECTRICAL",
                            "y": 5.58,
                            "drilldown": "ELECTRICAL"
                        },
                        {
                            "name": "CARPENTRY",
                            "y": 4.02,
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

        var quotationxdata = ['15/10/2018', '16/10/2018', '17/10/2018', '18/10/2018', '19/10/2018', '20/10/2018', '21/10/2018', '22/10/2018', '23/10/2018',]

        Highcharts.chart('quotationStackedCharts', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quotation Status'
            },
            xAxis: {
                categories: quotationxdata
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
            series: [{
                name: 'Waiting for Approval',
                data: [8, 3, 4, 7, 2,5, 3, 7, 2]
            }, {
                name: 'Rejected',
                data: [7, 2, 3, 2, 1,7, 5, 3, 8]
            }, {
                name: 'Approved',
                data: [6, 2, 3, 2, 1,2, 2, 8, 9]
            }, {
                name: 'Pending',
                data: [8, 4, 4, 2, 5,9, 9, 6, 5]
            }]
        });












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
