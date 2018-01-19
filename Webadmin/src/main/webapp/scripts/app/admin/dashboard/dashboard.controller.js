'use strict';

angular.module('timeSheetApp')
    .controller('DashboardController', function ($scope,$rootScope,DashboardComponent,$state,$http,$stateParams,$location) {

        $scope.selectedSite;

        $scope.siteCount;
        $scope.employeeCount;
        $scope.presentCount;
        $scope.absentCount;

        $scope.selectedDate;

        $scope.dateFilter = new Date();

        $scope.loadJobs = function(siteId){
            var siteId = 176;
            var selectedDate = new Date();
            DashboardComponent.loadJobs(siteId,selectedDate).then(function (data) {
                console.log(data)
            })
        }

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        }
        $scope.initCharts = function(){
                    console.log("Calling charts")
                    demo.initCharts();
        }

        $('#dateFilter').on('dp.change', function(e){
            console.log(e.date);

            console.log(e.date._d);
            $scope.selectedDate = e.date._d;
            $scope.refreshReport();
        });

        $scope.siteOptions = function(sites){

        }

        $scope.loadAllProjects = function(){
            DashboardComponent.loadAllProjects().then(function(data){
                console.log(data)
                $scope.projects = data;
                $scope.initialProject = data[0];
                $scope.loadSites($scope.initialProject.id);
            })
        }

        $scope.loadSites = function(projectId){
            DashboardComponent.loadSites(projectId).then(function(data){
                console.log(data);
                var selectedDate = new Date();
                console.log(selectedDate)
                selectedDate.setHours(0,0,0,0);
                console.log(selectedDate)

                $scope.sites = data;
                $scope.jobs=[];
                for (var i=0;i<data.length;i++){
                    DashboardComponent.loadJobs(data[i].id,selectedDate).then(function(data){
                        console.log(data)
                        $scope.jobs.push(data);
                    })
                }
            })
        }

        $scope.loadAllSites = function () {
            DashboardComponent.loadAllSites().then(function (data) {
                console.log(data)
                $scope.sites = data;
                $scope.siteCount = data.length;
            })
            var selectedDate = new Date();
            var endDate = new Date();
            console.log(selectedDate)
             selectedDate.setHours(0,0,0,0);
             endDate.setHours(23,59,59,0);
            console.log(selectedDate)
            DashboardComponent.loadAttendanceReport(0,selectedDate,endDate).then(function(data){
                console.log(data)
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
            })

        }

        $scope.refreshReport = function() {
            var selectedDate = new Date();
            console.log(selectedDate);
            if($scope.selectedDate) {
            	selectedDate = $scope.selectedDate;
            }
            console.log('selectedDate -' + selectedDate);
            var endDate = new Date();
            if($scope.selectedDate) {
            	endDate = $scope.selectedDate;
            }
            console.log(selectedDate)
             selectedDate.setHours(0,0,0,0);
             endDate.setHours(23,59,59,0);
            console.log(selectedDate)
        	DashboardComponent.loadAttendanceReport($scope.selectedSite,selectedDate,endDate).then(function(data){
                console.log(data)
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
            })

        }

        $scope.initCalender();

        $scope.initCharts();

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


    });
